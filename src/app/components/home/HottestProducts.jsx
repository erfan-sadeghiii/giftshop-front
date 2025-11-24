const HottestProducts = ({}) => {
  return (
       <section className="mx-4 lg:container mt-10 lg:mt-20">
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl h-[420px] p-5 flex flex-col gap-y-2 relative">
            {/* Title */}
            <div className="flex-center gap-x-1">
              <svg className="size-6 pb-1 text-orange-400">
                <use href="#fire" />
              </svg>
              <h4 className="font-DanaMedium text-lg text-gray-800 dark:text-gray-200">
                داغ ترین چند ساعت گذشته
              </h4>
            </div>

            <div className="swiper HottestSlider w-full">
              <div className="swiper-wrapper w-full">
                {/* PRODUCT ITEM */}
                {[
                  [
                    { src: "./images/products/1.png", text: "مانیتور گیمینگ ایسوس مدل ROG Swift PG259QN" },
                    { src: "./images/products/3.png", text: "کنسول بازی پلی استیشن 5 نسخه دیسک دار" },
                    { src: "./images/products/7.webp", text: "ساعت هوشمند سامسونگ مدل Galaxy Watch 6" },
                  ],
                  [
                    { src: "./images/products/1.png", text: "لپ تاپ 14 اینچی لنوو مدل ThinkPad X1 Carbon" },
                    { src: "./images/products/3.png", text: "گوشی موبایل سامسونگ مدل Galaxy S23 Ultra" },
                    { src: "./images/products/7.webp", text: "هدفون بی‌سیم اپل مدل AirPods Pro 2" },
                  ],
                  [
                    { src: "./images/products/1.png", text: "لپ تاپ 14 اینچی لنوو مدل ThinkPad X1 Carbon" },
                    { src: "./images/products/3.png", text: "گوشی موبایل سامسونگ مدل Galaxy S23 Ultra" },
                    { src: "./images/products/7.webp", text: "هدفون بی‌سیم اپل مدل AirPods Pro 2" },
                  ],
                  [
                    { src: "./images/products/1.png", text: "لپ تاپ 14 اینچی لنوو مدل ThinkPad X1 Carbon" },
                    { src: "./images/products/3.png", text: "گوشی موبایل سامسونگ مدل Galaxy S23 Ultra" },
                    { src: "./images/products/7.webp", text: "هدفون بی‌سیم اپل مدل AirPods Pro 2" },
                  ],
                  [
                    { src: "./images/products/1.png", text: "لپ تاپ 14 اینچی لنوو مدل ThinkPad X1 Carbon" },
                    { src: "./images/products/3.png", text: "گوشی موبایل سامسونگ مدل Galaxy S23 Ultra" },
                    { src: "./images/products/7.webp", text: "هدفون بی‌سیم اپل مدل AirPods Pro 2" },
                  ],
                ].map((slide, idx) => (
                  <div key={idx} className="swiper-slide hottest-slide">
                    {slide.map((item, i) => (
                      <a key={i} href="product-details.html" className="hottest-slide_link">
                        <img className="hottest-slide_img" src={item.src} alt="" />
                        <p className="hottest-slide_text">{item.text}</p>
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button className="slider-navigate_btn absolute right-1 top-[47%] border dark:border-gray-700 border-gray-200 Hottest-prev-slide z-10">
              <svg className="size-6 -rotate-[90deg]">
                <use href="#chevron" />
              </svg>
            </button>
            <button className="slider-navigate_btn absolute left-1 top-[47%] border dark:border-gray-700 border-gray-200 Hottest-next-slide z-10">
              <svg className="size-6 rotate-[90deg]">
                <use href="#chevron" />
              </svg>
            </button>
          </div>
        </section>

  );
}

export default HottestProducts