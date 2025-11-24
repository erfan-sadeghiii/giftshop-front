"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function SectionForm({ categoryId, onAdded }) {
  const [form, setForm] = useState({ title: "", order: 0 });
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Token:", accessToken);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/megamenu/sections/`,
        { ...form, menuCategory: categoryId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      Swal.fire("✅ موفقیت", "بخش با موفقیت اضافه شد", "success");
      setForm({ title: "", order: 0 });
      onAdded();
    } catch {
      Swal.fire("خطا", "امکان اضافه کردن بخش وجود ندارد", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2 text-sm">
      <input
        type="text"
        placeholder="عنوان بخش"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1.5 rounded"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="ترتیب"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-1.5 rounded w-20"
        value={form.order}
        onChange={(e) => setForm({ ...form, order: e.target.value })}
      />
      <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded">
        +
      </button>
    </form>
  );
}
