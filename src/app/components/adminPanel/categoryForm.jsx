"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function CategoryForm({ onAdded }) {
  const [form, setForm] = useState({ name: "",link:"", icon: "", order: 0 });
  const { accessToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/shop/megamenu/`, form, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      Swal.fire("✅ موفقیت", "دسته‌بندی با موفقیت اضافه شد", "success");
      setForm({ name: "",link:"", icon: "", order: 0 });
      onAdded();
    } catch {
      Swal.fire("خطا", "امکان اضافه کردن دسته‌بندی وجود ندارد", "error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-900 border border-gray-800 rounded-2xl flex gap-3 flex-wrap"
    >
      <input
        type="text"
        placeholder="نام دسته‌بندی"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-2 rounded w-40"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="لینک"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-2 rounded w-40"
        value={form.link}
        onChange={(e) => setForm({ ...form, link: e.target.value })}
      />
      <input
        type="text"
        placeholder="آیکون"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-2 rounded w-32"
        value={form.icon}
        onChange={(e) => setForm({ ...form, icon: e.target.value })}
      />
      <input
        type="number"
        placeholder="ترتیب"
        className="bg-gray-800 border border-gray-700 text-gray-200 p-2 rounded w-24"
        value={form.order}
        onChange={(e) => setForm({ ...form, order: e.target.value })}
      />
      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
        + افزودن
      </button>
    </form>
  );
}
