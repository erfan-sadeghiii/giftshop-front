"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const AdminCheckouts = () => {
  const { accessToken } = useAuth();
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCheckouts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();
      setCheckouts(data);
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "دریافت سفارشات ناموفق بود", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckouts();
  }, []);

  const togglePaid = async (id) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/${id}/toggle_paid/`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      fetchCheckouts();
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "تغییر وضعیت پرداخت انجام نشد", "error");
    }
  };

  const deleteCheckout = async (id) => {
    const confirm = await Swal.fire({
      title: "حذف سفارش؟",
      text: "این عملیات غیرقابل بازگشت است",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      Swal.fire("انجام شد", "سفارش با موفقیت حذف شد", "success");
      fetchCheckouts();
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "حذف سفارش انجام نشد", "error");
    }
  };

  // ✅ Improved Swal design (RTL + clean layout)
  const showMoreInfo = (checkout) => {
    const itemsHTML = checkout.items
      .map(
        (it) => `
          <tr>
            <td style="padding:6px 0;color:#9ca3af;">${it.product?.title || "-"}</td>
            <td style="padding:6px 0;">${it.quantity}</td>
          </tr>
        `
      )
      .join("");

    Swal.fire({
      title: `جزئیات سفارش #${checkout.id}`,
      html: `
        <div style="direction:rtl;text-align:right;font-size:14px">
          
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">کاربر</td>
              <td style="padding:6px 0;">${checkout.user.username}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">ایمیل</td>
              <td style="padding:6px 0;">${checkout.user.email}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">آیدی دیسکورد</td>
              <td style="padding:6px 0;">${checkout.user.discord}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">شماره تماس</td>
              <td style="padding:6px 0;">${checkout.user?.phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">مبلغ</td>
              <td style="padding:6px 0;font-weight:500;">
                ${checkout.amount.toLocaleString()} تومان
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">تاریخ</td>
              <td style="padding:6px 0;">
                ${new Date(checkout.created_at).toLocaleString("fa-IR")}
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">Authority</td>
              <td style="padding:6px 0;">${checkout.authority}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">Ref ID</td>
              <td style="padding:6px 0;">${checkout.ref_id || "—"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#9ca3af;">وضعیت پرداخت</td>
              <td style="padding:6px 0;">
                <span style="
                  padding:2px 8px;
                  border-radius:6px;
                  font-weight:600;
                  color:${checkout.is_paid ? "#16a34a" : "#dc2626"};
                  background:${checkout.is_paid ? "rgba(22,163,74,.15)" : "rgba(220,38,38,.15)"};
                ">
                  ${checkout.is_paid ? "پرداخت شده" : "ناموفق"}
                </span>
              </td>
            </tr>
          </table>

          <hr style="margin:12px 0;border-color:#e5e7eb" />

          <h3 style="font-weight:600;margin-bottom:6px">آیتم‌ها</h3>

          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:right;color:#9ca3af;font-size:12px;padding-bottom:4px">محصول</th>
                <th style="text-align:right;color:#9ca3af;font-size:12px;padding-bottom:4px">تعداد</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

        </div>
      `,
      confirmButtonText: "بستن",
    });
  };

  return (
    <div className="p-4 shadow rounded-lg bg-white dark:bg-gray-800 mt-5">
      <h2 className="font-DanaDemiBold text-lg mb-4">مدیریت سفارشات</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-600 dark:text-gray-300">
            <thead className="text-xs bg-gray-100 dark:bg-gray-900">
              <tr className="border-b dark:border-gray-700">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">کاربر</th>
                <th className="px-4 py-2">مبلغ</th>
                <th className="px-4 py-2">آیتم‌ها</th>
                <th className="px-4 py-2">پرداخت</th>
                <th className="px-4 py-2 w-40">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {checkouts.map((co) => (
                <tr key={co.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{co.id}</td>
                  <td className="px-4 py-2">
                    {co.user.username} ({co.user?.phone})
                  </td>
                  <td className="px-4 py-2">
                    {co.amount.toLocaleString()} تومان
                  </td>
                  <td className="px-4 py-2">
                    {co.items.slice(0, 1).map((item, i) => (
                      <span key={i}>
                        {item.product?.title?.slice(0, 20)} ({item.quantity})
                      </span>
                    ))}
                    {co.items.length > 1 && (
                      <span className="text-gray-400">
                        {" "}
                        +{co.items.length - 1}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {co.is_paid ? (
                      <span className="text-green-500">پرداخت شده</span>
                    ) : (
                      <span className="text-red-500">پرداخت ناموفق</span>
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => showMoreInfo(co)}
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
                    >
                      جزئیات
                    </button>
                    <button
                      onClick={() => togglePaid(co.id)}
                      className="px-2 py-1 rounded bg-blue-500 text-white"
                    >
                      تغییر وضعیت
                    </button>
                    <button
                      onClick={() => deleteCheckout(co.id)}
                      className="px-2 py-1 rounded bg-red-500 text-white"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}

              {checkouts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    دیتایی موجود نیست
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCheckouts;
