"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductCard from "../productCard";

const RelatedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products/`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null; // optional loading state
  let filtered = [...products].filter((p) => p.stock_quantity > 0);
  return (
    <section className="mx-4 lg:container mt-10 lg:mt-20">
      <div className=" ">
        {/* SECTION TITLE */}
        <div className="flex flex-col  gap-y-4 py-4 xs:flex-row items-center justify-between w-full text-center xs:text-start">
          <div className="flex items-center gap-x-2 sm:gap-x-4">
            <span className="size-12 hidden xs:flex rounded-lg bg-white shadow-lg dark:bg-gray-800 flex-center">
              <svg className="size-7 text-gray-700 dark:text-gray-100">
                <use href="#mobile" />
              </svg>
            </span>
            <div className="space-y-1 md:space-y-1">
              <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
                محصولات <span className="text-blue-600 dark:text-blue-500">مرتبط</span>
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                جدیدترین و بروزترین محصولات
              </p>
            </div>
          </div>

          <div className="w-full xs:w-auto flex justify-between xs:justify-end items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <button className="slider-navigate_btn BestSelling-prev-slide">
                <svg className="size-6 -rotate-[90deg]">
                  <use href="#chevron" />
                </svg>
              </button>
              <button className="slider-navigate_btn BestSelling-next-slide">
                <svg className="size-6 rotate-[90deg]">
                  <use href="#chevron" />
                </svg>
              </button>
            </div>
            <a
              href="/products"
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

        {/* Products Slider */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".BestSelling-prev-slide",
            nextEl: ".BestSelling-next-slide",
          }}
          spaceBetween={15}
          slidesPerView={"auto"}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 25 },
          }}
        >
          {filtered.map((product) => (
            <SwiperSlide
              key={product.id}
              className="w-[250px] md:w-auto"
            >
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default RelatedProducts;
