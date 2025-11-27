
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import BlogAdminSection from "../components/adminPanel/blogAdminSection";
import ProductsAdminSection from "../components/adminPanel/productsAdminSection";
import AdminCategoriesFeatures from "../components/adminPanel/adminCategoriesFeatures";
import ManageSliders from "../components/adminPanel/manageSlider";
import AdminManageBanners from "../components/adminPanel/adminManageBanner";
import TicketSystem from "../components/dashboard/TicketSystem";
import UsersSection from "../components/adminPanel/usersSection";
import MegaMenuAdmin from "../components/adminPanel/adminMegamenuSection";
import AdminAmazingSlider from "../components/adminPanel/AdminAmazingSlider";

// Example section components (you can create each in /components/admin)
// import ProductsManager from "../components/admin/ProductsManager";
// import BlogManager from "../components/admin/BlogManager";
// import CategoriesManager from "../components/admin/CategoriesManager";
// import SliderManager from "../components/admin/SliderManager";

const AdminPanel = () => {
    const [activeSection, setActiveSection] = useState("products");
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, Loading, logout } = useAuth();

    const menuItems = [
        { id: "products", label: "محصولات", icon: "#shopping-bag" },
        { id: "categories", label: "دسته‌بندی محصولات", icon: "#squares-2x2" },
        { id: "blog", label: "بلاگ", icon: "#newspaper" },
        { id: "slider", label: "اسلایدر صفحه اصلی", icon: "#photo" },
        { id: "banner", label: "بنر صفحه اصلی", icon: "#photo" },
        { id: "megamenu", label: "مگا منو", icon: "#photo" },
        { id: "tickets", label: "تیکت ها", icon: "#photo" },
        { id: "users", label: "کاربران", icon: "#photo" },
        { id: "amazing-slider", label: "پیشنهاد شگفت انگیز", icon: "#photo" },
        { id: "logout", label: "خروج", icon: "#arrow-left-end", isDanger: true },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case "products":
                
                return <ProductsAdminSection/>;
            case "categories":
                
                return <AdminCategoriesFeatures/>;
            case "blog":
                
                return <BlogAdminSection/>;
            case "slider":
                
                return <ManageSliders/>;
            case "banner":
                
                return <AdminManageBanners/>;
            case "megamenu":
                
                return <MegaMenuAdmin/>;
            case "tickets":
                
                return <TicketSystem isAdmin={true}/>;
            case "users":
                
                return <UsersSection/>;
            case "amazing-slider":
                
                return <AdminAmazingSlider/>;
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
                {/* SIDEBAR DESKTOP */}
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
                                    {Loading ? "" : user?.username || "ادمین"}
                                </p>
                                <p className="text-xs lg:text-xl text-gray-400">
                                    {Loading ? "" : user?.email}
                                </p>
                            </span>
                        </div>
                    </div>

                    <ul className="w-full space-y-2 text-lg">
                        {menuItems.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    if (item.isDanger) logout();
                                }}
                                className={`flex gap-x-2 items-center px-2 py-3 rounded-lg cursor-pointer transition-all duration-300 
                  ${activeSection === item.id
                                        ? "bg-blue-500/10 text-blue-500"
                                        : item.isDanger
                                            ? "text-red-400"
                                            : "hover:text-blue-500"
                                    }`}
                            >
                                {/* <svg className="w-6 h-6">
                                    <use href={item.icon} />
                                </svg> */}
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
                            <use href="#bars-3" />
                        </svg>
                        منوی ادمین
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
                        ${activeSection === item.id
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

export default AdminPanel;

