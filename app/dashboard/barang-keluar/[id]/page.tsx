"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBarangKeluar } from "@/app/controller/barang-keluar.controller";
import type { BarangKeluarWithRelasi } from "@/app/model/barang-keluar.model";
import { use } from "react";

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
