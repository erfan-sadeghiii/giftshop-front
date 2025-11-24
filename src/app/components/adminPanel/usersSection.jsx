"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from "@/context/AuthContext";

const UsersSection = () => {
  const [users, setUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/users/`;
    const {accessToken ,user:currentUser} = useAuth()


 

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "مشکلی در دریافت کاربران رخ داد.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (id) => {
    const confirm = await Swal.fire({
      title: "حذف کاربر؟",
      text: "آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "انصراف",
    });

    if (!confirm.isConfirmed) return;

    try {
      
      await axios.delete(`${apiUrl}${id}/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Swal.fire("حذف شد!", "کاربر با موفقیت حذف شد.", "success");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "حذف کاربر انجام نشد.", "error");
    }
  };

  // Toggle role (only owner can do this)
  const toggleRole = async (user) => {
    if (!currentUser || currentUser.role !== "owner") {
      Swal.fire("دسترسی غیرمجاز", "فقط مالک می‌تواند نقش‌ها را تغییر دهد.", "error");
      return;
    }

    const nextRole =
      user.role === "user" ? "admin" : user.role === "admin" ? "user" : "user";

    try {
      
      const res = await axios.patch(
        `${apiUrl}${user.id}/`,
        { role: nextRole },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      Swal.fire("بروزرسانی شد!", `نقش کاربر تغییر یافت به ${nextRole}.`, "success");
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: nextRole } : u))
      );
    } catch (err) {
      console.error(err);
      Swal.fire("خطا", "تغییر نقش انجام نشد.", "error");
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">در حال بارگذاری کاربران...</p>;

  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-white">مدیریت کاربران</h2>
      <table className="w-full text-left border-collapse text-sm text-gray-200">
        <thead>
          <tr className="bg-white/20">
            <th className="p-3">نام کاربری</th>
            <th className="p-3">ایمیل</th>
            <th className="p-3 text-center">نقش</th>
            <th className="p-3 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
              <td className="p-3">{user.username}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3 text-center">{user.role}</td>
              <td className="p-3 text-center flex justify-center gap-2">
                <button
                  onClick={() => toggleRole(user)}
                  disabled={currentUser?.role !== "owner" || user.role === "owner"}
                  className={`px-3 py-1 rounded-lg ${
                    currentUser?.role === "owner" && user.role !== "owner"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-gray-500 cursor-not-allowed text-gray-300"
                  }`}
                >
                  تغییر نقش
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  
                  className={`px-3 py-1 rounded-lg ${
                    currentUser?.role === "owner" && user.role !== "owner"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gray-500 cursor-not-allowed text-gray-300"
                  }`}
                  disabled={user.role === "owner"}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <p className="text-center text-gray-400 mt-4">هیچ کاربری یافت نشد.</p>
      )}
    </div>
  );
};

export default UsersSection;
