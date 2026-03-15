"use client";

import { useEffect, useState, useRef } from "react";
import {
  getLaporanBarangMasukHarian,
  getLaporanBarangMasukBulanan,
  getLaporanBarangMasukTahunan,
  type LaporanBarangMasuk,
  type LaporanBarangMasukAggregated,
} from "@/app/controller/laporan.controller";
import { getOwner } from "@/app/controller/user.controller";

type TabType = "harian" | "bulanan" | "tahunan";

const NAMA_TOKO = "4Yos Veterinary Care";
const ALAMAT_TOKO =
  "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175";

export default function LaporanBarangMasukPage() {
  const [activeTab, setActiveTab] = useState<TabType>("harian");
  const [dataHarian, setDataHarian] = useState<LaporanBarangMasuk[]>([]);
  const [dataAggregated, setDataAggregated] = useState<
    LaporanBarangMasukAggregated[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [ownerName, setOwnerName] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchOwner = async () => {
      const result = await getOwner();
      if (result.success && result.data) {
        setOwnerName(result.data.nama);
      }
    };
    fetchOwner();
  }, []);

  async function fetchData() {
    setLoading(true);

    if (activeTab === "harian") {
      const result = await getLaporanBarangMasukHarian(tanggal);
      if (result.success) {
        setDataHarian(result.data);
      }
    } else if (activeTab === "bulanan") {
      const result = await getLaporanBarangMasukBulanan(tahun, bulan);
      if (result.success) {
        setDataAggregated(result.data);
      }
    } else {
      const result = await getLaporanBarangMasukTahunan(tahun);
      if (result.success) {
        setDataAggregated(result.data);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [activeTab, tanggal, bulan, tahun]);

  function handlePrint() {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const infoText =
      activeTab === "harian"
        ? `Tanggal: ${new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
        : activeTab === "bulanan"
          ? `Bulan: ${bulanOptions.find((b) => b.value === bulan)?.label} ${tahun}`
          : `Tahun: ${tahun}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Barang Masuk</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 10px; }
            .header h1 { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .header p { font-size: 12px; color: #666; }
            .divider { border-bottom: 2px solid #000; margin: 15px 0; }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 5px; text-align: center; }
            .info { font-size: 11px; margin-bottom: 15px; text-align: center;}
            table { width: 100%; border-collapse: collapse; font-size: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background: #f5f5f5; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .footer { margin-top: 30px; display: flex; justify-content: flex-end; }
            .signature { margin-top: 50px; text-align: right; }
            .signature p { font-size: 11px; margin-bottom: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${NAMA_TOKO}</h1>
            <p>${ALAMAT_TOKO}</p>
          </div>
          <div class="divider"></div>
          <div class="title">LAPORAN BARANG MASUK</div>
          <div class="info">${infoText}</div>
          ${printContent.innerHTML}
           <div class="signature">
            <p>Padang, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} <br/> Owner</p>
            <br/>
            <p style="font-weight: bold;">${ownerName}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  const totalKeseluruhan =
    activeTab === "harian"
      ? dataHarian.reduce((sum, item) => sum + item.total, 0)
      : dataAggregated.reduce((sum, item) => sum + item.total_transaksi, 0);

  const totalTransaksi =
    activeTab === "harian"
      ? dataHarian.length
      : dataAggregated.reduce((sum, item) => sum + item.jumlah_transaksi, 0);

  const totalBarang =
    activeTab === "harian"
      ? dataHarian.reduce(
          (sum, item) =>
            sum + item.details.reduce((s, d) => s + d.jumlah_beli, 0),
          0,
        )
      : dataAggregated.reduce((sum, item) => sum + item.jumlah_barang, 0);

  const bulanOptions = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const tabs: { id: TabType; label: string }[] = [
    { id: "harian", label: "Per Hari" },
    { id: "bulanan", label: "Per Bulan" },
    { id: "tahunan", label: "Per Tahun" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Laporan Barang Masuk
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeTab === "harian" ? dataHarian.length : dataAggregated.length}{" "}
            {activeTab === "harian" ? "transaksi" : "periode"} ditemukan
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-semibold hover:bg-gray-900 transition shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Cetak
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1">
        <div className="flex gap-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-end gap-4">
          {activeTab === "harian" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Tanggal
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {activeTab === "bulanan" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Bulan
                </label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]">
                  {bulanOptions.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Tahun
                </label>
                <input
                  type="number"
                  value={tahun}
                  onChange={(e) => setTahun(Number(e.target.value))}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
                />
              </div>
            </>
          )}

          {activeTab === "tahunan" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Tahun
              </label>
              <input
                type="number"
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-28"
              />
            </div>
          )}

          <button
            onClick={fetchData}
            className="px-4 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition">
            Tampilkan
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeTab === "harian" ? (
          dataHarian.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg
                className="w-12 h-12 text-gray-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-gray-400 text-sm font-medium">
                Tidak ada data transaksi
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      "#",
                      "Kode",
                      "Tanggal",
                      "Supplier",
                      "Detail",
                      "Total",
                      "PIC",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {dataHarian.map((m, i) => (
                    <tr
                      key={m.id}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-4 text-xs text-gray-300 font-medium text-center">
                        {i + 1}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-widest uppercase">
                          {m.kode}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium text-center">
                        {new Date(m.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-800 text-center">
                        {m.supplier_nama}
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {m.details.map((d, idx) => (
                            <div
                              key={idx}
                              className="text-xs flex justify-between gap-3">
                              <span className="text-gray-600">
                                {d.produk_nama}{" "}
                                <span className="text-gray-400">
                                  ({d.kategori_nama})
                                </span>
                              </span>
                              <span className="text-gray-800 font-medium">
                                {d.jumlah_beli} x Rp{" "}
                                {d.harga_beli.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-green-700 text-center">
                        Rp {m.total.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-4 text-xs font-semibold text-gray-500 text-center uppercase tracking-wide">
                        {m.user_nama}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-100">
                    <td
                      colSpan={5}
                      className="px-4 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Total
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-green-700">
                        Rp {totalKeseluruhan.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )
        ) : dataAggregated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg
              className="w-12 h-12 text-gray-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-400 text-sm font-medium">Tidak ada data</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "#",
                    activeTab === "bulanan" ? "Minggu Ke" : "Bulan",
                    "Jumlah Barang",
                    "Jumlah Transaksi",
                    "Total Uang Masuk",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dataAggregated.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-300 font-medium text-center">
                      {i + 1}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-gray-800 text-center">
                      {item.periode}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-blue-700 text-center">
                      {item.jumlah_barang.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-green-700 text-center">
                      {item.jumlah_transaksi.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-green-700 text-center">
                      Rp {item.total_transaksi.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-100">
                  <td
                    colSpan={2}
                    className="px-5 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-blue-700">
                      {totalBarang.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-green-700">
                      {totalTransaksi.toLocaleString("id-ID")}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-sm font-bold text-green-700">
                      Rp {totalKeseluruhan.toLocaleString("id-ID")}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
