
"use client";

import { useState } from "react";
import CommentTab from "./commentTab";
import FeatureTab from "./featureTab";

const ProductTabs = ({ comments = [], description = "", features = [],productId }) => {
  const [activeTab, setActiveTab] = useState("tab1");
  const [showAllComments, setShowAllComments] = useState(false);

  const toggleTab = (tab) => setActiveTab(tab);
  const toggleComments = () => setShowAllComments(!showAllComments);

  return (
    <section className="relative mt-10 flex flex-col items-start gap-4 rounded-lg bg-white dark:bg-gray-800 shadow p-4">
      {/* Tabs */}
      <div className="w-full py-3 flex items-center gap-x-6 z-10 border-b border-gray-600/20 dark:border-b-gray-200/20">
        <button
          className={`tab-btn ${
            activeTab === "tab1"
              ? "text-blue-500"
              : "text-gray-500 dark:text-gray-300"
          }`}
          onClick={() => toggleTab("tab1")}
        >
          معرفی محصول
        </button>
        <button
          className={`tab-btn ${
            activeTab === "tab2"
              ? "text-blue-500"
              : "text-gray-500 dark:text-gray-300"
          }`}
          onClick={() => toggleTab("tab2")}
        >
          مشخصات
        </button>
        <button
          className={`tab-btn ${
            activeTab === "tab3"
              ? "text-blue-500"
              : "text-gray-500 dark:text-gray-300"
          }`}
          onClick={() => toggleTab("tab3")}
        >
          دیدگاه‌ها
        </button>
      </div>

      {/* Tab 1 - Product Description */}
      {activeTab === "tab1" && (
        <div className="tab-content tab1 block">
          <h2 className="font-DanaDemiBold border-b-2 border-blue-500 w-fit p-1 text-lg">
            معرفی
          </h2>
          <p className="mt-4 leading-8 prose" dangerouslySetInnerHTML={{ __html: description }}></p>
        </div>
      )}

      {/* Tab 2 - Features */}
      {activeTab === "tab2" && (
        <FeatureTab features={features}/>
      )}

      {/* Tab 3 - Comments & Form */}
      {activeTab === "tab3" && (
       <CommentTab initialComments={comments} toggleComments={toggleComments}  productId={productId} showAllComments={showAllComments}/>
      )}
    </section>
  );
};

export default ProductTabs;