
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// ---------------- Cookie helpers ----------------
const setCookie = (name, value, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, null);
};

// ---------------- Axios ----------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // ---------------- Refresh token (NO refresh in body) ----------------
  const refreshAccessToken = async () => {
    try {
      const { data } = await refreshApi.post("/api/accounts/refresh/");

      setAccessToken(data.access);
      setCookie("access", data.access);

      return true;
    } catch {
      setAccessToken(null);
      setCookie("access", "", -1);
      return false;
    }
  };

  // ---------------- Axios interceptor ----------------
  useEffect(() => {
    setAccessToken(getCookie("access"))
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = accessToken || getCookie("access");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
          original._retry = true;
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            original.headers.Authorization = "Bearer " + getCookie("access");
            return api(original);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  // ---------------- Fetch user ----------------
  const fetchUser = async () => {
    const token = accessToken || getCookie("access");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/api/accounts/me/");
      setUser(data);
    } catch {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        const { data } = await api.get("/api/accounts/me/");
        setUser(data);
      } else {
        setUser(null);
      }
    }

    setLoading(false);
  };

  // ---------------- Login ----------------
  const login = async ({ username, password }) => {
    try {
      const { data } = await api.post("/api/accounts/login/", { username, password });

      setAccessToken(data.access);
      setCookie("access", data.access);

      // refresh_token cookie already set by Django (HttpOnly)

      await fetchUser();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || "Login failed" };
    }
  };



  // ---------------- Login with sms ---------------
const login_with_sms = async ({ phone, code }) => {
  try {
    const { data } = await api.post(
      "/api/accounts/login-phone/",
      { phone, code }
    );

    setAccessToken(data.access);
    setCookie("access", data.access);

    await fetchUser();
    return { success: true };

  } catch (err) {
    const res = err.response;

    return {
      success: false,
      status: res?.status,
      message: res?.data?.detail || "Login failed",
      lockout: res?.data?.lockout || null,
    };
  }
};





  // ---------------- Register ----------------
  const register = async ({ username, email, password, password2,discord,phone }) => {
    try {
      const { data } = await api.post("/api/accounts/register/", {
        username,
        email,
        password,
        password2,
        discord,
         phone
      });

      setAccessToken(data.access);
      setCookie("access", data.access);

      await fetchUser();
      return { success: true };
    } catch (err) {
      return { success: false, errors: err.response?.data };
    }
  };

  // ---------------- Logout ----------------
  const logout = async () => {
    try {
      await api.post("/api/accounts/logout/");
    } finally {
      setUser(null);
      setAccessToken(null);
      setCookie("access", "", -1);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
         accessToken,
         login_with_sms,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

