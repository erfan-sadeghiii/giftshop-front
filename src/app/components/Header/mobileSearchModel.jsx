"use client";
import { useState, useEffect } from "react";

const MobileSearchModal = ({ searchModal, setSearchModal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/products/search/`;

  // Debounce search input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length > 0) {
        fetchSearchResults();
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`mobile_search-modal ${searchModal ? "active" : ""}`}>
      {/* Search Top */}
      <div className="w-full flex items-center gap-x-2">
        <button className="w-full flex items-center gap-x-1 bg-gray-200 dark:bg-gray-800 text-gray-500 py-2 px-4 rounded-3xl">
          <svg className="size-6">
            <use href="#search" />
          </svg>
          <input
            type="text"
            placeholder="جستجو در همه کالاها"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </button>
        <svg
          onClick={() => setSearchModal(false)}
          className="size-6 close-mobile_search-modal cursor-pointer"
        >
          <use href="#x-mark" />
        </svg>
      </div>

      <div className="w-full space-y-4 mt-4">
        {/* --- Search Results --- */}
        {loading && (
          <p className="text-gray-400 text-sm text-center">در حال جستجو...</p>
        )}

        {!loading && searchTerm && (
          <div>
            <span className="flex items-center text-sm gap-x-1 text-gray-600 dark:text-gray-200">
              <p>
                نتیجه جستجو برای{" "}
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
              <p className="text-gray-400 pt-4 text-sm">نتیجه‌ای یافت نشد.</p>
            )}
          </div>
        )}

        {/* --- Search Trends --- */}
        {!searchTerm && (<div></div>)}
      </div>
    </div>
  );
};

export default MobileSearchModal;
