"use client";
import { useState, useEffect } from "react";
import ArticleCard from "../ArticleCard";
import axios from "axios";

const ArticlesSection = () => {
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  // ✅ Fetch articles from Django API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(process.env.NEXT_PUBLIC_API_URL+"/blog/");
        setArticles(res.data);
      } catch (err) {
        console.error("Error fetching articles:", err);
      }
    };
    fetchArticles();
  }, []);

  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = articles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">تمامی مقالات</h2>

      {/* Articles grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {currentArticles.map((article, idx) => (
          <ArticleCard
            key={article.id || idx}
            article={article}
          />
        ))}
      </div>

      {/* Pagination */}
      {articles.length > 0 && (
        <div dir="ltr" className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            قبلــــی
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            بعــــدی
          </button>
        </div>
      )}
    </section>
  );
};

export default ArticlesSection;
