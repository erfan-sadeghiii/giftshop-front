"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function ItemForm({ sectionId, onAdded }) {
  const [form, setForm] = useState({
    name: "",
    link: "",
    query: "",
    order: 0,
  });
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ اعتبارسنجی ساده
    if (!form.name.trim()) {
      Swal.fire("خطا", "نام آیتم الزامی است", "error");
      return;
    }
    if (!sectionId) {
      Swal.fire("خطا", "شناسه بخش وجود ندارد", "error");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/megamenu/items/`,
        {
          ...form,
          section: sectionId,
          order: Number(form.order), // ✅ اطمینان از عدد صحیح بودن ترتیب
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      Swal.fire("✅ موفقیت", "آیتم با موفقیت اضافه شد", "success");
      setForm({ name: "", link: "", query: "", order: 0 });
      onAdded(); // بروزرسانی منو
    } catch (err) {
      console.error("Add Item Error:", err.response?.data || err.message);
      Swal.fire(
        "خطا",
        err.response?.data?.error || "امکان اضافه کردن آیتم وجود ندارد",
        "error"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ml-5 mt-2 flex gap-2 text-xs">
      <input
        type="text"
        placeholder="نام آیتم"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1 rounded w-28"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="لینک"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1 rounded w-32"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
      />
      <input
        type="text"
        dir="ltr"
        lang="Eng"
        placeholder="Query"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1 rounded w-24"
        value={form.query}
        onChange={(e) => setForm({ ...form, query: e.target.value })}
      />
      <input
        type="number"
        placeholder="ترتیب"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1 rounded w-16"
        value={form.order}
        onChange={(e) =>
          setForm({ ...form, order: Number(e.target.value) }) // تبدیل به عدد صحیح
        }
      />
      <button className="bg-purple-600 hover:bg-purple-500 text-white px-2 py-1 rounded">
        +
      </button>
    </form>
  );
}
