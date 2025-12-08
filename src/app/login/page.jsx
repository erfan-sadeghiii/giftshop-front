"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login({ username: email, password });

    if (!result.success) {
      setError(result.message || "ورود ناموفق بود");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 mt-12">
      <div className="w-full max-w-md rounded-2xl dark:bg-gray-700 bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center dark:text-gray-200 text-2xl font-bold text-gray-800">
          خوش آمدید
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 dark:text-gray-200"
            >
              ایمیل
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 text-black dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 dark:text-gray-200"
            >
              رمز عبور
            </label>

            <div className="relative ">
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-4 cursor-pointer text-gray-600 dark:text-gray-200"
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5 0-9.27-3.11-11-7.5a10.48 10.48 0 0 1 5.17-5.92M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88M1 1l22 22" />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 pr-10 text-black dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />


            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-3 text-black dark:text-white font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              ورود
            </button>
            <a href="/mobile-login" className="w-full rounded-lg bg-gray-600 p-3 mt-4 text-blue-500 dark:text-blue-500 font-semibold transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >ورود با تلفن همراه</a>
          </div>
        </form>

        <p className="mt-6 text-center text-sm dark:text-gray-200 text-gray-600">
          حساب کاربری ندارید؟{" "}
          <a href="/sign-up" className="font-medium text-blue-600 hover:underline">
            ثبت نام کنید
          </a>
        </p>
      </div>
    </div>
  );
}
