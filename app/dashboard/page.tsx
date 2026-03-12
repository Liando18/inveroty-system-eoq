"use client";

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
const IcoCheck = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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

const STATS = [
  {
    label: "Total Produk",
    value: "248",
    change: "+12",
    changeTxt: "produk baru bulan ini",
    up: true,
    Icon: IcoBox,
    gradient: "from-green-500 to-emerald-600",
    lightBg: "bg-green-50",
    lightText: "text-green-700",
    lightBorder: "border-green-100",
  },
  {
    label: "Stok Kritis",
    value: "14",
    change: "4",
    changeTxt: "lebih banyak dari kemarin",
    up: false,
    Icon: IcoWarn,
    gradient: "from-amber-500 to-orange-500",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
    lightBorder: "border-amber-100",
  },
  {
    label: "Nilai Inventori",
    value: "Rp 84,2jt",
    change: "+5.2%",
    changeTxt: "dibanding bulan lalu",
    up: true,
    Icon: IcoCoin,
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    lightBorder: "border-blue-100",
  },
  {
    label: "Transaksi Hari Ini",
    value: "37",
    change: "+8",
    changeTxt: "dibanding kemarin",
    up: true,
    Icon: IcoTrx,
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    lightText: "text-violet-700",
    lightBorder: "border-violet-100",
  },
];

const TRX = [
  {
    name: "Royal Canin Kitten 2kg",
    type: "Masuk",
    qty: 24,
    time: "08:32",
    done: true,
    cat: "Makanan",
  },
  {
    name: "Whiskas Pouch Tuna 85gr",
    type: "Keluar",
    qty: 12,
    time: "09:15",
    done: true,
    cat: "Makanan",
  },
  {
    name: "Frontline Plus Cat",
    type: "Keluar",
    qty: 5,
    time: "10:03",
    done: true,
    cat: "Obat",
  },
  {
    name: "NexGard Spectra",
    type: "Masuk",
    qty: 10,
    time: "11:22",
    done: true,
    cat: "Obat",
  },
  {
    name: "Drools Cat Food 1kg",
    type: "Keluar",
    qty: 8,
    time: "13:48",
    done: true,
    cat: "Makanan",
  },
  {
    name: "Feliway Spray 60ml",
    type: "Masuk",
    qty: 6,
    time: "14:30",
    done: false,
    cat: "Aksesoris",
  },
];

const LOW_STOCK = [
  { name: "Advantage II Cat", stock: 3, min: 10, eoq: 36 },
  { name: "Revolution Cat 5-15kg", stock: 2, min: 8, eoq: 24 },
  { name: "Purina Pro Plan Kitten", stock: 5, min: 15, eoq: 45 },
  { name: "Hill's Science Diet", stock: 4, min: 12, eoq: 36 },
];

const EOQ_TABLE = [
  {
    name: "Royal Canin Kitten 2kg",
    demand: 48,
    eoq: 96,
    rop: 16,
    stock: 42,
    safe: true,
  },
  {
    name: "Whiskas Pouch Tuna 85gr",
    demand: 120,
    eoq: 240,
    rop: 40,
    stock: 88,
    safe: true,
  },
  {
    name: "Frontline Plus Cat",
    demand: 30,
    eoq: 60,
    rop: 10,
    stock: 7,
    safe: false,
  },
  {
    name: "NexGard Spectra",
    demand: 24,
    eoq: 48,
    rop: 8,
    stock: 15,
    safe: true,
  },
  {
    name: "Advantage II Cat",
    demand: 18,
    eoq: 36,
    rop: 6,
    stock: 3,
    safe: false,
  },
];

const CHART_BARS = [
  { label: "Sen", in: 18, out: 12 },
  { label: "Sel", in: 24, out: 18 },
  { label: "Rab", in: 15, out: 22 },
  { label: "Kam", in: 30, out: 16 },
  { label: "Jum", in: 22, out: 28 },
  { label: "Sab", in: 28, out: 20 },
  { label: "Min", in: 36, out: 24 },
];
const MAX_BAR = 40;

