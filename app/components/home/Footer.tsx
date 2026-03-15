import Link from "next/link";

function formatTanggal() {
  return new Date().toLocaleDateString("id-ID", {
    year: "numeric",
  });
}

export default function Footer() {
  return (
    <footer className="bg-green-900 pt-14 pb-8 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-lg">
                🐾
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  4Yos Veterinary Care Care
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">
                  Klinik Kesehatan Hewan
                </p>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs">
              Memberikan layanan kesehatan hewan terbaik di Padang, Sumatera
              Barat.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-4">
              Navigasi
            </p>
            {["Beranda", "Layanan", "Tentang", "Lokasi"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
                {l}
              </a>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-4">
              Sistem
            </p>
            <Link
              href="/login"
              className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
              Login Inventori
            </Link>
            <Link
              href="/dashboard"
              className="block text-xs text-white/40 mb-2.5 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/20">
            © {formatTanggal()} 4Yos Veterinary Care Care. All rights reserved.
          </p>
          <p className="text-xs text-white/20">PWA · EOQ & ROP System</p>
        </div>
      </div>
    </footer>
  );
}
