import { supabase } from "@/app/lib/supabase";
import type { Kategori, KategoriPayload } from "@/app/model/kategori.model";

export type KategoriResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllCategories(): Promise<KategoriResult<Kategori[]>> {
  const { data, error } = await supabase
    .from("kategori")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data ?? [] };
}

export async function createCategory(
  payload: KategoriPayload
): Promise<KategoriResult<null>> {
  const { error } = await supabase.from("kategori").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function updateCategory(
  id: number,
  payload: KategoriPayload
): Promise<KategoriResult<null>> {
  const { error } = await supabase.from("kategori").update(payload).eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function deleteCategory(id: number): Promise<KategoriResult<null>> {
  const { error } = await supabase.from("kategori").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
