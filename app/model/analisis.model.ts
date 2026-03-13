import type { Produk } from "./produk.model";

export interface Analisis {
  id: number;
  produk_id: number;
  periode: number;
  permintaan_pertahun: number;
  biaya_pemesanan: number;
  biaya_penyimpanan: number;
  permintaan_perhari: number;
  lama_pemesanan: number;
  stok_cadangan: number;
  eoq: number;
  rop: number;
  created_at: string;
}

export interface AnalisisWithProduk extends Analisis {
  produk: Produk;
}

export interface AnalisisPayload {
  produk_id: number;
  periode: number;
  permintaan_pertahun: number;
  biaya_pemesanan: number;
  biaya_penyimpanan: number;
  permintaan_perhari: number;
  lama_pemesanan: number;
  stok_cadangan: number;
  eoq: number;
  rop: number;
}
