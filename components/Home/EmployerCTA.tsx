export default function EmployerCTA() {
  return (
    <section className="mt-16 rounded-xl bg-slate-900 px-6 py-10 sm:px-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Sedang mencari kandidat?
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            Temukan kandidat terbaik untuk perusahaanmu dan
            publikasikan lowongan pekerjaan sekarang.
          </p>
        </div>

        <button className="shrink-0 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
          Pasang lowongan
        </button>
      </div>
    </section>
  );
}