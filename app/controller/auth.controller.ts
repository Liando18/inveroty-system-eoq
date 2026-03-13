import { supabase } from "@/app/lib/supabase";
import type { LoginPayload, UserSession } from "@/app/model/user.model";

const SESSION_KEY = "4yos_session";

export type AuthResult<T> =
  | { success: true; data: T }
  | { success: false; message: string };

export async function login(
  payload: LoginPayload,
  rememberMe: boolean,
): Promise<AuthResult<UserSession>> {
  const { email, password } = payload;

  const { data, error } = await supabase
    .from("user")
    .select("id, nama, email, password, role")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("LOGIN ERROR:", error.code, error.message, error.details);
    return { success: false, message: `Error: ${error.message}` };
  }

  if (!data) {
    return { success: false, message: "Email tidak ditemukan." };
  }

  if (data.password !== password) {
    return { success: false, message: "Password salah." };
  }

  const session: UserSession = {
    id: data.id,
    nama: data.nama,
    email: data.email,
    role: data.role,
  };

  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return { success: true, data: session };
}

export function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;

  const fromLocal = localStorage.getItem(SESSION_KEY);
  if (fromLocal) {
    try {
      return JSON.parse(fromLocal) as UserSession;
    } catch {
      /* skip */
    }
  }

  const fromSession = sessionStorage.getItem(SESSION_KEY);
  if (fromSession) {
    try {
      return JSON.parse(fromSession) as UserSession;
    } catch {
      /* skip */
    }
  }

  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export async function sendResetEmail(email: string): Promise<AuthResult<null>> {
  const { data, error } = await supabase
    .from("user")
    .select("id")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error("RESET EMAIL ERROR:", error.code, error.message);
    return { success: false, message: `Error: ${error.message}` };
  }

  if (!data) {
    return { success: false, message: "Email tidak ditemukan." };
  }

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email.trim().toLowerCase(),
    { redirectTo: `${window.location.origin}/login/reset-password` },
  );

  if (resetError) {
    return { success: false, message: "Gagal mengirim email. Coba lagi." };
  }

  return { success: true, data: null };
}

export async function resetPassword(
  newPassword: string,
): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return {
      success: false,
      message: "Gagal memperbarui password. Coba lagi.",
    };
  }

  return { success: true, data: null };
}
