"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Bot,
  Info,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";

type JobDetail = {
  id: string;
  title: string;
  jd_text: string;
};

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const resolvedParams = use(params);
  const jobId = resolvedParams.jobId;
  const router = useRouter();

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form input kandidat
  const [fullName, setFullName] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();

        if (res.ok && data.job) {
          setJob(data.job);
        } else {
          setError(data.error || "Job tidak ditemukan.");
        }
      } catch {
        setError("Terjadi kesalahan koneksi saat memuat data job.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.type !== "application/pdf") {
        alert("Harap pilih file dengan format PDF.");
        return;
      }

      setCvFile(file);
    }
  };

  const handleApply = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!cvFile) {
      alert(
        "Silakan unggah file CV (PDF) kamu terlebih dahulu."
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("jobId", jobId);
      formData.append("fullName", fullName);
      formData.append("cv", cvFile);

      const res = await fetch(
        "/api/candidate/apply",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(
          result.error ||
            "Gagal mengirimkan lamaran."
        );

        setSubmitting(false);
        return;
      }

      // Berhasil -> lanjut ke halaman interview
      router.push(
        `/jobs/${jobId}/interview`
      );
    } catch {
      alert(
        "Terjadi kesalahan koneksi saat mengirimkan lamaran."
      );

      setSubmitting(false);
    }
  };

  /*
   * LOADING STATE
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="mb-6 h-5 w-32 rounded bg-slate-200" />

            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="h-96 rounded-xl border border-slate-200 bg-white" />

              <div className="h-96 rounded-xl border border-slate-200 bg-white" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ERROR STATE
   */
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
              !
            </div>

            <h1 className="text-lg font-semibold text-slate-900">
              Lowongan tidak dapat dimuat
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!job) return null;

  /*
   * Generate initial logo
   */
  const initialLogo = job.title
    ? job.title
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "JP";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* =========================================================
            BACK BUTTON
           ========================================================= */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-teal-700"
        >
          <ArrowLeft size={16} />
          Kembali ke lowongan
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

          {/* =========================================================
              LEFT COLUMN
              JOB DETAIL
             ========================================================= */}
          <section className="space-y-6">

            {/* JOB HEADER */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-start gap-4">

                {/* JOB INITIAL */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-teal-100 bg-teal-50 text-lg font-bold text-teal-700">
                  {initialLogo}
                </div>

                {/* TITLE */}
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Dipublikasikan di TalentPulse AI
                  </p>
                </div>
              </div>

              {/* JOB BADGES */}
              <div className="mt-6 flex flex-wrap gap-2">

                {/* Lowongan */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
                  <Briefcase size={13} />
                  Lowongan Kerja
                </span>

                {/* AI Recruitment */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <Bot size={13} />
                  AI Recruitment
                </span>

              </div>
            </div>

            {/* =====================================================
                JOB DESCRIPTION
               ===================================================== */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="mb-5 border-b border-slate-100 pb-4">

                <h2 className="text-lg font-bold text-slate-900">
                  Deskripsi Pekerjaan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Informasi detail mengenai kualifikasi dan tanggung
                  jawab posisi ini
                </p>

              </div>

              <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.jd_text ||
                  "Deskripsi pekerjaan belum dicantumkan."}
              </div>

            </div>

            {/* =====================================================
                AI SELECTION PROCESS
               ===================================================== */}
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-5">

              <div className="flex gap-3">

                {/* ICON */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                  <Info size={18} />
                </div>

                {/* CONTENT */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Proses Seleksi Menggunakan AI
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Setelah mengunggah CV, kamu akan langsung
                    mengikuti tes skenario wawancara AI. Nilai akhir
                    kamu akan dihitung dari hasil analisis CV dan kuis.
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* =========================================================
              RIGHT COLUMN
              APPLICATION FORM
             ========================================================= */}
          <aside className="lg:sticky lg:top-6">

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              {/* FORM HEADER */}
              <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-bold text-slate-900">
                  Lamar Pekerjaan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Masukkan nama lengkap dan unggah berkas CV PDF.
                </p>

              </div>

              {/* FORM */}
              <form
                onSubmit={handleApply}
                className="space-y-5 p-6"
              >

                {/* =================================================
                    NAMA
                   ================================================= */}
                <div>

                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Nama Lengkap
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="Contoh: Ahmad Putra Brilian"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />

                </div>

                {/* =================================================
                    UPLOAD CV
                   ================================================= */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Unggah CV (PDF)
                  </label>

                  <div className="relative cursor-pointer rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-teal-400 hover:bg-teal-50/30">

                    <input
                      type="file"
                      accept=".pdf"
                      required
                      onChange={handleFileChange}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />

                    <div className="flex flex-col items-center justify-center gap-2">

                      {cvFile ? (
                        <>
                          {/* SUCCESS ICON */}
                          <CheckCircle2 className="h-8 w-8 text-emerald-500" />

                          <p className="line-clamp-1 max-w-[200px] text-xs font-semibold text-slate-800">
                            {cvFile.name}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Klik atau seret file baru untuk mengganti
                          </p>
                        </>
                      ) : (
                        <>
                          {/* UPLOAD ICON */}
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                            <Upload size={18} />
                          </div>

                          <div>

                            <p className="text-xs font-semibold text-slate-700">
                              Klik atau seret file CV ke sini
                            </p>

                            <p className="mt-0.5 text-[11px] text-slate-400">
                              Format PDF (Maksimal 5MB)
                            </p>

                          </div>
                        </>
                      )}

                    </div>

                  </div>

                </div>

                {/* =================================================
                    SUBMIT
                   ================================================= */}
                <div className="border-t border-slate-100 pt-5">

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600/30 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >

                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>
                          Mengekstrak CV & Memproses...
                        </span>
                      </>
                    ) : (
                      <>
                        <FileText size={16} />

                        <span>
                          Lanjut ke Tes Wawancara
                        </span>

                        <ArrowRight size={16} />
                      </>
                    )}

                  </button>

                </div>

                {/* DISCLAIMER */}
                <p className="text-center text-xs leading-5 text-slate-400">
                  Dengan melanjutkan, kamu akan langsung mengerjakan
                  tes wawancara AI untuk posisi ini.
                </p>

              </form>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}