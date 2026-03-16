"use client";

import Link from "next/link";

function formatTanggal() {
  return new Date().toLocaleDateString("id-ID", {
    year: "numeric",
  });
}

export default function LoginSidebar() {
  return (
    <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] shrink-0 bg-green-900 flex-col justify-between p-12 relative overflow-hidden">
      <div className="absolute -top-28 -right-20 w-72 h-72 rounded-full bg-green-400/10 pointer-events-none" />
      <div className="absolute top-1/3 -left-16 w-48 h-48 rounded-full bg-green-500/8 pointer-events-none" />
      <div className="absolute -bottom-20 right-1/4 w-56 h-56 rounded-full bg-emerald-400/10 pointer-events-none" />

      <Link href="/" className="relative z-10 inline-flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-green-500/30 border border-green-400/40 flex items-center justify-center shrink-0">
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
        <div>
          <p className="font-bold text-white text-sm">4Yos Veterinary Care</p>
          <p className="text-[10px] text-green-400/60 uppercase tracking-widest">
            Inventory System
          </p>
        </div>
      </Link>

      <div className="relative z-10 space-y-6">
        <div>
          <span className="inline-block bg-green-400/15 border border-green-400/25 rounded-full px-4 py-1 text-xs font-bold text-green-300 uppercase tracking-wider mb-5">
            Sistem Manajemen Persediaan · PWA
          </span>
          <h1 className="font-bold text-white leading-tight text-3xl xl:text-4xl">
            Kelola Stok
            <br />
            Lebih Cerdas
            <br />
            <span className="text-green-400">dengan EOQ & ROP</span>
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-xs">
            Platform inventori otomatis yang menghitung pesanan optimal dan
            memberi peringatan reorder sebelum terlambat.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              icon: "📊",
              head: "Kalkulasi EOQ Otomatis",
              sub: "Hitung Economic Order Quantity secara real-time",
            },
            {
              icon: "🔔",
              head: "Alert ROP Otomatis",
              sub: "Notifikasi saat stok mendekati titik reorder",
            },
            {
              icon: "📈",
              head: "Analitik & Laporan Lengkap",
              sub: "Dashboard visual untuk keputusan bisnis cerdas",
            },
          ].map((f) => (
            <div
              key={f.head}
              className="flex gap-3.5 p-4 bg-white/[0.06] border border-white/10 rounded-2xl backdrop-blur-sm">
              <span className="text-xl shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{f.head}</p>
                <p className="text-xs text-white/45 mt-0.5 leading-relaxed">
                  {f.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-xs text-white/20">
        © {formatTanggal()} 4Yos Veterinary Care. All rights reserved.
      </p>
    </div>
  );
}
