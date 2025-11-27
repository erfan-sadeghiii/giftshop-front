"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import AmazingSlider from "../home/AmazingSlider";
import { useAuth } from "@/context/AuthContext";

export default function AdminAmazingSlider() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [hours, setHours] = useState(1);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [slider, setSlider] = useState(null);

    const API_PRODUCTS = `${process.env.NEXT_PUBLIC_API_URL}/shop/products/`;
    const API_SLIDER = `${process.env.NEXT_PUBLIC_API_URL}/shop/amazing-slider/`;
    const { accessToken } = useAuth();

    useEffect(() => {
        fetchProducts();
        fetchSlider();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get(API_PRODUCTS);
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSlider = async () => {
        try {
            const { data } = await axios.get(API_SLIDER);
            setSlider(data.length ? data[0] : null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        if (!selectedProducts.length) {
            Swal.fire("خطا", "لطفاً حداقل یک محصول انتخاب کنید", "error");
            return;
        }

        const duration = hours * 3600 + minutes * 60 + seconds;

        try {
            await axios.post(
                API_SLIDER,
                {
                    product_ids: selectedProducts,
                    duration,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            Swal.fire("موفقیت", "اسلایدر ایجاد شد", "success");
            fetchSlider();
        } catch (err) {
            console.error(err);
            Swal.fire("خطا", "ایجاد اسلایدر با مشکل مواجه شد", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_SLIDER}${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            Swal.fire("حذف شد", "اسلایدر با موفقیت حذف شد", "success");
            setSlider(null);
        } catch (err) {
            console.error(err);
            Swal.fire("خطا", "حذف اسلایدر با مشکل مواجه شد", "error");
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-900 text-gray-100 rounded-lg space-y-6 max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-4">
                    مدیریت اسلایدر شگفت‌انگیز
                </h2>

                {/* اسلایدر فعال */}
                {slider ? (
                    <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-lg">
                        <h3 className="font-semibold text-xl mb-2 text-white">
                            اسلایدر فعال فعلی
                        </h3>

                        <p className="mb-2">
                            زمان ایجاد:{" "}
                            <span className="font-bold">
                                {new Date(slider.created_at).toLocaleString("fa-IR", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                })}
                            </span>
                        </p>

                        <p className="mb-2">
                            مدت زمان:{" "}
                            <span className="font-bold">
                                {String(Math.floor(slider.duration / 3600)).padStart(2, "0")}:
                                {String(Math.floor((slider.duration % 3600) / 60)).padStart(
                                    2,
                                    "0"
                                )}
                                :
                                {String(slider.duration % 60).padStart(2, "0")}
                            </span>
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                            {slider.products.map((product) => (
                                <span
                                    key={product.id}
                                    className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm"
                                >
                                    {product.title}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleDelete(slider.id)}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            حذف اسلایدر
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-300 text-center">هیچ اسلایدری فعال نیست</p>
                )}

                {/* ایجاد اسلایدر جدید */}
                <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-lg space-y-4">
                    <h3 className="font-semibold text-xl text-white">
                        ایجاد اسلایدر جدید
                    </h3>

                    <div className="flex gap-4 items-center">
                        <div>
                            <label className="block text-gray-300">ساعت</label>
                            <input
                                type="number"
                                min={0}
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                className="w-20 border border-gray-600 bg-gray-700 text-white px-2 py-1 rounded text-center"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300">دقیقه</label>
                            <input
                                type="number"
                                min={0}
                                max={59}
                                value={minutes}
                                onChange={(e) => setMinutes(Number(e.target.value))}
                                className="w-20 border border-gray-600 bg-gray-700 text-white px-2 py-1 rounded text-center"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300">ثانیه</label>
                            <input
                                type="number"
                                min={0}
                                max={59}
                                value={seconds}
                                onChange={(e) => setSeconds(Number(e.target.value))}
                                className="w-20 border border-gray-600 bg-gray-700 text-white px-2 py-1 rounded text-center"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-300">
                            انتخاب محصولات (انتخاب چندین محصول : Ctrl + Click)
                        </label>

                        <select
                            multiple
                            value={selectedProducts}
                            onChange={(e) =>
                                setSelectedProducts(
                                    Array.from(e.target.selectedOptions, (opt) =>
                                        Number(opt.value)
                                    )
                                )
                            }
                            className="border border-gray-600 bg-gray-700 text-white px-2 py-1 rounded w-full h-40"
                        >
                            {products.map((p) => (
                                <option key={p.id} value={p.id} className="bg-gray-700 text-white">
                                    {p.title} - {p.price.toLocaleString()} تومان
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        ایجاد اسلایدر
                    </button>
                </div>
            </div>
        </>
    );
}
