"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getSession, logout } from "@/app/controller/auth.controller";
import type { UserSession } from "@/app/model/user.model";
import Sidebar, { NavId } from "@/app/components/dashboard/Sidebar";
import Navbar from "@/app/components/dashboard/Navbar";
import DashboardFooter from "@/app/components/dashboard/DashboardFooter";
import NextTopLoader from "nextjs-toploader";
import NotificationProvider from "@/app/components/dashboard/NotificationProvider";

const PATH_MAP: Record<string, NavId> = {
  "/dashboard": "dashboard",
  "/dashboard/data-akun": "akun",
  "/dashboard/data-supplier": "supplier",
  "/dashboard/data-kategori": "kategori",
  "/dashboard/data-produk": "produk",
  "/dashboard/barang-masuk": "barang-masuk",
  "/dashboard/barang-keluar": "barang-keluar",
  "/dashboard/stok": "stok",
  "/dashboard/analisis": "analisis",
  "/dashboard/laporan": "laporan",
};

const NAV_PATH: Record<NavId, string> = {
  dashboard: "/dashboard",
  akun: "/dashboard/data-akun",
  supplier: "/dashboard/data-supplier",
  kategori: "/dashboard/data-kategori",
  produk: "/dashboard/data-produk",
  "barang-masuk": "/dashboard/barang-masuk",
  "barang-keluar": "/dashboard/barang-keluar",
  stok: "/dashboard/stok",
  analisis: "/dashboard/analisis",
  laporan: "/dashboard/laporan",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<UserSession | null>(null);
  const [checked, setChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const active: NavId = PATH_MAP[pathname] ?? "dashboard";

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    setChecked(true);
  }, [router]);

  useEffect(() => {
    setPageLoading(true);
    const t = setTimeout(() => setPageLoading(false), 400);
    return () => clearTimeout(t);
  }, [pathname]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function handleSelect(id: NavId) {
    router.push(NAV_PATH[id]);
    setMobileOpen(false);
  }

  function handleToggle() {
    if (window.innerWidth < 1024) {
      setMobileOpen((o) => !o);
    } else {
      setCollapsed((c) => !c);
    }
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NextTopLoader
        color="#16a34a"
        height={3}
        showSpinner={false}
        shadow="0 0 10px #16a34a,0 0 5px #16a34a"
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-green-900 transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: 260 }}>
        <Sidebar
          active={active}
          collapsed={false}
          mobile
          session={session}
          onSelect={handleSelect}
          onClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-green-900 sticky top-0 h-screen transition-all duration-300 overflow-hidden ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
        <Sidebar
          active={active}
          collapsed={collapsed}
          session={session}
          onSelect={handleSelect}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar active={active} onToggleSidebar={handleToggle} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative">
          {pageLoading && (
            <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px] flex items-start justify-center pt-20 z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400 font-medium">
                  Memuat halaman...
                </p>
              </div>
            </div>
          )}
          <div
            style={{
              opacity: pageLoading ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}>
            <NotificationProvider>{children}</NotificationProvider>
          </div>
        </main>
        <DashboardFooter />
      </div>
    </div>
  );
}
