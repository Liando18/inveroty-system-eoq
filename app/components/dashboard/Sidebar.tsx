"use client";

import { ComponentType } from "react";
import type { UserSession, UserRole } from "@/app/model/user.model";

export type NavId =
  | "dashboard"
  | "akun"
  | "supplier"
  | "kategori"
  | "produk"
  | "barang-masuk"
  | "barang-keluar"
  | "stok"
  | "analisis"
  | "laporan";

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
const IcoUser = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcoTruck = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IcoTag = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
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
const IcoLayers = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
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
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcoFile = () => (
  <svg
    className="w-[18px] h-[18px]"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

export const MENU: {
  label: string;
  id: NavId;
  Icon: ComponentType;
  roles: UserRole[];
}[] = [
  {
    label: "Dashboard",
    id: "dashboard",
    Icon: IcoGrid,
    roles: ["admin", "kasir", "gudang", "owner"],
  },
  { label: "Data Akun", id: "akun", Icon: IcoUser, roles: ["admin"] },
  {
    label: "Data Supplier",
    id: "supplier",
    Icon: IcoTruck,
    roles: ["admin", "gudang"],
  },
  {
    label: "Data Kategori",
    id: "kategori",
    Icon: IcoTag,
    roles: ["admin", "gudang"],
  },
  {
    label: "Data Produk",
    id: "produk",
    Icon: IcoBox,
    roles: ["admin", "gudang", "kasir"],
  },
  {
    label: "Barang Masuk",
    id: "barang-masuk",
    Icon: IcoIn,
    roles: ["admin", "gudang"],
  },
  {
    label: "Barang Keluar",
    id: "barang-keluar",
    Icon: IcoOut,
    roles: ["admin", "kasir"],
  },
  {
    label: "Stok",
    id: "stok",
    Icon: IcoLayers,
    roles: ["admin", "gudang", "owner"],
  },
  {
    label: "Analisis",
    id: "analisis",
    Icon: IcoChart,
    roles: ["admin", "owner"],
  },
  { label: "Laporan", id: "laporan", Icon: IcoFile, roles: ["admin", "owner"] },
];

interface SidebarProps {
  active: NavId;
  collapsed: boolean;
  mobile?: boolean;
  session: UserSession | null;
  onSelect: (id: NavId) => void;
  onClose?: () => void;
  onLogout: () => void;
}

export default function Sidebar({
  active,
  collapsed,
  mobile = false,
  session,
  onSelect,
  onClose,
  onLogout,
}: SidebarProps) {
  const initials = session?.nama
    ? session.nama
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
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
              4Yos Veterinary Care
            </p>
            <p className="text-[10px] text-green-400/70 uppercase tracking-widest">
              Inventory System
            </p>
          </div>
        )}
        {mobile && (
          <button
            onClick={onClose}
            className="ml-auto text-white/50 hover:text-white">
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
          </button>
        )}
      </div>

      {(!collapsed || mobile) && (
        <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-green-700/40 border border-green-600/30 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">
              {session?.nama ?? "Admin"}
            </p>
            <p className="text-[10px] text-green-400/70 truncate">
              {session?.email ?? ""}
            </p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400 shrink-0" />
        </div>
      )}

      {collapsed && !mobile && (
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>
      )}

      <p
        className={`text-[10px] font-bold text-green-500/60 uppercase tracking-widest mb-1 mt-3 ${collapsed && !mobile ? "text-center px-2" : "px-5"}`}>
        {collapsed && !mobile ? "—" : "Menu Utama"}
      </p>

      <nav className="flex-1 px-2 overflow-y-auto">
        {MENU.filter(
          ({ roles }) =>
            session?.role && roles.includes(session.role as UserRole),
        ).map(({ label, id, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                if (mobile) onClose?.();
              }}
              className={`w-full flex items-center gap-3 rounded-xl mb-0.5 transition-all duration-150 relative
                ${collapsed && !mobile ? "px-0 py-3 justify-center" : "px-3.5 py-2.5"}
                ${isActive ? "bg-green-500/25 text-white" : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"}`}>
              <span className={`shrink-0 ${isActive ? "text-green-300" : ""}`}>
                <Icon />
              </span>
              {(!collapsed || mobile) && (
                <span
                  className={`text-sm flex-1 text-left ${isActive ? "font-semibold" : "font-medium"}`}>
                  {label}
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
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-150 ${collapsed && !mobile ? "justify-center px-0" : ""}`}>
          <svg
            className="w-[18px] h-[18px] shrink-0"
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
          {(!collapsed || mobile) && (
            <span className="text-sm font-medium">Keluar</span>
          )}
        </button>
      </div>
    </div>
  );
}
