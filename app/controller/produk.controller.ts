import { supabase } from "@/app/lib/supabase";
import type { Produk, ProdukPayload, ProdukWithKategori } from "@/app/model/produk.model";

export type ProdukResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllProducts(): Promise<ProdukResult<ProdukWithKategori[]>> {
  const { data, error } = await supabase
    .from("produk")
    .select("*, kategori(*)")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data as ProdukWithKategori[] };
}

export async function createProduct(
  payload: ProdukPayload
): Promise<ProdukResult<null>> {
  const { error } = await supabase.from("produk").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function updateProduct(
  id: number,
  payload: ProdukPayload
): Promise<ProdukResult<null>> {
  const { error } = await supabase.from("produk").update(payload).eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function deleteProduct(id: number): Promise<ProdukResult<null>> {
  const { error } = await supabase.from("produk").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
