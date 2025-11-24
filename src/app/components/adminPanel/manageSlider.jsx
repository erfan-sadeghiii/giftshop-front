"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Swal from "sweetalert2";

export default function ManageHeaderSlider() {
  const [slides, setSlides] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newLink, setNewLink] = useState("");

  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/shop/sliders/`;

  // گرفتن اسلایدها
  const fetchSlides = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("عدم توانایی در دریافت اسلایدها:", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // افزودن اسلاید جدید
  const handleAddSlide = async (e) => {
    e.preventDefault();
    if (!newImage || !newLink) {
      Swal.fire("خطا", "لطفاً تصویر و لینک را وارد کنید", "error");
      return;
    }

    const formData = new FormData();
    formData.append("picture", newImage);
    formData.append("link", newLink.trim());

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("خطاهای اعتبارسنجی سرور:", data);
        Swal.fire("خطا", JSON.stringify(data), "error");
        return;
      }

      Swal.fire("موفقیت", "اسلاید با موفقیت اضافه شد", "success");
      setNewImage(null);
      setNewLink("");
      fetchSlides();
    } catch (err) {
      console.error("خطای شبکه:", err);
      Swal.fire("خطا", "عدم توانایی در افزودن اسلاید", "error");
    }
  };

  // حذف اسلاید
  const handleDeleteSlide = async (id) => {
    const confirm = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این اسلاید به‌صورت دائمی حذف خواهد شد.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن!",
      cancelButtonText: "لغو",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${apiUrl}${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("عدم توانایی در حذف اسلاید");

      Swal.fire("حذف شد!", "اسلاید حذف شد.", "success");
      fetchSlides();
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "عدم توانایی در حذف اسلاید", "error");
    }
  };

  
  return (
    <div className="px-3 lg:container mt-4 lg:mt-10">
      {/* افزودن اسلاید جدید */}
      <form onSubmit={handleAddSlide} className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="/link"
          dir="ltr"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="bg-gray-800 p-2 rounded flex-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          افزودن اسلاید
        </button>
      </form>
      {!slides.length && (<p className="text-center mt-4">در حال بارگذاری اسلایدها...</p>)}


      {/* اسلایدر Swiper با دکمه حذف */}
      <Swiper
        dir="ltr"
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}

  
        pagination={{ clickable: true }}
        navigation={true}
        className="header-slider h-52 md:h-96 cursor-pointer"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <a href={slide.link}>
              <img
                src={slide.picture}
                className="rounded-xl w-full h-full object-cover"
                alt={`اسلاید ${slide.id}`}
              />
            </a>
            <button
              onClick={() => handleDeleteSlide(slide.id)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded opacity-80 hover:opacity-100"
            >
              حذف
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
