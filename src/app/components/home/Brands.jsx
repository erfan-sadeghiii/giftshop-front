"use client";

import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const BrandSection = () => {
  const brandImages = [
    "./images/brand/1.png",
    "./images/brand/6.webp",
    "./images/brand/5.webp",
    "./images/brand/4.webp",
    "./images/brand/3.webp",
    "./images/brand/2.png",
    "./images/brand/7.png",
  ];

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="mx-4 lg:container mt-10 lg:mt-20">
      {/* SECTION TITLE */}
      <div className="flex flex-col gap-y-4 xs:flex-row items-center justify-between w-full text-center xs:text-start">
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          <span className="size-12 hidden xs:flex rounded-lg bg-white shadow-lg dark:bg-gray-800 flex-center">
            <svg className="size-7 text-gray-700 dark:text-gray-100">
              <use href="#check-badge" />
            </svg>
          </span>
          <div className="space-y-1 md:space-y-1">
            <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
              محبوب‌ترین <span className="text-blue-600 dark:text-blue-500">برندها</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">جدیدترین و بروزترین برندها</p>
          </div>
        </div>

        <div className="w-full xs:w-auto flex justify-between xs:justify-end items-center gap-x-2">
          {/* <div className="flex items-center gap-x-2">
            <button ref={prevRef} className="slider-navigate_btn brand-prev-slide">
              Prev
            </button>
            <button ref={nextRef} className="slider-navigate_btn brand-next-slide">
              Next
            </button>
          </div> */}
          <a
            href="shop.html"
            className="group shadow-xl text-sm md:text-base flex gap-x-1.5 items-center px-2 h-10 md:px-3 text-white bg-blue-600 rounded-xl"
          >
            <p>مشاهده همه</p>
            <span className="w-7 h-7 rounded-full bg-blue-500 flex-center md:group-hover:-translate-x-1 transition-transform duration-300">
              <svg className="size-5 ">
                <use href="#arrow" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* BRAND Slider */}
      <Swiper
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        spaceBetween={20}
        slidesPerView={4}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="mt-5 w-full"
      >
        {brandImages.map((src, idx) => (
          <SwiperSlide key={idx} className="brand-card group">
            <img src={src} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BrandSection;
