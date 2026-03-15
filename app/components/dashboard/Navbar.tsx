"use client";

import { useState, useEffect } from "react";
import { MENU, NavId } from "./Sidebar";
import { getSession } from "@/app/controller/auth.controller";
import { supabase } from "@/app/lib/supabase";

function formatTanggal() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface LowStockItem {
  id: number;
  produk_id: number;
  stok: number;
  minimum: number;
  produk?: {
    nama: string;
  };
}

interface NavbarProps {
  active: NavId;
  onToggleSidebar: () => void;
}

export default function Navbar({ active, onToggleSidebar }: NavbarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  
  const fetchLowStock = async () => {
    setLoading(true);
    try {
      const { data: allStok } = await supabase
        .from("stok")
        .select("*, produk(nama)");

      const lowStock = (allStok || []).filter(
        (item) => item.stok <= item.minimum,
      );
      setLowStockItems(lowStock);
    } catch (error) {
      console.error("Error fetching low stock:", error);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    if (notifOpen) {
      fetchLowStock();
    }
  }, [notifOpen]);

  
  useEffect(() => {
    const channel = supabase
      .channel("navbar-stock-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "stok",
        },
        () => {
          
          if (notifOpen) {
            fetchLowStock();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notifOpen]);

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
              {}
              {lowStockItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {lowStockItems.length > 9 ? "9+" : lowStockItems.length}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">Notifikasi</p>
                  <button
                    onClick={fetchLowStock}
                    className="text-xs text-green-600 hover:text-green-700">
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : lowStockItems.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <svg
                      className="w-10 h-10 text-green-200 mx-auto mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5">
                      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                    <p className="text-xs text-gray-400">Semua stok aman ✓</p>
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 border-b border-gray-50 hover:bg-red-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <svg
                              className="w-4 h-4 text-red-600"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2">
                              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              Stok Menipis
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {item.produk?.nama || "Produk"}
                            </p>
                            <p className="text-[10px] text-red-600 font-medium mt-0.5">
                              Stok: {item.stok} / Minimum: {item.minimum}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {lowStockItems.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 text-center">
                    <p className="text-[10px] text-gray-500">
                      {lowStockItems.length} produk stoknya di bawah minimum
                    </p>
                  </div>
                )}
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
