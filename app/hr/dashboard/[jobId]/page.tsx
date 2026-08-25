// ===== FILE INI: app/hr/dashboard/[jobId]/page.tsx (HALAMAN TABEL RANKING KANDIDAT UNTUK HR) =====
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type CandidateApp = {
  id: string
  match_score: number | null
  status: string
  transcript: { qa: { question: string; answer: string }[]; pitch_summary: string } | null
  candidate_profiles: {
    full_name: string
    cv_json: {
      summary: string
      experience: { role: string; company: string; points: string[] }[]
      skills: string[]
    }
  }
}

type DashboardData = {
  job: { id: string; title: string; jd_text: string }
  applications: CandidateApp[]
}

function scoreBadgeClass(score: number | null) {
  if (score === null) return 'bg-slate-100 text-slate-500'
  if (score >= 70) return 'bg-[#0F6E56]/10 text-[#0F6E56]'
  if (score >= 40) return 'bg-amber-100 text-amber-700'
  return 'bg-slate-100 text-slate-500'
}

function exportShortlistCSV(jobTitle: string, applications: CandidateApp[]) {
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

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Shortlist-${jobTitle.replace(/\s+/g, '-')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function HrDashboardPage() {
  const params = useParams<{ jobId: string }>()
  const jobId = params.jobId

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<CandidateApp | null>(null)

  useEffect(() => {
    async function load() {
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
    if (jobId) load()
  }, [jobId])

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 text-sm text-[#0B1F1B]/60 lg:px-8">
        Memuat dashboard...
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-5 py-16 text-sm text-red-600 lg:px-8">
        {error}
      </main>
    )
  }

  if (!data) return null

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[#0B1F1B] px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold">{data.job.title}</h1>
          <p className="mt-1 text-sm text-white/60">
            {data.applications.length} kandidat melamar
          </p>
        </div>
        <button
          onClick={() => exportShortlistCSV(data.job.title, data.applications)}
          disabled={data.applications.length === 0}
          className="rounded-full bg-[#0F6E56] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B5443] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Export Shortlist
        </button>
      </div>

      {/* Table */}
      {data.applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#0B1F1B]/15 px-6 py-16 text-center">
          <p className="text-sm text-[#0B1F1B]/50">
            Belum ada kandidat yang apply ke posisi ini.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#0B1F1B]/10">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#0B1F1B]/10 bg-[#0B1F1B]/[0.03] text-left text-xs font-semibold uppercase tracking-wide text-[#0B1F1B]/50">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Match Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.applications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-[#0B1F1B]/5 last:border-0 hover:bg-[#0F6E56]/[0.03]"
                >
                  <td className="px-4 py-3 font-medium text-[#0B1F1B]">
                    {app.candidate_profiles?.full_name ?? '(tanpa nama)'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${scoreBadgeClass(
                        app.match_score
                      )}`}
                    >
                      {app.match_score !== null ? `${app.match_score}/100` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize text-[#0B1F1B]/70">
                    {app.status}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelected(app)}
                      className="rounded-full border border-[#0B1F1B]/15 px-4 py-1.5 text-xs font-semibold text-[#0B1F1B] transition hover:border-[#0F6E56]/40 hover:text-[#0F6E56]"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white p-6 text-[#0B1F1B] shadow-2xl">
          <button
            onClick={() => setSelected(null)}
            className="float-right text-xl leading-none text-[#0B1F1B]/40 hover:text-[#0B1F1B]"
            aria-label="Tutup"
          >
            ×
          </button>

          <h2 className="mb-1 text-lg font-bold">
            {selected.candidate_profiles?.full_name}
          </h2>

          <p
            className={`mb-6 inline-block rounded-full px-3 py-1 text-lg font-bold ${scoreBadgeClass(
              selected.match_score
            )}`}
          >
            {selected.match_score !== null
              ? `${selected.match_score}/100`
              : 'Belum dites'}
          </p>

          <h3 className="mb-1.5 text-sm font-bold text-[#0B1F1B]">
            Ringkasan CV
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-[#0B1F1B]/70">
            {selected.candidate_profiles?.cv_json?.summary}
          </p>

          <h3 className="mb-1.5 text-sm font-bold text-[#0B1F1B]">Skills</h3>
          <p className="mb-6 text-sm text-[#0B1F1B]/70">
            {selected.candidate_profiles?.cv_json?.skills?.join(', ')}
          </p>

          {selected.transcript && (
            <>
              <h3 className="mb-1.5 text-sm font-bold text-[#0B1F1B]">
                Ringkasan AI untuk HR
              </h3>
              <p className="mb-6 rounded-lg bg-[#0F6E56]/5 p-3 text-sm leading-relaxed text-[#0B1F1B]/80">
                {selected.transcript.pitch_summary}
              </p>

              <h3 className="mb-2 text-sm font-bold text-[#0B1F1B]">
                Transkrip Jawaban
              </h3>
              {selected.transcript.qa.map((qa, i) => (
                <div key={i} className="mb-3 text-sm">
                  <p className="font-semibold text-[#0B1F1B]">{qa.question}</p>
                  <p className="text-[#0B1F1B]/60">{qa.answer}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </main>
  )
}
