"use client";

import { useState } from "react";
import PriceSlider from "./priceSlider";
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

export default function SideFilterBox({
  categories = [],                // parent categories
  childCategories = [],           // child categories
  selectedCategory = [],          // selected parent
  selectedChildCategory = [],     // selected child
  onCategoryChange,               // function(cat, type)
  onlyAvailable,
  onAvailabilityChange,
  priceRange,
  onPriceChange,
  onClearFilters,
}) {
  const [accordionOpen, setAccordionOpen] = useState({ 1: true, 2: true });

  const toggleAccordion = (id) => {
    setAccordionOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="lg:sticky top-1 h-fit lg:w-1/4 text-sm md:text-lg lg:flex flex-col gap-y-4 items-center shadow rounded-lg py-4 dark:bg-gray-800 bg-white">
      {/* HEADER */}
      <div className="flex items-center justify-between w-full px-2 xl:px-4">
        <span className="flex items-center gap-x-1">
          <p className="font-DanaMedium text-gray-700 dark:text-gray-200 text-lg">
            فیلترها
          </p>
        </span>
        <p
          className="text-blue-500 dark:text-blue-400 text-sm cursor-pointer"
          onClick={onClearFilters}
        >
          حذف فیلتر‌ها
        </p>
      </div>

      <div className="w-full divide-y divide-slate-200 dark:divide-gray-700/20">
        {/* PARENT CATEGORY FILTER */}
        <div>
          <button
            onClick={() => toggleAccordion(1)}
            className="w-full flex justify-between items-center px-2 xl:px-4 pt-4 mb-4 text-gray-800 dark:text-gray-100"
          >
            <span>دسته بندی</span>
            <svg
              className={`size-4 transition-transform duration-300 ${accordionOpen[1] ? "rotate-90" : ""
                }`}
            >
              <use href="#chevron-left" />
            </svg>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen[1] ? "max-h-[500px] pb-3" : "max-h-0"
              }`}
          >
            <div className="text-gray-700 dark:text-gray-300 w-full flex flex-col gap-y-1.5 px-2 xl:px-4">
              {categories.map((cat, idx) => (
                <div key={idx} className="inline-flex items-center mr-2.5 mt-1">
                  <input
                    type="checkbox"
                    id={`cat-${cat}`}
                    name="category"
                    value={cat}
                    checked={toArray(selectedCategory).includes(cat)}
                    onChange={(e) => onCategoryChange(e.target.value, "parent")}
                    className="h-4 w-4 accent-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`cat-${cat}`}
                    className="mr-2 cursor-pointer text-gray-800 dark:text-gray-400"
                  >
                    {cat}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHILD CATEGORY FILTER */}
        {childCategories.length > 0 && (
          <div>
            <button
              onClick={() => toggleAccordion(2)}
              className="w-full flex justify-between items-center px-2 xl:px-4 pt-4 mb-4 text-gray-800 dark:text-gray-100"
            >
              <span>زیر دسته</span>
              <svg
                className={`size-4 transition-transform duration-300 ${accordionOpen[2] ? "rotate-90" : ""
                  }`}
              >
                <use href="#chevron-left" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen[2] ? "max-h-[500px] pb-3" : "max-h-0"
                }`}
            >
              <div className="text-gray-700 dark:text-gray-300 w-full flex flex-col gap-y-1.5 px-2 xl:px-4">
                {childCategories.map((cat, idx) => (
                  <div key={idx} className="inline-flex items-center mr-2.5 mt-1">
                    <input
                      type="checkbox"
                      id={`child-${cat}`}
                      name="childCategory"
                      value={cat}
                      checked={toArray(selectedChildCategory).includes(cat)}
                      onChange={(e) => onCategoryChange(e.target.value, "child")}
                      className="h-4 w-4 accent-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`child-${cat}`}
                      className="mr-2 cursor-pointer text-gray-800 dark:text-gray-400"
                    >
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AVAILABILITY SWITCH */}
        <div
          className="w-full justify-between flex items-center gap-x-3 px-2 xl:px-4 py-4"
          dir="ltr"
        >
          <label htmlFor="available" className="relative block w-12 h-6 cursor-pointer">
            <input
              type="checkbox"
              id="available"
              checked={onlyAvailable}
              onChange={(e) => onAvailabilityChange(e.target.checked)}
              className="peer sr-only"
            />
            <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-blue-500 dark:bg-neutral-700 dark:peer-checked:bg-blue-500"></span>
            <span className="absolute ps-1 bottom-0 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out peer-checked:translate-x-full peer-checked:right-11 dark:bg-neutral-400 dark:peer-checked:bg-white"></span>
          </label>

          <label
            htmlFor="available"
            className="text-gray-800 dark:text-gray-100 flex items-center gap-x-2"
          >
            فقط کالاهای موجود
          </label>
        </div>

        {/* PRICE RANGE */}
        <PriceSlider
          min={priceRange.min}
          max={priceRange.max}
          onChange={onPriceChange}
        />
      </div>
    </div>
  );
}
