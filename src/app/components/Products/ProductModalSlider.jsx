"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductModalSlider = ({ active, setActive, images = [],title }) => {
  const swiperRef = useRef(null);

  const handleNext = () => swiperRef.current?.swiper.slideNext();
  const handlePrev = () => swiperRef.current?.swiper.slidePrev();

  if (!images || images.length === 0) return null; // no images to show

  return (
    <div className={`slider-modal ${active ? "active" : ""} relative`}>
      <div className="flex w-full h-fit items-center justify-between">
        <h1 className="font-DanaMedium text-lg">
        تصاویر {title}
        </h1>
        <button onClick={() => setActive(false)}>
          <svg className="size-6 cursor-pointer close-sliderModal">
            <use href="#x-mark" />
          </svg>
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        spaceBetween={20}
        slidesPerView={1}
        className="ProductDetailsSlider mt-14 px-10 w-96 relative"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img src={process.env.NEXT_PUBLIC_API_URL+img} alt={`Product ${index + 1}`} className="rounded-lg" />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        onClick={handleNext}
        className="slider-navigate_btn absolute left-40 top-[17rem] border dark:border-gray-700 border-gray-200 z-10"
      >
        <svg className="size-6 rotate-[90deg]">
          <use href="#chevron" />
        </svg>
      </button>
      <button
        onClick={handlePrev}
        className="slider-navigate_btn absolute right-40 top-[17rem] border dark:border-gray-700 border-gray-200 z-20"
      >
        <svg className="size-6 -rotate-[90deg]">
          <use href="#chevron" />
        </svg>
      </button>
    </div>
  );
};

export default ProductModalSlider;
