"use client";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function UserInfoSection() {
  const { user, api, accessToken } = useAuth(); 

  const [phone, setPhone] = useState(user?.phone || "");
  const [discord, setDiscord] = useState(user?.discord || ""); // ✅ Discord state

  // -------------------------------
  // SEND CODE
  // -------------------------------
  const sendCode = async () => {
    if (!phone) return null;

    try {
      const res = await api.post("/api/accounts/send-code/", { mobile: phone });
      return { ok: true };
    } catch (err) {
      console.error(err);
      if (err.response?.data?.lockout) {
        return {
          ok: false,
          lockout: err.response.data.lockout,
          message: err.response.data.detail,
        };
      }
      return {
        ok: false,
        message: err.response?.data?.detail || "ارسال کد انجام نشد.",
      };
    }
  };

  // -------------------------------
  // VERIFY CODE
  // -------------------------------
  const verifyCode = async (result) => {
    if (result && result.lockout) {
      let sec = result.lockout.total_seconds;
      Swal.fire({
        title: "لطفاً صبر کنید",
        html: `تا درخواست بعدی <b>${sec}</b> ثانیه باقی مانده است.`,
        showConfirmButton: false,
        background: "#1e1e1e",
        color: "#fff",
      });

      const interval = setInterval(() => {
        sec--;
        if (sec <= 0) {
          clearInterval(interval);
          Swal.update({
            title: "آماده!",
            html: "اکنون می‌توانید دوباره درخواست دهید.",
          });
          setTimeout(() => Swal.close(), 1500);
          return;
        }
        Swal.update({ html: `تا درخواست بعدی <b>${sec}</b> ثانیه باقی مانده است.` });
      }, 1000);

      return;
    }

    if (!phone) {
      Swal.fire("خطا", "ابتدا شماره موبایل را وارد کنید.", "error");
      return;
    }

    const { value: code } = await Swal.fire({
      title: "کد تأیید را وارد کنید",
      input: "text",
      inputPlaceholder: "مثال: 123456",
      showCancelButton: true,
      confirmButtonText: "تأیید",
      cancelButtonText: "لغو",
      background: "#1e1e1e",
      color: "#fff",
    });

    if (!code) return;

    try {
      await api.post("/api/accounts/verify-code/", { code, mobile: phone });
      Swal.fire("موفق!", "شماره با موفقیت تأیید شد.", "success");
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || " شماره تلفن قبلا ثبت شده است.";
      Swal.fire("خطا!", detail, "error");
    }
  };

  // -------------------------------
  // UPDATE DISCORD
  // -------------------------------
  const updateDiscord = async () => {
    if (!discord) return;

    try {
      const res = await api.patch(`/api/accounts/users/${user.id}/`, { discord });
      Swal.fire("موفق!", "Discord ID با موفقیت به‌روزرسانی شد.", "success");
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || "به‌روزرسانی انجام نشد.";
      Swal.fire("خطا!", detail, "error");
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div
      className="w-full mx-auto p-5 rounded-lg shadow 
                 bg-white dark:bg-gray-800
                 text-gray-900 dark:text-gray-100
                 border border-gray-200 dark:border-gray-700
                 space-y-5 transition"
    >
      {/* Profile Header */}
      <div className="flex items-center gap-x-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="w-24">
          <img
            src="./images/svg/user.png"
            width={70}
            height={70}
            alt="Profile"
            className="rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="flex flex-col gap-y-1">
          <h2 className="font-DanaDemiBold text-lg">{user?.username}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex justify-between items-center 
                        bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
          <span className="font-DanaMedium text-gray-600 dark:text-gray-300">ایمیل</span>
          <span className="text-sm">{user?.email}</span>
        </div>

        {/* Role */}
        <div className="flex justify-between items-center 
                        bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
          <span className="font-DanaMedium text-gray-600 dark:text-gray-300">نقش</span>
          <span
            className={`px-2 py-1 text-xs rounded-md text-white ${
              user?.role === "owner" ? "bg-yellow-500" :
              user?.role === "admin" ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            {user?.role}
          </span>
        </div>

        {/* Verified */}
        <div className="flex justify-between items-center 
                        bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
          <span className="font-DanaMedium text-gray-600 dark:text-gray-300">تایید شده</span>
          <span className={`px-2 py-1 text-xs rounded-md text-white ${user?.verified ? "bg-green-600" : "bg-red-600"}`}>
            {user?.verified ? "بله" : "خیر"}
          </span>
        </div>

        {/* Phone + Verify */}
        <div className="flex justify-between items-center 
                        bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
          <div>
            <span className="font-DanaMedium text-gray-600 dark:text-gray-300">شماره موبایل</span>
            {!user?.verified ? (
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 09123456789"
                className="mt-1 mx-2 text-sm px-2 py-1 rounded-md 
                           bg-white dark:bg-gray-800 
                           border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <p className="text-sm mt-1">{user.phone}</p>
            )}
          </div>

          {!user?.verified && (
            <button
              onClick={async () => {
                const result = await sendCode();
                await verifyCode(result);
              }}
              className="px-3 py-1 rounded-lg text-white text-sm
                         bg-blue-600 hover:bg-blue-700
                         dark:bg-blue-500 dark:hover:bg-blue-600 transition"
            >
              تایید
            </button>
          )}
        </div>

        {/* Discord ID */}
        <div className="flex justify-between items-center 
                        bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
          <div>
            <span className="font-DanaMedium text-gray-600 dark:text-gray-300">Discord ID</span>
            <input
              type="text"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="مثال: User#1234"
              className="mt-1 mx-2 text-sm px-2 py-1 rounded-md 
                         bg-white dark:bg-gray-800 
                         border border-gray-300 dark:border-gray-600"
            />
          </div>

          <button
            onClick={updateDiscord}
            className="px-3 py-1 rounded-lg text-white text-sm
                       bg-purple-600 hover:bg-purple-700
                       dark:bg-purple-500 dark:hover:bg-purple-600 transition"
          >
            بروزرسانی
          </button>
        </div>
      </div>
    </div>
  );
}
