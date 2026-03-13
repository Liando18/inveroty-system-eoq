import { SERVICES } from "./constants";

export default function ServicesSection() {
  return (
    <section id="layanan" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-xs font-bold text-green-500 uppercase tracking-widest">
            LAYANAN KAMI
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mt-3 mb-4">
            Perawatan Lengkap untuk
            <br />
            Sahabat Berbulu Anda
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Dokter berpengalaman dan fasilitas modern untuk kesehatan optimal
            hewan peliharaan Anda.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-250">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl mb-5">
                {s.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2.5">
                {s.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
