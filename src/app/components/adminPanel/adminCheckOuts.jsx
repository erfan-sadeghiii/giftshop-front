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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            setCheckouts(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to fetch checkouts", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCheckouts();
    }, []);

    const togglePaid = async (id) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/${id}/toggle_paid/`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            fetchCheckouts();
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to toggle payment", "error");
        }
    };

    const deleteCheckout = async (id) => {
        const confirm = await Swal.fire({
            title: "حذف سفارش؟",
            text: "این عملیات غیرقابل بازگشت است",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "بله حذف کن",
            cancelButtonText: "لغو",
        });

        if (confirm.isConfirmed) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop/admin/checkouts/${id}/`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                Swal.fire("Done", "با موفقیت حذف شد", "success");
                fetchCheckouts();
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Failed to delete checkout", "error");
            }
        }
    };

    // 🔥 SHOW MORE DETAILS IN POPUP
    const showMoreInfo = (checkout) => {
        let itemsHTML = checkout.items
            .map(
                (it) =>
                    `<div style="margin-bottom:6px">
            <strong>${it.product?.title || "-"}</strong>
            — تعداد: ${it.quantity}
          </div>`
            )
            .join("");

        Swal.fire({
            title: `جزئیات سفارش #${checkout.id}`,
            html: `
<div class="text-right rtl space-y-2">

  <div class="space-y-1 text-sm">
    <p><span class="font-semibold text-gray-700">کاربر:</span>${checkout.user_name}(ID: ${checkout.user} ) </p>

    <p>
      <span class="font-semibold text-gray-700">مبلغ:</span>
      ${checkout.amount.toLocaleString()} تومان
    </p>

    <p>
      <span class="font-semibold text-gray-700">تاریخ:</span>
      ${new Date(checkout.created_at).toLocaleString("fa-IR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })}
    </p>

    <p>
    ${checkout.authority}
      <span class="font-semibold text-gray-700">Authority:</span>
    </p>

    <p>
    <span class="font-semibold text-gray-700">Ref&nbsp;ID:</span>
    <p>
    ${checkout.ref_id || "-"}
    </p>
    </p>

    <p>
      <span class="font-semibold text-gray-700">وضعیت پرداخت:</span>
      <span class="${checkout.is_paid
                    ? "text-green-600 font-bold"
                    : "text-red-600 font-bold"
                }">
        ${checkout.is_paid ? "پرداخت شده" : "پرداخت ناموفق"}
      </span>
    </p>
  </div>

  <hr class="my-3 border-gray-300"/>

  <h3 class="font-bold text-base text-gray-800 mb-2">آیتم‌ها:</h3>

  <div class="space-y-2">
    ${itemsHTML}
  </div>

</div>
`,
            confirmButtonText: "باشه",
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

                                    <td className="px-4 py-2">{co.user_name}(ID:{co.user})</td>

                                    <td className="px-4 py-2">{co.amount.toLocaleString()} تومان</td>

                                    {/* BRIEF ITEMS */}
                                    <td className="px-4 py-2">
                                        {co.items.slice(0, 1).map((item, i) => (
                                            <span key={i}>
                                                {item.product?.title?.slice(0, 20) || "Item"} ({item.quantity})
                                            </span>
                                        ))}
                                        {co.items.length > 1 && (
                                            <span className="text-gray-400"> +{co.items.length - 1}</span>
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
