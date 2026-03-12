"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";

const SERVICES = [
  {
    icon: "🩺",
    title: "Pemeriksaan & Pengobatan",
    desc: "Diagnosa dan pengobatan oleh dokter berpengalaman dengan peralatan medis modern.",
  },
  {
    icon: "🏥",
    title: "Rawat Inap",
    desc: "Perawatan intensif 24 jam dengan pemantauan penuh untuk pemulihan optimal.",
  },
  {
    icon: "🛒",
    title: "Pet Shop Lengkap",
    desc: "Makanan premium, aksesoris, dan obat-obatan pilihan untuk hewan peliharaan.",
  },
  {
    icon: "💉",
    title: "Vaksinasi",
    desc: "Program vaksinasi terstruktur untuk menjaga kekebalan hewan peliharaan Anda.",
  },
  {
    icon: "✂️",
    title: "Grooming",
    desc: "Perawatan penampilan profesional agar hewan selalu bersih dan nyaman.",
  },
  {
    icon: "💬",
    title: "Konsultasi Dokter",
    desc: "Sesi konsultasi langsung untuk pencegahan dan deteksi dini penyakit.",
  },
];

const STATS = [
  { val: "7+", label: "Tahun Pengalaman" },
  { val: "2000+", label: "Pasien Ditangani" },
  { val: "14 Jam", label: "Layanan/Hari" },
  { val: "6", label: "Jenis Layanan" },
];

