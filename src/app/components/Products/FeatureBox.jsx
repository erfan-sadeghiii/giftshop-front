"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const FeatureBox = ({ features = [] }) => {
  if (!features.length) return null;

  return (
    <div className="w-full flex flex-col gap-y-4 ">
      <h1 className="font-DanaDemiBold  text-lg dark:text-gray-200">
        ویژگی‌ها
      </h1>

      {/* Desktop & Tablet grid */}
  <div className="md:grid hidden   grid-cols-12 gap-2">

  {features.filter(x=>x.feature_detail.is_general==true).map((item) => (
    <div
      key={item.id}
      className="col-span-12 md:col-span-6 xl:col-span-4 p-2 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col gap-y-1.5"
    >
      <p className="text-sm text-gray-500">{item.feature_detail.name}</p>
      <p className="line-clamp-1 font-DanaDemiBold text-sm text-slate-800 dark:text-slate-200">
        {item.value}
      </p>
    </div>
  ))}
</div>


      {/* Mobile slider */}
      <div className="md:hidden">
        <Swiper spaceBetween={12} slidesPerView={1.2}>
          {features.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="p-2 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col gap-y-1.5">
                <p className="text-sm text-gray-500">{item.feature_detail.name}</p>
                <p className="line-clamp-1 font-DanaDemiBold text-sm text-slate-800 dark:text-slate-200">
                  {item.value}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default FeatureBox;
