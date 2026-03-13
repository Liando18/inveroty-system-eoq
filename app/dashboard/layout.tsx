"use client";

import { useState } from "react";
import Sidebar, { NavId } from "@/app/components/dashboard/Sidebar";
import Navbar from "@/app/components/dashboard/Navbar";
import DashboardFooter from "@/app/components/dashboard/DashboardFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<NavId>("dashboard");

  const handleToggle = () => {
    setCollapsed((c) => !c);
    setMobileOpen((o) => !o);
  };

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
          onSelect={setActive}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-green-900 sticky top-0 h-screen transition-all duration-300 overflow-hidden ${collapsed ? "w-[72px]" : "w-[240px]"}`}>
        <Sidebar active={active} collapsed={collapsed} onSelect={setActive} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar active={active} onToggleSidebar={handleToggle} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
