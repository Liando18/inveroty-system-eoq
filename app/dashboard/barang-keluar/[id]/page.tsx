"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBarangKeluar } from "@/app/controller/barang-keluar.controller";
import type { BarangKeluarWithRelasi } from "@/app/model/barang-keluar.model";
import { use } from "react";

const NAMA_TOKO = "4Yos Veterinary Care";
const ALAMAT_TOKO =
  "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175";
const KONTAK_TOKO = "Telp: +62 822-8631-6881";

export default function DetailBarangKeluarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const paramId = parseInt(unwrappedParams.id, 10);
  const [data, setData] = useState<BarangKeluarWithRelasi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (isNaN(paramId)) return;
      const res = await getBarangKeluar(paramId);
      if (res.success) setData(res.data);
      setLoading(false);
    }
    init();
  }, [paramId]);

  function handlePrintFaktur() {
    if (!data) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Faktur Penjualan - ${data.kode}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 15px; }
            .header { text-align: center; margin-bottom: 15px; }
            .header h1 { font-size: 20px; font-weight: bold; margin-bottom: 3px; }
            .header p { font-size: 11px; color: #666; }
            .divider { border-bottom: 1px solid #000; margin: 10px 0; }
            .info { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; }
            .info-left { text-align: left; }
            .info-right { text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 5px; text-align: left; }
            th { background: #f5f5f5; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .total-box { background: #f5f5f5; padding: 10px; text-align: right; font-size: 12px; font-weight: bold; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${NAMA_TOKO}</h1>
            <p>${ALAMAT_TOKO} | ${KONTAK_TOKO}</p>
          </div>
          <div class="divider"></div>
          <div style="text-align: center; margin-bottom: 15px;">
            <strong style="font-size: 14px;">FAKTUR PENJUALAN</strong>
          </div>
          <div class="info">
            <div class="info-left">
              <p><strong>No. Faktur:</strong> ${data.kode}</p>
            </div>
            <div class="info-right">
              <p><strong>Tanggal:</strong> ${new Date(data.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p><strong>Kasir:</strong> ${data.user?.nama}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 30px;">No</th>
                <th>Nama Produk</th>
                <th style="width: 80px;" class="text-right">Harga</th>
                <th style="width: 50px;" class="text-center">Qty</th>
                <th style="width: 100px;" class="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.barang_keluar_detail
                .map(
                  (d, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${d.produk?.nama || "-"}</td>
                  <td class="text-right">Rp ${d.harga_jual.toLocaleString("id-ID")}</td>
                  <td class="text-center">${d.jumlah_jual}</td>
                  <td class="text-right">Rp ${(d.harga_jual * d.jumlah_jual).toLocaleString("id-ID")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          <div class="total-box">
            TOTAL: Rp ${data.total.toLocaleString("id-ID")}
          </div>
          <div class="footer">
            <p>Terima kasih atas kunjungan Anda</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">Data tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/barang-keluar"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Detail Transaksi Keluar
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Rincian lengkap penjualan / barang keluar
            </p>
          </div>
        </div>
        <button
          onClick={handlePrintFaktur}
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
          Cetak Faktur
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wide mb-1">
              Total Penjualan
            </p>
            <p className="text-xl font-black text-red-700">
              Rp {data.total.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Kode Transaksi
            </p>
            <p className="text-base font-bold text-gray-800 tracking-widest">
              {data.kode}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Tanggal
            </p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date(data.tanggal).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Penanggung Jawab
            </p>
            <p className="text-sm font-semibold text-gray-700 uppercase">
              {data.user?.nama}
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Rincian Produk Keluar
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Produk", "Harga Jual", "Qty Keluar", "Subtotal"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.barang_keluar_detail.map((d, i) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5 text-xs text-gray-300 font-medium text-center">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-gray-800 text-center">
                      {d.produk?.nama}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 text-center">
                      Rp {d.harga_jual.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold">
                        - {d.jumlah_jual}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-gray-800 text-center">
                      Rp{" "}
                      {(d.harga_jual * d.jumlah_jual).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="bg-red-50 px-6 py-3 rounded-xl border border-red-100 text-right">
            <p className="text-[11px] font-bold text-red-500 uppercase tracking-wide">
              Grand Total
            </p>
            <p className="text-2xl font-black text-red-700">
              Rp {data.total.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
