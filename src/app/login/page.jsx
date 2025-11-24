"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
const { login } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");

const handleSubmit = async (e) => {
e.preventDefault();
setError("");


const result = await login({ username: email, password });

if (!result.success) {
  setError(result.message || "ورود ناموفق بود");
} else {
  // console.log(result);
  window.location.href = "/dashboard";
}


};

return ( <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 mt-12"> <div className="w-full max-w-md rounded-2xl dark:bg-gray-700 bg-white p-8 shadow-lg"> <h2 className="mb-6 text-center dark:text-gray-200 text-2xl font-bold text-gray-800">
خوش آمدید </h2> <form className="space-y-5" onSubmit={handleSubmit}> <div> <label
           htmlFor="email"
           className="block text-sm font-medium text-gray-600 dark:text-gray-200"
         >
ایمیل </label>
<input
type="text"
id="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="example@domain.com"
className="mt-1 w-full rounded-lg border ring-2 border-gray-300 p-3 text-black dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
required
/> </div>


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
          className="mt-1 w-full rounded-lg border ring-2  border-gray-300 p-3 text-black dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 p-3 text-black dark:text-white font-semibold transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        ورود
      </button>
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
