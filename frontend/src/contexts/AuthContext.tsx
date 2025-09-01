import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { BASE_URL } from "../config/api";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    dob: string
  ) => Promise<boolean>;
  verifyOtp: (email: string, otp: string) => Promise<boolean>;
  resendOtp: (email: string) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check if user is already authenticated on app start
  useEffect(() => {
    // Check if user data exists in localStorage or session
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch (error) {
        console.log("Invalid user data in localStorage");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    dob: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        { name, email, password, dob },
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        return true;
      } else {
        throw new Error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/verify-otp`,
        { email, otp },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      return false;
    }
  };

  const resendOtp = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/resend-otp`,
        { email },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return true;
      } else {
        throw new Error(response.data.message || "Resend OTP failed");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Store user data in localStorage after successful login
        const userData = { name: response.data.user?.name || email, email };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        return true;
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    register,
    verifyOtp,
    resendOtp,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
