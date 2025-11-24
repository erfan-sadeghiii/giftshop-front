"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import CategoryForm from "./categoryForm";
import SectionForm from "./SectionForm";
import ItemForm from "./itemForm";
import { useAuth } from "@/context/AuthContext";

export default function MegaMenuAdmin() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useAuth();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shop/megamenu/`);
      setCategories(res.data);
    } catch (error) {
      Swal.fire("خطا", "بارگذاری منوی اصلی موفقیت‌آمیز نبود.", "error");
    }
    setLoading(false);
  };

  const handleDelete = async (url, label) => {
    const result = await Swal.fire({
      title: `حذف این ${label}؟`,
      text: "این عمل قابل بازگشت نیست.",
      icon: "warning",
      background: "#1f2937",
      color: "#e5e7eb",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "بله، حذف شود",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/shop/${url}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        Swal.fire({
          title: "حذف شد!",
          text: `${label} با موفقیت حذف شد.`,
          icon: "success",
          background: "#1f2937",
          color: "#e5e7eb",
        });
        fetchMenu();
      } catch {
        Swal.fire("خطا", `حذف ${label} موفقیت‌آمیز نبود.`, "error");
      }
    }
  };

  if (loading)
    return <p className="p-4 text-gray-400 text-center">در حال بارگذاری منوی اصلی...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">
        مگـــــا منـــو
      </h1>

      <CategoryForm onAdded={fetchMenu} />

      <div className="space-y-5 mt-8">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-md"
          >
            {/* سربرگ دسته‌بندی */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-xl text-gray-100">{cat.name}</h2>
              <button
                onClick={() => handleDelete(`megamenu/${cat.id}/`, "دسته‌بندی")}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                🗑 حذف دسته‌بندی
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-3">
              آیکون: {cat.icon} | ترتیب: {cat.order}
            </p>

            {/* افزودن بخش جدید */}
            <SectionForm categoryId={cat.id} onAdded={fetchMenu} />

            {/* بخش‌ها */}
            <div className="mt-4 space-y-3">
              {cat.sections.map((sec) => (
                <div
                  key={sec.id}
                  className="ml-3 border-l-2 border-gray-700 pl-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-300">
                      📁 {sec.title} 
                      <span className="text-gray-500">(#{sec.order})</span>
                    </h3>
                    <button
                      onClick={() =>
                        handleDelete(`megamenu/sections/${sec.id}/`, "بخش")
                      }
                      className="text-red-500 hover:text-red-400 text-xs"
                    >
                      🗑 حذف بخش
                    </button>
                  </div>

                  {/* افزودن آیتم */}
                  <ItemForm sectionId={sec.id} onAdded={fetchMenu} />

                  {/* آیتم‌ها */}
                  <ul className="ml-6 mt-2 space-y-1 text-sm">
                    {sec.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex flex-start text-gray-400 hover:text-gray-200"
                      >
                        <span>
                          {item.name} →{" "}
                          <span dir="ltr" lang="Eng" className="text-indigo-400">{item.link}?{item.query}</span>
                        </span>
                        <button
                          onClick={() =>
                            handleDelete(`megamenu/items/${item.id}/`, "آیتم")
                          }
                          className="text-red-400 mt-1 mx-4 hover:text-red-300 text-xs"
                        >
                          ✖
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
