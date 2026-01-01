"use client";

import { selectCartEntities } from "@/app/cartSlice";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
const PriceBox = ({ count = 0, totalPrice = 0, totalDiscount = 0, finalPrice = 0 }) => {
  // const {user} = useAuth()
  const { accessToken, user } = useAuth()
  const cart = useSelector(selectCartEntities);
  const cartItems = Object.values(cart || {});
  // console.log(cartItems);

  const handlePayment = async () => {
    if (!user.verified) {
       Swal.fire({
    title: "ابتدا باید شماره تلفن خود را در بخش اطلاعات حساب تایید کنید",
    icon: "warning",
    confirmButtonText: "تایید شماره تلفن",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to your verification page
      window.location.href = "/dashboard"; // change this to your page
    }
  });
    } else {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/shop/payment/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`

          },
          body: JSON.stringify({
            amount: finalPrice,
            // user:user.id,
            cartItems,
            description: "Transaction description (change this)",
            metadata: {
              mobile: "09121234567",
              email: "info.test@gmail.com",
            },
          }),
        });

        const data = await res.json();
        console.log(data);

        if (data.payment_url) {
          window.location.href = data.payment_url

        } else {
          alert(data.errors?.message || "خطا در ایجاد پرداخت");
        }
      } catch (err) {
        alert("خطای اتصال");
        console.error(err);
      }
    }

  };

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

      <button
        onClick={handlePayment}
        className="w-full mt-4 flex items-center gap-x-1 justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all rounded-lg shadow py-2"
      >
        تایید و تکمیل سفارش
        <svg className="w-5 h-5">
          <use href="#shopping-bag" />
        </svg>
      </button>
    </div>
  );
};

export default PriceBox;
