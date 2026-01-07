"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/shop/offers/";

export default function AdminOfferCodeSection() {
  const { accessToken } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    code: "",
    type: "percent",
    value: "",
    min_order_price: "",
    start_at: "",
    end_at: "",
  });

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { headers });
      if (!res.ok) throw new Error("بارگذاری تخفیف‌ها موفق نبود");
      setOffers(await res.json());
    } catch (err) {
      Swal.fire("خطا", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const createOffer = async (e) => {
    e.preventDefault();

    if (!form.start_at || !form.end_at) {
      Swal.fire("خطا", "زمان شروع و پایان الزامی است", "error");
      return;
    }

    const payload = {
      ...form,
      value: Number(form.value),
      min_order_price: Number(form.min_order_price),
      start_at: new Date(form.start_at).toISOString(),
      end_at: new Date(form.end_at).toISOString(),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("ایجاد تخفیف ناموفق بود");

      Swal.fire("موفقیت", "کد تخفیف ایجاد شد", "success");

      setForm({ code: "", type: "percent", value: "", min_order_price: "", start_at: "", end_at: "" });
      fetchOffers();
    } catch (err) {
      Swal.fire("خطا", err.message, "error");
    }
  };

  const deleteOffer = async (id) => {
    const confirm = await Swal.fire({
      title: "حذف کد تخفیف؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("حذف ناموفق بود");

      Swal.fire("حذف شد", "کد تخفیف حذف شد", "success");
      fetchOffers();
    } catch (err) {
      Swal.fire("خطا", err.message, "error");
    }
  };

  return (
    <div className="p-6 space-y-8 dark:bg-gray-900 dark:text-gray-100">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">مدیریت کدهای تخفیف</h2>
      </div>

      {/* ---------- CREATE FORM ---------- */}
      <form
        onSubmit={createOffer}
        className="flex flex-col md:space-x-4 space-y-4 md:space-y-0 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800"
      >
        <div className="flex flex-col py-4 gap-4 w-full">
          <input
            className="border rounded px-3 py-2 w-full md:w-1/5 dark:bg-gray-700 dark:border-gray-600"
            placeholder="کد"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />

          <select
            className="border rounded px-3 py-2 w-full md:w-1/5 dark:bg-gray-700 dark:border-gray-600"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="percent">درصد</option>
            <option value="fixed">مقدار ثابت</option>
          </select>

          <input
            type="number"
            className="border rounded px-3 py-2 w-full md:w-1/5 dark:bg-gray-700 dark:border-gray-600"
            placeholder="مقدار"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            required
          />

          <input
            type="number"
            className="border rounded px-3 py-2 w-full md:w-1/5 dark:bg-gray-700 dark:border-gray-600"
            placeholder="حداقل قیمت سفارش"
            value={form.min_order_price}
            onChange={(e) => setForm({ ...form, min_order_price: e.target.value })}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col w-full md:w-1/5">
            <label className="text-xs mb-1">زمان شروع</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-2 dark:bg-gray-700 dark:border-gray-600"
              value={form.start_at}
              onChange={(e) => setForm({ ...form, start_at: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col w-full md:w-1/5">
            <label className="text-xs mb-1">زمان پایان</label>
            <input
              type="datetime-local"
              className="border rounded px-2 py-2 dark:bg-gray-700 dark:border-gray-600"
              value={form.end_at}
              onChange={(e) => setForm({ ...form, end_at: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 md:w-auto w-full"
        >
          ایجاد کد تخفیف
        </button>
      </form>

      {/* ---------- TABLE ---------- */}
      <div className="border rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">کد</th>
              <th className="p-3 text-center">نوع</th>
              <th className="p-3 text-center">مقدار</th>
              <th className="p-3 text-center">حداقل قیمت</th>
              <th className="p-3 text-center">زمان شروع</th>
              <th className="p-3 text-center">زمان پایان</th>
              <th className="p-3 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : offers.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500 dark:text-gray-400">
                  کد تخفیفی وجود ندارد
                </td>
              </tr>
            ) : (
              offers.map((o) => (
                <tr key={o.id} className="border-t dark:border-gray-600">
                  <td className="p-3 font-medium">{o.code}</td>
                  <td className="p-3 text-center">{o.type === 'percent' ? 'درصد' : 'مقدار ثابت'}</td>
                  <td className="p-3 text-center">{o.value}</td>
                  <td className="p-3 text-center">{o.min_order_price}</td>
                  <td className="p-3 text-xs text-gray-600 dark:text-gray-400 text-center">
                    {new Date(o.start_at).toLocaleString('fa-IR')}
                  </td>
                  <td className="p-3 text-xs text-gray-600 dark:text-gray-400 text-center">
                    {new Date(o.end_at).toLocaleString('fa-IR')}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteOffer(o.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}