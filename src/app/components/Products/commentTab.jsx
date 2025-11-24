"use client";


import { useState } from "react";
import SubmitComment from "./submitComment";

const CommentTab = ({
    initialComments,
    
    showAllComments,
    toggleComments,
    productId,
}) => {
const [comments, setComments] = useState(initialComments || []);
    // Sort comments newest first
    const sortedComments = [...comments].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
        <div className="tab-content tab3 block w-full">
            <div className="flex items-center gap-x-2 mb-6">
                <h2 className="font-DanaMedium text-2xl">دیدگاه‌ها</h2>
                <p className="text-sm text-blue-500">({comments.length} دیدگاه)</p>
            </div>

            <div className="w-full flex flex-col md:flex-row items-start gap-10">
                {/* Submit Comment */}
                <SubmitComment productId={productId} setComments={setComments}  />

                {/* Comments List */}
                <ul className="lg:w-3/4 flex flex-col gap-y-2">
                    {sortedComments
                        .slice(0, showAllComments ? undefined : 3)
                        .map((comment) => (
                            <li
                                key={comment.id}
                                className="flex flex-col py-4 border-b border-gray-200 dark:border-b-gray-200/20"
                            >
                                <div className="flex items-center gap-x-2">
                                    <h2 className="font-DanaMedium text-lg mb-1">{comment.title}</h2>
                                    <span className="px-2 py-1 mb-2 rounded-lg bg-blue-500 text-white text-xs">
                                        خریدار
                                    </span>
                                </div>
                                <div className="flex-col">
                                    <h2
                                        className={`flex items-center gap-x-1 mb-4 ${comment.isLiked ? "text-green-500" : "text-red-500"
                                            }`}
                                    >
                                        <svg className="w-4 h-4">
                                            <use href={comment.isLiked ? "#hand-up" : "#hand-down"} />
                                        </svg>
                                        {comment.isLiked ? "پیشنهاد میشود" : "پیشنهاد نمیشود"}
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-200 mb-2">
                                        {comment.content}
                                    </p>
                                </div>
                                <div className="mt-2 lg:mt-0 flex-col lg:flex-row gap-y-2 lg:items-center justify-between flex">
                                    <div className="flex items-center gap-x-4 text-gray-400 text-sm">
                                        <p>{new Date(comment.date).toLocaleDateString("fa-IR")}</p>
                                        <p>{comment.user}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    {!showAllComments && comments.length > 3 && (
                        <button
                            className="w-full flex items-center justify-center gap-x-1 my-4 text-blue-600 dark:text-blue-400 font-DanaMedium"
                            onClick={toggleComments}
                        >
                            <p>مشاهده بیشتر</p>
                            <svg className="size-4 more-comment-icon">
                                <use href="#chevron" />
                            </svg>
                        </button>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CommentTab;
