"use client";
import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const FeaturedSlider = () => {
  const swiperRef = useRef(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/?limit=10`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="my-20 mb-32  relative">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">مقالات اخیر</h2>

      {/* Custom Navigation Buttons */}
      <button
        className="slider-navigate_btn absolute left-1 top-40 border dark:border-gray-700 border-gray-200 z-10 p-2 rounded-full bg-white dark:bg-gray-800"

        onClick={() => swiperRef.current?.slidePrev()}
      >
        <svg className="w-6 h-6 rotate-[180deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <button
        className="slider-navigate_btn absolute right-1 top-40 border dark:border-gray-700 border-gray-200 z-10 p-2 rounded-full bg-white dark:bg-gray-800"
        onClick={() => swiperRef.current?.slideNext()}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <Swiper
        modules={[Pagination]}
        dir="ltr"
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <a href={`/blog/${blog.id}`}>

              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95  to-gray-50/10   bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-lg font-semibold text-center mt-12 px-4">{blog.title}</h3>
                </div>
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedSlider;
