"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

// 🔹 Persian date formatter
const formatPersianDate = (isoString) => {
  if (!isoString) return "بدون تاریخ";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

// 🔹 Ticket status order for sorting
const STATUS_ORDER = { open: 0, pending: 1, closed: 2 };

// 🔹 Helper to get badge colors
const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "closed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// 🔹 Sort tickets by status
const sortTickets = (tickets) =>
  [...tickets].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

const TicketSystem = ({ isAdmin = false }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", content: "", file: null });
  const [replyContent, setReplyContent] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { accessToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 🔹 Fetch tickets (which already contain replies)
  useEffect(() => {
    if (!accessToken) return;

    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_URL}/shop/tickets/`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "خطا در بارگذاری",
          text: "بارگذاری تیکت‌ها با مشکل مواجه شد.",
          confirmButtonText: "باشه",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [API_URL, accessToken]);

  // 🔹 Add new ticket
  const handleAddTicket = async () => {
    if (!newTicket.title || !newTicket.content) {
      Swal.fire({
        icon: "warning",
        title: "ورودی ناقص",
        text: "لطفاً عنوان و متن تیکت را وارد کنید.",
        confirmButtonText: "باشه",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", newTicket.title);
    formData.append("content", newTicket.content);
    if (newTicket.file) formData.append("file", newTicket.file);

    try {
      const res = await fetch(`${API_URL}/shop/tickets/`, {
        method: "POST",
        credentials: "include",
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit ticket");
      const createdTicket = await res.json();

      setTickets((prev) => [...prev, createdTicket]);
      setNewTicket({ title: "", content: "", file: null });
      setIsModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "تیکت با موفقیت ثبت شد",
        text: "تیکت شما ارسال شد و به زودی بررسی می‌شود.",
        confirmButtonText: "باشه",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا در ارسال تیکت",
        text: "ارسال تیکت با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
        confirmButtonText: "باشه",
      });
    }
  };

  // 🔹 Send reply
  const handleSendReply = async () => {
    if (!replyContent) {
      Swal.fire({
        icon: "warning",
        title: "متن پاسخ خالی است",
        text: "لطفاً محتوای پاسخ را وارد کنید.",
        confirmButtonText: "باشه",
      });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/shop/replies/`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ticket: selectedTicket.id,
          content: replyContent,
        }),
      });

      if (!res.ok) throw new Error("Failed to send reply");
      const newReply = await res.json();

      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, replies: [...t.replies, newReply] }
            : t
        )
      );

      setReplyContent("");
      setReplyModalOpen(false);

      Swal.fire({
        icon: "success",
        title: "پاسخ ارسال شد",
        text: "پاسخ شما با موفقیت ثبت شد.",
        confirmButtonText: "باشه",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "خطا در ارسال پاسخ",
        text: "ارسال پاسخ با مشکل مواجه شد.",
        confirmButtonText: "باشه",
      });
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-DanaDemiBold text-lg">تیکت‌ها</h2>

        {!isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            + افزودن تیکت
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      ) : tickets.length === 0 ? (
        <p className="text-center">در حال حاضر تیکتی برای نمایش وجود ندارد</p>
      ) : (
        <ul className="space-y-3">
          {sortTickets(tickets).map((ticket) => (
            <li
              key={ticket.id}
              className="p-3 border rounded-lg shadow-sm dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-DanaMedium py-4 text-base">({ticket.user_name}) : {ticket.title}</h3>
                  

                <div className="flex items-center gap-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status === "open"
                      ? "باز"
                      : ticket.status === "pending"
                      ? "در انتظار"
                      : "بسته"}
                  </span>

                  <span className="text-xs text-gray-400 mt-2">
                    {formatPersianDate(ticket.dateTime)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{ticket.content}</p>

              {ticket.file && (
                <a
                  href={ticket.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block my-2 text-xs text-blue-500 underline"
                >
                  مشاهده فایل پیوست
                </a>
              )}

              {/* 🔹 Replies */}
              {ticket.replies?.length > 0 && (
                <div className="mt-4 border-t pt-3 space-y-2">
                  {ticket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="font-DanaMedium text-gray-800 dark:text-gray-200">
                          (admin) {reply.user_name || "پاسخ"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatPersianDate(reply.dateTime)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-x-2 mt-4">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setReplyModalOpen(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                      پاسخ
                    </button>

                    {/* 🔹 Admin status toggle */}
                    <select
                      value={ticket.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const res = await fetch(
                            `${API_URL}/shop/tickets/${ticket.id}/`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`,
                              },
                              body: JSON.stringify({ status: newStatus }),
                            }
                          );
                          if (!res.ok) throw new Error("Failed to update status");
                          const updatedTicket = await res.json();
                          setTickets((prev) =>
                            prev.map((t) => (t.id === ticket.id ? updatedTicket : t))
                          );
                        } catch (err) {
                          console.error(err);
                          Swal.fire({
                            icon: "error",
                            title: "خطا در تغییر وضعیت",
                            text: "لطفاً دوباره تلاش کنید.",
                            confirmButtonText: "باشه",
                          });
                        }
                      }}
                      className="border bg-gray-800 rounded-lg p-1 text-sm"
                    >
                      <option value="open">باز</option>
                      <option value="pending">در انتظار</option>
                      <option value="closed">بسته</option>
                    </select>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 🔹 New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="font-DanaDemiBold text-lg mb-4">ایجاد تیکت جدید</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="عنوان تیکت"
                value={newTicket.title}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <textarea
                placeholder="محتوای تیکت"
                rows="4"
                value={newTicket.content}
                onChange={(e) =>
                  setNewTicket({ ...newTicket, content: e.target.value })
                }
                className="w-full p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-900"
              />
              <input
                type="file"
                onChange={(e) =>
                  setNewTicket({ ...newTicket, file: e.target.files[0] })
                }
                className="w-full text-sm"
              />
            </div>

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
              >
                انصراف
              </button>
              <button
                onClick={handleAddTicket}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
              >
                ثبت تیکت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Reply Modal */}
      {replyModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="font-DanaDemiBold text-lg mb-4">
              پاسخ به: {selectedTicket.title}
            </h2>

            <textarea
              placeholder="متن پاسخ..."
              rows="4"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="w-full p-2 border rounded-lg dark:border-gray-700 dark:bg-gray-900"
            />

            <div className="flex justify-end gap-x-2 mt-6">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
              >
                انصراف
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition"
              >
                ارسال پاسخ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketSystem;
