"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/97 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-white/80 backdrop-blur-md"}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-200">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-green-900 text-base leading-none">
              4Yos
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Veterinary Care
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-all">
              {l}
            </a>
          ))}
          <button
            onClick={() =>
              window.dispatchEvent(new Event("trigger-pwa-install"))
            }
            className="ml-2 px-4 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-bold shadow-sm shadow-green-100 hover:bg-green-100 transition-all">
            Install
          </button>
          <Link
            href="/login"
            className="ml-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-px transition-all">
            Masuk Sistem
          </Link>
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            {mobileMenu ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileMenu && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-1">
          {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              onClick={() => setMobileMenu(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all">
              {l}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenu(false);
                window.dispatchEvent(new Event("trigger-pwa-install"));
              }}
              className="block w-full text-center px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 text-sm font-bold hover:bg-green-100 transition-all">
              Install
            </button>
            <Link
              href="/login"
              className="block w-full text-center px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all">
              Masuk Sistem
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
