import { supabase } from "@/app/lib/supabase";
import type { User, UserRole } from "@/app/model/user.model";

export type UserResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function getAllUsers(): Promise<UserResult<User[]>> {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, message: error.message };
  return { success: true, data: data ?? [] };
}

export async function createUser(payload: {
  nama: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<UserResult<null>> {
  const { error } = await supabase.from("user").insert(payload);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function updateUser(
  id: number,
  payload: { nama: string; email: string; password: string; role: UserRole },
): Promise<UserResult<null>> {
  const { error } = await supabase.from("user").update(payload).eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}

export async function deleteUser(id: number): Promise<UserResult<null>> {
  const { error } = await supabase.from("user").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  return { success: true, data: null };
}
