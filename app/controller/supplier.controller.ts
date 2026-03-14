import { supabase } from "@/app/lib/supabase";
import type { Supplier, SupplierPayload } from "@/app/model/supplier.model";

export type SupplierResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllSuppliers(): Promise<SupplierResult<Supplier[]>> {
  const { data, error } = await supabase
    .from("supplier")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data ?? [] };
}

export async function createSupplier(
  payload: SupplierPayload
): Promise<SupplierResult<null>> {
  const { error } = await supabase.from("supplier").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function updateSupplier(
  id: number,
  payload: SupplierPayload
): Promise<SupplierResult<null>> {
  const { error } = await supabase.from("supplier").update(payload).eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function deleteSupplier(id: number): Promise<SupplierResult<null>> {
  const { error } = await supabase.from("supplier").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
