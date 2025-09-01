import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "signup" | "signin" | "otp";

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { register, login, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.dateOfBirth
      );
      if (success) {
        setMode("otp");
        setMessage(
          "OTP sent to your email. Please verify to complete registration."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials or email not verified");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      setError("Please enter the OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const success = await verifyOtp(formData.email, formData.otp);
      if (success) {
        setMessage("Email verified successfully! You can now sign in.");
        setMode("signin");
        setFormData({ ...formData, otp: "", password: "" });
      } else {
        setError("Invalid or expired OTP");
      }
    } catch (error) {
      setError("OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const success = await resendOtp(formData.email);
      if (success) {
        setMessage("OTP resent successfully!");
      } else {
        setError("Failed to resend OTP");
      }
    } catch (error) {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const renderSignupForm = () => (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Your Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Jonas Khanwald"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="jonas_kahnwald@gmail.com"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? "Signing up..." : "Sign up"}
      </button>

      <p className="text-center text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("signin")}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </form>
  );

  const renderSigninForm = () => (
    <form onSubmit={handleSignin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="jonas_kahnwald@gmail.com"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-gray-600">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("signup")}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  );

  const renderOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Verify Your Email
        </h3>
        <p className="text-gray-600 text-sm">
          We've sent a verification code to <strong>{formData.email}</strong>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Enter OTP
        </label>
        <input
          type="text"
          name="otp"
          value={formData.otp}
          onChange={handleInputChange}
          placeholder="Enter 6-digit OTP"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-center text-base sm:text-lg tracking-widest"
          maxLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={loading}
          className="text-blue-600 hover:underline font-medium disabled:opacity-50"
        >
          Resend OTP
        </button>
      </div>

      <button
        type="button"
        onClick={() => setMode("signup")}
        className="w-full text-gray-600 hover:text-gray-800 font-medium"
      >
        ← Back to Sign up
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <span className="text-xl font-bold text-gray-800">HD</span>
          </div>

          {/* Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              {mode === "signup"
                ? "Sign up"
                : mode === "signin"
                ? "Sign in"
                : "Verify Email"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {mode === "signup"
                ? "Sign up to enjoy the feature of HD"
                : mode === "signin"
                ? "Welcome back! Please sign in to continue"
                : "Complete your registration by verifying your email"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Forms */}
          {mode === "signup" && renderSignupForm()}
          {mode === "signin" && renderSigninForm()}
          {mode === "otp" && renderOtpForm()}
        </div>
      </div>

      {/* Right side - Blue gradient background */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
        <div className="relative flex items-center justify-center w-full">
          <div className="w-64 h-64 xl:w-96 xl:h-96 relative">
            {/* Abstract blue shape similar to the image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transform rotate-45 scale-150 opacity-80"></div>
            <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transform -rotate-12 scale-125 opacity-90"></div>
            <div className="absolute inset-8 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full transform rotate-12 opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
