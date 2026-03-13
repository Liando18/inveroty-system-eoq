import type { Kategori } from "./kategori.model";

export interface Produk {
  id: number;
  kategori_id: number;
  nama: string;
  harga: number;
  deskripsi: string;
  created_at: string;
}

export interface ProdukWithKategori extends Produk {
  kategori: Kategori;
}

export interface ProdukPayload {
  kategori_id: number;
  nama: string;
  harga: number;
  deskripsi: string;
}
