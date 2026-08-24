import { MapPin, Search } from "lucide-react";

export default function HeroSearch() {
  return (
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Temukan pekerjaan yang tepat untukmu
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Cari lowongan kerja berdasarkan posisi, keahlian,
            perusahaan, atau lokasi yang kamu inginkan.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

          <div className="flex flex-col md:flex-row">

            <div className="flex flex-1 items-center px-3">
              <Search
                size={20}
                className="mr-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="Posisi, keahlian, atau perusahaan"
                className="w-full py-3 text-sm outline-none"
              />
            </div>

            <div className="hidden h-10 w-px bg-slate-200 md:block" />

            <div className="flex flex-1 items-center px-3">
              <MapPin
                size={20}
                className="mr-3 text-slate-400"
              />

              <input
                type="text"
                placeholder="Kota atau lokasi"
                className="w-full py-3 text-sm outline-none"
              />
            </div>

            <button className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-800 md:mt-0">
              <Search size={18} />
              Cari
            </button>

          </div>
        </div>

      </div>
    </section>
  );
}