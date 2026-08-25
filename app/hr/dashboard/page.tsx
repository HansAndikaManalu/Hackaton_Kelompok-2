"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface JobVacancy {
  id: string;
  title: string;
  created_at: string;
  total_applicants: number;
}

export default function HRDashboardPage() {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/hr/dashboard/jobs");

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Server mengembalikan respon non-JSON (Status: ${res.status}). Pastikan Anda sudah login.`,
          );
        }

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Gagal mengambil data lowongan");
        }

        setJobs(data.jobs);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const totalApplicants = jobs.reduce(
    (acc, job) => acc + job.total_applicants,
    0,
  );

  if (loading) {
    return (
      <div className="py-2">
        <div className="mx-auto w-full py-8">
          <div className="animate-pulse space-y-8">
            <div className="space-y-3">
              <div className="h-8 w-64 rounded-lg bg-slate-200" />
              <div className="h-4 w-96 max-w-full rounded bg-slate-200" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="h-32 rounded-2xl bg-white" />
              <div className="h-32 rounded-2xl bg-white" />
            </div>

            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-2">
        <div className="mx-auto w-full py-8">
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                !
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Gagal memuat dashboard
                </h2>
                <p className="mt-1 text-sm text-slate-500">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="mx-auto w-full py-8">
        {/* ========================================
            HEADER
        ======================================== */}
        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                <span>Dashboard</span>
                <span className="text-slate-300">/</span>
                <span className="font-medium text-slate-700">Rekrutmen</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                Dashboard Rekrutmen
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Kelola lowongan pekerjaan dan temukan kandidat terbaik
                berdasarkan hasil seleksi dan ranking pelamar.
              </p>
            </div>

            <Link
              href="/hr/new-job"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 active:scale-[0.98]"
            >
              <span className="text-lg leading-none">+</span>
              Buat Lowongan
            </Link>
          </div>
        </section>

        {/* ========================================
            STATISTICS
        ======================================== */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Jobs */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Lowongan Aktif
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {jobs.length}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Posisi yang sedang kamu kelola
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M3 12h18" />
                </svg>
              </div>
            </div>
          </div>

          {/* Applicants */}
          <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Pelamar
                </p>

                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {totalApplicants}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Kandidat dari seluruh lowongan
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </div>

          {/* Recruitment Status */}
          <div className="hidden rounded-2xl border border-slate-200 bg-white p-5 lg:block">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Status Rekrutmen
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-lg font-semibold text-slate-900">
                    Aktif
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  Sistem rekrutmen siap digunakan
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================
            JOB LIST
        ======================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Section Header */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Lowongan Saya
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Kelola posisi dan lihat kandidat yang melamar.
                </p>
              </div>

              {jobs.length > 0 && (
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {jobs.length} posisi
                </span>
              )}
            </div>
          </div>

          {/* Empty State */}
          {jobs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>

              <h3 className="mt-5 text-base font-semibold text-slate-900">
                Belum ada lowongan
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Buat lowongan pertama untuk mulai menerima dan menyeleksi
                kandidat.
              </p>

              <Link
                href="/hr/new-job"
                className="mt-5 inline-flex items-center rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Buat Lowongan Baru
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="group px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* Job Information */}
                    <div className="flex min-w-0 items-start gap-4">
                      {/* Company / Job Icon */}
                      <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-blue-700 sm:flex">
                        {job.title
                          .split(" ")
                          .slice(0, 2)
                          .map((word) => word[0])
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-bold text-slate-900">
                            {job.title}
                          </h3>

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Aktif
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          Dibuat pada{" "}
                          {new Date(job.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <svg
                              className="h-4 w-4 text-slate-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                            </svg>
                            {job.total_applicants} Pelamar
                          </span>

                          <span className="text-slate-200">•</span>

                          <span className="text-xs text-slate-400">
                            Rekrutmen sedang berjalan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Kandidat
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-900">
                          {job.total_applicants}
                        </p>
                      </div>

                      <Link
                        href={`/hr/dashboard/${job.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Lihat Pelamar
                        <span className="text-base transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ========================================
            BOTTOM INFO
        ======================================== */}
        <div className="mt-6 flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Kelola proses rekrutmen dengan lebih mudah.</p>

          <p>ResumeForge</p>
        </div>
      </div>
    </div>
  );
}
