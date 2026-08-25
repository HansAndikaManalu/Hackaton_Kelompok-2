import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default async function HrDashboardIndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: jobs, error } = await supabase
    .from("job_vacancies")
    .select("id, title, created_at")
    .eq("hr_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <p className="text-sm text-red-600">
          Gagal memuat data lowongan: {error.message}
        </p>
      </main>
    );
  }

  // Ambil ringkasan pelamar & rata-rata skor per lowongan
  const jobsWithStats = await Promise.all(
    (jobs ?? []).map(async (job) => {
      const { data: applications } = await supabase
        .from("applications")
        .select("match_score")
        .eq("job_id", job.id);

      const total = applications?.length ?? 0;
      const avgScore =
        total > 0
          ? Math.round(
              applications!.reduce(
                (sum, a) => sum + (a.match_score ?? 0),
                0
              ) / total
            )
          : null;

      return { ...job, total, avgScore };
    })
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F1B]">
            Dashboard Lowongan
          </h1>
          <p className="mt-1 text-sm text-[#0B1F1B]/60">
            Pilih lowongan untuk melihat ranking dan skor validasi kandidat.
          </p>
        </div>
        <Link
          href="/hr/new-job"
          className="inline-block rounded-full bg-[#0F6E56] px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-[#0B5443]"
        >
          + Buat Lowongan Baru
        </Link>
      </div>

      {jobsWithStats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0B1F1B]/15 px-6 py-16 text-center">
          <p className="text-sm text-[#0B1F1B]/60">
            Belum ada lowongan. Buat lowongan pertama kamu untuk mulai
            menerima pelamar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jobsWithStats.map((job) => (
            <Link
              key={job.id}
              href={`/hr/dashboard/${job.id}`}
              className="rounded-2xl border border-[#0B1F1B]/10 bg-white p-6 transition hover:border-[#0F6E56]/40 hover:shadow-sm"
            >
              <h2 className="text-lg font-bold text-[#0B1F1B]">
                {job.title}
              </h2>
              <p className="mt-1 text-xs text-[#0B1F1B]/50">
                Dibuat{" "}
                {new Date(job.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="font-semibold text-[#0F6E56]">
                  {job.total} pelamar
                </span>
                {job.avgScore !== null && (
                  <span className="text-[#0B1F1B]/60">
                    Rata-rata skor: {job.avgScore}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
