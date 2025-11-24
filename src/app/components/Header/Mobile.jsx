"use client"
import useDarkMode from "@/app/hooks/useDarkmode";
import { useState } from "react";
import MobileSearchModel from "./mobileSearchModel";
import BottomNavbar from "./bottomNavbar";
import { useAuth } from "@/context/AuthContext";

const Mobile = ({}) => {
    const [isDark, toggleDarkMode] = useDarkMode();
    const [MobileMenu, setMobileMenu] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const {isAuthenticated,logout} = useAuth()
  return (<>
    <div className="flex justify-center lg:hidden">
                {/* Top Navbar */}
                <nav className="absolute top-0 inset-x-0 w-full h-16 px-4 shadow-sm bg-gray-200 dark:bg-gray-800 flex items-center justify-between">
                    {/* Menu */}
                    <button onClick={()=>setMobileMenu(pre=>!pre)} className="open-menu-mobile flex-center p-2 app-border rounded-full">
                        <svg className="size-6">
                            <use href="#bars" />
                        </svg>
                    </button>

                    <div className={`mobile-menu z-50 flex flex-col ${MobileMenu?"active":""}`}>
                        {/* Mobile Menu Header */}
                        <div className="flex w-full items-center justify-between border-b-normal pb-4">
                            <a href="/" className="text-xl font-MorabbaMedium">
                                 <span className="text-blue-500">تیکسـو</span> گیم
                            </a>
                            <button onClick={()=>{setMobileMenu(false)}} className="close-menu-mobile">
                                <svg className="size-5 text-gray-500 dark:text-gray-200">
                                    <use href="#x-mark" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Menu Categories & Actions */}
                        <ul className="flex flex-col gap-y-2 text-gray-800 dark:text-gray-100 mt-4">
                            

                            {/* Account Links */}
                            {isAuthenticated?<li className="mobile-menu-item">
                                <svg className="size-5">
                                    <use href="#user" />
                                </svg>
                                <a href="/dashboard">حساب کاربری</a>
                            </li>:<li className="mobile-menu-item">
                                <svg className="size-5">
                                    <use href="#user" />
                                </svg>
                                <a href="/login">ورود | ثبت نام</a>
                            </li>
}
                            <li className="mobile-menu-item">
                                <svg className="size-5">
                                    <use href="#shopping-cart" />
                                </svg>
                                <a href="/cart">سبد خرید</a>
                            </li>
                            <li className="mobile-menu-item">
                                <svg className="size-5">
                                    <use href="#envelope" />
                                </svg>
                                <a href="/blog">وبلاگ</a>
                            </li>
                            <li className="mobile-menu-item">
                                <svg className="size-5">
                                    <use href="#check-badge" />
                                </svg>
                                <a href="#">دربـاره مـا</a>
                            </li>
                             {isAuthenticated?<li className="mobile-menu-item">
                               
                                <button onClick={()=>{logout()}} className="text-red-500" >خروج از حساب کاربری</button>
                            </li>:""}
                          
                        </ul>
                    </div>

                    {/* Logo */}
                    <a href="/" className="flex flex-col text-center">
                        <span className="font-MorabbaMedium text-3xl flex items-center">
                          <span className="text-blue-500">تیکسـو</span> گیم
                        </span>
                    </a>

                    {/* Toggle Theme */}
                     <button
                            onClick={toggleDarkMode}
                            className="toggle-theme flex-center p-2 app-border  rounded-full"
                        >
                            <svg className={`inline-block size-6 ${isDark ? "hidden" : "block"}`}>
                                <use href="#moon" />
                            </svg>
                            <svg className={`inline-block size-6 ${isDark ? "block" : "hidden"}`}>
                                <use href="#sun" />
                            </svg>
                        </button>
                </nav>

                {/* Search Bar */}
                <button onClick={()=>setSearchModal(pre=>!pre)} className="open-mobile_search-modal">
                    <svg className="size-6">
                        <use href="#search" />
                    </svg>
                    <p>
                        جستجو در <span className="font-MorabbaMedium">تیکسو گیم</span>
                    </p>
                </button>

                {/* Search Modal */}
                <MobileSearchModel searchModal={searchModal} setSearchModal={setSearchModal}/>

                {/* Bottom Navbar */}
               <BottomNavbar/>
            </div>
    { /* <!-- Overlay --> */}
      <div className={`overlay ${MobileMenu?"active":""}`}></div>
      
  </>
  );
}

export default Mobile