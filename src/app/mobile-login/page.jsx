"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { api, login_with_sms } = useAuth();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [cooldown, setCooldown] = useState(0); // 🔥 timeout seconds

  /* ---------------- Countdown ---------------- */
  useEffect(() => {
    if (cooldown <= 0) return;

    const t = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [cooldown]);

  /* ---------------- Send OTP ---------------- */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/accounts/send-login-code/", { phone });
      // console.log(res.data);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;

      if (err.response?.status === 403 && data?.lockout?.total_seconds) {
        setCooldown(data.lockout.total_seconds);
        setError("تلاش بیش از حد، لطفاً کمی صبر کنید");
      } else {
        setError(data?.detail || "ارسال کد با خطا مواجه شد");
      }
    }
  };

  /* ---------------- Verify OTP (TIMEOUT HERE ✅) ---------------- */
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setError("");

  const res = await login_with_sms({ phone, code: otp });

  if (!res.success) {
    // ⏱ timeout / lockout
    if (res.status === 403 && res.lockout?.total_seconds) {
      setCooldown(res.lockout.total_seconds);
      setError(`تلاش بیش از حد – ${res.lockout.total_seconds} ثانیه صبر کنید`);
      return;
    }

    // ❌ wrong code or other error
    setError(res.message || "کد نامعتبر است");
    return;
  }

  // ✅ success
  Swal.fire("ورود موفق", "", "success");
  window.location.href = "/dashboard";
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 mt-12">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-700 p-8 shadow-lg">

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-200">
          ورود با پیامک
        </h2>

        {/* -------- Step 1 -------- */}
        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSendOtp}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="w-full rounded-lg border p-3"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={cooldown > 0}
              className={`w-full rounded-lg p-3 font-semibold
                ${cooldown > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"}
              `}
            >
              {cooldown > 0
                ? `ارسال مجدد (${cooldown}s)`
                : "ارسال کد"}
            </button>
          </form>
        )}

        {/* -------- Step 2 -------- */}
        {step === 2 && (
          <form className="space-y-5" onSubmit={handleVerifyOtp}>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="کد تایید"
              className="w-full rounded-lg border p-3"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={cooldown > 0}
              className={`w-full rounded-lg p-3 font-semibold
                ${cooldown > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"}
              `}
            >
              {cooldown > 0
                ? `تلاش مجدد (${cooldown}s)`
                : "ورود"}
            </button>

            <p
              onClick={() => setStep(1)}
              className="text-center text-sm text-blue-600 cursor-pointer hover:underline"
            >
              تغییر شماره موبایل
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
