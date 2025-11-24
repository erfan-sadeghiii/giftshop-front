"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Swal from "sweetalert2";

const SubmitComment = ({ productId, setComments }) => {
  const { isAuthenticated, user, accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [recommend, setRecommend] = useState(null); // true/false for recommend
  const [loading, setLoading] = useState(false);

     const handleSubmit = async () => {
        if (!isAuthenticated) {
            Swal.fire("خطا", "لطفاً ابتدا وارد شوید", "warning");
            return;
        }

        if (!title || !text || recommend === null) {
            Swal.fire("خطا", "لطفاً تمام فیلدها را پر کنید", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/shop/comments/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        product: productId,
                        title,
                        content: text,
                        isLiked: recommend,
                    }),
                }
            );

            if (!response.ok) throw new Error("خطا در ثبت دیدگاه");

            const newComment = await response.json();

            // Add the new comment to the top of the list
            setComments((prev) => [newComment, ...prev]);

            Swal.fire("موفق", "دیدگاه شما ثبت شد", "success");

            // Clear form
            setTitle("");
            setText("");
            setRecommend(null);
        } catch (error) {
            Swal.fire("خطا", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="lg:w-1/4 flex flex-col w-full">
      <p className="font-DanaMedium text-lg mb-2">ثبت دیدگاه</p>
      <input disabled={!isAuthenticated}
        type="text"
        placeholder="عنوان"
        className="tailwind-input mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p className="text-gray-500 dark:text-white text-sm mb-4">
        این محصول را به دیگران پیشنهاد:
      </p>
      <div className="grid grid-cols-12 gap-4 mb-5">
        <button disabled={!isAuthenticated}
          className={`col-span-6 flex items-center justify-center gap-x-1 rounded-lg shadow py-2 font-DanaMedium transition-all duration-300 ${
            recommend === true
              ? "bg-green-100 text-green-600"
              : "text-green-600 ring-1 ring-transparent focus:ring-green-600"
          }`}
          onClick={() => setRecommend(true)}
        >
          <svg className="w-5 h-5">
            <use href="#hand-up" />
          </svg>
          میکنم
        </button>
        <button disabled={!isAuthenticated}
          className={`col-span-6 flex items-center justify-center gap-x-1 rounded-lg shadow py-2 font-DanaMedium transition-all duration-300 ${
            recommend === false
              ? "bg-red-100 text-red-500"
              : "text-red-500 ring-1 ring-transparent focus:ring-[#EF4343]"
          }`}
          onClick={() => setRecommend(false)}
        >
          <svg className="w-5 h-5">
            <use href="#hand-down" />
          </svg>
          نمیکنم
        </button>
      </div>
      <textarea
        className="h-24 tailwind-input mb-3"
        placeholder="متن دیدگاه"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!isAuthenticated}
      ></textarea>
      {
        isAuthenticated?<button onClick={handleSubmit}  disabled={loading} className="rounded-lg p-2 mt-3 bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50">
        {loading ? "در حال ارسال..." : "ثبت"}
      </button>:<p className="text-center text-red-600">برای نظر دادن ابتدا وارد شوید</p>
      }
    </div>
  );
};

export default SubmitComment;
