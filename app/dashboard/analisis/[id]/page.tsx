"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAnalisis,
  getKeteranganEOQ,
  getKeteranganROP,
} from "@/app/controller/analisis.controller";
import type { AnalisisWithProduk } from "@/app/model/analisis.model";
import { use } from "react";

const NAMA_TOKO = "4Yos Veterinary Care";
const ALAMAT_TOKO =
  "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175";
const KONTAK_TOKO = "Telp: +62 822-8631-6881";

export default function DetailAnalisisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const paramId = parseInt(unwrappedParams.id, 10);
  const [data, setData] = useState<AnalisisWithProduk | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (isNaN(paramId)) return;
      const res = await getAnalisis(paramId);
      if (res.success) setData(res.data);
      setLoading(false);
    }
    init();
  }, [paramId]);

  function handlePrintAnalisis() {
    if (!data) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const today = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Analisis - ${data.produk?.nama}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 15px; }
            .header { text-align: center; margin-bottom: 15px; }
            .header h1 { font-size: 20px; font-weight: bold; margin-bottom: 3px; }
            .header p { font-size: 11px; color: #666; }
            .divider { border-bottom: 1px solid #000; margin: 10px 0; }
            .title { text-align: center; margin-bottom: 15px; font-size: 14px; font-weight: bold; }
            .info { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; }
            .info-left { text-align: left; }
            .info-right { text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 5px; text-align: left; }
            th { background: #f5f5f5; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .result-box { padding: 10px; margin-bottom: 15px; }
            .result-box h3 { font-size: 12px; margin-bottom: 5px; }
            .result-box p { font-size: 10px; }
            .eoq-box { background: #dcfce7; border: 1px solid #86efac; }
            .rop-box { background: #fef3c7; border: 1px solid #fcd34d; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${NAMA_TOKO}</h1>
            <p>${ALAMAT_TOKO} | ${KONTAK_TOKO}</p>
          </div>
          <div class="divider"></div>
          <div class="title">LAPORAN HASIL ANALISIS</div>
          <div class="info">
            <div class="info-left">
              <p><strong>Produk:</strong> ${data.produk?.nama}</p>
              <p><strong>Periode:</strong> ${data.periode}</p>
            </div>
            <div class="info-right">
              <p><strong>Tanggal Cetak:</strong> ${today}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th class="text-center">#</th>
                <th>Parameter</th>
                <th class="text-right">Nilai</th>
                <th>Satuan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">1</td>
                <td>Permintaan per Tahun</td>
                <td class="text-right">${data.permintaan_pertahun.toLocaleString("id-ID")}</td>
                <td>unit</td>
              </tr>
              <tr>
                <td class="text-center">2</td>
                <td>Permintaan per Hari</td>
                <td class="text-right">${data.permintaan_perhari.toLocaleString("id-ID")}</td>
                <td>unit</td>
              </tr>
              <tr>
                <td class="text-center">3</td>
                <td>Safety Stock</td>
                <td class="text-right">${data.stok_cadangan.toLocaleString("id-ID")}</td>
                <td>unit</td>
              </tr>
              <tr>
                <td class="text-center">4</td>
                <td>Biaya Pemesanan</td>
                <td class="text-right">${data.biaya_pemesanan.toLocaleString("id-ID")}</td>
                <td>Rp</td>
              </tr>
              <tr>
                <td class="text-center">5</td>
                <td>Biaya Penyimpanan</td>
                <td class="text-right">${data.biaya_penyimpanan.toLocaleString("id-ID")}</td>
                <td>Rp</td>
              </tr>
              <tr>
                <td class="text-center">6</td>
                <td>Waktu Tunggu</td>
                <td class="text-right">${data.lama_pemesanan}</td>
                <td>hari</td>
              </tr>
            </tbody>
          </table>
          <div class="result-box eoq-box">
            <h3>EOQ (Economic Order Quantity)</h3>
            <p><strong>Hasil: ${data.eoq.toLocaleString("id-ID")} unit</strong></p>
            <p>Rumus: EOQ = √ (2 × D × S / H) = √(${data.permintaan_pertahun} × ${data.biaya_pemesanan} / ${data.biaya_penyimpanan})</p>
          </div>
          <div class="result-box rop-box">
            <h3>ROP (Reorder Point)</h3>
            <p><strong>Hasil: ${data.rop.toLocaleString("id-ID")} unit</strong></p>
            <p>Rumus: ROP = (d × L) + SS = (${data.permintaan_perhari} × ${data.lama_pemesanan}) + ${data.stok_cadangan}</p>
          </div>
          <div class="footer">
            <p>Dicetak pada ${today}</p>
            <p>${NAMA_TOKO} - Sistem Inventory</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
        <p className="text-gray-400 text-sm">Data analisis tidak ditemukan.</p>
      </div>
    );
  }

  const eoqNumerator = 2 * data.permintaan_pertahun * data.biaya_pemesanan;
  const eoqDivided =
    data.biaya_penyimpanan > 0 ? eoqNumerator / data.biaya_penyimpanan : 0;
  const ropStep1 = data.permintaan_perhari * data.lama_pemesanan;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/analisis"
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
            Detail Hasil Analisis
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Produk: {data.produk?.nama} — Periode {data.periode}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-600 rounded-2xl p-6 text-white shadow-lg shadow-green-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
              Economic Order Quantity
            </p>
            <h2 className="text-4xl font-black">
              {data.eoq.toLocaleString("id-ID")}
              <span className="text-lg font-normal opacity-70 ml-2">unit</span>
            </h2>
          </div>
          <p className="text-xs font-medium opacity-90 mt-4 leading-relaxed">
            Jumlah pesanan paling optimal untuk meminimalkan total biaya
            persediaan.
          </p>
        </div>
        <div className="bg-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-amber-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">
              Reorder Point
            </p>
            <h2 className="text-4xl font-black">
              {data.rop.toLocaleString("id-ID")}
              <span className="text-lg font-normal opacity-70 ml-2">unit</span>
            </h2>
          </div>
          <p className="text-xs font-medium opacity-90 mt-4 leading-relaxed">
            Titik persediaan di mana pemesanan baru harus segera dilakukan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between bg-green-50 px-6 py-4 border-b border-green-100">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                Q
              </span>
              <span className="text-sm font-bold text-green-900">
                EOQ — Langkah Perhitungan
              </span>
            </div>
            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-lg">
              Qty Optimal
            </span>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-600 font-mono">
                EOQ = √ ( 2 × D × S / H )
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Langkah Penyelesaian
                </p>
              </div>
              <div className="px-4 py-4 space-y-3">
                {[
                  {
                    n: "1",
                    text: `2 × ${data.permintaan_pertahun.toLocaleString("id-ID")} × ${data.biaya_pemesanan.toLocaleString("id-ID")} = `,
                    bold: eoqNumerator.toLocaleString("id-ID"),
                  },
                  {
                    n: "2",
                    text: `${eoqNumerator.toLocaleString("id-ID")} ÷ ${data.biaya_penyimpanan.toLocaleString("id-ID")} = `,
                    bold: eoqDivided.toFixed(2),
                  },
                  {
                    n: "3",
                    text: `√ ${eoqDivided.toFixed(2)} = `,
                    bold: Math.sqrt(eoqDivided).toFixed(2),
                  },
                ].map((row) => (
                  <div key={row.n} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-[9px] font-bold text-gray-500 flex items-center justify-center shrink-0">
                      {row.n}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {row.text}
                      <b className="text-gray-700">{row.bold}</b>
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-[9px] font-bold text-green-700 flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-green-700 font-mono">
                    EOQ ≈ {data.eoq.toLocaleString("id-ID")} unit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between bg-amber-50 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                R
              </span>
              <span className="text-sm font-bold text-amber-900">
                ROP — Langkah Perhitungan
              </span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
              Titik Pesan Ulang
            </span>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-center border border-gray-100">
              <p className="text-sm font-bold text-gray-600 font-mono">
                ROP = ( d × L ) + SS
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-100">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Langkah Penyelesaian
                </p>
              </div>
              <div className="px-4 py-4 space-y-3">
                {[
                  {
                    n: "1",
                    text: `d × L = ${data.permintaan_perhari} × ${data.lama_pemesanan} = `,
                    bold: ropStep1.toLocaleString("id-ID"),
                  },
                  {
                    n: "2",
                    text: `${ropStep1.toLocaleString("id-ID")} + ${data.stok_cadangan.toLocaleString("id-ID")} (SS) = `,
                    bold: data.rop.toLocaleString("id-ID"),
                  },
                ].map((row) => (
                  <div key={row.n} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-[9px] font-bold text-gray-500 flex items-center justify-center shrink-0">
                      {row.n}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {row.text}
                      <b className="text-gray-700">{row.bold}</b>
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-[9px] font-bold text-amber-700 flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-amber-700 font-mono">
                    ROP = {data.rop.toLocaleString("id-ID")} unit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span>
          <h3 className="text-sm font-bold text-gray-800">
            Parameter Perhitungan
          </h3>
        </div>
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {
                label: "Permintaan / Thn",
                value: `${data.permintaan_pertahun.toLocaleString("id-ID")} unit`,
              },
              {
                label: "Permintaan / Hari",
                value: `${data.permintaan_perhari.toLocaleString("id-ID")} unit`,
              },
              {
                label: "Safety Stock",
                value: `${data.stok_cadangan.toLocaleString("id-ID")} unit`,
              },
              {
                label: "Biaya Pesan",
                value: `Rp ${data.biaya_pemesanan.toLocaleString("id-ID")}`,
              },
              {
                label: "Biaya Simpan",
                value: `Rp ${data.biaya_penyimpanan.toLocaleString("id-ID")}`,
              },
              { label: "Waktu Tunggu", value: `${data.lama_pemesanan} hari` },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-gray-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-purple-500 rounded-full"></span>
          <h3 className="text-sm font-bold text-gray-800">
            Evaluasi &amp; Saran Kebijakan
          </h3>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">
              Rekomendasi Kuantitas (EOQ)
            </p>
            <p className="text-sm text-blue-900 leading-relaxed">
              {getKeteranganEOQ(data.eoq, data.permintaan_pertahun)}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">
              Rekomendasi Titik Pesan (ROP)
            </p>
            <p className="text-sm text-amber-900 leading-relaxed">
              {getKeteranganROP(
                data.rop,
                data.permintaan_perhari,
                data.lama_pemesanan,
                data.stok_cadangan,
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          href="/dashboard/analisis"
          className="text-xs font-bold text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Kembali ke Daftar
        </Link>
        <div className="flex gap-3">
          <Link
            href={`/dashboard/analisis/${data.id}/edit`}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition">
            Ubah Parameter
          </Link>
          <button
            onClick={() => handlePrintAnalisis()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
            Cetak Hasil
          </button>
        </div>
      </div>
    </div>
  );
}
