import { supabase } from "@/app/lib/supabase";
import type {
  BarangKeluar,
  BarangKeluarDetail,
  BarangKeluarWithRelasi,
  BarangKeluarPayload,
  BarangKeluarDetailPayload
} from "@/app/model/barang-keluar.model";

export type BKResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllBarangKeluar(): Promise<BKResult<BarangKeluarWithRelasi[]>> {
  const { data, error } = await supabase
    .from("barang_keluar")
    .select("*, user(id, nama), barang_keluar_detail(*, produk(*))")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as BarangKeluarWithRelasi[] };
}

export async function getBarangKeluar(id: number): Promise<BKResult<BarangKeluarWithRelasi>> {
  const { data, error } = await supabase
    .from("barang_keluar")
    .select("*, user(id, nama), barang_keluar_detail(*, produk(*))")
    .eq("id", id)
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as BarangKeluarWithRelasi };
}

async function updateStokKurang(produk_id: number, jumlah: number): Promise<string | null> {
  const { data: existing, error: selErr } = await supabase
    .from("stok")
    .select("id, stok")
    .eq("produk_id", produk_id);

  if (selErr) return "Select stok error: " + selErr.message;

  if (existing && existing.length > 0) {
    const newStok = existing[0].stok - jumlah;
    if (newStok < 0) return "Stok tidak mencukupi untuk produk ini.";
    const { error: updErr } = await supabase
      .from("stok")
      .update({ stok: newStok })
      .eq("id", existing[0].id);
    if (updErr) return "Update stok error: " + updErr.message;
  } else {
    return "Stok produk belum tersedia. Lakukan barang masuk terlebih dahulu.";
  }
  return null;
}

async function updateStokTambah(produk_id: number, jumlah: number): Promise<string | null> {
  const { data: existing, error: selErr } = await supabase
    .from("stok")
    .select("id, stok")
    .eq("produk_id", produk_id);

  if (selErr) return "Select stok error: " + selErr.message;

  if (existing && existing.length > 0) {
    const { error: updErr } = await supabase
      .from("stok")
      .update({ stok: existing[0].stok + jumlah })
      .eq("id", existing[0].id);
    if (updErr) return "Update stok error: " + updErr.message;
  }
  return null;
}

export async function createBarangKeluarTransaction(
  keluar: BarangKeluarPayload,
  details: Omit<BarangKeluarDetailPayload, "keluar_id">[]
): Promise<BKResult<null>> {
  const { data: header, error: headErr } = await supabase
    .from("barang_keluar")
    .insert(keluar)
    .select()
    .single();

  if (headErr) return { success: false, message: headErr.message };

  const keluar_id = header.id;

  const detailPayloads = details.map((d) => ({ ...d, keluar_id }));
  const { error: detErr } = await supabase
    .from("barang_keluar_detail")
    .insert(detailPayloads);

  if (detErr) {
    await supabase.from("barang_keluar").delete().eq("id", keluar_id);
    return { success: false, message: detErr.message };
  }

  for (const det of details) {
    const stokErr = await updateStokKurang(det.produk_id, det.jumlah_jual);
    if (stokErr) return { success: false, message: stokErr };
  }

  return { success: true, data: null };
}

export async function updateBarangKeluarTransaction(
  id: number,
  keluar: BarangKeluarPayload,
  details: Omit<BarangKeluarDetailPayload, "keluar_id">[]
): Promise<BKResult<null>> {
  const { data: oldDetails, error: oldDetErr } = await supabase
    .from("barang_keluar_detail")
    .select("*")
    .eq("keluar_id", id);

  if (oldDetErr) return { success: false, message: oldDetErr.message };

  for (const old of oldDetails) {
    const stokErr = await updateStokTambah(old.produk_id, old.jumlah_jual);
    if (stokErr) return { success: false, message: stokErr };
  }

  await supabase.from("barang_keluar_detail").delete().eq("keluar_id", id);

  const { error: headErr } = await supabase
    .from("barang_keluar")
    .update(keluar)
    .eq("id", id);

  if (headErr) return { success: false, message: headErr.message };

  const detailPayloads = details.map((d) => ({ ...d, keluar_id: id }));
  await supabase.from("barang_keluar_detail").insert(detailPayloads);

  for (const det of details) {
    const stokErr = await updateStokKurang(det.produk_id, det.jumlah_jual);
    if (stokErr) return { success: false, message: stokErr };
  }

  return { success: true, data: null };
}

export async function deleteBarangKeluar(id: number): Promise<BKResult<null>> {
  const { data: details } = await supabase
    .from("barang_keluar_detail")
    .select("*")
    .eq("keluar_id", id);

  if (details) {
    for (const d of details) {
      await updateStokTambah(d.produk_id, d.jumlah_jual);
    }
  }

  await supabase.from("barang_keluar_detail").delete().eq("keluar_id", id);
  const { error } = await supabase.from("barang_keluar").delete().eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
