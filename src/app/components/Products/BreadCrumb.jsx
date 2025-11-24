"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadCrumb = () => {
  const pathname = usePathname(); // e.g., /products/123
  const pathSegments = pathname.split("/").filter(Boolean); // ['products', '123']

  // Function to convert URL segment to readable Persian text
  const formatSegment = (segment) => {
    const mapping = {
      products: "فروشگاه",
      blog: "وبلاگ",
      cart: "سبد خرید",
      "about-us": "درباره ما",
      dashboard: "داشبورد",
      "sign-up": "ثبت نام",
      login: "ورود",
    };
    return mapping[segment] || segment;
  };

  return (
    <nav className="flex mt-8 mr-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Home always first */}
        <li className="inline-flex items-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm gap-x-1 text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="size-4 mb-0.5">
              <use href="#home" />
            </svg>
            صفحه اصلی
          </Link>
        </li>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const href = "/" + pathSegments.slice(0, index + 1).join("/");

          return (
            <li key={index} className="inline-flex items-center">
              <svg
                className="rtl:rotate-[180deg] w-3 h-3 text-gray-400 mx-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>

              {isLast ? (
                <span className="ms-1 text-sm text-gray-500 md:ms-2 dark:text-gray-400">
                  {formatSegment(segment)}
                </span>
              ) : (
                <Link
                  href={href}
                  className="inline-flex items-center text-sm gap-x-1 text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                >
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
