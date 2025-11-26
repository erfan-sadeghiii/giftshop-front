"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

export default function AmazingSlider() {
  const [products, setProducts] = useState([]);

  // Fetch products once
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/shop/products/`
        );

        const sorted = [...data]
          .filter((p) => Number(p.discount) > 0)
          .sort((a, b) => Number(b.discount) - Number(a.discount))
          .slice(0, 5);

        setProducts(sorted);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    fetchProducts();
  }, []);

  // Keep your layout safe; no early return before hooks
  const slides = products; // no useMemo needed, just reference state

  return (
    <section className="mx-4 lg:container mt-20">
      <div className="w-full h-80 rounded-xl bg-blue-500 dark:bg-blue-700 p-4 relative">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },     // mobile FIX
            480: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}

          loop={slides.length > 1} // only loop if more than 1
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={{
            prevEl: ".AmazingSlider-prev-slide",
            nextEl: ".AmazingSlider-next-slide",
          }}
          className="AmazingSlider w-full rounded-xl"
        >
          {/* Timer card */}
          <SwiperSlide>
            <div className="amazing-card mx-auto ">
              <img
                className="w-28 h-28"
                src="./images/slider/Amazings.svg"
                alt="Timer"
              />
              <div className="flex items-center gap-x-2">
                <span className="timer-box" id="seconds">
                  00
                </span>
                <p className="text-white">:</p>
                <span className="timer-box" id="minutes">
                  00
                </span>
                <p className="text-white">:</p>
                <span className="timer-box" id="hours">
                  03
                </span>
              </div>

              <a
                href="products"
                className="flex items-center gap-x-.5 text-gray-100 cursor-pointer"
              >
                <p>مشاهده همه</p>
                <svg className="size-4 rotate-[90deg]">
                  <use href="#chevron"></use>
                </svg>
              </a>
            </div>
          </SwiperSlide>

          {/* Product slides */}
          {slides.map((product) => (
            <SwiperSlide key={product.id} >
              <div className="small-card group mx-auto ">
                <div className="w-full flex items-center justify-between">
                  <span className="text-gray-400 flex items-center justify-end text-sm gap-x-0.5">
                    <p>
                      {product.comments && product.comments.length > 0
                        ? (
                          product.comments.reduce(
                            (acc, c) => acc + (c.isLiked ? 5 : 3),
                            0
                          ) / product.comments.length
                        ).toFixed(1)
                        : "0.0"}
                    </p>
                    <svg className="size-4 mb-1">
                      <use href="#star"></use>
                    </svg>
                  </span>
                </div>

                <a href={`/products/${product.slug}`}>
                  <img
                    className="small-card_img"
                    src={
                      process.env.NEXT_PUBLIC_API_URL +
                      (product.images[0] || "/images/products/default.png")
                    }
                    alt={product.title}
                  />
                </a>

                <div className="space-y-2">
                  <a
                    href={`/products/${product.slug}`}
                    className="small-card_link line-clamp-2"
                  >
                    {product.title}
                  </a>

                  <div className="product-card_price-wrapper">
                    <div className="small-card_price justify-between">
                      <span className="pt-1">{Math.round(product.discount)}%</span>
                      <div className="flex flex-col">
                        <h4 className="flex items-center gap-x-1 text-lg">
                          {Number(product.final_price).toLocaleString()}{" "}
                          <p className="text-xs font-DanaMedium">تومان</p>
                        </h4>
                        {product.discount > 0 && (
                          <del className="text-xs text-gray-300">
                            {Number(product.price).toLocaleString()}{" "}
                          </del>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* See all card */}
          <SwiperSlide>
            <a
              href="/products"
              className="amazing-card_last flex flex-col items-center justify-center"
            >
              <svg className="size-10">
                <use href="#arrow-left-circle"></use>
              </svg>
              <h2>مشاهده همه</h2>
            </a>
          </SwiperSlide>
        </Swiper>

        {/* Navigation buttons */}
        <button className="slider-navigate_btn absolute right-1 top-36 border dark:border-gray-700 border-gray-200 AmazingSlider-prev-slide z-10">
          <svg className="size-6  rotate-[-90deg]">
            <use href="#chevron" />
          </svg>
        </button>
        <button className="slider-navigate_btn absolute left-1 top-36 border dark:border-gray-700 border-gray-200 AmazingSlider-next-slide z-10">
          <svg className="size-6 rotate-[90deg]">
            <use href="#chevron" />
          </svg>
        </button>
      </div>
    </section>
  );
}
