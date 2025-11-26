"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "../components/productCard";
import BreadCrumb from "../components/Products/BreadCrumb";
import SideFilterBox from "../components/Products/ProductsSideFilter";

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isUpdatingUrl = useRef(false);

  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("محبوب ترین");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [priceMin, setPriceMin] = useState(parseInt(searchParams.get("priceMin")) || 0);
  const [priceMax, setPriceMax] = useState(parseInt(searchParams.get("priceMax")) || 30_000_000);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products/`;

  // ---- Sync state from URL ----
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }

    const cat = searchParams.get("category");
    const child = searchParams.get("childCategory");
    const available = searchParams.get("available") === "true";
    const min = parseInt(searchParams.get("priceMin")) || 0;
    const max = parseInt(searchParams.get("priceMax")) || 30_000_000;
    const sort = searchParams.get("sort") || "محبوب ترین";

    setSelectedCategory(cat || "all");
    setSelectedChildCategory(child || null);
    setOnlyAvailable(available);
    setPriceMin(min);
    setPriceMax(max);
    setSortOption(sort);
    setCurrentPage(1);
  }, [searchParams]);

  // ---- Fetch products once ----
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

const updateQueryParams = (updates) => {
  const params = new URLSearchParams(window.location.search); // ✅ always current
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === "all" || value === undefined) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  const oldUrl = window.location.pathname + window.location.search;

  if (newUrl !== oldUrl) {
    isUpdatingUrl.current = true;
    router.replace(newUrl, { scroll: false });
  }
};


  // ---- Filtering ----
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.category?.parent_detail?.name?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (selectedChildCategory) {
      filtered = filtered.filter(
        (p) =>
          p.category?.name?.toLowerCase() ===
          selectedChildCategory.toLowerCase()
      );
    }

    if (onlyAvailable) filtered = filtered.filter((p) => p.stock_quantity > 0);

    filtered = filtered.filter(
      (p) => p.final_price >= priceMin && p.final_price <= priceMax
    );

    switch (sortOption) {
      case "ارزان ترین":
        filtered.sort((a, b) => a.final_price - b.final_price);
        break;
      case "گران ترین":
        filtered.sort((a, b) => b.final_price - a.final_price);
        break;
      case "محبوب ترین":
        filtered.sort((a, b) => b.comments.length - a.comments.length);
        break;
    }

    // Out-of-stock → end
    filtered.sort(
      (a, b) => (b.stock_quantity > 0 ? 1 : 0) - (a.stock_quantity > 0 ? 1 : 0)
    );

    return filtered;
  }, [
    products,
    selectedCategory,
    selectedChildCategory,
    onlyAvailable,
    priceMin,
    priceMax,
    sortOption,
  ]);

  // ---- Pagination ----
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIdx, startIdx + productsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ---- Categories list ----
  const categories = [
    ...new Set(products.map((p) => p.category?.parent_detail?.name).filter(Boolean)),
  ];

  return (
       <main className="container overflow-x-hidden">
      <BreadCrumb />

      <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-2 md:mx-0">
        {/* SIDE FILTER BOX */}
 <SideFilterBox
  categories={categories}
  selectedCategory={selectedChildCategory || selectedCategory}
  onCategoryChange={(cat) => {
    setCurrentPage(1);

    if (cat === "all") {
      // Reset both category and childCategory
      setSelectedCategory("all");
      setSelectedChildCategory(null);
      updateQueryParams({ category: null, childCategory: null });
    } else if (categories.includes(cat)) {
      // Parent category
      setSelectedCategory(cat);
      setSelectedChildCategory(null);
      updateQueryParams({ category: cat, childCategory: null });
    } else {
      // Child category
      setSelectedChildCategory(cat);
      updateQueryParams({ childCategory: cat });
    }
  }}
  onlyAvailable={onlyAvailable}
  onAvailabilityChange={(val) => {
    setOnlyAvailable(val);
    updateQueryParams({ available: val ? "true" : null });
  }}
  priceRange={{ min: priceMin, max: priceMax }}
  onPriceChange={({ priceMin, priceMax }) => {
    setPriceMin(priceMin);
    setPriceMax(priceMax);
    setCurrentPage(1);
    updateQueryParams({ priceMin, priceMax });
  }}
  onClearFilters={() => {
    setSelectedCategory("all");
    setSelectedChildCategory(null);
    setOnlyAvailable(false);
    setPriceMin(0);
    setPriceMax(30_000_000);
    setCurrentPage(1);
    updateQueryParams({
      category: null,
      childCategory: null,
      available: null,
      priceMin: null,
      priceMax: null,
      sort: null,
    });
  }}
/>



        {/* MAIN PRODUCT AREA */}
        <div className="lg:w-3/4">
          {/* SORT OPTIONS */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="flex items-center gap-x-5">
              <h2 className="font-DanaDemiBold text-gray-400 flex items-center gap-x-2">
                <svg className="size-6 text-gray-400">
                  <use href="#sort-list" />
                </svg>
                مرتب سازی :
              </h2>
              <ul className="flex items-center gap-x-4">
                {["محبوب ترین", "ارزان ترین", "گران ترین"].map((label) => (
                  <li
                    key={label}
                    onClick={() => {
                      setSortOption(label);
                      updateQueryParams("sort", label);
                      setCurrentPage(1);
                    }}
                    className={
                      sortOption === label
                        ? "text-blue-500 cursor-pointer"
                        : "text-gray-400 cursor-pointer hover:text-blue-400"
                    }
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <span className="text-sm text-gray-400">
              {filteredProducts.length.toLocaleString("fa-IR")} کالا
            </span>
          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentProducts.length ? (
              currentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-gray-400 text-center col-span-full py-10">
                محصولی یافت نشد
              </p>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <ul className="flex items-center gap-x-3">
                <li
                  onClick={() => goToPage(currentPage - 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-500 hover:text-white cursor-pointer"
                  }`}
                >
                  قبلی
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "hover:bg-blue-500 hover:text-white cursor-pointer"
                    }`}
                  >
                    {i + 1}
                  </li>
                ))}
                <li
                  onClick={() => goToPage(currentPage + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-500 hover:text-white cursor-pointer"
                  }`}
                >
                  بعدی
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
