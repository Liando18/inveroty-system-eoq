export type UserRole = "admin" | "kasir" | "gudang" | "owner";

export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: string;
}

export interface UserSession {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}
