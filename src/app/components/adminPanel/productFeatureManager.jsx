"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ProductFeatureManager = ({ productId }) => {
   
    
  const [features, setFeatures] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);
  const [form, setForm] = useState({
    feature: "",
    value: "",
  });

  // 📦 دریافت لیست ویژگی‌های محصول
  useEffect(() => {
    if (!productId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/productsFeatures/?product=${productId}`)
   
    .then((res) => res.json())

    .then(setFeatures)
      .catch(console.error);
  }, [productId]);

  // 📦 دریافت لیست ویژگی‌های کلی برای انتخاب
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/features/`)
      .then((res) => res.json())
      .then(setAvailableFeatures)
      .catch(console.error);
  }, []);

  // ✏️ تغییر در ورودی فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ➕ افزودن ویژگی جدید
  const handleAddFeature = async (e) => {
    e.preventDefault();
    if (!form.feature || !form.value) {
      Swal.fire({
        icon: "warning",
        title: "ویژگی و مقدار را وارد کنید",
        confirmButtonText: "باشه",
      });
      return;
    }

    Swal.fire({
      title: "در حال افزودن ویژگی...",
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/productsFeatures/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feature: Number(form.feature),
          value: form.value,
          product: productId,
        }),
      });

      if (res.ok) {
        const newFeature = await res.json();
        setFeatures((prev) => [...prev, newFeature]);
        setForm({ feature: "", value: "" });
        Swal.fire({
          icon: "success",
          title: "ویژگی اضافه شد ✅",
          confirmButtonText: "باشه",
        });
      } else {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          icon: "error",
          title: "خطا در افزودن ویژگی",
          text: "مقادیر وارد شده را بررسی کنید",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "عدم ارتباط با سرور",
      });
    }
  };

  // ❌ حذف ویژگی
  const handleDeleteFeature = async (id) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "آیا از حذف این ویژگی مطمئن هستید؟",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/productsFeatures/${id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFeatures((prev) => prev.filter((f) => f.id !== id));
        Swal.fire({
          icon: "success",
          title: "ویژگی حذف شد 🗑️",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "خطا در حذف ویژگی",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "عدم ارتباط با سرور",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mt-10">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        ویژگی‌های محصول
      </h2>

      <form onSubmit={handleAddFeature} className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          name="feature"
          value={form.feature_detail}
          onChange={handleChange}
          className="border dark:border-gray-700 dark:bg-gray-800 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        >
          <option value="">انتخاب ویژگی</option>
          {availableFeatures.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="value"
          value={form.value}
          onChange={handleChange}
          placeholder="مقدار ویژگی (مثلاً: قرمز، 128GB)"
          className="border dark:border-gray-700 dark:bg-gray-800 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-700 text-white px-5 py-3 w-20 rounded-xl font-medium hover:bg-blue-800 transition"
        >
          افزودن
        </button>
      </form>

      <div className="space-y-2">
    
        {features.length === 0 ? (
          <p className="text-gray-500 text-center py-4">ویژگی‌ای ثبت نشده است.</p>
        ) : (
          features.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b dark:border-gray-700 py-2"
            >
              <div className="text-gray-800 dark:text-gray-200">
                <strong>{item.feature_detail?.name || "ویژگی نامشخص"}:</strong> {item.value}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteFeature(item.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition"
              >
                حذف
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductFeatureManager;
