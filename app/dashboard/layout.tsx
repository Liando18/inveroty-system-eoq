"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType, useState } from "react";

type NavId =
  | "dashboard"
  | "produk"
  | "stok-masuk"
  | "stok-keluar"
  | "eoq"
  | "rop"
  | "laporan"
  | "pengaturan";

const IcoGrid = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IcoBox = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IcoIn = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="M8 11l4 4 4-4" />
    <path d="M3 18h18" />
  </svg>
);
const IcoOut = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 21V9" />
    <path d="M8 13l4-4 4 4" />
    <path d="M3 6h18" />
  </svg>
);
const IcoCalc = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="12" y2="14" />
    <line x1="8" y1="18" x2="10" y2="18" />
  </svg>
);
const IcoBell = () => (
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
);
const IcoChart = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const IcoGear = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93l-1.41 1.41M22 12h-2M19.07 19.07l-1.41-1.41M12 20v2M4.93 19.07l1.41 1.41M2 12h2M4.93 4.93l1.41 1.41M12 2v2" />
  </svg>
);
const IcoBellH = () => (
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
);
const IcoSearch = () => (
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
);
const IcoHamb = () => (
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
);
const IcoX = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoLogout = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MENU: {
  label: string;
  id: NavId;
  Icon: ComponentType;
  badge?: number;
}[] = [
  { label: "Dashboard", id: "dashboard", Icon: IcoGrid },
  { label: "Produk", id: "produk", Icon: IcoBox },
  { label: "Stok Masuk", id: "stok-masuk", Icon: IcoIn },
  { label: "Stok Keluar", id: "stok-keluar", Icon: IcoOut },
  { label: "Kalkulasi EOQ", id: "eoq", Icon: IcoCalc },
  { label: "ROP & Alert", id: "rop", Icon: IcoBell, badge: 3 },
  { label: "Laporan", id: "laporan", Icon: IcoChart },
  { label: "Pengaturan", id: "pengaturan", Icon: IcoGear },
];

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [active, setActive] = useState<NavId>("dashboard");

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div
        className={`flex items-center gap-3 border-b border-white/10 ${collapsed && !mobile ? "px-4 py-5 justify-center" : "px-5 py-4"}`}>
        <div className="w-9 h-9 rounded-xl bg-green-400/20 border border-green-400/30 flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-green-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        {(!collapsed || mobile) && (
          <div className="overflow-hidden">
            <p className="font-bold text-white text-sm leading-tight whitespace-nowrap">
              4Yos Veterinary
            </p>
            <p className="text-[10px] text-green-400/70 uppercase tracking-widest">
              Inventory System
            </p>
          </div>
        )}
        {mobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto text-white/50 hover:text-white">
            <IcoX />
          </button>
        )}
      </div>

      {(!collapsed || mobile) && (
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-green-700/40 border border-green-600/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">
              Admin
            </p>
            <p className="text-[10px] text-green-400/70 truncate">
              admin@4yos-vet.com
            </p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 shrink-0" />
        </div>
      )}

      {collapsed && !mobile && (
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs font-bold">
            A
          </div>
        </div>
      )}

      <p
        className={`text-[10px] font-bold text-green-500/60 uppercase tracking-widest mb-1 mt-3 ${collapsed && !mobile ? "text-center px-2" : "px-5"}`}>
        {collapsed && !mobile ? "—" : "Menu Utama"}
      </p>

      <nav className="flex-1 px-2 overflow-y-auto">
        {MENU.map(({ label, id, Icon, badge }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                setActive(id);
                if (mobile) setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 rounded-xl mb-0.5 transition-all duration-150 relative
                ${collapsed && !mobile ? "px-0 py-3 justify-center" : "px-3.5 py-2.5"}
                ${
                  isActive
                    ? "bg-green-500/25 text-white"
                    : "text-white/50 hover:bg-white/6 hover:text-white/80"
                }`}>
              <span
                className={`shrink-0 transition-colors ${isActive ? "text-green-300" : ""}`}>
                <Icon />
              </span>
              {(!collapsed || mobile) && (
                <span
                  className={`text-sm flex-1 text-left ${isActive ? "font-semibold" : "font-medium"}`}>
                  {label}
                </span>
              )}
              {(!collapsed || mobile) && badge && (
                <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
              {isActive && (!collapsed || mobile) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-400 rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 mt-2">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-white/40 hover:bg-white/6 hover:text-white/70 transition-all duration-150 ${collapsed && !mobile ? "justify-center px-0" : ""}`}>
          <IcoLogout />
          {(!collapsed || mobile) && (
            <span className="text-sm font-medium">Keluar</span>
          )}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-green-900 transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 260 }}>
        <SidebarContent mobile />
      </aside>

      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-green-900 sticky top-0 h-screen transition-all duration-300 overflow-hidden ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCollapsed((c) => !c);
                  setMobileOpen((o) => !o);
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all lg:hidden">
                <IcoHamb />
              </button>
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all hidden lg:flex">
                <IcoHamb />
              </button>
              <div className="hidden sm:block">
                <p className="font-bold text-gray-900 text-sm leading-tight">
                  {MENU.find((m) => m.id === active)?.label ?? "Dashboard"}
                </p>
                <p className="text-[11px] text-gray-400">
                  Selasa, 10 Maret 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden md:block">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <IcoSearch />
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
                  <IcoBellH />
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
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>

        <footer className="bg-white border-t border-gray-100 px-4 md:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-gray-400">
            © 2025{" "}
            <span className="font-semibold text-green-600">
              4Yos Veterinary Care
            </span>{" "}
            · Sistem Manajemen Persediaan PWA
          </p>
          <div className="flex gap-1.5">
            {["EOQ v2.1", "ROP Real-time", "PWA Ready"].map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
                {t}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
