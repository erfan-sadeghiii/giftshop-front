"use client";
import { useState } from "react";

const TicketSample = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      {/* Ticket Item */}
      <div className="border rounded-lg p-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h3 className="font-DanaDemiBold text-lg mb-2">خطا در پرداخت</h3>
        <p className="text-sm text-gray-500 mb-2">
          هنگام پرداخت سفارش شماره 12345 خطا رخ داده است. لطفا بررسی کنید.
        </p>
        <div className="text-xs text-blue-500">
          📎 فایل پیوست: payment-error.png
        </div>
      </div>

    

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="font-DanaDemiBold text-lg mb-4">ایجاد تیکت جدید</h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="عنوان تیکت"
                className="w-full p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <textarea
                placeholder="محتوای تیکت"
                rows="4"
                className="w-full p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <input
                type="file"
                className="w-full text-sm"
              />
            </form>

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
              >
                ثبت تیکت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSample;
