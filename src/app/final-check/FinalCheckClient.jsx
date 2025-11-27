"use client";

import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeProductFromCart, selectCartEntities } from "../cartSlice";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function FinalCheckPageContent() {
  const params = useSearchParams();
  const cart = useSelector(selectCartEntities);
  const cartItems = Object.values(cart || {});
  const { accessToken } = useAuth();
  const dispatch = useDispatch();

  if (!params) return null;

  const status = params.get("status");
  const isSuccess = status === "success";

  const refId = params.get("ref_id");
  const amount = params.get("amount");
  const authority = params.get("authority");
  const cardPan = params.get("card_pan");

  const errorCode = params.get("error_code");
  const errorMessage = params.get("error_message");
  const errors = params.get("errors");

  // Remove all cart items if payment succeeded
  useEffect(() => {
    if (isSuccess && cartItems.length > 0) {
      cartItems.forEach(item =>
        dispatch(removeProductFromCart({ itemId: item.id, accessToken }))
      );
    }
  }, [isSuccess, cartItems, dispatch, accessToken]);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4 py-10">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 shadow-lg rounded-2xl p-6">
        <h1 className={`text-2xl font-bold text-center mb-6 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
          {isSuccess ? "پرداخت با موفقیت انجام شد" : "پرداخت ناموفق بود"}
        </h1>

        {isSuccess ? (
          <div className="space-y-3">
            <Info label="شناسه پرداخت" value={refId} />
            <Info label="مبلغ" value={`${amount} تومان`} />
            <Info label="Authority" value={authority} />
            <Info label="شماره کارت" value={cardPan} />
          </div>
        ) : (
          <div className="space-y-3">
            <Info label="کد خطا" value={errorCode} />
            <Info label="پیام خطا" value={errorMessage} />
            <Info label="جزئیات بیشتر" value={errors} />
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="p-3 rounded-lg bg-gray-700 border border-gray-600">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="font-semibold text-gray-200 break-all">{value || "-"}</p>
    </div>
  );
}
