export interface Supplier {
  id: number;
  nama: string;
  kontak: string;
  alamat: string;
  created_at: string;
}

export interface SupplierPayload {
  nama: string;
  kontak: string;
  alamat: string;
}
