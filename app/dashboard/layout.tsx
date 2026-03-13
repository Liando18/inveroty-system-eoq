"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/app/controller/auth.controller";
import type { UserSession } from "@/app/model/user.model";
import Sidebar, { NavId } from "@/app/components/dashboard/Sidebar";
import Navbar from "@/app/components/dashboard/Navbar";
import DashboardFooter from "@/app/components/dashboard/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [checked, setChecked] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<NavId>("dashboard");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setSession(s);
    setChecked(true);
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function handleToggle() {
    setCollapsed((c) => !c);
    setMobileOpen((o) => !o);
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
          onSelect={setActive}
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
          onSelect={setActive}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar active={active} onToggleSidebar={handleToggle} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
