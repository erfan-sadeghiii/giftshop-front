"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "خانه", icon: "#home" },
    { href: "/products", label: "فروشگاه", icon: "#squares" },
    { href: "/cart", label: "سبد خرید", icon: "#shopping-bag" },
    { href: "/dashboard", label: "حساب من", icon: "#user" },
  ];

  return (
    <ul className="bottom-navbar flex justify-around items-center py-2 bg-white dark:bg-gray-900 shadow-md fixed bottom-0 w-full z-50">
      {links.map(({ href, label, icon }) => {
        const isActive =
          href === "/"
            ? pathname === href
            : pathname.startsWith(href);

        return (
          <li
            key={href}
            className={` text-sm font-DanaMedium transition-all ${
              isActive
                ? "text-blue-500 dark:text-sky-400"
                : "text-gray-500 dark:text-gray-400 hover:text-blue-400"
            }`}
          >
            <Link className="flex flex-col items-center gap-1" href={href}>
            <svg className="size-5">
              <use href={icon} />
            </svg>
            {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default BottomNavbar;
