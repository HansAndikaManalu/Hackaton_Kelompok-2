'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

type Scenario = {
  id: string
  question: string
  options?: string[]
}

type JobDetail = {
  id: string
  title: string
  scenarios: Scenario[]
}

export default function InterviewPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const resolvedParams = use(params)
  const jobId = resolvedParams.jobId
  const router = useRouter()

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchJobScenarios() {
        try {
        const res = await fetch(`/api/jobs/${jobId}`)
        const data = await res.json()

        if (res.ok && data.job) {
            // Normalisasi format scenarios jika di database berbentuk Array of String
            const normalizedScenarios = (data.job.scenarios || []).map(
            (item: any, index: number) => {
                if (typeof item === 'string') {
                return {
                    id: String(index + 1),
                    question: item,
                }
                }
                return item
            }
            )

            // Simpan data job yang scenarios-nya sudah di-normalize
            setJob({
            ...data.job,
            scenarios: normalizedScenarios,
            })
        } else {
            setError(data.error || 'Gagal memuat kuis / skenario wawancara.')
        }
        } catch {
        setError('Terjadi kesalahan koneksi.')
        } finally {
        setLoading(false)
        }
    }

    fetchJobScenarios()
    }, [jobId])

  const handleAnswerChange = (scenarioId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [scenarioId]: value,
    }))
  }

  const handleSubmitInterview = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/candidate/interview/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          answers,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result.error || 'Gagal mengirimkan jawaban.')
        setSubmitting(false)
        return
      }

      alert('Selamat! Jawaban kuis & CV kamu berhasil dikirim.')
      router.push('/')
    } catch {
      alert('Terjadi kesalahan koneksi saat mengirim jawaban.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
              <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
            </div>

            <p className="mt-4 text-sm font-medium text-slate-700">
              Memuat assessment...
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Menyiapkan skenario wawancara untuk kamu
            </p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </button>

          <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              !
            </div>

            <h1 className="mt-4 text-lg font-bold text-slate-900">
              Gagal Memuat Assessment
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error || 'Data tidak ditemukan.'}
            </p>
          </div>
        </div>
      </main>
    )
  }

  const scenarios = job.scenarios || []

  const answeredCount = scenarios.filter(
    (item) => answers[item.id]?.trim()
  ).length

  const progress =
    scenarios.length > 0
      ? Math.round((answeredCount / scenarios.length) * 100)
      : 100

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* BACK */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </button>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}
          <section>

            {/* HEADER */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Bot className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Assessment Kandidat
                    </span>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      AI Interview
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Jawab setiap skenario berdasarkan pengalaman dan cara
                    berpikir kamu. Jawaban akan digunakan sebagai bagian dari
                    proses seleksi untuk posisi ini.
                  </p>
                </div>
              </div>

              {/* NOTICE */}
              <div className="mt-6 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Tips mengerjakan
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    Jawablah dengan jujur dan gunakan pengalaman nyata jika
                    memungkinkan. Tidak ada jawaban yang perlu dibuat-buat.
                  </p>
                </div>
              </div>
            </div>

            {/* QUESTIONS */}
            <form onSubmit={handleSubmitInterview}>

              {scenarios.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Bot className="h-5 w-5 text-slate-500" />
                  </div>

                  <h2 className="mt-4 text-base font-semibold text-slate-900">
                    Tidak ada skenario khusus
                  </h2>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Posisi ini tidak memiliki skenario wawancara khusus.
                    Kamu dapat menyelesaikan proses pendaftaran.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {scenarios.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 sm:p-6"
                    >
                      {/* QUESTION HEADER */}
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">
                          {index + 1}
                        </div>

                        <div className="flex-1">
                          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Pertanyaan {index + 1}
                          </p>

                          <h3 className="text-base font-semibold leading-6 text-slate-900">
                            {item.question}
                          </h3>
                        </div>

                        {answers[item.id] && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        )}
                      </div>

                      {/* MULTIPLE CHOICE */}
                      {item.options && item.options.length > 0 ? (
                        <div className="mt-5 space-y-2.5 pl-0 sm:pl-12">
                          {item.options.map((opt, optIdx) => {
                            const selected = answers[item.id] === opt

                            return (
                              <label
                                key={optIdx}
                                className={`group flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                                  selected
                                    ? 'border-blue-600 bg-blue-50/60'
                                    : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`scenario-${item.id}`}
                                  value={opt}
                                  checked={selected}
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      item.id,
                                      e.target.value
                                    )
                                  }
                                  className="mt-0.5 h-4 w-4 border-slate-300 text-blue-700 focus:ring-blue-600"
                                />

                                <span
                                  className={`text-sm leading-5 ${
                                    selected
                                      ? 'font-medium text-blue-900'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {opt}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      ) : (
                        /* ESSAY */
                        <div className="mt-5 sm:pl-12">
                          <textarea
                            rows={5}
                            required
                            value={answers[item.id] || ''}
                            onChange={(e) =>
                              handleAnswerChange(
                                item.id,
                                e.target.value
                              )
                            }
                            placeholder="Tuliskan jawaban atau penyelesaian skenario kamu..."
                            className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                          />

                          <p className="mt-2 text-xs text-slate-400">
                            Jelaskan cara kamu menghadapi situasi tersebut
                            secara jelas dan ringkas.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* SUBMIT MOBILE / MAIN */}
              <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Sudah selesai menjawab?
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pastikan semua pertanyaan sudah terisi sebelum dikirim.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menilai Jawaban...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Selesaikan Assessment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </section>

          {/* =====================================================
              RIGHT SIDEBAR
          ====================================================== */}
          <aside className="lg:sticky lg:top-6">

            <div className="rounded-xl border border-slate-200 bg-white p-5">

              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">
                  Progress Assessment
                </h2>

                <span className="text-sm font-bold text-blue-700">
                  {progress}%
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-700 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {answeredCount} dari {scenarios.length} pertanyaan telah
                dijawab
              </p>

              {/* QUESTION NAVIGATION */}
              {scenarios.length > 0 && (
                <div className="mt-6 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Pertanyaan
                  </p>

                  <div className="grid grid-cols-5 gap-2">
                    {scenarios.map((item, index) => (
                      <div
                        key={item.id || index}
                        className={`flex h-9 items-center justify-center rounded-lg border text-xs font-semibold ${
                          answers[item.id]
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* INFO CARD */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Bot className="h-4 w-4 text-slate-600" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Bagaimana penilaiannya?
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Jawaban akan diproses oleh sistem AI dan menjadi salah satu
                    bagian dari informasi yang tersedia bagi recruiter.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}