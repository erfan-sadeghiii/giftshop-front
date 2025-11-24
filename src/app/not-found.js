"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotFoundPage() {
  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Generate random positions ONLY on the client
    const generated = Array.from({ length: 30 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setDots(generated);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen  bg-gray-50 dark:bg-gray-900 text-white p-6 overflow-hidden">
      {/* Background dots */}
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-[#00aaff] rounded-full opacity-50 animate-pulse"
          style={{
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            animationDelay: `${dot.delay}s`,
          }}
        ></div>
      ))}
        <div className="text-9xl">

      <h1 className=" font-bold text-[#00aaff] mb-4">۴۰۴</h1>
        </div>
      <p className="text-2xl text-gray-300 mb-8 text-center max-w-lg">
        صفحه‌ای که دنبال آن بودید پیدا نشد
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href="/"
          className="bg-[#00aaff] hover:bg-[#0088cc] transition-transform duration-300 transform hover:scale-105 text-[#0f112b] font-semibold py-3 px-6 rounded-xl shadow-lg"
        >
          بازگشت به صفحه اصلی
        </Link>

      
      </div>

      <style jsx>{`
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
