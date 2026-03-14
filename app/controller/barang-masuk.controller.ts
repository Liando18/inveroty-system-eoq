import { supabase } from "@/app/lib/supabase";
import type { 
  BarangMasuk, 
  BarangMasukDetail, 
  BarangMasukWithRelasi,
  BarangMasukPayload,
  BarangMasukDetailPayload
} from "@/app/model/barang-masuk.model";

export type BMResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllBarangMasuk(): Promise<BMResult<BarangMasukWithRelasi[]>> {
  const { data, error } = await supabase
    .from("barang_masuk")
    .select("*, supplier(*), user(id, nama), barang_masuk_detail(*, produk(*))")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as BarangMasukWithRelasi[] };
}

export async function getBarangMasuk(id: number): Promise<BMResult<BarangMasukWithRelasi>> {
  const { data, error } = await supabase
    .from("barang_masuk")
    .select("*, supplier(*), user(id, nama), barang_masuk_detail(*, produk(*))")
    .eq("id", id)
    .single();

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as BarangMasukWithRelasi };
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
  } else {
    const { error: insErr } = await supabase.from("stok").insert({
      produk_id: produk_id,
      stok: jumlah,
      minimum: 1,
    });
    if (insErr) return "Insert stok error: " + insErr.message;
  }
  return null;
}

async function updateStokKurang(produk_id: number, jumlah: number): Promise<string | null> {
  const { data: existing, error: selErr } = await supabase
    .from("stok")
    .select("id, stok")
    .eq("produk_id", produk_id);

  if (selErr) return "Select stok error: " + selErr.message;

  if (existing && existing.length > 0) {
    const { error: updErr } = await supabase
      .from("stok")
      .update({ stok: Math.max(0, existing[0].stok - jumlah) })
      .eq("id", existing[0].id);
    if (updErr) return "Update stok kurang error: " + updErr.message;
  }
  return null;
}

export async function createBarangMasukTransaction(
  masuk: BarangMasukPayload,
  details: Omit<BarangMasukDetailPayload, "masuk_id">[]
): Promise<BMResult<null>> {
  const { data: header, error: headErr } = await supabase
    .from("barang_masuk")
    .insert(masuk)
    .select()
    .single();

  if (headErr) return { success: false, message: headErr.message };

  const masuk_id = header.id;

  const detailPayloads = details.map((d) => ({ ...d, masuk_id }));
  const { error: detErr } = await supabase
    .from("barang_masuk_detail")
    .insert(detailPayloads);

  if (detErr) {
    await supabase.from("barang_masuk").delete().eq("id", masuk_id);
    return { success: false, message: detErr.message };
  }

  for (const det of details) {
    const stokErr = await updateStokTambah(det.produk_id, det.jumlah_beli);
    if (stokErr) return { success: false, message: stokErr };
  }

  return { success: true, data: null };
}

export async function updateBarangMasukTransaction(
  id: number,
  masuk: BarangMasukPayload,
  details: Omit<BarangMasukDetailPayload, "masuk_id">[]
): Promise<BMResult<null>> {
  const { data: oldDetails, error: oldDetErr } = await supabase
    .from("barang_masuk_detail")
    .select("*")
    .eq("masuk_id", id);

  if (oldDetErr) return { success: false, message: oldDetErr.message };

  for (const old of oldDetails) {
    await updateStokKurang(old.produk_id, old.jumlah_beli);
  }

  await supabase.from("barang_masuk_detail").delete().eq("masuk_id", id);

  const { error: headErr } = await supabase
    .from("barang_masuk")
    .update(masuk)
    .eq("id", id);

  if (headErr) return { success: false, message: headErr.message };

  const detailPayloads = details.map((d) => ({ ...d, masuk_id: id }));
  await supabase.from("barang_masuk_detail").insert(detailPayloads);

  for (const det of details) {
    await updateStokTambah(det.produk_id, det.jumlah_beli);
  }

  return { success: true, data: null };
}

export async function deleteBarangMasuk(id: number): Promise<BMResult<null>> {
  const { data: details } = await supabase
    .from("barang_masuk_detail")
    .select("*")
    .eq("masuk_id", id);

  if (details) {
    for (const d of details) {
      await updateStokKurang(d.produk_id, d.jumlah_beli);
    }
  }

  await supabase.from("barang_masuk_detail").delete().eq("masuk_id", id);
  const { error } = await supabase.from("barang_masuk").delete().eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
