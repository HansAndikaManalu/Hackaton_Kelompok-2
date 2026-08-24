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
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">
          Jelajahi berdasarkan kategori
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Temukan pekerjaan sesuai bidang yang kamu minati.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category}
            className="rounded-lg border border-slate-200 bg-white px-4 py-4 text-left text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}