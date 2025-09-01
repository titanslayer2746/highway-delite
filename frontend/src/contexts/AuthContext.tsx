import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";

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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/auth/dashboard",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const data = response.data;
        // Extract user name from the welcome message
        const nameMatch = data.message.match(/Welcome to the dashboard, (.+)/);
        if (nameMatch) {
          setUser({ name: nameMatch[1], email: "" }); // We don't get email from dashboard endpoint
        }
      }
    } catch (error) {
      console.log("Not authenticated");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    dob: string
  ): Promise<boolean> => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
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
        "http://localhost:3000/api/auth/verify-otp",
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
        "http://localhost:3000/api/auth/resend-otp",
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
        "http://localhost:3000/api/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // After successful login, check auth to get user data
        await checkAuth();
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
        "http://localhost:3000/api/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
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
