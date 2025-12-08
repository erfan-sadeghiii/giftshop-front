"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import TicketSystem from "../components/dashboard/TicketSystem";
import { useAuth } from "@/context/AuthContext";
import UserInfoSection from "../components/dashboard/userInfoSection";

const Page = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkouts, setCheckouts] = useState([]);
  const { user, Loading, logout, accessToken } = useAuth();

  // Fetch user checkouts safely
  useEffect(() => {
    if (!accessToken) return;

    const fetchCheckouts = async () => {
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_URL+"/shop/my-checkouts/",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setCheckouts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCheckouts();
  }, [accessToken]);

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: "#squares" },
    { id: "ticket", label: "تیکت ها", icon: "#tag" },
    { id: "account", label: "اطلاعات حساب", icon: "#cog" },
    { id: "logout", label: "خروج", icon: "#arrow-left-end", isDanger: true },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <>
            <div className="grid grid-cols-12 child:col-span-12 mt-5 lg:mt-0 md:child:col-span-4 gap-4 child:rounded-lg child:bg-white child:dark:bg-gray-800 child:w-full child:flex child:shadow child:p-4">
              <div className="flex items-center gap-x-4">
                <svg className="size-9 text-blue-500">
                  <use href="#wallet" />
                </svg>
                <div className="flex flex-col gap-y-1">
                  <h2 className="font-DanaDemiBold">کالا های خریداری شده</h2>
                  <p className="text-gray-500">
                    <span>{checkouts.length} </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <svg className="size-9 text-blue-500">
                  <use href="#shopping-bag" />
                </svg>
                <div className="flex flex-col gap-y-1">
                  <h2 className="font-DanaDemiBold">سفارش‌ها</h2>
                  <p className="text-gray-500">{checkouts.length} سفارش</p>
                </div>
              </div>
              <div className="flex items-center gap-x-4">
                <svg className="size-9 text-blue-500">
                  <use href="#ticket" />
                </svg>
                <div className="flex flex-col gap-y-1">
                  <h2 className="font-DanaDemiBold">تیکت‌ها</h2>
                  <p className="text-gray-500">5 تیکت</p>
                </div>
              </div>
            </div>

            {/* RECENT ORDERS TABLE */}
            <div className="flex flex-col shadow rounded-lg p-4 dark:bg-gray-800 bg-white mt-5">
              <span className="flex items-center gap-x-2">
                <img
                  src="./images/svg/status-delivered.svg"
                  className="w-10"
                  alt=""
                />
                <h2 className="font-DanaMedium text-lg">سفارش های اخیر :</h2>
              </span>
              <div className="relative mt-5 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-3.5">
                        نام محصول
                      </th>
                      <th scope="col" className="px-6 py-3.5">تاریخ</th>
                      <th scope="col" className="px-6 py-3.5">قیمت</th>
                      <th scope="col" className="px-6 py-3.5">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkouts.map((checkout) =>
                      checkout.items.map((item, index) => (
                        <tr
                          key={checkout.id + "-" + index}
                          className="bg-white border-b cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                          <th
                            scope="row"
                            className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap dark:text-white flex items-center gap-x-2"
                          >
                            <img
                              className="w-10 object-cover"
                              src={
                                process.env.NEXT_PUBLIC_API_URL+item.product?.images?.[0] ||
                                "./images/products/placeholder.png"
                              }
                              alt={item.product?.title || "محصول"}
                            />
                            {item.product?.title || "بدون نام محصول"}
                          </th>
                          <td className="px-6 py-5">
                           {new Date(checkout.created_at).toLocaleString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                })}
                          </td>
                          <td className="px-6 py-5">
                            {(
                              item.product?.final_price ||
                              item.product?.price ||
                              0
                            ).toLocaleString()}{" "}
                            تومان
                          </td>
                          <td
                            className={`px-6 py-5 font-DanaDemiBold ${
                              checkout.is_paid ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {checkout.is_paid ? "پرداخت شده" : "پرداخت ناموفق"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case "account":
        return (
          <>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="font-DanaDemiBold text-lg mb-3">اطلاعات حساب</h2>
          </div>
          <UserInfoSection/>
          </>
        );
      case "ticket":
        return <TicketSystem />;
      case "logout":
        return (
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded-lg shadow text-red-500">
            <h2 className="font-DanaDemiBold text-lg">شما خارج شدید.</h2>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="container relative">
      <div className="flex flex-col lg:flex-row gap-x-8 mt-10">
        {/* SIDE MENU DESKTOP */}
        <div className="lg:sticky mb-8 top-1 h-fit lg:w-1/4 hidden lg:flex flex-col gap-y-4 items-center shadow rounded-lg p-4 dark:bg-gray-800 bg-white">
          <div className="w-full flex items-center justify-between border-b border-gray-200 dark:border-white/20 py-3">
            <div className="flex items-center gap-x-3">
              <img
                src="./images/svg/user.png"
                className="size-10 ring-2 ring-gray-400/20 rounded-full"
                alt="AVATAR"
              />
              <span className="flex flex-col gap-y-2">
                <p className="font-DanaMedium text-lg">
                  {Loading ? "" : user?.username}
                </p>
                <p className="text-xs lg:text-xl text-gray-400">
                  {Loading ? "" : user?.email}
                </p>
              </span>
            </div>
            <span>
              <svg className="w-6 h-6 cursor-pointer text-blue-500">
                <use href="#edit" />
              </svg>
            </span>
          </div>

          <ul className="w-full space-y-2 text-lg">
            <li>
              <a
                href="/cart"
                className={`flex gap-x-2 items-center px-2 py-3 rounded-lg cursor-pointer transition-all duration-300 `}
              >
                <svg className="w-6 h-6">
                  <use href="#shopping-bag" />
                </svg>
                <span>سفارش ها</span>
              </a>
            </li>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  if (item.isDanger) {
                    logout();
                  }
                }}
                className={`flex gap-x-2 items-center px-2 py-3 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    activeSection === item.id
                      ? "bg-blue-500/10 text-blue-500"
                      : item.isDanger
                      ? "text-red-400"
                      : "hover:text-blue-500"
                  }`}
              >
                <svg className="w-6 h-6">
                  <use href={item.icon} />
                </svg>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* MOBILE MENU */}
        <div className="lg:hidden px-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="bg-blue-500 flex items-center gap-x-1 font-DanaMedium text-white p-2 rounded-lg text-sm mr-2"
          >
            <svg className="size-5">
              <use href="#squares" />
            </svg>
            منوی کاربری
          </button>

          {menuOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex">
              <div className="w-64 bg-white dark:bg-gray-800 p-4 flex flex-col">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="self-end mb-4"
                >
                  <svg className="size-6">
                    <use href="#x-mark" />
                  </svg>
                </button>
                <ul className="space-y-2 text-lg">
                  {menuItems.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMenuOpen(false);
                        if (item.isDanger) logout();
                      }}
                      className={`flex gap-x-2 items-center px-2 py-3 rounded-lg cursor-pointer transition-all duration-300 
                        ${
                          activeSection === item.id
                            ? "bg-blue-500/10 text-blue-500"
                            : item.isDanger
                            ? "text-red-400"
                            : "hover:text-blue-500"
                        }`}
                    >
                      <svg className="w-6 h-6">
                        <use href={item.icon} />
                      </svg>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:w-3/4 px-3 md:px-0 mt-5 lg:mt-0">{renderContent()}</div>
      </div>
    </main>
  );
};

export default Page;
