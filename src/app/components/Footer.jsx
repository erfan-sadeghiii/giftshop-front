const Footer = ({ }) => {
  return (
    <>
      { /* <!-- Footer --> */}
      <footer className="md:container my-12">
        <div className="relative w-full bg-gray-900 dark:bg-gray-800 text-white rounded-2xl p-4 lg:p-9">
          <div className="flex items-start flex-col gap-x-7 lg:gap-x-10 gap-y-10 lg:flex-row flex-wrap">
            {/* About Section */}
            <div className="flex-[2] w-full">
              <h2 className="footer_title">درباره  <span className="text-blue-500">تیکسـو</span> گیم</h2>
              <p className="leading-8 text-gray-400 mb-5">
                تیکسو گیم با هدف فراهم‌کردن دسترسی آسان و مطمئن به انواع گیفت کارت‌های بین‌المللی فعالیت می‌کند. ما تلاش می‌کنیم تا محصولات معتبر را با قیمت مناسب و پشتیبانی واقعی در اختیار شما قرار دهیم تا تجربه‌ای امن و قابل اعتماد از خرید آنلاین داشته باشید.
              </p>
              <div className="flex items-center gap-x-4">
                {["instagram", "whatsapp", "linkedin", "youtube"].map((icon, i) => (
                  <a key={i} href="#" className="size-10 bg-gray-950 rounded-xl flex-center">
                    <svg className="size-6 text-blue-500">
                      <use href={`#${icon}`} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex-1 flex flex-col w-full lg:w-auto">
              <h2 className="footer_title">دسترسی سریع</h2>
              <div className="flex gap-x-10 child:space-y-2 child:text-gray-400">
                <ul className="child-hover:text-blue-500 child:transition-all">
                  <li><a href="/">صفحه اصلی</a></li>
                  <li><a href="/products">فروشگاه</a></li>
                  <li><a href="/about-us">تماس با ما</a></li>
                  {/* <li><a href="">سوالات متداول</a></li> */}
                </ul>
                <ul className="child-hover:text-blue-500  child:transition-all">
                  <li><a href="/login">ثبت نام </a></li>
                  <li><a href="/sign-up"> ورود</a></li>
                  <li><a href="/blog">وبلاگ</a></li>
                  {/* <li><a href="#">شرایط و قوانین</a></li>
                  <li><a href="#">حریم خصوصی</a></li> */}
                </ul>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex-[1.5] w-full">
              <h2 className="footer_title">تماس با ما</h2>
              <ul className="flex flex-col child:flex child:text-gray-400 child:items-center child:justify-between gap-y-6">
                <li>
                  {/* <p>شماره تماس:</p> */}
                  <p dir="ltr"><a href="tel:+9897727255110">097727255110</a>: شماره تماس </p>
                </li>
                {/* <li> */}
                {/* <p>آدرس ایمیل :</p>
                  <p></p> */}
                {/* </li> */}
                <li>
                  {/* <p>آدرس:</p> */}
                  <p>آدرس: مازندران، رامسر، لیماک، خیابان فرهنگ، فرهنگ 1، پلاک 145</p>
                </li>
              </ul>
            </div>

            {/* Logos & Go Top */}
            <div className="flex-1 w-full md:w-1/6 flex flex-row items-end justify-center md:justify-end ml-5 md:ml-0 md:mr-5">
              <div className="flex flex-col justify-center md:justify-end items-center  gap-x-3 child:bg-gray-950 child:dark:bg-gray-900">
                {/* <span className="w-16 h-16 lg:w-20 lg:h-20 flex-center rounded-xl"> */}
                {/* <img className="w-16 h-16" src="/images/footer/1.png" alt="" /> */}
                {/* </span> */}
                {/* <span className="w-16 h-16 lg:w-20 lg:h-20 flex-center rounded-xl"> */}
                {/* <img className="w-16 h-16" src="/images/footer/2.png" alt="" /> */}
                <span className="w-16 h-16 lg:w-20 lg:h-20 flex-center rounded-xl">
                  <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=676156&Code=NpPGAQdYpi6XGJXLMFhxnrNo4fWXvYkd' >

                  <img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=676156&Code=NpPGAQdYpi6XGJXLMFhxnrNo4fWXvYkd' alt='' style={{cursor:'pointer'}} code='NpPGAQdYpi6XGJXLMFhxnrNo4fWXvYkd'/>
                  </a>
                </span>



                {/* GO TOP */}
                <a
                  href="#"
                  className="ring-2 ring-gray-400 text-gray-300 w-32 rounded-lg text-sm flex-center gap-x-2 py-1.5 px-2 mt-10"
                >
                  بازگشت به بالا
                  <svg className="size-4 rotate-[180deg]">
                    <use href="#chevron" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter & Branding */}
            {/* <div className="w-full rounded-xl bg-gray-950 dark:bg-gray-900 flex flex-col md:flex-row gap-y-4 items-center justify-between p-4 md:p-6 mt-6">
            <a href="#" className="text-3xl font-MorabbaMedium">
              <span className="text-blue-500">کارین</span> شاپ
            </a>
            <div className="bg-gray-900 dark:bg-gray-800 p-1.5 rounded-xl w-72 lg:w-[350px] flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent text-gray-200 px-2 w-full"
                placeholder="از جدیدترین تخفیف ها با خبر شوید"
              />
              <button className="px-4 py-1 bg-blue-500 rounded-xl font-DanaMedium">ثبت</button>
            </div>*/}
          </div>
        </div>

        <p className="text-center text-sm my-4 text-gray-400">
          Copyright © 2025 TixoGame. تمامی حقوق محفوظ است.
        </p>
      </footer>
    </>
  );
}

export default Footer