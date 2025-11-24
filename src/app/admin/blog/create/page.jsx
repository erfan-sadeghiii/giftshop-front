"use client";

import { useState } from "react";
import Swal from "sweetalert2";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // image file
  const [preview, setPreview] = useState(""); // preview URL
  const [saving, setSaving] = useState(false);

  // Handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Save new blog
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: "warning",
        title: "فیلدهای مورد نیاز خالی است",
        text: "لطفاً عنوان و محتوا را وارد کنید.",
      });
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) formData.append("image", image);

      // Send POST request to create a new blog
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`, {
        method: "POST",
        body: formData, // multipart/form-data
      });

      Swal.fire({
        icon: "success",
        title: "ایجاد موفق!",
        text: "مقاله با موفقیت ایجاد شد.",
        timer: 2000,
        showConfirmButton: false,
      });

      window.location.href = "/admin"; // Redirect after creation
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "مشکلی در ایجاد مقاله پیش آمد.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex justify-center pt-0 pb-12 px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-6 text-center">ایجاد مقاله جدید</h1>

        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 ring-1 ring-blue-300 my-4 p-3 text-2xl font-bold border rounded-lg"
          placeholder="عنوان مقاله"
        />

        {/* Image Preview */}
        {
          <img
            src={preview? preview : "/placeholder2.png"}
            alt="پیش‌نمایش تصویر"
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg mb-4"
          />
        }

        {/* Image Upload */}
        <div className="ring-2 flex justify-around rounded-md pt-4 ring-blue-300 my-4">
          <label htmlFor="file">تصویر مقاله را انتخاب کنید</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-6"
          />
        </div>

        {/* Content Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 border rounded-lg shadow-inner mb-6 resize-none"
          placeholder="محتوای مقاله را وارد کنید..."
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-6 px-5 py-2 border-2 border-blue-700 rounded text-white ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-50"
          }`}
        >
          {saving ? "در حال ذخیره..." : "ذخیره مقاله"}
        </button>
      </div>
    </main>
  );
}
