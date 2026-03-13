"use client";

import { useState } from "react";
import { MENU, NavId } from "./Sidebar";

const NOTIFS = [
  {
    text: "Advantage II Cat stok kritis (3 pcs)",
    time: "5 mnt",
    dot: "bg-red-400",
  },
  {
    text: "Royal Canin Kitten diterima (24 unit)",
    time: "32 mnt",
    dot: "bg-green-400",
  },
  { text: "EOQ diperbarui untuk 5 produk", time: "2 jam", dot: "bg-blue-400" },
  {
    text: "Stok NexGard hampir habis (2 unit)",
    time: "3 jam",
    dot: "bg-amber-400",
  },
];

interface NavbarProps {
  active: NavId;
  onToggleSidebar: () => void;
}

export default function Navbar({ active, onToggleSidebar }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <div className="hidden sm:block">
            <p className="font-bold text-gray-900 text-sm leading-tight">
              {MENU.find((m) => m.id === active)?.label ?? "Dashboard"}
            </p>
            <p className="text-[11px] text-gray-400">Selasa, 10 Maret 2026</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              placeholder="Cari produk…"
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 bg-gray-50 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 w-44 lg:w-52 transition-all"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition-all">
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      Notifikasi
                    </p>
                    <p className="text-[11px] text-gray-400">
                      4 notifikasi baru
                    </p>
                  </div>
                  <button className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors">
                    Tandai Semua
                  </button>
                </div>
                {NOTIFS.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 flex gap-3 items-start hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${n.dot} shrink-0 mt-1.5`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 leading-relaxed">
                        {n.text}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {n.time} yang lalu
                      </p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors">
                    Lihat Semua Notifikasi
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none">
                Admin
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
