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

function scoreColor(score: number | null) {
  if (score === null) return '#999'
  if (score >= 70) return '#14B8A6' // teal - tinggi
  if (score >= 40) return '#F59E0B' // amber - sedang
  return '#999' // grey - rendah
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

  if (loading) return <main style={{ padding: 32 }}>Memuat dashboard...</main>
  if (error) return <main style={{ padding: 32, color: '#DC2626' }}>{error}</main>
  if (!data) return null

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
      <div
        style={{
          backgroundColor: '#1B2A4A',
          color: 'white',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{data.job.title}</h1>
        <p style={{ opacity: 0.8, fontSize: 14, marginTop: 4 }}>
          {data.applications.length} kandidat melamar
        </p>
      </div>

      {data.applications.length === 0 ? (
        <p style={{ color: '#777' }}>Belum ada kandidat yang apply ke posisi ini.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '10px 8px' }}>Nama</th>
              <th style={{ padding: '10px 8px' }}>Match Score</th>
              <th style={{ padding: '10px 8px' }}>Status</th>
              <th style={{ padding: '10px 8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {data.applications.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 8px' }}>
                  {app.candidate_profiles?.full_name ?? '(tanpa nama)'}
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      color: scoreColor(app.match_score),
                    }}
                  >
                    {app.match_score !== null ? `${app.match_score}/100` : '—'}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', textTransform: 'capitalize' }}>
                  {app.status}
                </td>
                <td style={{ padding: '10px 8px' }}>
                  <button
                    onClick={() => setSelected(app)}
                    style={{
                      backgroundColor: '#F4F5F7',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      padding: '6px 14px',
                      cursor: 'pointer',
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 420,
            backgroundColor: 'white',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
            padding: 24,
            overflowY: 'auto',
            color: '#1B2A4A',
          }}
        >
          <button
            onClick={() => setSelected(null)}
            style={{
              float: 'right',
              border: 'none',
              background: 'none',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
            {selected.candidate_profiles?.full_name}
          </h2>
          <p
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: scoreColor(selected.match_score),
              marginBottom: 16,
            }}
          >
            {selected.match_score !== null ? `${selected.match_score}/100` : 'Belum dites'}
          </p>

          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Ringkasan CV</h3>
          <p style={{ fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
            {selected.candidate_profiles?.cv_json?.summary}
          </p>

          <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Skills</h3>
          <p style={{ fontSize: 14, marginBottom: 16 }}>
            {selected.candidate_profiles?.cv_json?.skills?.join(', ')}
          </p>

          {selected.transcript && (
            <>
              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Ringkasan AI untuk HR</h3>
              <p
                style={{
                  fontSize: 14,
                  marginBottom: 16,
                  lineHeight: 1.5,
                  backgroundColor: '#F4F5F7',
                  padding: 12,
                  borderRadius: 6,
                }}
              >
                {selected.transcript.pitch_summary}
              </p>

              <h3 style={{ fontWeight: 700, marginBottom: 6 }}>Transkrip Jawaban</h3>
              {selected.transcript.qa.map((qa, i) => (
                <div key={i} style={{ marginBottom: 12, fontSize: 14 }}>
                  <p style={{ fontWeight: 600 }}>{qa.question}</p>
                  <p style={{ color: '#555' }}>{qa.answer}</p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </main>
  )
}
