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

  // Fetch categories and features
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get(`${apiUrl}/shop/categories/`);
        setCategories(categoriesRes.data);

        const featuresRes = await axios.get(`${apiUrl}/shop/features/`);
        setFeatures(featuresRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add category
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
      console.error("Error adding category:", error);
    }
  };

  // Add feature
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
      console.error("Error adding feature:", error);
    }
  };

  // Delete category or feature
  const handleDelete = async (id, type) => {
    try {
      await axios.delete(`${apiUrl}/shop/${type}/${id}/`);
      if (type === "categories") {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        setFeatures(features.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="p-6 space-y-10">
      {/* Categories Section */}
      <div className="border p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inputs */}
          <div className="flex flex-col gap-2 md:w-1/3">
            <input
              type="text"
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="border p-2 rounded"
            />
            {/* Parent selector for categories */}
            <select
              value={categoryParent || ""}
              onChange={(e) => setCategoryParent(e.target.value || null)}
              className="border bg-gray-800 p-2 rounded"
            >
              <option value="">Select parent category (optional)</option>
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
              Add Category
            </button>
          </div>

          {/* Categories list */}
          <ul className="flex-1 space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center border-b py-1"
              >
                <span>
                  {cat.name} {cat.parent ? `(Parent ID: ${cat.parent})` : ""}
                </span>
                <button
                  onClick={() => handleDelete(cat.id, "categories")}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="border p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Features</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          {/* Feature name input */}
          <input
            type="text"
            placeholder="New feature name"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          {/* is_general checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featureIsGeneral}
              onChange={(e) => setFeatureIsGeneral(e.target.checked)}
              className="h-5 w-5"
            />
            Is General
          </label>
          <button
            onClick={handleAddFeature}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Feature
          </button>
        </div>
        <ul className="space-y-2">
          {features.map((feat) => (
            <li
              key={feat.id}
              className="flex justify-between items-center border-b py-1"
            >
              <span>
                {feat.name} {feat.is_general ? "(General)" : "(Specific)"}
              </span>
              <button
                onClick={() => handleDelete(feat.id, "features")}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminCategoriesFeatures;
