"use client";

const ProductRating = ({ comments = [] }) => {
  // Calculate average rating
  const avgRating =
    comments.length > 0
      ? comments.reduce((acc, c) => acc + (c.isLiked ? 5 : 3), 0) / comments.length
      : 0;

  const totalReviews = comments.length;

  return (
    <div className="flex items-center gap-x-2">
      {/* Average rating */}
      <span className="flex items-center gap-x-1 text-sm">
        <svg className="size-4 text-yellow-400 mb-1.5">
          <use href="#star" />
        </svg>
        {avgRating.toFixed(1)}{" "}
        <span className="text-gray-300 dark:text-gray-500">
          (امتیاز {totalReviews} خریدار)
        </span>
      </span>

      {/* Total comments */}
      <span className="h-6 bg-slate-100 text-gray-400 dark:bg-slate-700 dark:text-gray-400 flex items-center justify-center rounded-full px-2 text-xs font-DanaMedium pt-1">
        {totalReviews} دیدگاه
      </span>
    </div>
  );
};

export default ProductRating;
