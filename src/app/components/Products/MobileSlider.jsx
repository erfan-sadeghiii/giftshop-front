"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MobileSlider = ({ images }) => {
  
  
  if (!images || images.length === 0) return null; // no images to show

  return (
    <div className="md:hidden">
      <Swiper spaceBetween={10} slidesPerView={1} className="MobileProductSlider">
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={process.env.NEXT_PUBLIC_API_URL+img}
              alt={`Product ${index + 1}`}
              className="w-full rounded-lg"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MobileSlider;
