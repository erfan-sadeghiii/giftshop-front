"use client";

import { useEffect, useState } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

Swiper.use([Navigation]);

export default function LatestProducts() {
  const [products, setProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/products/`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    }
    getData();
  }, []);

  // Initialize Swiper after products are loaded
  useEffect(() => {
    if (products.length > 0) {
      const swiper = new Swiper(".LatestProducts", {
        slidesPerView: 1,
        spaceBetween: 15,
        navigation: {
          nextEl: ".LatestProducts-next-slide",
          prevEl: ".LatestProducts-prev-slide",
        },
        breakpoints: {
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
          1280: { slidesPerView: 1 },
          1480: { slidesPerView: 1 },
        },
      });

      return () => swiper.destroy(true, true);
    }
  }, [products]);
  let filtered = [...products].filter((p) => p.stock_quantity > 0);
  return (
    <section className="mx-4 lg:container mt-10 lg:mt-20">
      {/* Section title */}
      <div className="flex flex-col gap-y-4 xs:flex-row items-center justify-between w-full text-center xs:text-start">
        <div className="flex items-center gap-x-2 sm:gap-x-4">
          <span className="size-12 hidden xs:flex rounded-lg bg-white shadow-lg dark:bg-gray-800 flex-center">
            <svg className="size-7 text-gray-700 dark:text-gray-100">
              <use href="#mobile" />
            </svg>
          </span>
          <div className="space-y-1 md:space-y-1">
            <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
              جدید ترین{" "}
              <span className="text-blue-600 dark:text-blue-500">محصولات</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              جدیدترین و بروزترین محصولات
            </p>
          </div>
        </div>

        {/* Navigation + "View All" button */}
        <div className="w-full xs:w-auto flex justify-between xs:justify-end items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <button className="slider-navigate_btn LatestProducts-prev-slide">
              <svg className="size-6 -rotate-[90deg]">
                <use href="#chevron" />
              </svg>
            </button>
            <button className="slider-navigate_btn LatestProducts-next-slide">
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
              <svg className="size-5 ">
                <use href="#arrow" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Product list */}
      <div className="swiper LatestProducts mt-5 w-full">
        <div className="swiper-wrapper py-5">
         
          {filtered.length == 0 ? (
            <p className="text-center w-full text-gray-500 dark:text-gray-400">
              در حال بارگذاری...
            </p>
          ) : (

            filtered.map((product) => (
              <div key={product.id} className="swiper-slide w-full product-card group">
                {/* Product header */}
                <div className="product-card_header">
                  <div className="flex items-center gap-x-2">
                    {/* {["shopping-cart", "heart", "arrows-up-down"].map((icon, i) => (
                      <div key={i} className="tooltip">
                        <button className="rounded-full p-1.5 app-border app-hover">
                          <svg className="size-4">
                            <use href={`#${icon}`} />
                          </svg>
                        </button>
                        <div className="tooltiptext">
                          {icon === "shopping-cart"
                            ? "سبد خرید"
                            : icon === "heart"
                            ? "علاقه مندی"
                            : "مقایسه"}
                        </div>
                      </div>
                    ))} */}
                  </div>
                  {product.discount > 0 && (
                    <span className="product-card_badge">
                      {Math.floor(product.discount)}% تخفیف
                    </span>
                  )}
                </div>

                {/* Product image */}
                <a href={`/products/${product.slug}`}>
                  <img
                    className="product-card_img"
                    src={process.env.NEXT_PUBLIC_API_URL + product.images[0] || "/images/products/1.png"}
                    alt={product.title}
                  />
                </a>

                {/* Product footer */}
                <div className="space-y-2">
                  <a href={`/products/${product.slug}`} className="product-card_link">
                    {product.title}
                  </a>
                  <div className="product-card_price-wrapper">
                    <div className="product-card_rate">
                      <span className="flex items-center gap-x-0.5 text-gray-400 text-sm">
                        <p> {product.comments && product.comments.length > 0
                          ? (
                            product.comments.reduce(
                              (acc, c) => acc + (c.isLiked ? 5 : 3),
                              0
                            ) / product.comments.length
                          ).toFixed(1)
                          : "0.0"}</p>
                        <svg className="size-4 mb-1">
                          <use href="#star" />
                        </svg>
                      </span>
                    </div>
                    <div className="product-card_price">
                      {product.discount > 0 && (
                        <del>{Number(product.price).toLocaleString()} تومان</del>
                      )}
                      <p>{Number(product.final_price).toLocaleString()}</p>
                      <span>تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
