export interface Kategori {
  id: number;
  nama: string;
  deskripsi: string;
  created_at: string;
}

export interface KategoriPayload {
  nama: string;
  deskripsi: string;
}
