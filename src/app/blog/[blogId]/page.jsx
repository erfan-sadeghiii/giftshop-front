"use client";
import { useEffect, useState, useMemo, use } from "react";
import axios from "axios";
import BreadCrumb from "@/app/components/Products/BreadCrumb";

const SingleBlogPage = ({ params }) => {
  // Unwrap the params promise
  const { blogId } = use(params);

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    let isMounted = true;

    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/${blogId}/`);
        if (isMounted) setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        if (isMounted) setBlog(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlog();

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const readingTime = useMemo(() => {
    if (!blog?.content) return 0;
    const text = blog.content.replace(/<[^>]*>/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [blog]);

  if (loading) {
    return <p className="text-center py-12">در حال بارگذاری...</p>;
  }

  if (!blog) {
    return <p className="text-center py-12 text-red-500">مقاله پیدا نشد</p>;
  }

  return (
    <main className="flex justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="pb-6">
          <BreadCrumb />
        </div>
        <h1 className="text-xl md:text-3xl font-extrabold mb-4 text-gray-900 dark:text-white text-justify  ">
          {blog.title}
        </h1>


        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left gap-2 sm:gap-0">
          <span>By <strong>Admin</strong></span>
          <span>
            {new Date(blog.created_at).toLocaleDateString("fa-IR")} • {readingTime} دقیقه مطالعه
          </span>
        </div>

        {blog.image && (
          <div className="w-full mb-6">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-auto max-h-[500px] sm:max-h-[600px] md:max-h-[700px] object-cover rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
        )}


        <div
          className="space-y-6 text-gray-800 dark:text-white leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </main>
  );
};

export default SingleBlogPage;
