"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function AdminManageBanners() {
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    position: "",
    image: null,
    link: "",
  });
  const [preview, setPreview] = useState(null);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/banners/`;

  // Fetch banners
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data);
    } catch {
      Swal.fire("خطا!", "مشکل در دریافت بنرها.", "error");
    }
  };

  // Add new banner
  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!newBanner.image || !newBanner.link || !newBanner.position)
      return Swal.fire("توجه!", "تمام فیلدها الزامی هستند.", "warning");

    const formData = new FormData();
    formData.append("position", newBanner.position);
    formData.append("link", newBanner.link);
    formData.append("image", newBanner.image);

    try {
      const res = await fetch(API_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to add banner");

      Swal.fire("موفق!", "بنر جدید اضافه شد.", "success");
      setNewBanner({ position: "", image: null, link: "" });
      setPreview(null);
      fetchBanners();
    } catch {
      Swal.fire("خطا!", "در افزودن بنر مشکلی پیش آمد.", "error");
    }
  };

  // Delete banner
  const handleDeleteBanner = async (id) => {
    const confirm = await Swal.fire({
      title: "حذف بنر؟",
      text: "آیا مطمئنی که می‌خوای این بنر حذف بشه؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذفش کن!",
      cancelButtonText: "لغو",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");

      Swal.fire("حذف شد!", "بنر با موفقیت حذف شد.", "success");
      fetchBanners();
    } catch {
      Swal.fire("خطا!", "در حذف بنر مشکلی پیش آمد.", "error");
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
        مدیریت بنرها
      </h1>

      {/* Add banner form */}
      <form
        onSubmit={handleAddBanner}
        className="bg-white/80 dark:bg-gray-800/70 backdrop-blur p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-4"
      >
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
          افزودن بنر جدید
        </h2>

        {/* Position */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">موقعیت:</label>
          <select
            value={newBanner.position}
            onChange={(e) =>
              setNewBanner({ ...newBanner, position: e.target.value })
            }
            className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">انتخاب کنید</option>
            <option value="left">چپ</option>
            <option value="right">راست</option>
          </select>
        </div>

        {/* Link */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">لینک:</label>
          <input
            type="text"
            value={newBanner.link}
            onChange={(e) =>
              setNewBanner({ ...newBanner, link: e.target.value })
            }
            className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="مثلاً /products"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-sm">تصویر:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setNewBanner({ ...newBanner, image: file });
              if (file) setPreview(URL.createObjectURL(file));
            }}
            className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-2 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          افزودن بنر
        </button>
      </form>

      {/* Banner list */}
      <div className="grid md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="group relative h-36 overflow-hidden rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-transform hover:scale-[1.02]"
          >
            <img
              src={banner.image}
              alt={banner.position}
              className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            <div className="absolute bottom-0 w-full p-4 text-white flex justify-between items-center backdrop-blur-sm">
              <div>
                <p className="font-semibold">
                  {banner.position === "left" ? "چپ" : "راست"}
                </p>
                <a
                  href={banner.link}
                  className="text-blue-200 text-xs break-all hover:underline"
                  target="_blank"
                >
                  {banner.link}
                </a>
              </div>
              <button
                onClick={() => handleDeleteBanner(banner.id)}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-lg shadow"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
