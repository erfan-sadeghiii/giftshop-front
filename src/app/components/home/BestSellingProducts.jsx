const BestSellingProducts = ({ }) => {
    return (
        <section className="mx-4 lg:container mt-10 lg:mt-20">
            {/* SECTION TITLE */}
            <div className="flex flex-col gap-y-4 xs:flex-row items-center justify-between w-full text-center xs:text-start">
                <div className="flex items-center gap-x-2 sm:gap-x-4">
                    <span className="size-12 hidden xs:flex rounded-lg bg-white shadow-lg dark:bg-gray-800 flex-center">
                        <svg className="size-7 text-gray-700 dark:text-gray-100">
                            <use href="#mobile" />
                        </svg>
                    </span>
                    <div className="space-y-1 md:space-y-1">
                        <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
                            محصولات <span className="text-blue-600 dark:text-blue-500">پرفروش </span>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-300">جدیدترین و بروزترین محصولات</p>
                    </div>
                </div>
                <div className="w-full xs:w-auto flex justify-between xs:justify-end items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                        <button className="slider-navigate_btn BestSelling-prev-slide">
                            <svg className="size-6  rotate-[-90deg]">
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
                        href="main.html"
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

            {/* Latest products Slider */}
            <div className="swiper BestSelling mt-5 w-full">
                <div className="swiper-wrapper py-5">
                    {/* PRODUCT ITEM */}
                    {[1, 3, 5, 7, 1, 3].map((imgIndex, idx) => (
                        <div key={idx} className="swiper-slide product-card group">
                            {/* product header */}
                            <div className="product-card_header">
                                <div className="flex items-center gap-x-2">
                                    {["shopping-cart", "heart", "arrows-up-down"].map((icon, i) => (
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
                                    ))}
                                </div>
                                {/* badge offer */}
                                <span className="product-card_badge">70% تخفیف‌</span>
                            </div>

                            {/* product img */}
                            <a href="product-details.html">
                                <img
                                    className="product-card_img group-hover:opacity-0 absolute"
                                    src={`./images/products/${imgIndex}.png`}
                                    alt=""
                                />
                                <img
                                    className="product-card_img opacity-0 group-hover:opacity-100"
                                    src={`./images/products/${imgIndex + 1}.png`}
                                    alt=""
                                />
                            </a>

                            {/* product footer */}
                            <div className="space-y-2">
                                <a href="product-details.html" className="product-card_link">
                                    لپ تاپ 15.6 اینچی ایسوس مدل Vivobook15 X515MA-BR001-Celeron N4020-8GB DDR4
                                </a>

                                {/* Rate and Price */}
                                <div className="product-card_price-wrapper">
                                    {/* RATE */}
                                    <div className="product-card_rate">
                                        <span className="flex items-center gap-x-0.5">
                                            <svg className="size-4 text-blue-500 mb-0.5">
                                                <use href="#rocket" />
                                            </svg>
                                            <p className="text-xs">ارسال امروز</p>
                                        </span>
                                        <span className="text-gray-400 flex items-center text-sm gap-x-0.5">
                                            <p>5.0</p>
                                            <svg className="size-4 mb-1">
                                                <use href="#star" />
                                            </svg>
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="product-card_price">
                                        <del>
                                            70,000,000 <h6>تومان</h6>
                                        </del>
                                        <p>70,000,000</p>
                                        <span>تومان</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BestSellingProducts