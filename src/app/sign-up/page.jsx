"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
const { register } = useAuth();
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [password2, setPassword2] = useState("");
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

const result = await register({ username, email, password, password2 });

if (result.success) {
  setSuccess("حساب با موفقیت ساخته شد! در حال انتقال...");
  setTimeout(() => {
    window.location.href = "/dashboard";
  }, 1500);
} else {
  if (result.errors) {
    const firstError =
      typeof result.errors === "string"
        ? result.errors
        : Object.values(result.errors)[0]?.[0] || "ثبت نام ناموفق بود";
    setError(firstError);
  } else {
    setError("ثبت نام ناموفق بود");
  }
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 mt-12"> <div className="w-full max-w-md rounded-2xl dark:bg-gray-700 bg-white p-8 shadow-lg"> <h2 className="mb-6 text-center dark:text-gray-200 text-2xl font-bold text-gray-800">
ساخت حساب کاربری </h2> <form className="space-y-5" onSubmit={handleSubmit}> <div> <label
           htmlFor="username"
           className="block text-sm font-medium text-gray-600 dark:text-gray-200"
         >
نام کاربری </label>
<input
type="text"
id="username"
value={username}
onChange={(e) => setUsername(e.target.value)}
placeholder="نام کاربری شما"
className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
required
/> </div>


      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          ایمیل
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@domain.com"
          className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password2"
          className="block text-sm font-medium text-gray-600 dark:text-gray-200"
        >
          تکرار رمز عبور
        </label>
        <input
          type="password"
          id="password2"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="••••••••"
          className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 dark:text-gray-100 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
