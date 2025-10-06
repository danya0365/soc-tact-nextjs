"use client";

import { useAuthPresenter } from "@/src/presentation/presenters/auth/useAuthPresenter";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordView() {
  const [state, actions] = useAuthPresenter();
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await actions.forgotPassword(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <span className="text-5xl">⚽</span>
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Soccer<span className="text-green-600">Tactics</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔑</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              ลืมรหัสผ่าน?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              ไม่ต้องกังวล เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณ
            </p>
          </div>

          {/* Success Message */}
          {state.success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <div>
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-1">
                    ส่งอีเมลสำเร็จ!
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs">
                    กรุณาตรวจสอบอีเมลของคุณและคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
                    (ถ้าไม่เจอ ลองดูในกล่องสแปม)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm text-center">
                {state.error}
              </p>
            </div>
          )}

          {!state.success ? (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    อีเมล
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    กรอกอีเมลที่คุณใช้สมัครสมาชิก
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={state.loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.loading ? "กำลังส่งอีเมล..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                >
                  ← กลับไปหน้าเข้าสู่ระบบ
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success Actions */}
              <div className="space-y-3">
                <Link
                  href="/auth/login"
                  className="block w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  กลับไปหน้าเข้าสู่ระบบ
                </Link>

                <button
                  onClick={() => {
                    actions.resetState();
                    setFormData({ email: "" });
                  }}
                  className="block w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  ส่งอีเมลอีกครั้ง
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  💡 <strong>เคล็ดลับ:</strong> ลิงก์รีเซ็ตรหัสผ่านจะหมดอายุภายใน 1
                  ชั่วโมง หากคุณไม่ได้รับอีเมล ลองตรวจสอบกล่องสแปมหรือส่งอีกครั้ง
                </p>
              </div>
            </>
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}
