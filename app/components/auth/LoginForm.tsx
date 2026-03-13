"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <p className="font-bold text-green-900 text-sm">
            4Yos Veterinary Care
          </p>
        </div>
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-green-600 transition-colors">
          ← Beranda
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center mb-5 shadow-lg shadow-green-200">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat Datang Kembali
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              Masuk untuk mengelola persediaan 4Yos Veterinary Care
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
              <svg
                className="w-4 h-4 text-red-500 mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="admin@4yos-vet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 outline-none focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full pl-11 pr-28 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 outline-none focus:bg-white focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600 hover:text-green-800 transition-colors px-2 py-1">
                  {showPw ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-green-600"
                />
                <span className="text-sm text-gray-600">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-green-600 hover:text-green-800 transition-colors">
                Lupa password?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 transition-all duration-200
                ${
                  loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 active:translate-y-0"
                }`}>
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-2xl">
            <p className="text-xs font-bold text-green-700 flex items-center gap-2 mb-2">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Akses Demo
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="bg-white rounded-lg px-3 py-2 border border-green-100">
                <p className="text-[10px] text-gray-400 mb-0.5">Email</p>
                <p className="font-bold text-gray-800">admin@4yos-vet.com</p>
              </div>
              <div className="bg-white rounded-lg px-3 py-2 border border-green-100">
                <p className="text-[10px] text-gray-400 mb-0.5">Password</p>
                <p className="font-bold text-gray-800">admin123</p>
              </div>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-gray-400">
            <Link
              href="/"
              className="font-medium text-green-600 hover:text-green-800 transition-colors">
              ← Kembali ke Halaman Utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
