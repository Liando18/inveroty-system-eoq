function formatTanggal() {
  return new Date().toLocaleDateString("id-ID", {
    year: "numeric",
  });
}

export default function DashboardFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 md:px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p className="text-[11px] text-gray-400">
        © {formatTanggal()}{" "}
        <span className="font-semibold text-green-600">
          4Yos Veterinary Care
        </span>{" "}
        · Sistem Manajemen Persediaan PWA
      </p>
      <div className="flex gap-1.5">
        {["EOQ v2.1", "ROP Real-time", "PWA Ready"].map((t) => (
          <span
            key={t}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">
            {t}
          </span>
        ))}
      </div>
    </footer>
  );
}
