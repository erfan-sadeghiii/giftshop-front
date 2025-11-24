"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
import PriceBox from "../components/cart/priceBox";
import BreadCrumb from "../components/Products/BreadCrumb";
import {
  fetchCart,
  quantityDecreased,
  quantityIncreased,
  removeProductFromCart,
  selectCartEntities,
  updateCartQuantity,
} from "../cartSlice";

const Page = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCartEntities);
  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchCart(accessToken));
    }
  }, [dispatch, accessToken]);

  const cartItems = Object.values(cart || {});

  // --- Handlers ---

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

  // --- Render ---
  return (
    <main className="container overflow-x-hidden">
      <BreadCrumb />

      <section className="flex flex-col lg:flex-row justify-between items-start gap-4 child:rounded-lg child:bg-white child:dark:bg-gray-800 child:shadow child:p-4 mt-5">
        {/* --- Cart Items --- */}
        <div className="w-full lg:w-3/4 flex flex-col gap-y-8">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-x-2">
              <h2 className="font-DanaMedium text-xl">سبد خرید</h2>
              <p className="text-gray-400">({cartItems.length} کالا)</p>
            </span>
            <span
              className="flex items-center gap-x-1 text-red-600 dark:text-white cursor-pointer"
              onClick={handleDeleteAll}
            >
              <p className="mt-1 font-DanaMedium">حذف همه</p>
              <svg className="w-5 h-5">
                <use href="#trash" />
              </svg>
            </span>
          </div>

          <div className="w-full flex flex-col gap-y-4 child:p-2 lg:child:p-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex relative border-b-2 border-gray-200 dark:border-white/20"
                >
                  <div className="flex w-full flex-col sm:flex-row items-center gap-6">
                    <div className="flex w-fit flex-col">
                      <img
                        src={
                          `${process.env.NEXT_PUBLIC_API_URL}${item.product?.images[0]}` ||
                          "/images/products/placeholder.webp"
                        }
                        alt={item.product?.title}
                        className="w-36"
                      />
                      <div className="flex items-center justify-between gap-x-1 rounded-lg border border-gray-200 dark:border-white/20 py-1 px-2 mt-2">
                        <svg
                          className="w-4 h-4 increment text-green-600 cursor-pointer"
                          onClick={() => handleIncrease(item)}
                        >
                          <use href="#plus" />
                        </svg>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          readOnly
                          className="mr-2 text-lg bg-transparent text-center w-10"
                        />
                        <svg
                          className="w-4 h-4 decrement text-red-500 cursor-pointer"
                          onClick={() => handleDecrease(item)}
                        >
                          <use href="#minus" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-y-4">
                      <a href={`/products/${item.product.slug}`}>
                        <h2 className="font-DanaMedium line-clamp-1">
                          {item.product?.title}
                        </h2>
                      </a>
                      <p className="text-sm text-gray-400">
                        {item.product?.subtitle}
                      </p>
                      <div className="flex flex-col">
                        <div className="flex flex-row items-baseline" >

                          {item.product.discount ? (
                            <del className="text-xs  text-gray-300">
                              {Number(item.product.price).toLocaleString()}
                            </del>
                          ) : null}
                          <span className=" flex justify-center items-center mx-2 pt-1 px-3 rounded-2xl  bg-blue-500">
                            {Math.round(item.product.discount)}%
                          </span>
                        </div>
                        <span className="flex items-center gap-x-1 text-gray-700 dark:text-gray-300 font-DanaMedium mt-4">
                          <p className="font-DanaMedium text-xl">
                            {item.product?.final_price?.toLocaleString("fa-IR")}
                          </p>
                          <p className="text-lg">تومان</p>
                        </span>

                      </div>

                      <div className="flex justify-end">

                        <span
                          className="flex items-center gap-x-1 text-red-600 dark:text-white cursor-pointer mt-2"
                          onClick={() => handleRemove(item.id)}
                        >
                          <p className="font-DanaMedium text-sm">حذف</p>
                          <svg className="w-4 h-4">
                            <use href="#trash" />
                          </svg>
                        </span>

                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                سبد خرید شما خالی است.
              </p>
            )}
          </div>
        </div>

        {/* --- Price Box --- */}
        <PriceBox
          count={cartItems.length}
          totalPrice={totalPrice}
          totalDiscount={totalDiscount}
          finalPrice={finalPrice}
        />
      </section>
    </main>
  );
};

export default Page;
