"use client";

import { useRef, useState, useEffect, use } from "react";
import Swal from "sweetalert2";

export default function SingleBlogEditPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // For new uploaded file
  const [preview, setPreview] = useState(""); // For previewing the image
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch blog data
  useEffect(() => {
    if (!id) return;

    async function fetchBlog() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}/`);
        const data = await res.json();
        setBlog(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setPreview(data.image || "");
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Save edited content
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
      let imageUrl = preview; // Default to current preview

      // If a new image is selected, upload it first
      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}/`, {
          method: "PATCH",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url; // Adjust based on your API response
      }

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          // image: image,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "بروزرسانی موفق!",
        text: "مقاله با موفقیت بروزرسانی شد.",
        timer: 2000,
        showConfirmButton: false,
      });
       window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا!",
        text: "مشکلی در بروزرسانی مقاله پیش آمد.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center py-12">در حال بارگذاری...</p>;
  if (!blog)
    return <p className="text-center py-12 text-red-500">مقاله پیدا نشد</p>;

  return (
    <main className="flex justify-center pt-0 pb-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 ring-1 ring-blue-300 my-4 p-3 text-2xl font-bold border rounded-lg"
          placeholder="عنوان مقاله"
        />

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="پیش‌نمایش تصویر"
            className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg mb-4"
          />
        )}

        {/* Image Upload */}
        <div className="ring-2 flex  justify-around rounded-md pt-4 ring-blue-300 my-4 ">

       
        <label htmlFor="file">
          تصویر جدیدی آپلود کنید
        </label>
        <input
        id="file"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-6"
         
        />
 </div>
        {/* Editable Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-96 p-4 border rounded-lg shadow-inner mb-6 resize-none"
          placeholder="محتوای مقاله را وارد کنید..."
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className={`mt-6 px-5 py-2 border-2  border-blue-700 p-4 hover:border-gray-500 rounded text-white ${
            saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-50"
          }`}
        >
          {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </button>
      </div>
    </main>
  );
}
