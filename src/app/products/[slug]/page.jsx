"use client";

import React, { use, useEffect, useState } from "react";
import BreadCrumb from "@/app/components/Products/BreadCrumb";
import ProductImageSlider from "@/app/components/Products/ProductImageSlider";
import MobileSlider from "@/app/components/Products/MobileSlider";
import FeatureBox from "@/app/components/Products/FeatureBox";
import ProductTabs from "@/app/components/Products/ProductInfo";
import RelatedProducts from "@/app/components/Products/RelatedProducts";
import ProductRating from "@/app/components/Products/productRating";

import { useAuth } from "@/context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  quantityDecreased,
  quantityIncreased,
  removeProductFromCart,
  selectCartEntities,
  updateCartQuantity,
} from "@/app/cartSlice";

const Page = ({ params }) => {
  const { slug } = use(params);
  const dispatch = useDispatch();
  const { accessToken } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const cart = useSelector(selectCartEntities);
  const cartItems = Object.values(cart || {});
  const cartItemsIDs = cartItems.map((item) => item.product.id);

  // --- Fetch product ---
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shop/products/${slug}/`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading)
    return <p className="text-center mt-10">در حال بارگذاری...</p>;
  if (!product) return <p className="text-center mt-10">محصول یافت نشد</p>;

  // --- Quantity handlers ---
  const handleIncrease = (item) => {
    if (cartItemsIDs.includes(product.id)) {
      // Product already in cart
      dispatch(quantityIncreased(item.id));
      dispatch(
        updateCartQuantity({
          itemId: item.id,
          newQuantity: item.quantity + 1,
          accessToken,
        })
      );
    } else if (quantity < 20) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = (item) => {
    if (cartItemsIDs.includes(product.id)) {
      if (item.quantity > 1) {
        dispatch(quantityDecreased(item.id));
        dispatch(
          updateCartQuantity({
            itemId: item.id,
            newQuantity: item.quantity - 1,
            accessToken,
          })
        );
      } else {
        dispatch(removeProductFromCart({ itemId: item.id, accessToken }));
      }
    } else if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  // --- Add to cart ---
  const handleAddToCart = () => {
    if (!accessToken) {
      alert("لطفا ابتدا وارد شوید");
      return;
    }

    dispatch(
      addProductToCart({
        productId: product.id,
        quantity,
        accessToken,
      })
    );

    window.location.href = "/cart";
  };

  // Find the cart item if it exists
  const existingCartItem = cartItems.find(
    (item) => item.product.id === product.id
  );

  return (
    <main className="container">
      <BreadCrumb />

      <section className="mt-5 flex flex-col lg:flex-row items-start gap-4 child:rounded-lg child:bg-white child:dark:bg-gray-800 child:shadow child:p-4">
        {/* IMAGE & INFO */}
        <div className="w-full lg:w-3/4 flex flex-col md:flex-row gap-x-8">
          <ProductImageSlider images={product.images} title={product.title} />

          <div className="w-full md:w-3/4 flex flex-col lg:justify-between gap-y-7">
            <div>
              <div className="flex items-center justify-between">
                <a href="#" className="font-DanaMedium text-sky-400">
                  {product.category?.parent_detail?.name} /{" "}
                  {product.category?.name}
                </a>
              </div>

              <MobileSlider images={product.images} />

              <div className="flex flex-col gap-y-3">
                <p className="text-lg font-DanaDemiBold dark:text-gray-300">
                  {product.title}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {product.subtitle}
                </p>
                <ProductRating comments={product.comments} />
              </div>
            </div>
            <FeatureBox features={product.product_features} />
          </div>
        </div>

        {/* PRICE BOX */}
        <div className="w-full lg:w-1/4 lg:sticky top-5 flex flex-col gap-y-6">
          <div className="flex flex-col">
            <div className="flex flex-row w-[80%]">
              <div className="flex items-center gap-x-1">
                <p className="text-2xl font-DanaDemiBold">
                  {Number(product.final_price).toLocaleString("fa-IR")}
                </p>
                <p>تومان</p>
              </div>
              {product.discount && (
                <span className="flex justify-center items-center mx-2 rounded-4xl p-2 bg-blue-500">
                  {Math.round(product.discount)}%
                </span>
              )}
            </div>

            {product.discount ? (
              <del className="text-md text-gray-300">
                {Number(product.price).toLocaleString()}
              </del>
            ) : null}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-white/20 py-2 px-3">
            <button
              onClick={() =>
                handleIncrease(existingCartItem || { id: product.id, quantity })
              }
            >
              <svg className="w-6 h-6 increment text-green-600">
                <use href="#plus" />
              </svg>
            </button>
            <input
              type="number"
              min="1"
              max="20"
              value={
                existingCartItem ? existingCartItem.quantity : quantity
              }
              onChange={(e) =>
                setQuantity(Math.min(20, Math.max(1, Number(e.target.value))))
              }
              className="custom-input mx-2 text-lg bg-transparent text-center w-12"
            />
            <button
              onClick={() =>
                handleDecrease(existingCartItem || { id: product.id, quantity })
              }
            >
              <svg className="w-6 h-6 decrement text-red-500">
                <use href="#minus" />
              </svg>
            </button>
          </div>

          {/* Add to Cart Button */}
          {accessToken ? (
            cartItemsIDs.includes(product.id) ? (
              <p className="text-center text-green-500">
                در سبد شما موجود است
              </p>
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition-all rounded-lg shadow py-2"
              >
                افزودن به سبد خرید
                <svg className="w-5 h-5 mr-2">
                  <use href="#shopping-bag" />
                </svg>
              </button>
            )
          ) : (
            <p className="text-center text-red-500">ابتدا وارد شوید</p>
          )}
        </div>
      </section>

      <ProductTabs
        description={product.description}
        features={product.product_features}
        comments={product.comments}
        productId={product.id}
      />
      <RelatedProducts categoryId={product.category?.id} />
    </main>
  );
};

export default Page;