export default function DashboardPage() {
  return (
    <div className="space-y-5 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Selamat Datang, Admin 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Ringkasan inventori 4Yos Veterinary Care · Hari ini, 10 Maret 2026
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Filter Tanggal
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-all shadow-md shadow-green-200">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export Laporan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
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
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${s.lightBg} ${s.lightText} border ${s.lightBorder}`}>
                {s.up ? <IcoCheck /> : "!"}
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1">
              {s.value}
            </p>
            <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            <p
              className={`text-[11px] mt-1 font-medium ${s.up ? "text-green-600" : "text-amber-600"}`}>
              {s.up ? "↑" : "↑"} {s.changeTxt}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-900">Aktivitas Stok Mingguan</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Perbandingan stok masuk vs keluar
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-green-600">
                <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
                Masuk
              </span>
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />
                Keluar
              </span>
            </div>
          </div>
          <div className="px-5 pb-5 pt-4">
            <div className="flex items-end justify-between gap-2 h-36">
              {CHART_BARS.map((b) => (
                <div
                  key={b.label}
                  className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full flex items-end gap-0.5"
                    style={{ height: 108 }}>
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500"
                      style={{ height: `${(b.in / MAX_BAR) * 100}%` }}
                    />
                    <div
                      className="flex-1 rounded-t-md bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-500"
                      style={{ height: `${(b.out / MAX_BAR) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-medium text-gray-400">
                    {b.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-4 border-b border-gray-50">
            <p className="font-bold text-gray-900">Distribusi Kategori</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Komposisi stok saat ini
            </p>
          </div>
          <div className="p-5">
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
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="4"
                  strokeDasharray="38 62"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="25 75"
                  strokeDashoffset="-38"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="4"
                  strokeDasharray="22 78"
                  strokeDashoffset="-63"
                  strokeLinecap="round"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="4"
                  strokeDasharray="15 85"
                  strokeDashoffset="-85"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-bold text-gray-900">248</p>
                <p className="text-[9px] text-gray-400 font-medium">PRODUK</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Makanan", pct: 38, count: 94, color: "bg-green-500" },
                { label: "Obat", pct: 25, count: 62, color: "bg-blue-500" },
                { label: "Vitamin", pct: 22, count: 55, color: "bg-amber-500" },
                {
                  label: "Lainnya",
                  pct: 15,
                  count: 37,
                  color: "bg-purple-500",
                },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${c.color} shrink-0`}
                  />
                  <span className="text-xs text-gray-600 font-medium flex-1">
                    {c.label}
                  </span>
                  <span className="text-xs font-bold text-gray-900">
                    {c.count}
                  </span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.color} rounded-full`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-900">Transaksi Terbaru</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Hari ini · {TRX.length} transaksi
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 transition-colors">
              Lihat Semua <IcoArrow />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {TRX.map((t, i) => (
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
                      {t.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-400">
                        {t.time}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">
                        {t.cat}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-sm font-bold ${t.type === "Masuk" ? "text-green-700" : "text-rose-600"}`}>
                    {t.type === "Masuk" ? "+" : "−"}
                    {t.qty} unit
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.done ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {t.done ? "Selesai" : "Proses"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">Stok Kritis</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Perlu segera reorder
                </p>
              </div>
              <button className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors">
                Reorder
              </button>
            </div>
            <div className="p-4 space-y-3">
              {LOW_STOCK.map((item, i) => {
                const pct = Math.round((item.stock / item.min) * 100);
                const danger = pct < 35;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${danger ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-bold text-gray-800 leading-tight pr-2">
                        {item.name}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${danger ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                        {item.stock}/{item.min}
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
                      <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-600">
                        <IcoCalc /> EOQ: {item.eoq} unit
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-5 shadow-lg shadow-green-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <IcoCalc />
              </div>
              <p className="font-bold text-white text-sm">
                Insight EOQ Hari Ini
              </p>
            </div>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Berdasarkan data permintaan 30 hari terakhir, sistem
              merekomendasikan pemesanan segera untuk{" "}
              <strong className="text-white">3 produk kritis</strong>.
            </p>
            <div className="space-y-2">
              {[
                { name: "Advantage II Cat", qty: "36 unit" },
                { name: "Revolution Cat", qty: "24 unit" },
              ].map((r) => (
                <div
                  key={r.name}
                  className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                  <p className="text-white text-xs font-medium">{r.name}</p>
                  <span className="text-xs font-bold text-green-300">
                    {r.qty}
                  </span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 rounded-xl bg-white text-green-700 text-xs font-bold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
              Lihat Semua Rekomendasi <IcoArrow />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-bold text-gray-900">Tabel EOQ & ROP</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Kalkulasi terkini untuk 5 produk utama
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
            <button className="text-xs font-semibold text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors">
              Perbarui EOQ
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[
                  "Nama Produk",
                  "Permintaan/Bln",
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
              {EOQ_TABLE.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-2 h-8 rounded-full ${row.safe ? "bg-green-400" : "bg-red-400"}`}
                      />
                      <p className="font-semibold text-gray-800 text-xs">
                        {row.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">
                    {row.demand} unit
                  </td>
                  <td className="px-5 py-4 text-xs text-gray-600">Rp 15.000</td>
                  <td className="px-5 py-4 text-xs text-gray-600">Rp 2.500</td>
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
                      className={`text-xs font-bold ${row.safe ? "text-gray-700" : "text-red-600"}`}>
                      {row.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${row.safe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                      {row.safe ? (
                        <>
                          <IcoCheck />
                          Aman
                        </>
                      ) : (
                        "⚠ Kritis"
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
