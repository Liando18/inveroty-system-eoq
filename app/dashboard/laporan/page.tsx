"use client";

import Link from "next/link";

const cards = [
  {
    title: "Laporan Barang Masuk",
    desc: "Laporan transaksi barang masuk berdasarkan periode",
    href: "/dashboard/laporan/barang-masuk",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v12m0 0l-4-4m4 4l4-4M3 18h18"
        />
      </svg>
    ),
    color: "bg-blue-500",
  },
  {
    title: "Laporan Barang Keluar",
    desc: "Laporan transaksi barang keluar berdasarkan periode",
    href: "/dashboard/laporan/barang-keluar",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21V9m0 0l-4 4m4-4l4 4M3 6h18"
        />
      </svg>
    ),
    color: "bg-orange-500",
  },
  {
    title: "Laporan Stok",
    desc: "Laporan stok barang saat ini",
    href: "/dashboard/laporan/stok",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    color: "bg-green-500",
  },
];

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Laporan</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Pilih jenis laporan yang ingin Anda lihat
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200">
            <div
              className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center text-white mb-4`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-green-600 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
