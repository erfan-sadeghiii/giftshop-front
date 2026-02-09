"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export default function HeaderSlider() {
  const [slides, setSlides] = useState([]);
  const [l, setl] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/sliders/`);
        const data = await res.json();
        setSlides(data);
        setl(false)
      } catch (error) {
        console.error("Failed to fetch slides:", error);
        setl(false)
      }
    };

    fetchSlides();
  }, []);

  // Loading skeleton
  if (l)
    return (
      <div className="px-3 lg:container w-full mt-4 lg:mt-10 h-52 md:h-96 bg-gray-200 animate-pulse rounded-xl" />
    );

  // Duplicate slides if less than 2 for loop
  const displaySlides = slides.length < 2 ? [...slides, ...slides] : slides;

  return (
      <div className="px-3 lg:container w-full mt-4 lg:mt-10">
  {/* HEIGHT CONTROLLER */}
  <div className="h-52 md:h-[35rem] rounded-xl overflow-hidden">
    <Swiper
      dir="ltr"
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      loop={displaySlides.length > 1}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      className="header-slider w-full h-full"
    >
      {displaySlides.map((slide, i) => (
        <SwiperSlide key={`${slide.id}-${i}`} className="h-full">
          <a href={slide.link ?? "#"} className="block w-full h-full relative">
            <Image
              fill
              src={slide.picture}
              alt={`Slide ${slide.id}`}
              className="object-cover"
            />
          </a>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
</div>

      );
}
