"use client";

import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import ArticleCard from "../ArticleCard";

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/?limit=10`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data.results ? data.results : data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

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
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
              آخرین <span className="text-blue-600 dark:text-blue-500">مقالات</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              جدیدترین و بروزترین مقالات
            </p>
          </div>
        </div>

        {/* Custom Arrow Buttons */}
        <div className="w-full xs:w-auto flex justify-between xs:justify-end items-center gap-x-2">
          <div className="flex items-center gap-x-2">
          <button className="slider-navigate_btn articleSlider-prev-slide">
            <svg className="size-6 -rotate-[90deg]">
              <use href="#chevron" />
            </svg>
          </button>
          <button className="slider-navigate_btn articleSlider-next-slide">
            <svg className="size-6 rotate-[90deg]">
              <use href="#chevron" />
            </svg>
          </button>

          </div>

          <a
            href="/blog"
            className="group shadow-xl text-sm md:text-base flex gap-x-1.5 items-center px-2 h-10 md:px-3 text-white bg-blue-600 rounded-xl"
          >
            <p>مشاهده همه</p>
            <span className="w-7 h-7 rounded-full bg-blue-500 flex-center md:group-hover:-translate-x-1 transition-transform duration-300">
              <svg className="size-5">
                <use href="#arrow" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".articleSlider-prev-slide",
          nextEl: ".articleSlider-next-slide",
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
          1280: { slidesPerView: 4 },
        }}
        className="mt-6"
      >
        {articles.slice(0, 10).map((article, idx) => (
          <SwiperSlide key={article.id || idx}>
            <ArticleCard
              article={article}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Articles;
