"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AdminCategoriesFeatures = () => {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryParent, setCategoryParent] = useState(null);
  const [newFeature, setNewFeature] = useState("");
  const [featureIsGeneral, setFeatureIsGeneral] = useState(true);

  // دریافت دسته‌بندی‌ها و ویژگی‌ها
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(`${apiUrl}/shop/categories/`);
        setCategories(categoriesRes.data);

        const featuresRes = await axios.get(`${apiUrl}/shop/features/`);
        setFeatures(featuresRes.data);
      } catch (error) {
        console.error("خطا در دریافت اطلاعات:", error);
      }
    };
    fetchData();
  }, []);

  // افزودن دسته‌بندی
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await axios.post(`${apiUrl}/shop/categories/`, {
        name: newCategory,
        parent: categoryParent || null,
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
      setCategoryParent(null);
    } catch (error) {
      console.error("خطا در افزودن دسته:", error);
    }
  };

  // افزودن ویژگی
  const handleAddFeature = async () => {
    if (!newFeature.trim()) return;
    try {
      const res = await axios.post(`${apiUrl}/shop/features/`, {
        name: newFeature,
        is_general: featureIsGeneral,
      });
      setFeatures([...features, res.data]);
      setNewFeature("");
      setFeatureIsGeneral(true);
    } catch (error) {
      console.error("خطا در افزودن ویژگی:", error);
    }
  };

  // حذف دسته یا ویژگی
  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`${apiUrl}/shop/${type}/${id}/`);
      if (type === "categories") {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        setFeatures(features.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("خطا در حذف مورد:", error);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* بخش دسته‌بندی‌ها */}
      <div className="border p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">دسته‌بندی‌ها</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* ورودی‌ها */}
          <div className="flex flex-col gap-2 md:w-1/3">
            <input
              type="text"
              placeholder="نام دسته جدید"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded"
            />

            {/* انتخاب والد برای دسته‌بندی */}
            <select
              value={categoryParent || ""}
              onChange={(e) => setCategoryParent(e.target.value || null)}
              className="border bg-gray-800 p-2 rounded"
            >
              <option value="">انتخاب دسته والد (اختیاری)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddCategory}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              افزودن دسته
            </button>
          </div>

          {/* لیست دسته‌بندی‌ها */}
          <ul className="flex-1 space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center border-b py-1"
              >
                <span>
                  {cat.parent ? `والد: ${cat.parent_detail?.name}  >  ` : ""}
                  {cat.name}
                </span>
                <button
                  onClick={() => handleDelete(cat.id, "categories")}
                  className="text-red-600 hover:underline"
                >
                  حذف
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* بخش ویژگی‌ها */}
      <div className="border p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">ویژگی‌ها</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          {/* نام ویژگی */}
          <input
            type="text"
            placeholder="نام ویژگی جدید"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="border p-2 rounded flex-1"
          />

          {/* چک‌باکس عمومی بودن */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featureIsGeneral}
              onChange={(e) => setFeatureIsGeneral(e.target.checked)}
              className="h-5 w-5"
            />
            ویژگی عمومی
          </label>

          <button
            onClick={handleAddFeature}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            افزودن ویژگی
          </button>
        </div>

        {/* لیست ویژگی‌ها */}
        <ul className="space-y-2">
          {features.map((feat) => (
            <li
              key={feat.id}
              className="flex justify-between items-center border-b py-1"
            >
              <span>
                {feat.name} {feat.is_general ? "(عمومی)" : "(مخصوص دسته)"}
              </span>
              <button
                onClick={() => handleDelete(feat.id, "features")}
                className="text-red-600 hover:underline"
              >
                حذف
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCategoriesFeatures;
