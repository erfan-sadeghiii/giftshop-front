"use client"
import useDarkMode from "@/app/hooks/useDarkmode";
import { useState, useRef, useEffect } from "react";
import MegaMenu from "./MegaMenu";
import { useAuth } from "@/context/AuthContext";
import SearchBox from "./searchBox";
import CartIcon from "./CartIcon";
import SideCart from "./sideCart";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, quantityDecreased, quantityIncreased, removeProductFromCart, selectCartEntities, updateCartQuantity } from "@/app/cartSlice";

const Desktop = ({ }) => {

    const [isDark, toggleDarkMode] = useDarkMode();
    const [carousel, setCarousel] = useState(false);
    const [searchOverlay, setSearchOverlay] = useState(false);
    const searchRef = useRef(null);
    const { accessToken, logout, isAuthenticated,user } = useAuth()
    // Close search overlay on click outside or Esc key

    const cart = useSelector(selectCartEntities);


    const dispatch = useDispatch();


    useEffect(() => {
        if (accessToken) {
            dispatch(fetchCart(accessToken));
        }
    }, [dispatch, accessToken]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOverlay(false);
            }
        };
        const handleEsc = (event) => {
            if (event.key === "Escape") setSearchOverlay(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const handleIncrease = (item) => {
        dispatch(quantityIncreased(item.id)); // Optimistic UI
        dispatch(
            updateCartQuantity({
                itemId: item.id,
                newQuantity: item.quantity + 1,
                accessToken,
            })
        );
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            dispatch(quantityDecreased(item.id)); // Optimistic UI
            dispatch(
                updateCartQuantity({
                    itemId: item.id,
                    newQuantity: item.quantity - 1,
                    accessToken,
                })
            );
        }else if (item.quantity <=1){
       dispatch(removeProductFromCart({ itemId:item.id, accessToken }));
    }
    };

    const handleRemove = (itemId) => {
        dispatch(removeProductFromCart({ itemId, accessToken }));
    };

    const handleDeleteAll = () => {
        cartItems.forEach((item) =>
            dispatch(removeProductFromCart({ itemId: item.id, accessToken }))
        );
    };



    return (
        <>
            <div className="container mt-5 hidden flex-col gap-y-6 lg:flex">
                {/* <!-- TOPBAR --> */}
                <div className="flex-between">
                    {/* <!-- Logo --> */}
                    <a href="/" className="flex flex-col text-center ml-20">
                        <span className="font-MorabbaMedium text-4xl flex items-center">
                            <span className="text-blue-500">تیکسـو</span> گیم
                        </span>
                        <p className="font-DanaMedium text-gray-400"> خرید گیفت کارت معتبر</p>
                    </a>

                    {/* <!-- Search Box --> */}
                    <SearchBox searchOverlay={searchOverlay} setSearchOverlay={setSearchOverlay} searchRef={searchRef} />

                    {/* <!-- Action Buttons --> */}
                    <div className="flex items-center gap-x-3">
                        {/* <!-- LOGIN --> */}
                        {/* <button className="hidden flex-center py-2 px-4 app-border rounded-full app-hover">
                            <a href="#" className="flex items-center gap-x-2">
                                <p>ورود | ثبت‌نام</p>
                                <svg className="size-5">
                                    <use href="#arrow-left-end" />
                                </svg>
                            </a>
                        </button> */}

                        {/* <!-- Account Btn --> */}
                        {isAuthenticated ? <button className={` group relative flex-center py-2 px-4 app-border rounded-full app-hover delay-75`}>
                            <a href={isAuthenticated ? "/dashboard" : "/login"} className="flex items-center gap-x-1">
                                <svg className="size-5">
                                    <use href="#user" />
                                </svg>
                                <p>حساب کاربری</p>
                            </a>
                            <div className="absolute dark:border-none border border-gray-100 w-52 p-2 bg-white text-gray-900 dark:text-gray-100 flex flex-col gap-y-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-12 transition-all delay-100 dark:bg-gray-700 top-20 rounded-lg text-base shadow child:transition-all duration-300 child:py-1.5 child:px-2 child:rounded-lg child:w-full z-40">
                                <a href="/cart" className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-gray-100">
                                    <svg className="h-5 w-5"><use href="#user"></use></svg> سفارشات من
                                </a>
                              {user.role !="user"?  <a href="/admin" className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-gray-100">
                                    <svg className="h-5 w-5"><use href="#user"></use></svg>پنل ادمین
                                </a>:""}
                                {/* <a href="/" className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-gray-100">
                                    <svg className="h-5 w-5"><use href="#envelope"></use></svg> لیست پیام ها
                                </a> */}
                                <a href="/dashboard" className="flex items-center gap-x-2 hover:bg-blue-500 hover:text-gray-100">
                                    <svg className="h-5 w-5"><use href="#cog"></use></svg> اطلاعات کاربری
                                </a>
                                <span onClick={() => { logout() }} className="flex items-center gap-x-2 hover:bg-red-500 dark:hover:bg-red-500 hover:text-gray-100">
                                    <svg className="h-5 w-5"><use href="#arrow-left-end"></use></svg> خروج از حساب
                                </span>
                            </div>
                        </button> : <button className="hidden flex-center py-2 px-4 app-border rounded-full app-hover">
                            <a href="/login" className="flex items-center gap-x-2">
                                <p>ورود | ثبت‌نام</p>
                                <svg className="size-5">
                                    <use href="#arrow-left-end" />
                                </svg>
                            </a>
                        </button>}

                        {/* <!-- Toggle theme --> */}
                        <button onClick={toggleDarkMode} className="toggle-theme flex-center p-2 app-border rounded-full">
                            <svg className={`inline-block size-6 ${isDark ? "hidden" : "block"}`}><use href="#moon" /></svg>
                            <svg className={`inline-block size-6 ${isDark ? "block" : "hidden"}`}><use href="#sun" /></svg>
                        </button>

                        {/* <!-- Shopping cart --> */}
                        <CartIcon isAuthenticated={isAuthenticated} carousel={carousel} setCarousel={setCarousel} />

                        {/* <!-- Cart --> */}

                        <SideCart carousel={carousel} setCarousel={setCarousel} handleIncrease={handleIncrease}  cart={cart} handleDecrease={handleDecrease}  />
                    </div>
                </div>

                {/* <!-- NAVBAR --> */}
                <div className="relative flex justify-center h-16 bg-gray-900 dark:bg-gray-800 rounded-full text-gray-200 px-10">
                    <ul className="flex items-center gap-x-8">
                        <li className="menu-item">
                            <a href="/" className="menu-item_link">صفحه اصلی</a>
                        </li>
                        <li className="menu-item megamenu-link">
                            <a href="" className="menu-item_link flex items-center justify-center gap-x-1">
                                دسته بندی ها
                                <svg className="size-4"><use href="#chevron" /></svg>
                            </a>
                            <MegaMenu />
                        </li>
                        <li className="menu-item">
                            <a href="/blog" className="menu-item_link">وبلاگ</a>
                        </li>
                        <li className="menu-item">
                            <a href="#" className="menu-item_link">درباره ما</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Search overlay */}
            <div
                className={`search-overlay ${searchOverlay ? "active" : ""}`}
                onClick={() => setSearchOverlay(false)}
            ></div>
        </>
    );
}

export default Desktop;
