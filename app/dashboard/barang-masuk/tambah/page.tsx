"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBarangMasukTransaction } from "@/app/controller/barang-masuk.controller";
import { getAllSuppliers } from "@/app/controller/supplier.controller";
import { getAllProducts } from "@/app/controller/produk.controller";
import { getAllStok } from "@/app/controller/stok.controller";
import { getSession } from "@/app/controller/auth.controller";
import { checkLowStockAndNotify } from "@/app/lib/notification-client";
import type { Supplier } from "@/app/model/supplier.model";
import type { ProdukWithKategori } from "@/app/model/produk.model";
import type { Stok } from "@/app/model/stok.model";

export default function TambahBarangMasukPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<ProdukWithKategori[]>([]);
  const [stocks, setStocks] = useState<Stok[]>([]);

  const [supplierId, setSupplierId] = useState<number>(0);
  const [kode, setKode] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [items, setItems] = useState<
    { produk_id: number; harga_beli: number; jumlah_beli: number }[]
  >([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function init() {
      const [resS, resP, resStok] = await Promise.all([
        getAllSuppliers(),
        getAllProducts(),
        getAllStok(),
      ]);
      if (resS.success) {
        setSuppliers(resS.data);
        if (resS.data.length > 0) setSupplierId(resS.data[0].id);
      }
      if (resP.success) setProducts(resP.data);
      if (resStok.success) setStocks(resStok.data);

      const tk = Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");
      setKode(`BM-${tk}`);
    }
    init();
  }, []);

  function handleAddItem() {
    if (products.length === 0) return;
    setItems([
      ...items,
      { produk_id: products[0].id, harga_beli: 0, jumlah_beli: 1 },
    ]);
  }

  function handleRemoveItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
  }

  function handleUpdateItem(idx: number, field: string, val: number) {
    const fresh = [...items];
    fresh[idx] = { ...fresh[idx], [field]: val };
    setItems(fresh);
  }

  const grandTotal = items.reduce(
    (acc, curr) => acc + curr.harga_beli * curr.jumlah_beli,
    0,
  );

  async function handleSave() {
    setErrorMsg("");
    if (supplierId === 0) return setErrorMsg("Pilih supplier.");
    if (!kode.trim() || !tanggal)
      return setErrorMsg("Lengkapi kode dan tanggal.");
    if (items.length === 0) return setErrorMsg("Pilih minimal 1 produk.");
    if (items.some((x) => x.harga_beli <= 0 || x.jumlah_beli <= 0))
      return setErrorMsg("Harga dan jumlah beli harus lebih dari 0.");

    setSaving(true);
    const session = getSession();
    if (!session) {
      setSaving(false);
      return setErrorMsg("Sesi berakhir, silakan login ulang.");
    }

    const payloadMasuk = {
      supplier_id: supplierId,
      kode,
      tanggal,
      total: grandTotal,
      user_id: session.id, // Ambil ID user dari sesi login
    };

    const payloadDetails = items.map((x) => ({
      produk_id: x.produk_id,
      harga_beli: x.harga_beli,
      jumlah_beli: x.jumlah_beli,
    }));

    const res = await createBarangMasukTransaction(
      payloadMasuk,
      payloadDetails,
    );

    if (!res.success) {
      setErrorMsg(res.message);
      setSaving(false);
      return;
    }

    // Check and notify low stock after transaction
    await checkLowStockAndNotify();

    router.push("/dashboard/barang-masuk");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/barang-masuk"
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
            Tambah Transaksi Masuk
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Catat restok dari supplier ke sistem. Otomatis tambah stok (+)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Kode Transaksi
            </label>
            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Tanggal
            </label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">
              Supplier
            </label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-gray-100" />

        {}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">
              Daftar Produk Masuk
            </h2>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition">
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
              Tambah Baris Produk
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const selectedProduct = products.find(
                (p) => p.id === item.produk_id,
              );
              const currentStock =
                stocks.find((s) => s.produk_id === item.produk_id)?.stok || 0;

              return (
                <div
                  key={idx}
                  className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Pilih Produk
                      </label>
                      <select
                        value={item.produk_id}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "produk_id",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm">
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nama}
                          </option>
                        ))}
                      </select>
                    </div>

                    {selectedProduct && (
                      <div className="w-full sm:w-1/2 bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                            Kategori
                          </span>
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                            {selectedProduct.kategori?.nama || "-"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-gray-600">
                            Harga Jual:{" "}
                            <span className="text-gray-900 font-bold">
                              Rp {selectedProduct.harga.toLocaleString("id-ID")}
                            </span>
                          </span>
                          <span className="font-semibold text-gray-600">
                            Stok Saat Ini:{" "}
                            <span className="text-gray-900 font-bold">
                              {currentStock}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Harga Beli Rp
                      </label>
                      <input
                        type="number"
                        value={item.harga_beli || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "harga_beli",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                        placeholder="Contoh: 10000"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Qty
                      </label>
                      <input
                        type="number"
                        value={item.jumlah_beli || ""}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "jumlah_beli",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
                        placeholder="1"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                        Subtotal
                      </label>
                      <div className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm h-[42px] flex items-center">
                        Rp{" "}
                        {(item.harga_beli * item.jumlah_beli).toLocaleString(
                          "id-ID",
                        )}
                      </div>
                    </div>
                    <div className="sm:col-span-2 flex">
                      <button
                        onClick={() => handleRemoveItem(idx)}
                        className="w-full px-4 py-2 rounded-lg text-red-500 font-semibold hover:bg-red-50 border border-transparent hover:border-red-100 transition whitespace-nowrap h-[42px]">
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-sm text-gray-400">
                  Belum ada produk yang ditambahkan
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-100" />

        {}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto bg-green-50 px-5 py-3 rounded-xl border border-green-100 text-center sm:text-left">
            <p className="text-xs font-bold text-green-700 uppercase tracking-wide">
              Total Estimasi Keseluruhan
            </p>
            <p className="text-2xl font-black text-green-800">
              Rp {grandTotal.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="w-full sm:w-auto flex flex-col items-end gap-2">
            {errorMsg && (
              <p className="text-xs font-semibold text-red-500">{errorMsg}</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold transition shadow-md shadow-green-200 disabled:opacity-50">
              {saving ? "Menyimpan Transaksi..." : "Selesaikan & Simpan Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
