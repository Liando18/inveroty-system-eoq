"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllProducts } from "@/app/controller/produk.controller";
import {
  getPermintaanTahun,
  getSafetyStock,
  hitungEOQ,
  hitungROP,
  getKeteranganEOQ,
  getKeteranganROP,
  createAnalisis,
} from "@/app/controller/analisis.controller";
import type { ProdukWithKategori } from "@/app/model/produk.model";

export default function TambahAnalisisPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProdukWithKategori[]>([]);
  const [loading, setLoading] = useState(true);

  const [produkId, setProdukId] = useState<number>(0);
  const [periode, setPeriode] = useState<string>("");
  const [biayaPemesanan, setBiayaPemesanan] = useState<number>(0);
  const [biayaPenyimpanan, setBiayaPenyimpanan] = useState<number>(0);
  const [lamaPemesanan, setLamaPemesanan] = useState<number>(0);

  const [permintaanTahun, setPermintaanTahun] = useState<number>(0);
  const [safetyStock, setSafetyStock] = useState<number>(0);
  const [isFetchingAuto, setIsFetchingAuto] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const periodeNum = Number(periode);
  const permintaanHari =
    permintaanTahun > 0
      ? Math.round((permintaanTahun / 365) * 10000) / 10000
      : 0;
  const eoq = hitungEOQ(permintaanTahun, biayaPemesanan, biayaPenyimpanan);
  const rop = hitungROP(permintaanHari, lamaPemesanan, safetyStock);
  const hasResult = eoq > 0 || rop > 0;

  const eoqNumerator = 2 * permintaanTahun * biayaPemesanan;
  const eoqDivided = biayaPenyimpanan > 0 ? eoqNumerator / biayaPenyimpanan : 0;
  const ropStep1 = permintaanHari * lamaPemesanan;

  useEffect(() => {
    async function init() {
      const res = await getAllProducts();
      if (res.success) setProducts(res.data);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    async function autoFetch() {
      if (!produkId || !periodeNum) return;
      setIsFetchingAuto(true);
      const [demand, ss] = await Promise.all([
        getPermintaanTahun(produkId, periodeNum),
        getSafetyStock(produkId),
      ]);
      setPermintaanTahun(demand);
      setSafetyStock(ss);
      setIsFetchingAuto(false);
    }
    autoFetch();
  }, [produkId, periodeNum]);

  async function handleSave() {
    setErrorMsg("");
    if (!produkId) return setErrorMsg("Pilih produk terlebih dahulu.");
    if (!periodeNum) return setErrorMsg("Isi periode terlebih dahulu.");
    if (!hasResult) return setErrorMsg("Lengkapi semua input terlebih dahulu.");
    setSaving(true);
    const res = await createAnalisis({
      produk_id: produkId,
      periode: periodeNum,
      permintaan_pertahun: permintaanTahun,
      biaya_pemesanan: biayaPemesanan,
      biaya_penyimpanan: biayaPenyimpanan,
      permintaan_perhari: permintaanHari,
      lama_pemesanan: lamaPemesanan,
      stok_cadangan: safetyStock,
      eoq,
      rop,
    });
    if (!res.success) {
      setErrorMsg(res.message);
      setSaving(false);
      return;
    }
    router.push("/dashboard/analisis");
  }

  if (loading) {
    return (
      <div className="flex py-20 items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const field = {
    wrapper: { marginBottom: "20px" } as React.CSSProperties,
    label: {
      display: "block",
      fontSize: "11px",
      fontWeight: 700,
      color: "#6b7280",
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      marginBottom: "8px",
    } as React.CSSProperties,
    input: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      fontSize: "14px",
      color: "#1f2937",
      background: "#fff",
      outline: "none",
      boxSizing: "border-box" as const,
    } as React.CSSProperties,
  };

  return (
    <div style={{ paddingBottom: "48px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "32px",
        }}>
        <Link
          href="/dashboard/analisis"
          className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
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
            Tambah Analisis Baru
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Metode Economic Order Quantity &amp; Reorder Point
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "20px 24px",
                borderBottom: "1px solid #f3f4f6",
              }}>
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <h2 className="text-sm font-bold text-gray-700">
                Pilih Produk &amp; Periode
              </h2>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={field.wrapper}>
                <label style={field.label}>Produk</label>
                <select
                  value={produkId}
                  onChange={(e) => setProdukId(Number(e.target.value))}
                  style={field.input}>
                  <option value={0}>— Pilih Produk —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div style={field.wrapper}>
                <label style={field.label}>Periode (Tahun)</label>
                <input
                  type="number"
                  value={periode}
                  onChange={(e) => setPeriode(e.target.value)}
                  placeholder="Contoh: 2025"
                  style={field.input}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                }}>
                {isFetchingAuto && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div
                  style={{
                    background: "#f9fafb",
                    padding: "10px 16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                    Nilai Otomatis dari Database
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #f9fafb",
                  }}>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Permintaan / Tahun (D)
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#4f46e5",
                    }}>
                    {permintaanTahun.toLocaleString("id-ID")} unit
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: "1px solid #f9fafb",
                  }}>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Permintaan / Hari (d)
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#4f46e5",
                    }}>
                    {permintaanHari.toLocaleString("id-ID")} unit
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                  }}>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>
                    Safety Stock (SS)
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#d97706",
                    }}>
                    {safetyStock.toLocaleString("id-ID")} unit
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "20px 24px",
                borderBottom: "1px solid #f3f4f6",
              }}>
              <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-sm font-bold text-gray-700">
                Parameter Biaya &amp; Lead Time
              </h2>
            </div>
            <div style={{ padding: "24px" }}>
              <div style={field.wrapper}>
                <label style={field.label}>
                  Biaya Pemesanan / S (Rp/pesan)
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "13px",
                      color: "#9ca3af",
                      fontWeight: 600,
                      pointerEvents: "none",
                    }}>
                    Rp
                  </span>
                  <input
                    type="number"
                    value={biayaPemesanan || ""}
                    onChange={(e) => setBiayaPemesanan(Number(e.target.value))}
                    placeholder="50000"
                    style={{ ...field.input, paddingLeft: "40px" }}
                  />
                </div>
              </div>

              <div style={field.wrapper}>
                <label style={field.label}>
                  Biaya Penyimpanan / H (Rp/unit/tahun)
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "13px",
                      color: "#9ca3af",
                      fontWeight: 600,
                      pointerEvents: "none",
                    }}>
                    Rp
                  </span>
                  <input
                    type="number"
                    value={biayaPenyimpanan || ""}
                    onChange={(e) =>
                      setBiayaPenyimpanan(Number(e.target.value))
                    }
                    placeholder="2000"
                    style={{ ...field.input, paddingLeft: "40px" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 0 }}>
                <label style={field.label}>Lead Time / L (hari)</label>
                <input
                  type="number"
                  value={lamaPemesanan || ""}
                  onChange={(e) => setLamaPemesanan(Number(e.target.value))}
                  placeholder="3"
                  style={field.input}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f0fdf4",
                padding: "16px 24px",
                borderBottom: "1px solid #bbf7d0",
              }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="w-7 h-7 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center shrink-0">
                  Q
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#14532d",
                  }}>
                  EOQ — Economic Order Quantity
                </span>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#15803d",
                  background: "#dcfce7",
                  padding: "4px 10px",
                  borderRadius: "8px",
                }}>
                Qty Optimal
              </span>
            </div>
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "monospace",
                  }}>
                  EOQ = √ ( 2 × D × S / H )
                </p>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                    Langkah Penyelesaian
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}>
                  {[
                    {
                      n: "1",
                      text: `2 × ${permintaanTahun.toLocaleString("id-ID")} × ${biayaPemesanan.toLocaleString("id-ID")} = `,
                      bold: eoqNumerator.toLocaleString("id-ID"),
                      color: "#374151",
                    },
                    {
                      n: "2",
                      text: `${eoqNumerator.toLocaleString("id-ID")} ÷ ${biayaPenyimpanan.toLocaleString("id-ID")} = `,
                      bold: eoqDivided.toFixed(2),
                      color: "#374151",
                    },
                    {
                      n: "3",
                      text: `√ ${eoqDivided.toFixed(2)} = `,
                      bold: Math.sqrt(eoqDivided).toFixed(2),
                      color: "#374151",
                    },
                  ].map((row) => (
                    <div
                      key={row.n}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}>
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#e5e7eb",
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                        {row.n}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontFamily: "monospace",
                        }}>
                        {row.text}
                        <b style={{ color: row.color }}>{row.bold}</b>
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#dcfce7",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#15803d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#15803d",
                        fontFamily: "monospace",
                      }}>
                      EOQ ≈ {eoq.toLocaleString("id-ID")} unit
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f0fdf4",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  border: "1px solid #bbf7d0",
                }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#15803d",
                    fontWeight: 600,
                  }}>
                  Kuantitas Pesan Optimal
                </span>
                <div>
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#15803d",
                    }}>
                    {eoq.toLocaleString("id-ID")}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#16a34a",
                      fontWeight: 600,
                      marginLeft: "6px",
                    }}>
                    unit
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#fffbeb",
                padding: "16px 24px",
                borderBottom: "1px solid #fde68a",
              }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shrink-0">
                  R
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#78350f",
                  }}>
                  ROP — Reorder Point
                </span>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#b45309",
                  background: "#fef3c7",
                  padding: "4px 10px",
                  borderRadius: "8px",
                }}>
                Titik Pesan Ulang
              </span>
            </div>
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}>
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  textAlign: "center",
                  border: "1px solid #e5e7eb",
                }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#374151",
                    fontFamily: "monospace",
                  }}>
                  ROP = ( d × L ) + SS
                </p>
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  overflow: "hidden",
                }}>
                <div
                  style={{
                    padding: "10px 16px",
                    borderBottom: "1px solid #e5e7eb",
                  }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}>
                    Langkah Penyelesaian
                  </p>
                </div>
                <div
                  style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}>
                  {[
                    {
                      n: "1",
                      text: `d × L = ${permintaanHari} × ${lamaPemesanan} = `,
                      bold: ropStep1.toLocaleString("id-ID"),
                      color: "#374151",
                    },
                    {
                      n: "2",
                      text: `${ropStep1.toLocaleString("id-ID")} + ${safetyStock.toLocaleString("id-ID")} (SS) = `,
                      bold: rop.toLocaleString("id-ID"),
                      color: "#374151",
                    },
                  ].map((row) => (
                    <div
                      key={row.n}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}>
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#e5e7eb",
                          fontSize: "9px",
                          fontWeight: 700,
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}>
                        {row.n}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontFamily: "monospace",
                        }}>
                        {row.text}
                        <b style={{ color: row.color }}>{row.bold}</b>
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#fef3c7",
                        fontSize: "9px",
                        fontWeight: 700,
                        color: "#b45309",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                      ✓
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: "#b45309",
                        fontFamily: "monospace",
                      }}>
                      ROP = {rop.toLocaleString("id-ID")} unit
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#fffbeb",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  border: "1px solid #fde68a",
                }}>
                <span
                  style={{
                    fontSize: "14px",
                    color: "#b45309",
                    fontWeight: 600,
                  }}>
                  Titik Pemesanan Ulang
                </span>
                <div>
                  <span
                    style={{
                      fontSize: "32px",
                      fontWeight: 900,
                      color: "#b45309",
                    }}>
                    {rop.toLocaleString("id-ID")}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#d97706",
                      fontWeight: 600,
                      marginLeft: "6px",
                    }}>
                    unit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {hasResult && (
            <div className="bg-white rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
              <div
                style={{
                  background: "#eff6ff",
                  padding: "16px 24px",
                  borderBottom: "1px solid #bfdbfe",
                }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1e3a8a",
                  }}>
                  Interpretasi &amp; Evaluasi
                </span>
              </div>
              <div
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}>
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#93c5fd",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "8px",
                    }}>
                    Evaluasi EOQ
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}>
                    {getKeteranganEOQ(eoq, permintaanTahun)}
                  </p>
                </div>
                <div
                  style={{
                    borderTop: "1px solid #eff6ff",
                    paddingTop: "20px",
                  }}>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#93c5fd",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "8px",
                    }}>
                    Evaluasi ROP
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#374151",
                      lineHeight: "1.6",
                    }}>
                    {getKeteranganROP(
                      rop,
                      permintaanHari,
                      lamaPemesanan,
                      safetyStock,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {errorMsg && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#ef4444",
                  fontWeight: 600,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  textAlign: "center",
                }}>
                {errorMsg}
              </p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !hasResult}
              className="w-full rounded-2xl text-white font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              style={{
                padding: "16px",
                background: saving || !hasResult ? "#f3f4f6" : "#16a34a",
                color: saving || !hasResult ? "#9ca3af" : "#fff",
                border: "none",
                cursor: saving || !hasResult ? "not-allowed" : "pointer",
                boxShadow:
                  saving || !hasResult
                    ? "none"
                    : "0 4px 24px rgba(22,163,74,0.18)",
              }}>
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Simpan Hasil Analisis
                </>
              )}
            </button>
            <p
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "#9ca3af",
              }}>
              Tombol aktif setelah EOQ &amp; ROP terhitung.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