const INFO = [
  {
    icon: "⏰",
    title: "Jam Operasional",
    lines: ["Sel – Sen: 08.00 – 22.00", "Kamis: 08.00 – 21.30"],
  },
  {
    icon: "📍",
    title: "Lokasi",
    lines: ["Jl. Durian Tarung No.10", "Kec. Kuranji, Padang"],
  },
  {
    icon: "📞",
    title: "Telepon",
    lines: ["+62 822-8631-6881", "Tersedia konsultasi"],
  },
  {
    icon: "💡",
    title: "Tips Kunjungan",
    lines: ["Hindari Senin pagi", "Sepi: Selasa & Kamis malam"],
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.from("produk").select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    testConnection();
  }, []);

  return (
    <div className="text-gray-900 bg-white">
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/97 backdrop-blur-xl border-b border-gray-200 shadow-sm" : "bg-white/80 backdrop-blur-md"}`}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-200">
              <svg
                className="w-5 h-5 text-white"
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
              <p className="font-bold text-green-900 text-base leading-none">
                4Yos
              </p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                Veterinary Care
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-green-50 hover:text-green-700 transition-all">
                {l}
              </a>
            ))}
            <Link
              href="/login"
              className="ml-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold shadow-md shadow-green-200 hover:bg-green-700 hover:-translate-y-px transition-all">
              Masuk Sistem
            </Link>
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              {mobileMenu ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-5 py-4 space-y-1">
            {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMobileMenu(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all">
                {l}
              </a>
            ))}
            <div className="pt-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-3 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-all">
                Masuk Sistem
              </Link>
            </div>
          </div>
        )}
      </nav>

      <section
        id="beranda"
        className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/40 to-white flex items-center pt-16 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-green-400/8 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-emerald-300/6 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                Klinik Hewan · Padang, Sumatera Barat
              </span>
            </div>

            <h1 className="font-bold leading-tight mb-5 text-3xl sm:text-4xl lg:text-5xl">
              Kesehatan Hewan
              <br />
              <span className="text-green-600">Peliharaan Anda</span>
              <br />
              Adalah Prioritas Kami
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-lg mb-8">
              4Yos Veterinary Care hadir memberikan perawatan terbaik —
              pemeriksaan, pengobatan, rawat inap, hingga pet shop lengkap di
              Padang, Sumatera Barat.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#layanan"
                className="px-7 py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm shadow-lg shadow-green-200 hover:bg-green-700 hover:-translate-y-0.5 transition-all">
                Lihat Layanan →
              </a>
              <a
                href="tel:+6282286316881"
                className="px-7 py-3.5 rounded-xl bg-white text-green-700 font-semibold text-sm border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all">
                Hubungi Kami
              </a>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-green-100">
              {STATS.map((s) => (
                <div key={s.label} className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-green-600">
                    {s.val}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium mt-1 leading-tight">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-green-700 px-5 sm:px-6 py-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">
                    4Yos Veterinary Care
                  </p>
                  <p className="text-white/60 text-xs mt-0.5">
                    Jl. Durian Tarung No.10, Padang
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                  <span className="text-white text-xs font-semibold">Buka</span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Layanan Tersedia
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["🩺", "Pemeriksaan"],
                    ["🏥", "Rawat Inap"],
                    ["🛒", "Pet Shop"],
                    ["💉", "Vaksinasi"],
                  ].map(([ic, lb]) => (
                    <div
                      key={lb as string}
                      className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                      <span className="text-base">{ic}</span>
                      <span className="text-sm font-semibold text-green-800">
                        {lb}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 px-5 sm:px-6 py-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Jam Operasional
                </p>
                {[
                  ["Selasa – Rabu", "08.00 – 22.00"],
                  ["Kamis", "08.00 – 21.30"],
                  ["Jumat – Senin", "08.00 – 22.00"],
                ].map(([d, t]) => (
                  <div
                    key={d}
                    className="flex justify-between items-center mb-2 last:mb-0">
                    <span className="text-sm text-gray-500">{d}</span>
                    <span className="text-sm font-bold text-green-700">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -top-3 -right-3 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
              Terpercaya di Padang ⭐
            </div>
            <div className="absolute -bottom-3 -left-3 bg-white border border-gray-200 text-gray-800 text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
              📞 +62 822-8631-6881
            </div>
          </div>
        </div>
      </section>

      <section id="layanan" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
              LAYANAN KAMI
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Perawatan Lengkap untuk
              <br />
              Sahabat Berbulu Anda
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              Dokter berpengalaman dan fasilitas modern untuk kesehatan optimal
              hewan peliharaan Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-250">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl mb-5">
                  {s.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2.5">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tentang" className="bg-green-800">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            {INFO.map((item, i) => (
              <div
                key={item.title}
                className={`px-6 sm:px-9 py-10 sm:py-14 ${i === 0 || i === 2 ? "" : ""}`}>
                <div className="text-2xl mb-4">{item.icon}</div>
                <p className="font-bold text-white text-sm mb-2.5">
                  {item.title}
                </p>
                {item.lines.map((l) => (
                  <p key={l} className="text-white/50 text-xs leading-loose">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
              LOKASI & KONTAK
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-5">
              Temukan Kami di
              <br />
              Kota Padang
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
              Berlokasi strategis di Kecamatan Kuranji, mudah dijangkau dari
              berbagai penjuru kota Padang.
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Alamat",
                  text: "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175",
                },
                { label: "Telepon", text: "+62 822-8631-6881" },
                {
                  label: "Jam Buka",
                  text: "Selasa – Senin: 08.00–22.00  |  Kamis: 08.00–21.30",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="p-4 bg-white border border-gray-200 rounded-xl">
                  <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">
                    {c.label}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl h-64 sm:h-80 shadow-lg flex flex-col items-center justify-center gap-4 p-8">
            <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-3xl">
              📍
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900">4Yos Veterinary Care</p>
              <p className="text-sm text-gray-500 mt-1">
                Jl. Durian Tarung No.10, Kec. Kuranji, Padang
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=4Yos+Veterinary+Care+Padang"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md shadow-green-200 hover:bg-green-700 transition-colors">
              Buka di Google Maps →
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-green-900 pt-14 pb-8 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-lg">
                  🐾
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    4Yos Veterinary Care
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest">
                    Klinik Kesehatan Hewan
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed max-w-xs">
                Memberikan layanan kesehatan hewan terbaik di Padang, Sumatera
                Barat.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-4">
                Navigasi
              </p>
              {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <div>
              <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-4">
                Sistem
              </p>
              <Link
                href="/login"
                className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
                Login Inventori
              </Link>
              <Link
                href="/dashboard"
                className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-white/20">
              © 2025 4Yos Veterinary Care. All rights reserved.
            </p>
            <p className="text-xs text-white/20">PWA · EOQ & ROP System</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
