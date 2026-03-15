"use client";

import { useEffect, useState, useRef } from "react";
import {
  getLaporanStok,
  type LaporanStok,
} from "@/app/controller/laporan.controller";
import { getOwner } from "@/app/controller/user.controller";

const NAMA_TOKO = "4Yos Veterinary Care Care";
const ALAMAT_TOKO =
  "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175";

export default function LaporanStokPage() {
  const [dataList, setDataList] = useState<LaporanStok[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"semua" | "menipis">("semua");
  const [ownerName, setOwnerName] = useState<string>("");
  const printRef = useRef<HTMLDivElement>(null);

  async function fetchData() {
    setLoading(true);
    const result = await getLaporanStok();
    if (result.success) {
      setDataList(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    const fetchOwner = async () => {
      const result = await getOwner();
      if (result.success && result.data) {
        setOwnerName(result.data.nama);
      }
    };
    fetchOwner();
  }, []);

  function handlePrint() {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Stok</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 10px; }
            .header h1 { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .header p { font-size: 12px; color: #666; }
            .divider { border-bottom: 2px solid #000; margin: 15px 0; }
            .title { font-size: 14px; font-weight: bold; margin-bottom: 15px; text-align: center; }
            .info { font-size: 11px; margin-bottom: 15px; }
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
          <div class="title">LAPORAN STOK</div>
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

  const filteredData = dataList.filter((item) => {
    if (filter === "menipis") {
      return item.stok <= item.minimum;
    }
    return true;
  });

  const totalStok = filteredData.reduce((sum, item) => sum + item.stok, 0);
  const produkMenipis = dataList.filter(
    (item) => item.stok <= item.minimum,
  ).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Laporan Stok</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredData.length} produk dalam inventori
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
            Total Stok
          </p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {totalStok.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-green-600/70 mt-1">unit produk</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Total Produk
          </p>
          <p className="text-2xl font-bold text-blue-700 mt-1">
            {dataList.length}
          </p>
          <p className="text-xs text-blue-600/70 mt-1">jenis produk</p>
        </div>
        <div
          className={`rounded-xl border p-4 ${produkMenipis > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
          <p
            className={`text-xs font-semibold uppercase tracking-wider ${produkMenipis > 0 ? "text-red-600" : "text-gray-600"}`}>
            Stok Menipis
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${produkMenipis > 0 ? "text-red-700" : "text-gray-700"}`}>
            {produkMenipis}
          </p>
          <p
            className={`text-xs mt-1 ${produkMenipis > 0 ? "text-red-600/70" : "text-gray-600/70"}`}>
            produk perlu restok
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("semua")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === "semua"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              Semua
            </button>
            <button
              onClick={() => setFilter("menipis")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === "menipis"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              Stok Menipis
            </button>
          </div>
          <button
            onClick={fetchData}
            className="ml-auto px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">
            Refresh
          </button>
        </div>
      </div>

      <div
        ref={printRef}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredData.length === 0 ? (
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <p className="text-gray-400 text-sm font-medium">
              {filter === "menipis"
                ? "Tidak ada produk dengan stok menipis"
                : "Tidak ada data stok"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Produk", "Kategori", "Stok", "Minimum", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((item, i) => {
                  const isMenipis = item.stok <= item.minimum;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-300 font-medium text-center">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-800">
                          {item.produk_nama}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 text-center">
                        {item.kategori_nama || "-"}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-sm font-bold ${isMenipis ? "text-red-600" : "text-green-700"}`}>
                          {item.stok}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 text-center">
                        {item.minimum}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isMenipis ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                            Menipis
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
