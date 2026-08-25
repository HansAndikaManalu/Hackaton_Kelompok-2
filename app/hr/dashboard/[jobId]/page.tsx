'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'

type CandidateApp = {
  id: string
  match_score: number | null
  status: string
  transcript: {
    qa: { question: string; answer: string }[]
    pitch_summary: string
  } | null
  candidate_profiles: {
    full_name: string
    cv_json: {
      summary: string
      experience: {
        role: string
        company: string
        points: string[]
      }[]
      skills: string[]
    }
  } | null
}

type DashboardData = {
  job: {
    id: string
    title: string
    jd_text: string
  }
  applications: CandidateApp[]
}

function scoreColor(score: number | null) {
  if (score === null) return '#94A3B8'
  if (score >= 70) return '#0F766E'
  if (score >= 40) return '#D97706'
  return '#64748B'
}

function exportShortlistCSV(
  jobTitle: string,
  applications: CandidateApp[]
) {
  const header = ['Nama', 'Match Score', 'Status', 'Ringkasan AI']

  const rows = applications.map((app) => [
    app.candidate_profiles?.full_name ?? '(tanpa nama)',
    app.match_score !== null ? String(app.match_score) : '-',
    app.status,
    (app.transcript?.pitch_summary ?? '').replace(/"/g, '""'),
  ])

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Shortlist-${jobTitle.replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function HrDashboardPage({
  params,
}: {
  params: Promise<{ jobId: string }>
}) {
  const resolvedParams = use(params)
  const jobId = resolvedParams.jobId

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<CandidateApp | null>(null)

  useEffect(() => {
    async function load() {
      if (!jobId) return

      setLoading(true)

      try {
        const res = await fetch(`/api/hr/dashboard/${jobId}`)
        const result = await res.json()

        if (!res.ok) {
          setError(result.error || 'Gagal memuat dashboard.')
          return
        }

        setData(result)
      } catch {
        setError('Terjadi kesalahan koneksi.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [jobId])

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-24 rounded bg-slate-200" />
            <div className="h-32 rounded-2xl bg-white" />
            <div className="h-16 rounded-xl bg-white" />
            <div className="h-96 rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-64px)] bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-red-100 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 font-bold text-red-600">
                !
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Gagal memuat data
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!data) return null

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* BACK BUTTON */}
        <div className="mb-5">
          <Link
            href="/hr/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
          >
            <span className="text-lg">←</span>
            Kembali ke Dashboard
          </Link>
        </div>

        {/* =========================================
            BREADCRUMB / BACK
        ========================================= */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <a
            href="/hr/dashboard"
            className="text-slate-400 transition hover:text-blue-700"
          >
            Dashboard
          </a>

          <span className="text-slate-300">/</span>

          <span className="font-medium text-slate-700">
            Ranking Pelamar
          </span>
        </div>

        {/* =========================================
            JOB HEADER
        ========================================= */}
        <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex items-start gap-4">

                {/* Job Icon */}
                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-700 sm:flex">
                  {data.job.title
                    .split(' ')
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join('')
                    .toUpperCase()}
                </div>

                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                      Lowongan Aktif
                    </span>

                    <span className="text-xs text-slate-400">
                      Recruitment
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    {data.job.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    {data.applications.length} kandidat telah melamar
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  exportShortlistCSV(
                    data.job.title,
                    data.applications
                  )
                }
                disabled={data.applications.length === 0}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>

                Export Shortlist
              </button>
            </div>
          </div>

          {/* Job Summary */}
          <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            <div className="px-5 py-4 sm:px-7">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total Kandidat
              </p>

              <p className="mt-1 text-xl font-bold text-slate-950">
                {data.applications.length}
              </p>
            </div>

            <div className="px-5 py-4 sm:px-7">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Kandidat Teratas
              </p>

              <p className="mt-1 text-xl font-bold text-slate-950">
                {data.applications[0]?.match_score !== null &&
                data.applications[0]
                  ? `${data.applications[0].match_score}/100`
                  : '—'}
              </p>
            </div>

            <div className="px-5 py-4 sm:px-7">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-sm font-semibold text-slate-800">
                  Seleksi Berjalan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            CANDIDATE LIST
        ========================================= */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Section Header */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Ranking Pelamar
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Kandidat diurutkan berdasarkan kecocokan dengan posisi ini.
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {data.applications.length} Kandidat
              </span>
            </div>
          </div>

          {/* Empty State */}
          {data.applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>

              <h3 className="mt-5 font-semibold text-slate-900">
                Belum ada pelamar
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Kandidat yang melamar posisi ini akan muncul di sini.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ranking
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Kandidat
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Match Score
                      </th>

                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {data.applications.map((app, index) => (
                      <tr
                        key={app.id}
                        className="group transition hover:bg-slate-50/70"
                      >
                        {/* Ranking */}
                        <td className="px-6 py-5">
                          {index < 3 ? (
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                                index === 0
                                  ? 'bg-amber-50 text-amber-700'
                                  : index === 1
                                    ? 'bg-slate-100 text-slate-600'
                                    : 'bg-orange-50 text-orange-700'
                              }`}
                            >
                              #{index + 1}
                            </div>
                          ) : (
                            <span className="pl-2 text-sm font-semibold text-slate-400">
                              #{index + 1}
                            </span>
                          )}
                        </td>

                        {/* Candidate */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                              {(app.candidate_profiles?.full_name ?? 'U')
                                .split(' ')
                                .slice(0, 2)
                                .map((word) => word[0])
                                .join('')
                                .toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900">
                                {app.candidate_profiles?.full_name ??
                                  '(tanpa nama)'}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                Kandidat #{index + 1}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="px-6 py-5">
                          <div className="w-36">
                            <div className="mb-1.5 flex items-center justify-between">
                              <span
                                className="text-sm font-bold"
                                style={{
                                  color: scoreColor(app.match_score),
                                }}
                              >
                                {app.match_score !== null
                                  ? `${app.match_score}%`
                                  : '—'}
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${
                                    app.match_score !== null
                                      ? app.match_score
                                      : 0
                                  }%`,
                                  backgroundColor: scoreColor(
                                    app.match_score
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                            {app.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setSelected(app)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            Detail
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="divide-y divide-slate-100 md:hidden">
                {data.applications.map((app, index) => (
                  <div
                    key={app.id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            index === 0
                              ? 'bg-amber-50 text-amber-700'
                              : index === 1
                                ? 'bg-slate-100 text-slate-600'
                                : index === 2
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'bg-slate-50 text-slate-400'
                          }`}
                        >
                          #{index + 1}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900">
                            {app.candidate_profiles?.full_name ??
                              '(tanpa nama)'}
                          </p>

                          <span className="text-xs capitalize text-slate-400">
                            {app.status}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-lg font-bold"
                        style={{
                          color: scoreColor(app.match_score),
                        }}
                      >
                        {app.match_score !== null
                          ? `${app.match_score}%`
                          : '—'}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelected(app)}
                      className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      Lihat Detail Kandidat →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* =========================================
          CANDIDATE DETAIL DRAWER
      ========================================= */}
      {selected && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-slate-200 bg-white shadow-2xl">

            {/* Drawer Header */}
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                    {(selected.candidate_profiles?.full_name ?? 'U')
                      .split(' ')
                      .slice(0, 2)
                      .map((word) => word[0])
                      .join('')
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-950">
                      {selected.candidate_profiles?.full_name ??
                        '(Tanpa Nama)'}
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Detail Kandidat
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

              {/* Match Score */}
              <div className="mb-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Match Score
                    </p>

                    <p
                      className="mt-1 text-3xl font-bold"
                      style={{
                        color: scoreColor(selected.match_score),
                      }}
                    >
                      {selected.match_score !== null
                        ? `${selected.match_score}/100`
                        : '—'}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-600 shadow-sm">
                    AI
                  </div>
                </div>

                {selected.match_score !== null && (
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selected.match_score}%`,
                        backgroundColor: scoreColor(
                          selected.match_score
                        ),
                      }}
                    />
                  </div>
                )}
              </div>

              {/* CV Summary */}
              <section className="mb-7">
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                  Ringkasan CV
                </h3>

                <p className="text-sm leading-6 text-slate-600">
                  {selected.candidate_profiles?.cv_json?.summary ||
                    'Tidak ada ringkasan.'}
                </p>
              </section>

              {/* Skills */}
              <section className="mb-7">
                <h3 className="mb-3 text-sm font-bold text-slate-900">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selected.candidate_profiles?.cv_json?.skills?.length ? (
                    selected.candidate_profiles.cv_json.skills.map(
                      (skill, i) => (
                        <span
                          key={i}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      )
                    )
                  ) : (
                    <span className="text-sm text-slate-400">
                      Tidak ada data skills.
                    </span>
                  )}
                </div>
              </section>

              {/* AI Summary */}
              {selected.transcript && (
                <>
                  <section className="mb-7">
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">
                        Ringkasan AI untuk HR
                      </h3>

                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        AI
                      </span>
                    </div>

                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                      <p className="text-sm leading-6 text-slate-600">
                        {selected.transcript.pitch_summary}
                      </p>
                    </div>
                  </section>

                  {/* Transcript */}
                  <section>
                    <h3 className="mb-4 text-sm font-bold text-slate-900">
                      Transkrip Jawaban
                    </h3>

                    <div className="space-y-4">
                      {selected.transcript.qa?.map((qa, i) => (
                        <div
                          key={i}
                          className="rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="mb-2 flex gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                              Q
                            </span>

                            <p className="text-sm font-semibold leading-5 text-slate-800">
                              {qa.question}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-bold text-blue-600">
                              A
                            </span>

                            <p className="text-sm leading-6 text-slate-500">
                              {qa.answer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-slate-200 bg-white px-6 py-4">
              <button
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Tutup Detail
              </button>
            </div>
          </aside>
        </>
      )}
    </main>
  )
}