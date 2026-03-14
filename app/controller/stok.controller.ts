import { supabase } from "@/app/lib/supabase";
import type { Stok, StokWithProduk } from "@/app/model/stok.model";

export type StokResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllStok(): Promise<StokResult<Stok[]>> {
  const { data, error } = await supabase
    .from("stok")
    .select("*")
    .order("stok", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as Stok[] };
}

export async function getAllStokWithProduk(): Promise<StokResult<StokWithProduk[]>> {
  const { data, error } = await supabase
    .from("stok")
    .select("*, produk(*, kategori(*))")
    .order("stok", { ascending: true });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as StokWithProduk[] };
}

export async function updateStokManual(
  id: number,
  payload: { stok: number; minimum: number }
): Promise<StokResult<null>> {
  const { error } = await supabase
    .from("stok")
    .update(payload)
    .eq("id", id);

  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
