# Sistem Inventori PWA

Aplikasi sistem inventori berbasis Progressive Web App (PWA) yang dibangun dengan Next.js dan Supabase. Aplikasi ini dirancang untuk membantu pengelolaan stok barang, transaksi masuk/keluar, dan pelaporan inventori secara real-time.

## 📋 Fitur Utama

### 1. Manajemen Produk

- Tambah, edit, hapus produk
- Kategori produk
- Informasi harga dan deskripsi

### 2. Transaksi

- **Barang Masuk**: Pencatatan restok dari supplier
- **Barang Keluar**: Pencatatan penjualan/pengeluaran barang
- Riwayat transaksi lengkap

### 3. Manajemen Stok

- Pemantauan stok real-time
- Pengaturan batas minimum stok
- Notifikasi otomatis saat stok menipis

### 4. Pelaporan

- Laporan barang masuk
- Laporan barang keluar
- Laporan stok barang
- Analisis data inventori

### 5. Fitur PWA

- Dapat diinstal di perangkat
- Mode offline (sebagian)
- Tampilan responsif

### 6. Notifikasi Stok

- Notifikasi browser saat stok di bawah minimum
- Real-time monitoring via Navbar

## 🛠️ Teknologi yang Digunakan

| Teknologi        | Deskripsi                                  |
| ---------------- | ------------------------------------------ |
| **Next.js 16**   | Framework React untuk frontend dan backend |
| **Supabase**     | Database dan autentikasi                   |
| **TypeScript**   | Bahasa pemrograman dengan type safety      |
| **Tailwind CSS** | Styling framework                          |
| **PWA**          | Progressive Web App                        |

## 💻 Persyaratan Sistem

### Software yang Harus Diinstal:

1. **Node.js** (versi 18 atau lebih tinggi)
   - Download: https://nodejs.org
2. **npm** atau **yarn** atau **pnpm** (sudah termasuk dengan Node.js)

3. **Git** (untuk version control)
   - Download: https://git-scm.com

4. **Akun Supabase**
   - Daftar: https://supabase.com

5. **Browser** (salah satu):
   - Google Chrome (disarankan)
   - Mozilla Firefox
   - Microsoft Edge
   - Safari (untuk iOS)

### Perangkat yang Didukung:

| Perangkat             | Status      | Catatan                          |
| --------------------- | ----------- | -------------------------------- |
| Desktop (Windows)     | ✅ Didukung | Chrome/Firefox/Edge              |
| Desktop (macOS)       | ✅ Didukung | Chrome/Firefox/Safari            |
| Laptop (Windows)      | ✅ Didukung | Chrome/Firefox/Edge              |
| Laptop (macOS)        | ✅ Didukung | Chrome/Firefox/Safari            |
| Tablet (Android)      | ✅ Didukung | Chrome                           |
| Tablet (iPadOS 16.4+) | ✅ Didukung | Safari, harus Add to Home Screen |
| HP (Android)          | ✅ Didukung | Chrome                           |
| HP (iOS)              | ⚠️ Terbatas | Safari, harus Add to Home Screen |

## 📦 Cara Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd inventory-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Buat file `.env.local` dengan isi berikut:

```env
# URL Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT].supabase.co

# Supabase Publishable Key (Anon Key)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_[YOUR_ANON_KEY]

# Supabase Service Role Key (untuk operasi admin)
SUPABASE_SERVICE_ROLE_KEY=eyJ[YOUR_SERVICE_ROLE_KEY]

# URL Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Konfigurasi Email (untuk reset password)
SMTP_EMAIL=your-email@gmail.com
SMTP_APP_PASSWORD=your-app-password
```

### 4. Setup Database Supabase

Buka **Supabase Dashboard** → **SQL Editor** dan jalankan:

