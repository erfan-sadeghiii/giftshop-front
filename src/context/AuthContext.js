
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

// ---------------- Axios instances ----------------
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// separate instance (no interceptors) only for refreshing tokens
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  // ---------------- Refresh token ----------------
  const refreshAccessToken = async () => {
   
    
    const refresh = getCookie("refresh2");
    if (!refresh) return false;

    try {
      const { data } = await refreshApi.post("/api/accounts/refresh/", { refresh });
      setAccessToken(data.access);
      setCookie("access2", data.access);
      return true;
    } catch (err) {
      console.error("Refresh failed:", err);
      setAccessToken(null);
      setCookie("access2", "", -1);
      setCookie("refresh2", "", -1);
      return false;
    }
  };

  // ---------------- Axios interceptor ----------------
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      const token = accessToken || getCookie("access2");
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            const newToken = getCookie("access2");
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api.request(originalRequest);
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

  // ---------------- Fetch current user ----------------
  const fetchUser = async (retry = true) => {
    const token = accessToken || getCookie("access2");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      await refreshAccessToken();
      const { data } = await api.get("/api/accounts/me/");
      setUser(data);
    } catch (err) {
      if (err.response?.status === 401 && retry) {
        const refreshed = await refreshAccessToken();
        
        
        if (refreshed) return fetchUser(false);
        setUser(null);
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Login ----------------
  const login = async ({ username, password }) => {
    try {
      const { data } = await api.post("/api/accounts/login/", { username, password });
      setAccessToken(data.access);
      setCookie("access2", data.access);
      setCookie("refresh2", data.refresh);
      await fetchUser();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || "Login failed" };
    }
  };

  // ---------------- Register ----------------
  const register = async ({ username, email, password, password2 }) => {
    try {
      const { data } = await api.post("/api/accounts/register/", {
        username,
        email,
        password,
        password2,
      });
      setAccessToken(data.access);
      setCookie("access2", data.access);
      setCookie("refresh2", data.refresh);
      await fetchUser();
      return { success: true };
    } catch (err) {
      return { success: false, errors: err.response?.data || { detail: "Registration failed" } };
    }
  };

  // ---------------- Logout ----------------
  const logout = async () => {
    try {
      await api.post("/api/accounts/logout/");
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      setAccessToken(null);
      setCookie("access2", "", -1);
      setCookie("refresh2", "", -1);
      window.location.href = "/";
    }
  };

  // ---------------- Initialize ----------------
  useEffect(() => {
    (async () => {
      await fetchUser();
    })();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        accessToken,
        api,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

