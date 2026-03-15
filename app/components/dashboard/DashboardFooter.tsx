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
          4Yos Veterinary Care Care
        </span>{" "}
        · Sistem Manajemen Persediaan PWA
      </p>
    </footer>
  );
}
