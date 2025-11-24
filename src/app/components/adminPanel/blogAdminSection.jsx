"use client";

import { useEffect, useState } from "react";
import ArticleCard from "../ArticleCard";
import Link from "next/link";

const BlogAdminSection = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/`);
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchArticles();
  }, []);

  return (
    <>
      {/* Create Blog Button */}
      <div className="flex justify-end mb-6 w-full">
        <Link
          href="/admin/blog/create"
          className="px-4 py-2 bg-blue-300 border-2 border-blue-600 text-white rounded hover:bg-blue-600 w-full text-center transition"
        >
          ایجاد مقاله جدید
        </Link>
      </div>
    <main className="container py-10 h-[calc(100vh-2.5rem)] overflow-hidden">

      {articles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-1 overflow-y-scroll h-full scrollbar-none">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} isAdmin={true} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">مقاله‌ای پیدا نشد</p>
      )}

      <style jsx>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </main>
  </>);
};

export default BlogAdminSection;
