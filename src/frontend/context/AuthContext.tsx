"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "ADMIN" | "MEMBER";
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("jarvis_access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await apiRequest<User>("/api/auth/me/");
      if (res.success && res.data) {
        setUser(res.data);
      } else {
        localStorage.removeItem("jarvis_access_token");
        localStorage.removeItem("jarvis_refresh_token");
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiRequest<{
      access: string;
      refresh: string;
      user: User;
    }>("/api/auth/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data) {
      localStorage.setItem("jarvis_access_token", res.data.access);
      localStorage.setItem("jarvis_refresh_token", res.data.refresh);
      setUser(res.data.user);
      return { success: true, message: "Welcome back!" };
    }

    return {
      success: false,
      message: res.error?.message || "Invalid email or password.",
    };
  };

  const register = async (data: {
    email: string;
    password: string;
    password_confirm: string;
    first_name: string;
    last_name: string;
  }) => {
    const res = await apiRequest<User>("/api/auth/register/", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.success) {
      return { success: true, message: "Registration successful! You can now log in." };
    }

    return {
      success: false,
      message: res.error?.message || "Registration failed. Please check your details.",
    };
  };

  const logout = () => {
    localStorage.removeItem("jarvis_access_token");
    localStorage.removeItem("jarvis_refresh_token");
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
