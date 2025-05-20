import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { MessageCircle, Map } from "lucide-react";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetRequested, setIsResetRequested] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Authentication state will be handled by onAuthStateChanged in App.tsx
    } catch (err: any) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      console.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("กรุณากรอกอีเมลก่อนเพื่อรีเซ็ตรหัสผ่าน");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setIsResetRequested(true);
    } catch (err: any) {
      setError("ไม่สามารถส่งอีเมลได้ กรุณาตรวจสอบอีเมลให้ถูกต้อง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen login-bg flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden transform transition-all slide-in">
        <div className="bg-yellow-500 py-6 px-8">
          <div className="flex items-center justify-center gap-2 text-white">
            <Map size={32} className="animate-pulse" />
            <h1 className="text-2xl font-bold">ATSOKO Route Planner</h1>
          </div>
        </div>

        <div className="py-8 px-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Login for staff
          </h2>

          {error && (
            <div className="mb-4 text-sm text-white bg-red-500 p-3 rounded-md">
              {error}
            </div>
          )}

          {isResetRequested && (
            <div className="mb-4 text-sm text-white bg-green-500 p-3 rounded-md">
              ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="อีเมลของคุณ"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="รหัสผ่านของคุณ"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-yellow-500 text-white py-2 px-4 rounded-md font-medium transition-all duration-200
                ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-600"}
              `}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-yellow-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="py-4 bg-gray-50 text-center border-t">
          <p className="text-sm text-gray-600">
            &copy; 2025 ATSOKO Company. Copyright.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
