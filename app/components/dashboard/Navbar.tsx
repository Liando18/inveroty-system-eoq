"use client";

import { useState } from "react";
import { MENU, NavId } from "./Sidebar";
import { getSession } from "@/app/controller/auth.controller";

function formatTanggal() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface NavbarProps {
  active: NavId;
  onToggleSidebar: () => void;
}

export default function Navbar({ active, onToggleSidebar }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const session = getSession();

  const initials = session?.nama
    ? session.nama
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const roleLabel: Record<string, string> = {
    admin: "Administrator",
    kasir: "Kasir",
    gudang: "Staff Gudang",
    owner: "Owner",
  };

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
            <p className="text-[11px] text-gray-400">{formatTanggal()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900 text-sm">Notifikasi</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Belum ada notifikasi
                  </p>
                </div>
                <div className="px-4 py-8 text-center">
                  <svg
                    className="w-10 h-10 text-gray-200 mx-auto mb-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                  </svg>
                  <p className="text-xs text-gray-400">
                    Tidak ada notifikasi baru
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
            <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-gray-900 leading-none truncate max-w-[100px]">
                {session?.nama ?? "Pengguna"}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                {roleLabel[session?.role ?? ""] ?? session?.role ?? ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
