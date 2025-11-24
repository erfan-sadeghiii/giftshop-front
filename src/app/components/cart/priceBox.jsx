"use client";

const PriceBox = ({ count = 0, totalPrice = 0, totalDiscount = 0, finalPrice = 0 }) => {
  return (
    <div className="w-full lg:w-1/4 lg:sticky top-5 flex flex-col gap-y-4">
      <ul className="child:flex child:items-center child:justify-between space-y-8">
        <li>
          <p>قیمت کالاها ({count})</p>
          <p className="flex gap-x-1 text-gray-600 dark:text-gray-300">
            {totalPrice.toLocaleString("fa-IR")}
            <span className="hidden xl:flex">تومان</span>
          </p>
        </li>
        <li>
          <p>تخفیف</p>
          <p className="font-DanaMedium text-gray-700 dark:text-gray-200">
            {totalDiscount > 0
              ? `${Math.floor(totalDiscount).toLocaleString("fa-IR")} تومان`
              : "۰ تومان"}
          </p>
        </li>
        <li className="border-t-2 border-dashed border-gray-400 pt-8">
          <p>مبلغ نهایی :</p>
          <p>{Math.floor(finalPrice).toLocaleString("fa-IR")} تومان</p>
        </li>
      </ul>

      <a
        href="./checkout.html"
        className="w-full mt-4 flex items-center gap-x-1 justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all rounded-lg shadow py-2"
      >
        تایید و تکمیل سفارش
        <svg className="w-5 h-5">
          <use href="#shopping-bag" />
        </svg>
      </a>
    </div>
  );
};

export default PriceBox;
