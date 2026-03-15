import { supabase } from "@/app/lib/supabase";

export interface LaporanBarangMasuk {
  id: number;
  kode: string;
  tanggal: string;
  supplier_id: number;
  supplier_nama: string;
  total: number;
  user_id: number;
  user_nama: string;
  details: {
    produk_id: number;
    produk_nama: string;
    kategori_nama: string;
    harga_beli: number;
    jumlah_beli: number;
  }[];
}

export interface LaporanBarangMasukAggregated {
  periode: string;
  jumlah_barang: number;
  total_transaksi: number;
}

export interface LaporanBarangKeluar {
  id: number;
  kode: string;
  tanggal: string;
  total: number;
  user_id: number;
  user_nama: string;
  details: {
    produk_id: number;
    produk_nama: string;
    kategori_nama: string;
    harga_jual: number;
    jumlah_jual: number;
  }[];
}

export interface LaporanBarangKeluarAggregated {
  periode: string;
  jumlah_barang: number;
  total_transaksi: number;
}

export interface LaporanStok {
  id: number;
  produk_id: number;
  produk_nama: string;
  kategori_id: number;
  kategori_nama: string;
  stok: number;
  minimum: number;
}

export type LaporanResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getLaporanBarangMasukHarian(
  tanggal: string,
): Promise<LaporanResult<LaporanBarangMasuk[]>> {
  const { data, error } = await supabase
    .from("barang_masuk")
    .select(
      "*, supplier(nama), user(nama), barang_masuk_detail(*, produk(nama, kategori(nama)))",
    )
    .eq("tanggal", tanggal)
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };

  const formatted = (data || []).map((item: any) => ({
    id: item.id,
    kode: item.kode,
    tanggal: item.tanggal,
    supplier_id: item.supplier_id,
    supplier_nama: item.supplier?.nama || "",
    total: item.total,
    user_id: item.user_id,
    user_nama: item.user?.nama || "",
    details: (item.barang_masuk_detail || []).map((d: any) => ({
      produk_id: d.produk_id,
      produk_nama: d.produk?.nama || "",
      kategori_nama: d.produk?.kategori?.nama || "",
      harga_beli: d.harga_beli,
      jumlah_beli: d.jumlah_beli,
    })),
  }));

  return { success: true, data: formatted };
}

export async function getLaporanBarangMasukBulanan(
  tahun: number,
  bulan: number,
): Promise<LaporanResult<LaporanBarangMasukAggregated[]>> {
  const startDate = `${tahun}-${String(bulan).padStart(2, "0")}-01`;
  const endDate =
    bulan === 12
      ? `${tahun + 1}-01-01`
      : `${tahun}-${String(bulan + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("barang_masuk")
    .select("*, barang_masuk_detail(*)")
    .gte("tanggal", startDate)
    .lt("tanggal", endDate)
    .order("tanggal", { ascending: true });

  if (error) return { success: false, message: error.message };

  const weekMap = new Map<string, { jumlah: number; total: number }>();

  (data || []).forEach((item: any) => {
    const date = new Date(item.tanggal);
    const weekNum = getWeekNumber(date);
    const key = `Minggu ${weekNum}`;

    const existing = weekMap.get(key) || { jumlah: 0, total: 0 };
    const jumlahBarang = (item.barang_masuk_detail || []).reduce(
      (sum: number, d: any) => sum + (d.jumlah_beli || 0),
      0,
    );

    weekMap.set(key, {
      jumlah: existing.jumlah + jumlahBarang,
      total: existing.total + (item.total || 0),
    });
  });

  const formatted: LaporanBarangMasukAggregated[] = Array.from(
    weekMap.entries(),
  ).map(([periode, data]) => ({
    periode,
    jumlah_barang: data.jumlah,
    total_transaksi: data.total,
  }));

  return { success: true, data: formatted };
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export async function getLaporanBarangMasukTahunan(
  tahun: number,
): Promise<LaporanResult<LaporanBarangMasukAggregated[]>> {
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun + 1}-01-01`;

  const { data, error } = await supabase
    .from("barang_masuk")
    .select("*, barang_masuk_detail(*)")
    .gte("tanggal", startDate)
    .lt("tanggal", endDate)
    .order("tanggal", { ascending: true });

  if (error) return { success: false, message: error.message };

  const bulanMap = new Map<string, { jumlah: number; total: number }>();
  const bulanLabels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  (data || []).forEach((item: any) => {
    const date = new Date(item.tanggal);
    const bulanIdx = date.getMonth();
    const key = bulanLabels[bulanIdx];

    const existing = bulanMap.get(key) || { jumlah: 0, total: 0 };
    const jumlahBarang = (item.barang_masuk_detail || []).reduce(
      (sum: number, d: any) => sum + (d.jumlah_beli || 0),
      0,
    );

    bulanMap.set(key, {
      jumlah: existing.jumlah + jumlahBarang,
      total: existing.total + (item.total || 0),
    });
  });

  const formatted: LaporanBarangMasukAggregated[] = bulanLabels.map(
    (bulan) => ({
      periode: bulan,
      jumlah_barang: bulanMap.get(bulan)?.jumlah || 0,
      total_transaksi: bulanMap.get(bulan)?.total || 0,
    }),
  );

  return { success: true, data: formatted };
}

