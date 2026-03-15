import { supabase } from "@/app/lib/supabase";
import type {
  Analisis,
  AnalisisWithProduk,
  AnalisisPayload,
} from "@/app/model/analisis.model";

export type AnalisisResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllAnalisis(): Promise<
  AnalisisResult<AnalisisWithProduk[]>
> {
  const { data, error } = await supabase
    .from("analisis")
    .select("*, produk(*)")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as AnalisisWithProduk[] };
}

export async function getAnalisis(
  id: number,
): Promise<AnalisisResult<AnalisisWithProduk>> {
  const { data, error } = await supabase
    .from("analisis")
    .select("*, produk(*)")
    .eq("id", id)
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as AnalisisWithProduk };
}

export async function createAnalisis(
  payload: AnalisisPayload,
): Promise<AnalisisResult<null>> {
  const { error } = await supabase.from("analisis").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function updateAnalisis(
  id: number,
  payload: AnalisisPayload,
): Promise<AnalisisResult<null>> {
  const { error } = await supabase
    .from("analisis")
    .update(payload)
    .eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function deleteAnalisis(
  id: number,
): Promise<AnalisisResult<null>> {
  const { error } = await supabase.from("analisis").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function getPermintaanTahun(
  produk_id: number,
  tahun: number,
): Promise<number> {
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun}-12-31`;

  const { data, error } = await supabase
    .from("barang_keluar_detail")
    .select("jumlah_jual, barang_keluar!inner(tanggal)")
    .eq("produk_id", produk_id)
    .gte("barang_keluar.tanggal", startDate)
    .lte("barang_keluar.tanggal", endDate);

  if (error || !data) return 0;
  return data.reduce((sum: number, d: any) => sum + (d.jumlah_jual || 0), 0);
}

export async function getPermintaanHarian(
  produk_id: number,
  tahun: number,
): Promise<number> {
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun}-12-31`;

  const { data, error } = await supabase
    .from("barang_keluar_detail")
    .select("jumlah_jual, barang_keluar!inner(tanggal)")
    .eq("produk_id", produk_id)
    .gte("barang_keluar.tanggal", startDate)
    .lte("barang_keluar.tanggal", endDate);

  if (error || !data || data.length === 0) return 0;

  const totalJual = data.reduce(
    (sum: number, d: any) => sum + (d.jumlah_jual || 0),
    0,
  );

  
  const hariUnik = new Set(data.map((d: any) => d.barang_keluar?.tanggal)).size;

  if (hariUnik === 0) return 0;

  
  return Math.round((totalJual / hariUnik) * 100) / 100;
}

export async function getSafetyStock(produk_id: number): Promise<number> {
  const { data } = await supabase
    .from("stok")
    .select("minimum")
    .eq("produk_id", produk_id);

  if (data && data.length > 0) return data[0].minimum || 0;
  return 0;
}

export function hitungEOQ(D: number, S: number, H: number): number {
  if (D <= 0 || S <= 0 || H <= 0) return 0;
  return Math.round(Math.sqrt((2 * D * S) / H));
}

export function hitungROP(d: number, L: number, SS: number): number {
  return Math.round(d * L + SS);
}

export function getKeteranganEOQ(eoq: number, D: number): string {
  if (eoq <= 0) return "Tidak dapat menghitung EOQ karena data belum lengkap.";
  const frekuensi = Math.ceil(D / eoq);
  const lines: string[] = [];
  lines.push(
    `Jumlah pemesanan paling ekonomis adalah sebanyak ${eoq.toLocaleString("id-ID")} unit per sekali pesan.`,
  );
  lines.push(
    `Dengan permintaan ${D.toLocaleString("id-ID")} unit per tahun, frekuensi pemesanan optimal adalah sekitar ${frekuensi} kali per tahun.`,
  );
  if (frekuensi <= 4) {
    lines.push(
      "Frekuensi pemesanan tergolong rendah, ini menandakan biaya pemesanan per unit relatif tinggi sehingga lebih efisien memesan dalam jumlah besar.",
    );
  } else if (frekuensi <= 12) {
    lines.push(
      "Frekuensi pemesanan cukup ideal, berada pada keseimbangan antara biaya pemesanan dan biaya penyimpanan.",
    );
  } else {
    lines.push(
      "Frekuensi pemesanan tergolong tinggi, pertimbangkan untuk meninjau kembali biaya penyimpanan agar tidak terlalu membebani gudang.",
    );
  }
  return lines.join(" ");
}

export function getKeteranganROP(
  rop: number,
  d: number,
  L: number,
  SS: number,
): string {
  if (rop <= 0) return "Tidak dapat menghitung ROP karena data belum lengkap.";
  const lines: string[] = [];
  lines.push(
    `Titik pemesanan ulang (Reorder Point) berada pada ${rop.toLocaleString("id-ID")} unit.`,
  );
  lines.push(
    `Artinya, ketika stok gudang mencapai ${rop.toLocaleString("id-ID")} unit, perusahaan harus segera melakukan pemesanan ulang.`,
  );
  lines.push(
    `Dengan rata-rata permintaan ${d.toLocaleString("id-ID")} unit/hari aktif dan waktu tunggu pengiriman ${L} hari, stok cadangan (safety stock) sebesar ${SS.toLocaleString("id-ID")} unit cukup untuk mengantisipasi keterlambatan.`,
  );
  if (SS === 0) {
    lines.push(
      "Perhatian: Stok cadangan bernilai 0, artinya tidak ada buffer jika terjadi keterlambatan pengiriman. Disarankan untuk menambahkan safety stock.",
    );
  }
  return lines.join(" ");
}
