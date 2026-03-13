import type { Supplier } from "./supplier.model";
import type { Produk } from "./produk.model";
import type { User } from "./user.model";

export interface BarangMasuk {
  id: number;
  supplier_id: number;
  kode: string;
  tanggal: string;
  total: number;
  user_id: number;
  created_at: string;
}

export interface BarangMasukDetail {
  id: number;
  masuk_id: number;
  produk_id: number;
  harga_beli: number;
  jumlah_beli: number;
  created_at: string;
}

export interface BarangMasukWithRelasi extends BarangMasuk {
  supplier: Supplier;
  user: Pick<User, "id" | "nama">;
  barang_masuk_detail: (BarangMasukDetail & { produk: Produk })[];
}

export interface BarangMasukPayload {
  supplier_id: number;
  kode: string;
  tanggal: string;
  total: number;
  user_id: number;
}

export interface BarangMasukDetailPayload {
  masuk_id: number;
  produk_id: number;
  harga_beli: number;
  jumlah_beli: number;
}