export async function getLaporanBarangKeluarHarian(
  tanggal: string,
): Promise<LaporanResult<LaporanBarangKeluar[]>> {
  const { data, error } = await supabase
    .from("barang_keluar")
    .select(
      "*, user(nama), barang_keluar_detail(*, produk(nama, kategori(nama)))",
    )
    .eq("tanggal", tanggal)
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };

  const formatted = (data || []).map((item: any) => ({
    id: item.id,
    kode: item.kode,
    tanggal: item.tanggal,
    total: item.total,
    user_id: item.user_id,
    user_nama: item.user?.nama || "",
    details: (item.barang_keluar_detail || []).map((d: any) => ({
      produk_id: d.produk_id,
      produk_nama: d.produk?.nama || "",
      kategori_nama: d.produk?.kategori?.nama || "",
      harga_jual: d.harga_jual,
      jumlah_jual: d.jumlah_jual,
    })),
  }));

  return { success: true, data: formatted };
}

export async function getLaporanBarangKeluarBulanan(
  tahun: number,
  bulan: number,
): Promise<LaporanResult<LaporanBarangKeluarAggregated[]>> {
  const startDate = `${tahun}-${String(bulan).padStart(2, "0")}-01`;
  const endDate =
    bulan === 12
      ? `${tahun + 1}-01-01`
      : `${tahun}-${String(bulan + 1).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("barang_keluar")
    .select("*, barang_keluar_detail(*)")
    .gte("tanggal", startDate)
    .lt("tanggal", endDate)
    .order("tanggal", { ascending: true });

  if (error) return { success: false, message: error.message };

  const weekMap = new Map<string, { jumlah: number; total: number }>();

  (data || []).forEach((item: any) => {
    const date = new Date(item.tanggal);
    const weekNum = getWeekNumber(date);
    const key = `Minggu ${weekNum}`;

    const existing = weekMap.get(key) || { jumlah: 0, total: 0 };
    const jumlahBarang = (item.barang_keluar_detail || []).reduce(
      (sum: number, d: any) => sum + (d.jumlah_jual || 0),
      0,
    );

    weekMap.set(key, {
      jumlah: existing.jumlah + jumlahBarang,
      total: existing.total + (item.total || 0),
    });
  });

  const formatted: LaporanBarangKeluarAggregated[] = Array.from(
    weekMap.entries(),
  ).map(([periode, data]) => ({
    periode,
    jumlah_barang: data.jumlah,
    total_transaksi: data.total,
  }));

  return { success: true, data: formatted };
}

export async function getLaporanBarangKeluarTahunan(
  tahun: number,
): Promise<LaporanResult<LaporanBarangKeluarAggregated[]>> {
  const startDate = `${tahun}-01-01`;
  const endDate = `${tahun + 1}-01-01`;

  const { data, error } = await supabase
    .from("barang_keluar")
    .select("*, barang_keluar_detail(*)")
    .gte("tanggal", startDate)
    .lt("tanggal", endDate)
    .order("tanggal", { ascending: true });

  if (error) return { success: false, message: error.message };

  const bulanMap = new Map<string, { jumlah: number; total: number }>();
  const bulanLabels = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  (data || []).forEach((item: any) => {
    const date = new Date(item.tanggal);
    const bulanIdx = date.getMonth();
    const key = bulanLabels[bulanIdx];

    const existing = bulanMap.get(key) || { jumlah: 0, total: 0 };
    const jumlahBarang = (item.barang_keluar_detail || []).reduce(
      (sum: number, d: any) => sum + (d.jumlah_jual || 0),
      0,
    );

    bulanMap.set(key, {
      jumlah: existing.jumlah + jumlahBarang,
      total: existing.total + (item.total || 0),
    });
  });

  const formatted: LaporanBarangKeluarAggregated[] = bulanLabels.map(
    (bulan) => ({
      periode: bulan,
      jumlah_barang: bulanMap.get(bulan)?.jumlah || 0,
      total_transaksi: bulanMap.get(bulan)?.total || 0,
    }),
  );

  return { success: true, data: formatted };
}

export async function getLaporanStok(): Promise<LaporanResult<LaporanStok[]>> {
  const { data, error } = await supabase
    .from("stok")
    .select("*, produk(*, kategori(nama))")
    .order("stok", { ascending: true });

  if (error) return { success: false, message: error.message };

  const formatted = (data || []).map((item: any) => ({
    id: item.id,
    produk_id: item.produk_id,
    produk_nama: item.produk?.nama || "",
    kategori_id: item.produk?.kategori_id,
    kategori_nama: item.produk?.kategori?.nama || "",
    stok: item.stok,
    minimum: item.minimum,
  }));

  return { success: true, data: formatted };
}
