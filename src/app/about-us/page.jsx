import BreadCrumb from "../components/Products/BreadCrumb";

const AboutUsSection = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 pb-24 relative overflow-hidden">
           <div className="pb-8  flex justify-center">
      <BreadCrumb/>

      </div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 relative ">
        {/* Image Half */}
        <div className="lg:w-6/12 w-full relative">
          <div className="overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="/images/articles/about.png"
              alt="About Us"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl"></div>
          </div>
        </div>

        {/* Content Half */}
        <div className="lg:w-6/12 w-full flex flex-col gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white animate-fadeInUp">
            درباره تیکسو گیم
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl animate-fadeInUp delay-100">
            در تیکسو گیم، ما فقط محصولات دیجیتال نمی‌فروشیم — بلکه تجربه‌ای مطمئن، سریع و لذت‌بخش از خرید گیمینگ را ارائه می‌دهیم.

از روز اول، هدفمان ساختن جایی بوده که گیمرها بتوانند با آرامش خاطر اکانت بازی، گیفت کارت و محصولات محبوبشان را تهیه کنند، بدون نگرانی از اصالت یا امنیت خرید.

ما باور داریم که رضایت مشتری واقعی‌ترین موفقیت ماست؛ به همین دلیل تمام فرایندهای خرید، تحویل و پشتیبانی در تیکسو گیم به‌صورت کاملاً شفاف و تضمین‌شده انجام می‌شود.

هر محصول قبل از عرضه تست می‌شود و تیم فنی ما همیشه در دسترس است تا در هر مرحله از خرید، کنار شما باشد.

اعتماد شما بزرگ‌ترین سرمایه ماست — و ما هر روز تلاش می‌کنیم با سرعت بالا، قیمت منصفانه و پشتیبانی حرفه‌ای، این اعتماد را حفظ کنیم.
          </p>
          <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl animate-fadeInUp delay-200">
            تیکسو گیم | دنیای مطمئن خرید بازی و گیفت کارت
          </p>
          {/* <button className="self-start bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition transform">
            Learn More
          </button> */}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
