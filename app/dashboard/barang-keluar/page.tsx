"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllBarangKeluar,
  deleteBarangKeluar,
} from "@/app/controller/barang-keluar.controller";
import type { BarangKeluarWithRelasi } from "@/app/model/barang-keluar.model";

export default function BarangKeluarPage() {
  const [dataList, setDataList] = useState<BarangKeluarWithRelasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] =
    useState<BarangKeluarWithRelasi | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function fetchList() {
    setLoading(true);
    const res = await getAllBarangKeluar();
    if (res.success) setDataList(res.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleDelete() {
    if (!deleteConfirm) return;
    setDeleting(true);
    await deleteBarangKeluar(deleteConfirm.id);
    setDeleting(false);
    setDeleteConfirm(null);
    fetchList();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Barang Keluar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {dataList.length} transaksi terdaftar
          </p>
        </div>
        <Link
          href="/dashboard/barang-keluar/tambah"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition shrink-0">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Transaksi
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : dataList.length === 0 ? (
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
              Tidak ada transaksi barang keluar
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["#", "Kode", "Tanggal", "Total Jual", "PIC", "Aksi"].map(
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
                {dataList.map((m, i) => (
                  <tr
                    key={m.id}
                    className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 text-xs text-gray-300 font-medium text-center">
                      {i + 1}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-widest uppercase">
                        {m.kode}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600 font-medium text-center">
                      {new Date(m.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-red-600 text-center">
                      Rp {m.total.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-500 text-center uppercase tracking-wide">
                      {m.user?.nama}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <Link
                          href={`/dashboard/barang-keluar/${m.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 text-xs font-semibold transition">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          Detail
                        </Link>
                        <Link
                          href={`/dashboard/barang-keluar/${m.id}/edit`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold transition">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(m)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Hapus Transaksi Keluar
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Menghapus transaksi{" "}
                  <strong className="text-gray-800">
                    {deleteConfirm.kode}
                  </strong>{" "}
                  akan otomatis <strong>mengembalikan stok produk</strong> yang
                  sebelumnya dikurangi. Lanjutkan?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition disabled:opacity-50">
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
