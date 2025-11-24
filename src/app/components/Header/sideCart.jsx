"use client";

const SideCart = ({ carousel, setCarousel, cart, handleIncrease, handleDecrease }) => {
    if (!carousel) return <div></div>;

    const cartItems = Object.values(cart || {});

    // --- Totals ---
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    const totalDiscount = cartItems.reduce(
        (sum, item) =>
            sum +
            ((item.product?.price || 0) - (item.product?.final_price || 0)) *
                item.quantity,
        0
    );

    const finalPrice = totalPrice - totalDiscount;

    return (
        <div className="cart translate-y-0 absolute bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 w-[400px] left-0 top-12">
            {/* HEADER */}
            <div className="flex items-center justify-between pb-2 border-b-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300">
                <h2 className="font-DanaMedium text-lg">
                    سبد خرید
                    <span className="text-sm text-gray-400 font-Dana">
                        {" "}
                        ({cartItems.length} مورد)
                    </span>
                </h2>
                <button
                    onClick={() => setCarousel(!carousel)}
                    className="cursor-pointer"
                >
                    <svg className="size-5">
                        <use href="#x-mark" />
                    </svg>
                </button>
            </div>

            {/* MAIN */}
            <div className="flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-600 my-4 max-h-[80vh] overflow-y-auto">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item} // Pass the whole item
                            img={`${process.env.NEXT_PUBLIC_API_URL}${item.product?.images[0]}` || "/images/placeholder.webp"}
                            title={item.product?.title || "بدون عنوان"}
                            price={Math.floor(item.product?.final_price || 0).toLocaleString("fa-IR")}
                            quantity={item.quantity}
                            handleIncrease={handleIncrease}
                            handleDecrease={handleDecrease}
                        />
                    ))
                ) : (
                    <p className="text-center py-8 text-gray-400 font-Dana">
                        سبد خرید شما خالی است.
                    </p>
                )}
            </div>

            {/* FOOTER */}
            <div className="w-[90%] fixed bottom-2 flex items-center justify-between border-t-2 border-gray-200 dark:border-gray-600 pt-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                        مبلغ قابل پرداخت :
                    </p>
                    <p className="text-lg text-blue-500 dark:text-blue-400 font-DanaDemiBold">
                        {Math.floor(finalPrice).toLocaleString("fa-IR")}{" "}
                        <span className="font-Dana text-sm">تومان</span>
                    </p>
                </div>
                <a
                    href="/cart"
                    className="py-2 px-4 bg-blue-600 flex-center hover:bg-blue-700 transition-all rounded-lg text-gray-200"
                >
                    ثبت سفارش
                </a>
            </div>
        </div>
    );
};

const CartItem = ({ item, img, title, price, quantity, handleIncrease, handleDecrease }) => {
    return (
        <div className="grid grid-cols-12 gap-x-2 w-full py-4 cursor-pointer">
            {/* IMG */}
            <div className="col-span-4 w-24 h-20">
                <img src={img} className="rounded-lg object-cover w-full h-full" alt="product" />
            </div>

            {/* DETAILS */}
            <div className="col-span-8 flex flex-col justify-between">
                <h2 className="font-DanaMedium line-clamp-2">{title}</h2>
                <div className="flex items-center justify-between gap-x-2 mt-2">
                    <button className="w-20 flex items-center justify-between gap-x-1 rounded-lg border border-gray-200 dark:border-white/20 py-1 px-2">
                        <svg
                            onClick={() => handleIncrease(item)}
                            className="size-4 text-green-600 cursor-pointer"
                        >
                            <use href="#plus" />
                        </svg>
                        <input
                            type="number"
                            min="0"
                            max="20"
                            value={quantity}
                            readOnly
                            className="custom-input w-4 mr-2 text-sm text-center bg-transparent"
                        />
                        <svg
                            onClick={() => handleDecrease(item)}
                            className="size-4 text-red-500 cursor-pointer"
                        >
                            <use href="#minus" />
                        </svg>
                    </button>
                    <p className="text-lg text-blue-500 dark:text-blue-400 font-DanaMedium">
                        {price} <span className="font-Dana text-sm">تومان</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SideCart;