```sql
-- Tabel Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'kasir',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Supplier
CREATE TABLE supplier (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  alamat TEXT,
  telepon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Kategori
CREATE TABLE kategori (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Produk
CREATE TABLE produk (
  id SERIAL PRIMARY KEY,
  kategori_id INTEGER REFERENCES kategori(id),
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Stok
CREATE TABLE stok (
  id SERIAL PRIMARY KEY,
  produk_id INTEGER REFERENCES produk(id),
  stok INTEGER DEFAULT 0,
  minimum INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Barang Masuk
CREATE TABLE barang_masuk (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES supplier(id),
  kode TEXT UNIQUE NOT NULL,
  tanggal DATE NOT NULL,
  total INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Detail Barang Masuk
CREATE TABLE barang_masuk_detail (
  id SERIAL PRIMARY KEY,
  masuk_id INTEGER REFERENCES barang_masuk(id),
  produk_id INTEGER REFERENCES produk(id),
  harga_beli INTEGER NOT NULL,
  jumlah_beli INTEGER NOT NULL
);

-- Tabel Barang Keluar
CREATE TABLE barang_keluar (
  id SERIAL PRIMARY KEY,
  kode TEXT UNIQUE NOT NULL,
  tanggal DATE NOT NULL,
  total INTEGER DEFAULT 0,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Detail Barang Keluar
CREATE TABLE barang_keluar_detail (
  id SERIAL PRIMARY KEY,
  keluar_id INTEGER REFERENCES barang_keluar(id),
  produk_id INTEGER REFERENCES produk(id),
  harga_jual INTEGER NOT NULL,
  jumlah_jual INTEGER NOT NULL
);

-- Enable Realtime untuk Stok
ALTER PUBLICATION supabase_realtime ADD TABLE stok;
```

### 5. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi akan tersedia di **http://localhost:3000**

## 🔐 Akun Default

Buat akun baru melalui halaman registrasi di aplikasi.

## 📱 Cara Menggunakan PWA

### Install di Desktop (Chrome/Edge)

1. Buka aplikasi di Chrome/Edge
2. Klik ikon instalasi di address bar (terlihat seperti komputer dengan panah ke bawah)
3. Klik "Install"

### Install di Android (Chrome)

1. Buka aplikasi di Chrome
2. Klik menu (titik tiga)
3. Pilih "Install App" atau "Tambah ke Layar Utama"

### Install di iOS (Safari)

1. Buka aplikasi di Safari
2. Klik tombol "Share" (kotak dengan panah ke atas)
3. Gulir ke bawah dan pilih "Add to Home Screen"
4. Klik "Add"

## 🔔 Notifikasi Stok

### Mengaktifkan Notifikasi

1. Buka aplikasi di browser
2. Buka pengaturan browser → Notifications
3. Izinkan notifikasi untuk localhost atau domain aplikasi

### Cara Kerja

- Notifikasi akan muncul secara otomatis saat transaksi membuat stok di bawah minimum
- Klik ikon lonceng di Navbar untuk melihat daftar produk dengan stok rendah
- Badge merah menunjukkan jumlah produk yang stoknya di bawah minimum

## 📂 Struktur Project

```
inventory-system/
├── app/
│   ├── api/              # API Routes
│   ├── components/        # Komponen React
│   ├── controller/        # Logika bisnis
│   ├── dashboard/        # Halaman dashboard
│   ├── lib/              # Library & utilities
│   ├── login/            # Halaman login
│   ├── model/            # TypeScript models
│   └── services/         # Service workers
├── public/
│   ├── icon.png          # Ikon aplikasi
│   └── sw.js             # Service worker
└── package.json
```

## 🔧 Development

### Command yang Tersedia

| Command         | Deskripsi                   |
| --------------- | --------------------------- |
| `npm run dev`   | Jalankan development server |
| `npm run build` | Build untuk production      |
| `npm run start` | Jalankan production server  |
| `npm run lint`  | Jalankan ESLint             |

### Lingkungan Development

- URL: http://localhost:3000
- Hot Reload: Aktif (perubahan langsung terlihat)

## 📝 Catatan Penting

1. **Database**: Pastikan semua tabel sudah dibuat di Supabase sebelum menggunakan aplikasi
2. **Environment Variables**: File `.env.local` tidak boleh di-commit ke Git
3. **iOS**: Untuk notifikasi push di iOS, pengguna harus menambahkan aplikasi ke Home Screen
4. **Reset Password**: Pastikan konfigurasi SMTP sudah benar di `.env.local`

## 📄 Lisensi

Proyek ini dibuat untuk tujuan pembelajaran dan pengembangan lebih lanjut.

## 🆘 Troubleshooting

### Error saat menjalankan npm run dev

```bash
# Bersihkan cache dan install ulang
rm -rf node_modules
rm package-lock.json
npm install
```

### Supabase connection error

- Pastikan URL dan key Supabase sudah benar di `.env.local`
- Cek apakah project Supabase masih aktif

### Notifikasi tidak muncul

- Cek pengaturan notification di browser
- Refresh halaman dan klik icon lonceng di Navbar
- Cek console browser untuk melihat error

---

Dibuat dengan ❤️ menggunakan Next.js dan Supabase
