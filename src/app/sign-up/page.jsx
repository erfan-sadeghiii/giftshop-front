"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [discord, setDiscord] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== password2) {
      setError("رمزهای عبور یکسان نیستند");
      return;
    }

    const payload = {
      username,
      email,
      password,
      password2,
      discord: discord || null,
      phone: phone || null,
    };

    const result = await register(payload);

    if (result.success) {
      setSuccess("حساب با موفقیت ساخته شد! در حال انتقال...");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } else {
      const firstError =
        typeof result.errors === "string"
          ? result.errors
          : Object.values(result.errors)[0]?.[0] || "ثبت نام ناموفق بود";
      setError(firstError);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 mt-12">
      <div className="w-full max-w-md rounded-2xl dark:bg-gray-700 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center dark:text-gray-200 text-2xl font-bold text-gray-800">
          ساخت حساب کاربری
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              نام کاربری
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام کاربری شما"
              className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* discord (optional) */}
          <div>
            <label htmlFor="discord" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              دیسکورد (اختیاری)
            </label>
            <input
              type="text"
              id="discord"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              placeholder="yourdiscord#1234"
              className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* phone (optional) */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              شماره تلفن (اختیاری)
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0912xxxxxxx"
              className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              رمز عبور
            </label>
            <div className="relative">
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-4 cursor-pointer text-gray-600 dark:text-gray-200"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a10.48 10.48 0 0 1 5.17-5.92M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 pr-10 text-black dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {/* password2 with hide/show */}
          <div>
            <label htmlFor="password2" className="block text-sm font-medium text-gray-600 dark:text-gray-200">
              تکرار رمز عبور
            </label>

            <div className="relative">
              <span
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute left-4 top-4 cursor-pointer text-gray-600 dark:text-gray-200"
              >
                {showPassword2 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a10.48 10.48 0 0 1 5.17-5.92M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M1 1l22 22" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>

              <input
                type={showPassword2 ? "text" : "password"}
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 pr-10 text-black dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
          >
            ثبت نام
          </button>
        </form>

        <p className="mt-6 text-center text-sm dark:text-gray-200 text-gray-600">
          قبلاً حساب ساخته‌اید؟{" "}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            وارد شوید
          </a>
        </p>
      </div>
    </div>
  );
}
