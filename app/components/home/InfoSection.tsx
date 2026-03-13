import { INFO } from "./constants";

export default function InfoSection() {
  return (
    <section id="tentang" className="bg-green-800">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
          {INFO.map((item) => (
            <div key={item.title} className="px-6 sm:px-9 py-10 sm:py-14">
              <div className="text-2xl mb-4">{item.icon}</div>
              <p className="font-bold text-white text-sm mb-2.5">
                {item.title}
              </p>
              {item.lines.map((l) => (
                <p key={l} className="text-white/50 text-xs leading-loose">
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
