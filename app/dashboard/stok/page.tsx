"use client";

import { useEffect, useState } from "react";
import {
  getAllStokWithProduk,
  updateStokManual,
} from "@/app/controller/stok.controller";
import type { StokWithProduk } from "@/app/model/stok.model";
import type { ProdukWithKategori } from "@/app/model/produk.model";

export default function StokPage() {
  const [dataList, setDataList] = useState<StokWithProduk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<StokWithProduk | null>(null);
  const [formStok, setFormStok] = useState(0);
  const [formMinimum, setFormMinimum] = useState(1);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function fetchData() {
    setLoading(true);
    const res = await getAllStokWithProduk();
    if (res.success) setDataList(res.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  function openEdit(item: StokWithProduk) {
    setEditItem(item);
    setFormStok(item.stok);
    setFormMinimum(item.minimum);
    setFormError("");
    setShowModal(true);
  }

  async function handleSave() {
    if (formStok < 0) {
      setFormError("Stok tidak boleh kurang dari 0.");
      return;
    }
    if (formMinimum < 0) {
      setFormError("Minimum tidak boleh kurang dari 0.");
      return;
    }
    if (!editItem) return;

    setSaving(true);
    setFormError("");
    const res = await updateStokManual(editItem.id, {
      stok: formStok,
      minimum: formMinimum,
    });
    setSaving(false);

    if (!res.success) {
      setFormError(res.message);
      return;
    }
    setShowModal(false);
    fetchData();
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Data Stok</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {dataList.length} produk dengan data stok
        </p>
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
              Belum ada data stok. Lakukan transaksi barang masuk terlebih
              dahulu.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "#",
                    "Produk",
                    "Kategori",
                    "Stok",
                    "Minimum",
                    "Status",
                    "Aksi",
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
                {dataList.map((item, i) => {
                  const isLow = item.stok <= item.minimum;
                  const isEmpty = item.stok === 0;
                  const produk = item.produk as ProdukWithKategori;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-xs text-gray-300 font-medium text-center">
                        {i + 1}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-gray-800 text-center">
                        {produk?.nama}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                          {(produk as any)?.kategori?.nama || "-"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-sm font-black ${isEmpty ? "text-red-500" : isLow ? "text-amber-600" : "text-gray-800"}`}>
                          {item.stok}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 font-medium text-center">
                        {item.minimum}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {isEmpty ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            Habis
                          </span>
                        ) : isLow ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                            Rendah
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            Aman
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => openEdit(item)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold transition">
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
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && editItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Edit Stok</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Mengubah stok untuk{" "}
                  <strong className="text-gray-600">
                    {(editItem.produk as any)?.nama}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Jumlah Stok
                </label>
                <input
                  type="number"
                  value={formStok}
                  onChange={(e) => setFormStok(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Batas Minimum
                </label>
                <input
                  type="number"
                  value={formMinimum}
                  onChange={(e) => setFormMinimum(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Jika stok ≤ minimum, status akan menjadi "Rendah"
                </p>
              </div>

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {formError}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition disabled:opacity-50">
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
