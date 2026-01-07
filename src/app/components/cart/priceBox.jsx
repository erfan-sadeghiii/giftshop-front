"use client";

import { selectCartEntities } from "@/app/cartSlice";
import { useAuth } from "@/context/AuthContext";
import { useSelector } from "react-redux";
import { useState, useMemo } from "react";
import Swal from "sweetalert2";

const PriceBox = ({
  count = 0,
  totalPrice = 0,     // sum of product prices
  totalDiscount = 0,  // product discounts
}) => {
  const { accessToken, user } = useAuth();
  const cart = useSelector(selectCartEntities);
  const cartItems = Object.values(cart || {});

  const [offerCode, setOfferCode] = useState("");
  const [offerDiscount, setOfferDiscount] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FINAL PRICE LOGIC
  const finalPrice = useMemo(() => {
    return Math.max(
      totalPrice - totalDiscount - offerDiscount,
      0
    );
  }, [totalPrice, totalDiscount, offerDiscount]);

  // ---------------- APPLY OFFER CODE ----------------
  const applyOfferCode = async () => {
    if (!offerCode) return;

    setLoading(true);
    setStatus("");

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/shop/apply/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            code: offerCode,
            // ✅ product discount already applied
            order_price: totalPrice - totalDiscount,
            order_id: 0,
          }),
        }
      );

      const data = await res.json();
      // console.log(data);
      
      if (!res.ok) {
        setOfferDiscount(0);
        setStatus(data.detail || data[0] || "کد تخفیف نامعتبر است");
        return;
      }

      setOfferDiscount(data.discount_amount);
      setStatus("کد تخفیف اعمال شد ✅");
    } catch {
      setStatus("خطای اتصال");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- PAYMENT ----------------
  const handlePayment = async () => {
    if (!user?.verified) {
      Swal.fire({
        title: "ابتدا شماره تلفن خود را تایید کنید",
        icon: "warning",
        confirmButtonText: "رفتن به داشبورد",
        allowOutsideClick: false,
      }).then((res) => {
        if (res.isConfirmed) {
          window.location.href = "/dashboard";
        }
      });
      return;
    }

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/shop/payment/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            amount: totalPrice- totalDiscount,
            code:offerCode,
            cartItems,
            description: "Shop payment",
            metadata: {
              mobile: `${user.mobile}` || "",
              email: user.email || "",
            },
          }),
        }
      );

      const data = await res.json();
// console.log(data);

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        Swal.fire("خطا", data?.error || "خطا در پرداخت", "error");
      }
    } catch {
      Swal.fire("خطا", "خطای اتصال به سرور", "error");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="w-full lg:w-1/4 lg:sticky top-5 flex flex-col gap-y-4">
      <ul className="space-y-6">

        <li className="flex justify-between">
          <p>قیمت کالاها ({count})</p>
          <p>{totalPrice.toLocaleString("fa-IR")} تومان</p>
        </li>

        <li className="flex justify-between">
          <p>تخفیف محصولات</p>
          <p className="text-red-500">
            {totalDiscount > 0
              ? `${totalDiscount.toLocaleString("fa-IR")} تومان`
              : "۰ تومان"}
          </p>
        </li>

        {/* OFFER CODE */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              value={offerCode}
              onChange={(e) => setOfferCode(e.target.value)}
              placeholder="کد تخفیف"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={applyOfferCode}
              disabled={loading}
              className="bg-gray-900 text-white px-4 rounded-lg text-sm disabled:opacity-50"
            >
              اعمال
            </button>
          </div>

          {status && (
            <p
              className={`text-sm ${
                status.includes("✅")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {status}
            </p>
          )}
        </div>

        {offerDiscount > 0 && (
          <li className="flex justify-between text-green-600">
            <p>تخفیف کد</p>
            <p>{offerDiscount.toLocaleString("fa-IR")} تومان</p>
          </li>
        )}

        <li className="flex justify-between border-t pt-4 font-bold">
          <p>مبلغ نهایی</p>
          <p>{finalPrice.toLocaleString("fa-IR")} تومان</p>
        </li>
      </ul>

      <button
        onClick={handlePayment}
        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2"
      >
        تایید و پرداخت
      </button>
    </div>
  );
};

export default PriceBox;
