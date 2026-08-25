"use client";

import { useState } from "react";
import type { CVData } from "@/lib/cv";
import { CandidateHeader } from "@/components/CandidatedBuilder/Header";
import { CandidateForm } from "@/components/CandidatedBuilder/Form";
import { CandidateSidebar } from "@/components/CandidatedBuilder/Sidebar";
import { CVPreview } from "@/components/CandidatedBuilder/Preview";
import { DownloadCVButton } from "@/components/DownloadCVButton";

type Job = { id: string; title: string };

export default function CandidateBuilderPage() {
  const [rawText, setRawText] = useState("");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applying, setApplying] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  async function loadJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();

      if (res.ok) {
        setJobs(data.jobs);
      }
    } catch {
      // silent, jobs list opsional
    }
  }

  async function handleApply() {
    if (!selectedJobId || !candidateId) return;

    setApplying(true);
    setError("");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          job_id: selectedJobId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal apply, coba lagi.");
        return;
      }

      setApplicationId(data.application_id);
    } catch {
      setError("Terjadi kesalahan koneksi saat apply.");
    } finally {
      setApplying(false);
    }
  }

  async function handleGenerate() {
    if (!rawText.trim()) {
      setError(
        "Isi pengalaman, pendidikan, atau background kamu terlebih dahulu."
      );
      return;
    }

    setError("");
    setLoading(true);
    setCvData(null);

    try {
      const res = await fetch("/api/candidate/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat CV. Silakan coba lagi.");
        return;
      }

      setCvData(data.cv);

      if (data.candidate_id) {
        setCandidateId(data.candidate_id);
      }

      loadJobs();
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50">
      <CandidateHeader />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <CandidateForm
              rawText={rawText}
              setRawText={setRawText}
              error={error}
              loading={loading}
              onGenerate={handleGenerate}
            />
          </div>

          <CandidateSidebar />
        </div>

        {cvData && (
          <div className="mt-8 space-y-6">
            <CVPreview cvData={cvData} />

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Langkah Selanjutnya
                </h3>

                <DownloadCVButton cv={cvData} />
              </div>

              <div className="mt-4">
                <h4 className="mb-2 font-semibold text-slate-700">
                  Lamar Posisi Tersedia
                </h4>

                {applicationId ? (
                  <p className="font-medium text-teal-600">
                    Berhasil apply! Lanjut ke{" "}
                    <a
                      href={`/assess/${applicationId}`}
                      className="underline hover:text-teal-700"
                    >
                      halaman verifikasi
                    </a>
                    .
                  </p>
                ) : jobs.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Belum ada lowongan tersedia. Minta HR buat lowongan dulu di
                    halaman{" "}
                    <code className="rounded bg-slate-100 px-1 py-0.5">
                      /hr/new-job
                    </code>
                    .
                  </p>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full rounded-md border border-slate-300 p-2.5 text-sm focus:border-amber-500 focus:outline-none sm:w-80"
                    >
                      <option value="">-- Pilih posisi --</option>

                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleApply}
                      disabled={!selectedJobId || applying}
                      className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {applying
                        ? "Mengirim lamaran..."
                        : "Save & Apply to Open Roles"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}