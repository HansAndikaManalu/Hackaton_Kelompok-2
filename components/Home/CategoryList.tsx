const categories = [
  "Teknologi & IT",
  "Marketing",
  "Desain",
  "Keuangan",
  "Administrasi",
  "Sales",
];

export default function CategoryList() {
  return (
    <section>
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Jelajahi berdasarkan kategori
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Temukan pekerjaan sesuai bidang yang kamu minati.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="
              group
              rounded-xl
              border border-slate-200
              bg-white
              px-4 py-4
              text-left
              text-sm font-semibold text-slate-700
              shadow-sm
              transition-all duration-200
              hover:-translate-y-0.5
              hover:border-teal-200
              hover:bg-teal-50
              hover:text-teal-700
              hover:shadow-[0_4px_12px_rgba(13,148,136,0.08)]
              focus:outline-none
              focus:ring-2
              focus:ring-teal-500/20
            "
          >
            <span className="transition-colors">
              {category}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}