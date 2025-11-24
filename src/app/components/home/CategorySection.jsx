const CategorySection = ({}) => {
  return (<section className="mx-4 lg:container mt-20">
          {/* SECTION TITLE */}
          <div className="flex flex-col gap-y-4 xs:flex-row items-center justify-between w-full text-center xs:text-start">
            <div className="flex items-center gap-x-2 sm:gap-x-4">
              <span className="size-12 hidden xs:flex rounded-lg bg-white shadow-lg dark:bg-gray-800 flex-center">
                <svg className="size-7 text-gray-700 dark:text-gray-100">
                  <use href="#squares" />
                </svg>
              </span>
              <div className="space-y-1 md:space-y-1">
                <h3 className="text-xl md:text-2xl font-MorabbaMedium text-gray-800 dark:text-gray-50">
                  محصولات{" "}
                  <span className="text-blue-600 dark:text-blue-500">محبوب</span>
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  جدیدترین و بروزترین محصولات
                </p>
              </div>
            </div>
            <div className="w-full xs:w-auto flex justify-center items-center gap-x-2">
              <a
                href="shop.html"
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

          {/* ITEMS */}
          <div className="flex items-center justify-evenly flex-wrap mt-12 child:mb-8 gap-x-8 child:items-center child:flex-col child:duration-300 child:cursor-pointer child:gap-y-1 child:text-gray-800 dark:child:text-gray-300 child:relative">
            <a href="shop.html" className="group flex">
              <img
                src="./images/category/5.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category1"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">موبایل</p>
            </a>

            <a href="shop.html" className="group flex">
              <img
                src="./images/category/6.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category2"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">کالای دیجیتال</p>
            </a>

            <a href="shop.html" className="group flex">
              <img
                src="./images/category/7.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category3"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">خانه و آشپزخانه</p>
            </a>

            <a href="shop.html" className="group flex">
              <img
                src="./images/category/8.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category4"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">آرایشی بهداشتی</p>
            </a>

            <a href="shop.html" className="group flex">
              <img
                src="./images/category/9.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category5"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">لوازم تحریر</p>
            </a>

            <a href="shop.html" className="group flex">
              <img
                src="./images/category/10.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category6"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">گیفت کارت</p>
            </a>

            <a href="shop.html" className="group hidden md:flex">
              <img
                src="./images/category/11.png"
                className="w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] object-cover group-hover:grayscale group-hover:opacity-90 duration-300"
                alt="category7"
              />
              <p className="pt-1  dark:text-white text-sm lg:text-lg line-clamp-1">ابزار آلات</p>
            </a>
          </div>
        </section>);
}

export default CategorySection