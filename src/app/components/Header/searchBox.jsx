"use client";
import { useState, useEffect } from "react";

const SearchBox = ({ searchOverlay, setSearchOverlay, searchRef }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products/search/`;

  // --- handle search typing ---
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        fetchSearchResults();
      } else {
        setResults([]);
      }
    }, 400); // debounce typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 px-8 z-20">
      <div className="search-btn-open flex gap-x-2 app-border bg-gray-50 dark:bg-gray-700 p-1 rounded-full cursor-pointer ring-blue-400 w-full transition-all">
        <svg className="size-6 p-1.5 flex-center text-gray-100 bg-blue-600 rounded-full w-9 h-9">
          <use href="#search" />
        </svg>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setSearchOverlay(true)}
          placeholder="جستجو در تیکسو گیم..."
          type="text"
        />
      </div>

      {/* --- Search Modal --- */}
      <div className={`search-modal space-y-4 ${searchOverlay ? "active" : ""}`}>
        {loading && <p className="text-sm text-gray-400">در حال جستجو...</p>}

        {!loading && searchTerm && (
          <div>
            <span className="flex items-center text-sm gap-x-1 text-gray-600 dark:text-gray-200">
              <p>
                نتیجه جستجو برای:{" "}
                <span className="font-DanaMedium text-blue-400">{searchTerm}</span>
              </p>
            </span>

            {results.length > 0 ? (
              <ul className="pt-4 text-gray-500 dark:text-gray-300 flex flex-col gap-y-4 child:flex-between child:cursor-pointer">
                {results.map((product) => (
                  <li key={product.id}>
                    <a
                      href={`/products/${product.slug}`}
                      className="flex items-center gap-x-2 hover:text-blue-600"
                    >
                      <svg className="size-5">
                        <use href="#search" />
                      </svg>
                      {product.title}
                    </a>
                    <svg className="size-4">
                      <use href="#arrow-up-right" />
                    </svg>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 pt-4">نتیجه‌ای یافت نشد.</p>
            )}
          </div>
        )}

        {/* --- Trend Section --- */}
        {!searchTerm && (
          <div className="pt-4">
            <span className="flex items-center gap-x-1 text-sm text-gray-500 dark:text-gray-200">
              <svg className="size-4">
                <use href="#fire" />
              </svg>
              <p>جستجوهای پرطرفدار:</p>
            </span>
            <ul className="w-full flex items-center gap-1.5 mt-3 child:search-modal-list-item">
              <li><a href="/products?category=mobile&childCategory=apple">#آیفون</a></li>
              <li><a href="/products?category=laptop">#لپ‌تاپ</a></li>
              <li><a href="/products?category=headphone">#هدفون</a></li>
              {/* <li><a href="#">#هلدر</a></li> */}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBox;
