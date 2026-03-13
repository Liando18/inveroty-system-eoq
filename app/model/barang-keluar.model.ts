import type { Produk } from "./produk.model";
import type { User } from "./user.model";

export interface BarangKeluar {
  id: number;
  kode: string;
  tanggal: string;
  total: number;
  user_id: number;
  created_at: string;
}

export interface BarangKeluarDetail {
  id: number;
  keluar_id: number;
  produk_id: number;
  harga_jual: number;
  jumlah_jual: number;
  created_at: string;
}

export interface BarangKeluarWithRelasi extends BarangKeluar {
  user: Pick<User, "id" | "nama">;
  barang_keluar_detail: (BarangKeluarDetail & { produk: Produk })[];
}

export interface BarangKeluarPayload {
  kode: string;
  tanggal: string;
  total: number;
  user_id: number;
}

export interface BarangKeluarDetailPayload {
  keluar_id: number;
  produk_id: number;
  harga_jual: number;
  jumlah_jual: number;
}
