"use client";

import Swal from "sweetalert2";

const ArticleCard = ({ article, isAdmin = false }) => {
  // Handle delete
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "آیا مطمئن هستید؟",
      text: "این مقاله برای همیشه حذف می‌شود!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${article.id}/`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("خطا در حذف مقاله");

        Swal.fire({
          title: "حذف شد!",
          text: "مقاله با موفقیت حذف شد.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // Optional: reload or trigger parent refresh
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        Swal.fire({
          title: "خطا!",
          text: "مشکلی در حذف مقاله پیش آمد.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="swiper-slide group article-box">
      <div className="relative overflow-hidden rounded-lg">
        <img src={article.image} className="article-box_img" alt={article.title} />
        <div className="absolute opacity-0 left-0 top-0 bottom-0 right-0 bg-black/60 flex items-center justify-center group-hover:opacity-100 duration-300 transition-all rounded-bl-3xl rounded-tr-3xl">
          <a
            href={`/blog/${article.id}`}
            className="flex items-center px-2 py-1 gap-x-1 font-DanaMedium rounded-lg border-2 border-white text-white"
          >
            <p>ادامه مطالب</p>
            <svg className="w-4 h-4 rotate-90">
              <use href="#chevron" />
            </svg>
          </a>
        </div>
      </div>

      <div className="flex flex-col h-20 gap-y-1 py-5 px-1">
        <h2 className="font-DanaDemiBold">{article.title}</h2>
      </div>

      <span className="flex w-full h-1 py-1 border-t border-gray-100 dark:border-white/10"></span>

      <div className="flex items-center justify-between text-sm px-1 pb-4">
        <span className="flex items-center gap-x-1 text-blue-500 dark:text-sky-400">
          <svg className="w-4 h-4">
            <use href="#calendar" />
          </svg>
          <p className="mt-1">{new Date(article.updated_at).toLocaleDateString("fa-IR")}</p>
        </span>

        {isAdmin && (
          <div className="flex gap-x-2">
            <button
              onClick={() => (window.location.href = `/admin/blog/edit/${article.id}`)}
              className="px-3 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              ویرایش
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition"
            >
              حذف
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
