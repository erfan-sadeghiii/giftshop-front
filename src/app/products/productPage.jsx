"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "../components/productCard";
import BreadCrumb from "../components/Products/BreadCrumb";
import SideFilterBox from "../components/Products/ProductsSideFilter";
const toArray = (v) =>
  Array.isArray(v) ? v : v ? [v] : [];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isUpdatingUrl = useRef(false);

  const lastQuery = useRef({
    // category: "all",
    // childCategory: null,
    category: [],
    childCategory: [],
    available: false,
    priceMin: 0,
    priceMax: 30_000_000,
    sort: "محبوب ترین",
  });

  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("محبوب ترین");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  // const [selectedChildCategory, setSelectedChildCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedChildCategory, setSelectedChildCategory] = useState([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(30_000_000);

  const [visibleCount, setVisibleCount] = useState(6); // initial products to show
  const loadCount = 6; // load 6 more on scroll

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products/`;

  // ---- Sync state from URL or fallback to lastQuery ----
  useEffect(() => {
    if (isUpdatingUrl.current) {
      isUpdatingUrl.current = false;
      return;
    }

    // const cat = searchParams.get("category") || lastQuery.current.category;
    // const child = searchParams.get("childCategory") || lastQuery.current.childCategory;


    const parseParam = (param) => {
      if (!param) return [];
      return param
        .split(",")
        .map((s) => decodeURIComponent(s.trim()))
        .filter(Boolean);
    };

    const cats = parseParam(searchParams.get("category"));
    const childCats = parseParam(searchParams.get("childCategory"));

    const available = searchParams.get("available") === "true" || lastQuery.current.available;
    const min = parseInt(searchParams.get("priceMin")) || lastQuery.current.priceMin;
    const max = parseInt(searchParams.get("priceMax")) || lastQuery.current.priceMax;
    const sort = searchParams.get("sort") || lastQuery.current.sort;

    // setSelectedCategories(cats);
    // setSelectedChildCategory(child);
    setSelectedCategory(cats);
    setSelectedChildCategory(childCats);
    setOnlyAvailable(available);
    setPriceMin(min);
    setPriceMax(max);
    setSortOption(sort);

    lastQuery.current = { category: cats, childCategory: childCats, available, priceMin: min, priceMax: max, sort };
    setVisibleCount(loadCount); // reset visible products when filters change
  }, [searchParams]);

  // ---- Fetch products ----
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === undefined) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (newUrl !== window.location.href) {
      isUpdatingUrl.current = true;
      router.replace(newUrl, { scroll: false });
    }
  };

  // ---- Filtering & Sorting ----

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    
    if (selectedCategory.length) {
      filtered = filtered.filter(
        (p) =>
          // p.category?.parent_detail?.name ==
          selectedCategory.includes(p.category?.parent_detail?.name)
      );
  
    }

    if (selectedChildCategory.length) {
  filtered = filtered.filter((p) =>
    selectedChildCategory.some(
      (cat) => cat.trim() === p.category?.name?.trim()
    )
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

  // type = "parent" or "child"
  const handleCategoryChange = (cat, type) => {
    if (type === "parent") {
      setSelectedCategory(prev => {
        const next = prev.includes(cat)
          ? prev.filter(c => c !== cat)
          : [...prev, cat];
        updateQueryParams({ category: next.length ? next.join(",") : null });
        return next;
      });
    } else {
      setSelectedChildCategory(prev => {
        const next = prev.includes(cat)
          ? prev.filter(c => c !== cat)
          : [...prev, cat];
        updateQueryParams({ childCategory: next.length ? next.join(",") : null });
        return next;
      });
    }
  };

  // ---- Infinite scroll handler ----
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 550
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + loadCount, filteredProducts.length)
        );
      }
    };

    // initial check in case content is smaller than viewport
    const checkInitialHeight = () => {
      if (document.body.offsetHeight <= window.innerHeight && visibleCount < filteredProducts.length) {
        setVisibleCount((prev) =>
          Math.min(prev + loadCount, filteredProducts.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkInitialHeight();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProducts]);


  const currentProducts = filteredProducts.slice(0, visibleCount);

  
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
          // selectedCategory={selectedChildCategory || selectedCategory}
          // selectedCategory={[...selectedCategory, ...selectedChildCategory]}
          selectedCategory={selectedCategory}       // parent
          selectedChildCategory={selectedChildCategory} // child
          onCategoryChange={handleCategoryChange}

          // onCategoryChange={(cat) => {
          //   if (cat === "all") {
          //     setSelectedCategory("all");
          //     setSelectedChildCategory(null);
          //     updateQueryParams({ category: null, childCategory: null });
          //   } else if (categories.includes(cat)) {
          //     setSelectedCategory(cat);
          //     setSelectedChildCategory(null);
          //     updateQueryParams({ category: cat, childCategory: null });
          //   } else {
          //     setSelectedChildCategory(cat);
          //     updateQueryParams({ childCategory: cat });
          //   }
          // }}
          onlyAvailable={onlyAvailable}
          onAvailabilityChange={(val) => {
            setOnlyAvailable(val);
            updateQueryParams({ available: val ? "true" : null });
          }}
          priceRange={{ min: priceMin, max: priceMax }}
          onPriceChange={({ priceMin, priceMax }) => {
            setPriceMin(priceMin);
            setPriceMax(priceMax);
            updateQueryParams({ priceMin, priceMax });
          }}
          onClearFilters={() => {
            // setSelectedCategory("all");
            // setSelectedChildCategory(null);
            setSelectedCategory([]);
            setSelectedChildCategory([]);

            setOnlyAvailable(false);
            setPriceMin(0);
            setPriceMax(30_000_000);
            setSortOption("محبوب ترین");
            setVisibleCount(loadCount);
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
          <div className="flex flex-col gap-y-4 lg:flex-row items-start lg:items-center text-xs sm:text-sm md:text-lg justify-between mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-y-3 sm:gap-x-5">
              <h2 className="font-DanaDemiBold text-gray-400 flex items-center gap-x-1 md:gap-x-2 whitespace-nowrap">

                مرتب سازی :
              </h2>

              <ul className="flex flex-wrap items-center gap-x-3 gap-y-2">
                {["محبوب ترین", "ارزان ترین", "گران ترین"].map((label) => (
                  <li
                    key={label}
                    onClick={() => {
                      setSortOption(label);
                      updateQueryParams({ sort: label });
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

            <span className="text-xs sm:text-sm text-gray-400 self-end lg:self-auto">
              {filteredProducts.length.toLocaleString("fa-IR")} کالا
            </span>
          </div>


          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {currentProducts.length ? (
              currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  preserveQuery
                />
              ))
            ) : (
              <p className="text-gray-400 flex justify-center col-span-full py-10">
                <svg class="mr-3 size-5 animate-spin " viewBox="0 0 24 24">  </svg>
              </p>
            )}
          </div>

          {/* LOADING INDICATOR */}
          {visibleCount < filteredProducts.length && (
            <p className="text-center text-gray-400 py-12">در حال بارگذاری...</p>
          )}
        </div>
      </div>
    </main>
  );
}
