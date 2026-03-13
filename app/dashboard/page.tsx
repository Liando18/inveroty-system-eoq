"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

const IcoBox = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
  </svg>
);
const IcoWarn = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const IcoCoin = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IcoTrx = () => (
  <svg
    className="w-5 h-5"
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
const IcoDown = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="M8 11l4 4 4-4" />
  </svg>
);
const IcoUp = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 21V9" />
    <path d="M8 13l4-4 4 4" />
  </svg>
);
const IcoArrow = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcoCalc = () => (
  <svg
    className="w-4 h-4"
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
  </svg>
);

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate() {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface StatsData {
  totalProduk: number;
  stokKritis: number;
  nilaiInventori: number;
  transaksiHariIni: number;
}

interface TrxItem {
  nama: string;
  type: string;
  jumlah: number;
  waktu: string;
  kategori: string;
}

interface LowStockItem {
  nama: string;
  stok: number;
  min: number;
  eoq: number;
}

interface EoqItem {
  nama: string;
  permintaan: number;
  biaya_pemesanan: number;
  biaya_penyimpanan: number;
  eoq: number;
  rop: number;
  stok: number;
}

interface KategoriDist {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    totalProduk: 0,
    stokKritis: 0,
    nilaiInventori: 0,
    transaksiHariIni: 0,
  });
  const [trxList, setTrxList] = useState<TrxItem[]>([]);
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [eoqTable, setEoqTable] = useState<EoqItem[]>([]);
  const [kategoriDist, setKategoriDist] = useState<KategoriDist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      const today = new Date().toISOString().split("T")[0];

      const [produkRes, stokRes, masukRes, keluarRes, analisisRes] =
        await Promise.all([
          supabase
            .from("produk")
            .select("id, nama, harga, kategori_id, kategori(nama)"),
          supabase.from("stok").select("produk_id, stok"),
          supabase
            .from("barang_masuk")
            .select(
              "id, tanggal, barang_masuk_detail(jumlah_beli, produk_id, produk(nama, kategori(nama)))",
            )
            .order("tanggal", { ascending: false })
            .limit(10),
          supabase
            .from("barang_keluar")
            .select(
              "id, tanggal, barang_keluar_detail(jumlah_jual, produk_id, produk(nama, kategori(nama)))",
            )
            .order("tanggal", { ascending: false })
            .limit(10),
          supabase
            .from("analisis")
            .select("*, produk(nama)")
            .order("created_at", { ascending: false }),
        ]);

      const produkData = produkRes.data ?? [];
      const stokData = stokRes.data ?? [];
      const masukData = masukRes.data ?? [];
      const keluarData = keluarRes.data ?? [];
      const analisisData = analisisRes.data ?? [];

      const stokMap = new Map(stokData.map((s: any) => [s.produk_id, s.stok]));

      const totalProduk = produkData.length;

      const STOK_MIN = 5;
      const stokKritis = stokData.filter((s: any) => s.stok <= STOK_MIN).length;

      const nilaiInventori = produkData.reduce((acc: number, p: any) => {
        const stok = stokMap.get(p.id) ?? 0;
        return acc + p.harga * stok;
      }, 0);

      const masukHariIni = masukData.filter((m: any) =>
        m.tanggal?.startsWith(today),
      ).length;
      const keluarHariIni = keluarData.filter((k: any) =>
        k.tanggal?.startsWith(today),
      ).length;
      const transaksiHariIni = masukHariIni + keluarHariIni;

      setStats({ totalProduk, stokKritis, nilaiInventori, transaksiHariIni });

      const trxRaw: TrxItem[] = [];
      for (const m of masukData.slice(0, 4)) {
        for (const d of m.barang_masuk_detail ?? []) {
          trxRaw.push({
            nama: (d.produk as any)?.nama ?? "-",
            type: "Masuk",
            jumlah: d.jumlah_beli,
            waktu: formatTime(m.tanggal),
            kategori: (d.produk as any)?.kategori?.nama ?? "-",
          });
        }
      }
      for (const k of keluarData.slice(0, 4)) {
        for (const d of k.barang_keluar_detail ?? []) {
          trxRaw.push({
            nama: (d.produk as any)?.nama ?? "-",
            type: "Keluar",
            jumlah: d.jumlah_jual,
            waktu: formatTime(k.tanggal),
            kategori: (d.produk as any)?.kategori?.nama ?? "-",
          });
        }
      }
      setTrxList(trxRaw.slice(0, 6));

      const lowRaw: LowStockItem[] = stokData
        .filter((s: any) => s.stok <= STOK_MIN)
        .map((s: any) => {
          const produk = produkData.find((p: any) => p.id === s.produk_id);
          const analisis = analisisData.find(
            (a: any) => a.produk_id === s.produk_id,
          );
          return {
            nama: produk?.nama ?? "-",
            stok: s.stok,
            min: STOK_MIN,
            eoq: analisis?.eoq ?? 0,
          };
        })
        .slice(0, 4);
      setLowStock(lowRaw);

      const eoqRaw: EoqItem[] = analisisData.slice(0, 5).map((a: any) => {
        const stok = stokMap.get(a.produk_id) ?? 0;
        return {
          nama: (a.produk as any)?.nama ?? "-",
          permintaan: a.permintaan_pertahun,
          biaya_pemesanan: a.biaya_pemesanan,
          biaya_penyimpanan: a.biaya_penyimpanan,
          eoq: a.eoq,
          rop: a.rop,
          stok,
        };
      });
      setEoqTable(eoqRaw);

      const COLORS = [
        { color: "bg-green-500", bgColor: "bg-green-500" },
        { color: "bg-blue-500", bgColor: "bg-blue-500" },
        { color: "bg-amber-500", bgColor: "bg-amber-500" },
        { color: "bg-purple-500", bgColor: "bg-purple-500" },
      ];
      const kategoriMap = new Map<string, number>();
      for (const p of produkData) {
        const nama = (p.kategori as any)?.nama ?? "Lainnya";
        kategoriMap.set(nama, (kategoriMap.get(nama) ?? 0) + 1);
      }
      const kategoriArr = Array.from(kategoriMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([label, count], i) => ({ label, count, ...COLORS[i] }));
      setKategoriDist(kategoriArr);

      setLoading(false);
    }

    fetchAll();
  }, []);

  const STAT_CARDS = [
    {
      label: "Total Produk",
      value: stats.totalProduk.toString(),
      Icon: IcoBox,
      gradient: "from-green-500 to-emerald-600",
      lightBg: "bg-green-50",
      lightText: "text-green-700",
      lightBorder: "border-green-100",
    },
    {
      label: "Stok Kritis",
      value: stats.stokKritis.toString(),
      Icon: IcoWarn,
      gradient: "from-amber-500 to-orange-500",
      lightBg: "bg-amber-50",
      lightText: "text-amber-700",
      lightBorder: "border-amber-100",
    },
    {
      label: "Nilai Inventori",
      value: formatRupiah(stats.nilaiInventori),
      Icon: IcoCoin,
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50",
      lightText: "text-blue-700",
      lightBorder: "border-blue-100",
    },
    {
      label: "Transaksi Hari Ini",
      value: stats.transaksiHariIni.toString(),
      Icon: IcoTrx,
      gradient: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50",
      lightText: "text-violet-700",
      lightBorder: "border-violet-100",
    },
  ];

  const totalKategori = kategoriDist.reduce((a, c) => a + c.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Selamat Datang 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ringkasan inventori 4Yos Veterinary Care · {formatDate()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`}
            />
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-md`}>
                <s.Icon />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
              {s.value}
            </p>
            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="font-bold text-gray-900">Transaksi Terbaru</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {trxList.length} transaksi terakhir
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {trxList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                Belum ada transaksi
              </p>
            ) : (
              trxList.map((t, i) => (
                <div
                  key={i}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${t.type === "Masuk" ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-600"}`}>
                      {t.type === "Masuk" ? <IcoDown /> : <IcoUp />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {t.nama}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {t.waktu}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                          {t.kategori}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold ${t.type === "Masuk" ? "text-green-700" : "text-rose-600"}`}>
                    {t.type === "Masuk" ? "+" : "−"}
                    {t.jumlah} unit
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-50">
            <p className="font-bold text-gray-900">Distribusi Kategori</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Komposisi produk saat ini
            </p>
          </div>
          <div className="p-5">
            {kategoriDist.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Belum ada data
              </p>
            ) : (
              <>
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="4"
                    />
                    {(() => {
                      const colors = [
                        "#22c55e",
                        "#3b82f6",
                        "#f59e0b",
                        "#a855f7",
                      ];
                      let offset = 0;
                      return kategoriDist.map((c, i) => {
                        const pct =
                          totalKategori > 0
                            ? (c.count / totalKategori) * 100
                            : 0;
                        const el = (
                          <circle
                            key={c.label}
                            cx="18"
                            cy="18"
                            r="14"
                            fill="none"
                            stroke={colors[i]}
                            strokeWidth="4"
                            strokeDasharray={`${pct} ${100 - pct}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                          />
                        );
                        offset += pct;
                        return el;
                      });
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-bold text-gray-900">
                      {stats.totalProduk}
                    </p>
                    <p className="text-[9px] text-gray-400 font-medium">
                      PRODUK
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {kategoriDist.map((c) => (
                    <div key={c.label} className="flex items-center gap-2.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${c.bgColor} shrink-0`}
                      />
                      <span className="text-xs text-gray-600 font-medium flex-1">
                        {c.label}
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {c.count}
                      </span>
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${c.bgColor} rounded-full`}
                          style={{
                            width: `${totalKategori > 0 ? (c.count / totalKategori) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">Stok Kritis</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Perlu segera reorder
              </p>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                Semua stok aman 🎉
              </p>
            ) : (
              lowStock.map((item, i) => {
                const pct = Math.round((item.stok / item.min) * 100);
                const danger = pct < 35;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${danger ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-gray-800 leading-tight pr-2">
                        {item.nama}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${danger ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {item.stok}/{item.min}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/70 rounded-full overflow-hidden mb-1.5">
                      <div
                        className={`h-full rounded-full ${danger ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <p className="text-[10px] text-gray-500">
                        {pct}% dari min stok
                      </p>
                      {item.eoq > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                          <IcoCalc /> EOQ: {item.eoq} unit
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 shadow-lg shadow-green-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <IcoCalc />
              </div>
              <p className="font-bold text-white text-sm">Insight EOQ</p>
            </div>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Terdapat{" "}
              <strong className="text-white">
                {lowStock.length} produk kritis
              </strong>{" "}
              yang perlu segera dipesan berdasarkan data stok saat ini.
            </p>
            <div className="space-y-2">
              {lowStock.slice(0, 2).map((r) => (
                <div
                  key={r.nama}
                  className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                  <p className="text-white text-xs font-medium truncate pr-2">
                    {r.nama}
                  </p>
                  {r.eoq > 0 && (
                    <span className="text-xs font-bold text-green-300 shrink-0">
                      {r.eoq} unit
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button className="mt-4 w-full py-2 rounded-xl bg-white text-green-700 text-xs font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
            Lihat Semua Rekomendasi <IcoArrow />
          </button>
        </div>
      </div>

      {eoqTable.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-gray-900">Tabel EOQ & ROP</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Data analisis terkini dari Supabase
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                Aman
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                Kritis
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Nama Produk",
                    "Permintaan/Thn",
                    "Biaya Pesan",
                    "Biaya Simpan",
                    "EOQ (unit)",
                    "ROP (unit)",
                    "Stok Sekarang",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {eoqTable.map((row, i) => {
                  const safe = row.stok > row.rop;
                  return (
                    <tr
                      key={i}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-2 h-8 rounded-full ${safe ? "bg-green-400" : "bg-red-400"}`}
                          />
                          <p className="font-semibold text-gray-800 text-xs">
                            {row.nama}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {row.permintaan} unit
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {formatRupiah(row.biaya_pemesanan)}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {formatRupiah(row.biaya_penyimpanan)}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                          {row.eoq}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                          {row.rop}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-xs font-bold ${safe ? "text-gray-700" : "text-red-600"}`}>
                          {row.stok}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${safe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                          {safe ? "✓ Aman" : "⚠ Kritis"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
