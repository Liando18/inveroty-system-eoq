export default function LocationSection() {
  return (
    <section id="lokasi" className="py-20 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <div>
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
            LOKASI & KONTAK
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-5">
            Temukan Kami di
            <br />
            Kota Padang
          </h2>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8">
            Berlokasi strategis di Kecamatan Kuranji, mudah dijangkau dari
            berbagai penjuru kota Padang.
          </p>
          <div className="space-y-3">
            {[
              {
                label: "Alamat",
                text: "Jl. Durian Tarung No.10, Ps. Ambacang, Kec. Kuranji, Kota Padang, Sumatera Barat 25175",
              },
              { label: "Telepon", text: "+62 822-8631-6881" },
              {
                label: "Jam Buka",
                text: "Selasa – Senin: 08.00–22.00  |  Kamis: 08.00–21.30",
              },
            ].map((c) => (
              <div
                key={c.label}
                className="p-4 bg-white border border-gray-200 rounded-xl">
                <p className="text-[11px] font-bold text-green-600 uppercase tracking-wider mb-1">
                  {c.label}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl h-64 sm:h-80 shadow-lg flex flex-col items-center justify-center gap-4 p-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-3xl">
            📍
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">4Yos Veterinary Care Care</p>
            <p className="text-sm text-gray-500 mt-1">
              Jl. Durian Tarung No.10, Kec. Kuranji, Padang
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=4Yos+Veterinary+Care+Padang"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl shadow-md shadow-green-200 hover:bg-green-700 transition-colors">
            Buka di Google Maps →
          </a>
        </div>
      </div>
    </section>
  );
}
