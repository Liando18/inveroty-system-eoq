import type { Produk } from "./produk.model";

export interface Stok {
  id: number;
  produk_id: number;
  stok: number;
  minimun: number;
  created_at: string;
}

export interface StokWithProduk extends Stok {
  produk: Produk;
}
