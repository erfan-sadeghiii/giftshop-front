"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProductFeatureManager from "@/app/components/adminPanel/productFeatureManager";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then(mod => mod.Editor),
  { ssr: false }
);
const EditProductClient = ({ slug }) => {
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    slug: "",
    description: "",
    price: "",
    discount: "",
    stock_quantity: "",
    category: "",
    images: [],
    product_features: [],
    remove_images: [],
  });

  // 📦 دریافت دسته‌بندی‌ها
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/categories/`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  // 📦 دریافت اطلاعات محصول
  useEffect(() => {
    if (!slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products/${slug}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
       

        setFormData((prev) => ({
          ...prev,
          title: data.title,
          subtitle: data.subtitle,
          description: data.description,
          price: data.price,
          discount: data.discount,
          stock_quantity: data.stock_quantity,
          category: data?.category?.id,
          slug: data.slug,
          product_features: data.product_features || [],
        }));
        setExistingImages(data.images);
        setImagesPreview(data.images);
      })
      .catch(console.error);
  }, [slug]);

  // ✏️ تغییر ورودی‌ها
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼 افزودن تصویر جدید
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagesPreview((prev) => [...prev, ...previews]);
  };

  // ❌ حذف تصویر موجود
  const removeExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setImagesPreview((prev) => prev.filter((img) => img !== url));
    setFormData((prev) => ({
      ...prev,
      remove_images: [...prev.remove_images, url],
    }));
  };

  // ❌ حذف تصویر جدید
  const removeNewImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));

    const newPreviews = [...imagesPreview];
    newPreviews.splice(existingImages.length + index, 1);
    setImagesPreview(newPreviews);
  };

  // 📨 ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subtitle", formData.subtitle);
    payload.append("description", formData.description);
    payload.append("price", Number(formData.price));
    payload.append("discount", Number(formData.discount));
    payload.append("stock_quantity", Number(formData.stock_quantity));
    payload.append("category", Number(formData.category));
    payload.append("slug", formData.slug);

    formData.images.forEach((file) => payload.append("images", file));
    formData.remove_images.forEach((url) => payload.append("remove_images", url));
    payload.append("product_features", JSON.stringify(formData.product_features));

    Swal.fire({
      title: "در حال ذخیره تغییرات...",
      text: "لطفاً منتظر بمانید",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/products/${slug}/`,
        {
          method: "PUT",
          body: payload,
        }
      );

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "محصول با موفقیت به‌روزرسانی شد 🎉",
          confirmButtonText: "باشه",
        });

        window.location.href = "/admin";
      } else {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          icon: "error",
          title: "خطا در به‌روزرسانی محصول",
          text: "اطلاعات وارد شده را بررسی کنید.",
          confirmButtonText: "متوجه شدم",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "عدم ارتباط با سرور ❌",
        text: "لطفاً اتصال خود را بررسی کنید.",
        confirmButtonText: "باشه",
      });
    }
  };

  if (!product)
    return (
      <p className="text-center py-10 text-gray-500 animate-pulse">
        در حال بارگذاری اطلاعات محصول...
      </p>
    );

  return (
    <div dir="rtl" className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center border-b pb-4">
        ویرایش محصول
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border border-gray-100 dark:border-gray-800"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              عنوان محصول
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              زیرعنوان
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
            slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
            توضیحات محصول
          </label>
          {/* <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full h-68 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          /> */}
           <Editor
             name="description"
              apiKey="9tmzehb3ivzivy1yerginx4rohemst3uq1th2nlnymihruy6"
              value={formData.description}
              init={{
                promotion: false,
                onboarding: false,
                branding: false,
                language: "fa",
                height: 400,
                menubar: true,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "charmap",
                  "preview", "anchor", "searchreplace", "visualblocks",
                  "code", "fullscreen", "insertdatetime", "media", "table",
                  "help", "wordcount"
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
                content_style: "body { font-family:Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={(value)=>setFormData((prev) => ({ ...prev, ["description"]: value }))}
            />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              قیمت (تومان)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              تخفیف (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
              موجودی انبار
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Show discounted price */}
        {formData.price && (
          <p className="my-2 text-sm text-gray-600 dark:text-gray-400">
            قیمت با تخفیف:{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {(
                formData.price -
                (formData.price * (formData.discount || 0)) / 100
              ).toLocaleString()}{" "}
              تومان
            </span>
          </p>
        )}


        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
            دسته‌بندی
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="border dark:border-gray-700 dark:bg-gray-800 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          >
            <option value="">انتخاب دسته‌بندی</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.parent_detail
                  ? `${cat.parent_detail.name} > ${cat.name}`
                  : cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
            تصاویر محصول
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="border dark:border-gray-700 dark:bg-gray-800 rounded-xl p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-3 mt-3">
            {imagesPreview.map((img, i) =>
              existingImages.includes(img) ? (
                <div key={img} className="relative group">
                  <img
                    src={process.env.NEXT_PUBLIC_API_URL + img}
                    alt="preview"
                    className="w-24 h-24 object-cover border rounded-xl shadow-sm group-hover:opacity-80 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm shadow-md"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div key={i} className="relative group">
                  <img
                    src={img}
                    alt="preview"
                    className="w-24 h-24 object-cover border rounded-xl shadow-sm group-hover:opacity-80 transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i - existingImages.length)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm shadow-md"
                  >
                    ×
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-700 text-white w-full py-3 rounded-xl text-lg font-medium "
        >
          ذخیره تغییرات
        </button>
      </form>

      <ProductFeatureManager productId={product.id} />
    </div>
  );
};

export default EditProductClient;
