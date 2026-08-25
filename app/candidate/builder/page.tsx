'use client'

import { useState } from 'react'
import { DownloadCVButton } from '@/components/DownloadCVButton'

type CVData = {
  full_name: string
  summary: string
  experience: {
    role: string
    company: string
    points: string[]
  }[]
  education: string[]
  skills: string[]
}

type Job = { id: string; title: string }

export default function CandidateBuilderPage() {
  const [rawText, setRawText] = useState('')
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [candidateId, setCandidateId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedJobId, setSelectedJobId] = useState('')
  const [applying, setApplying] = useState(false)
  const [applicationId, setApplicationId] = useState<string | null>(null)

  async function loadJobs() {
    try {
      const res = await fetch('/api/jobs')
      const data = await res.json()
      if (res.ok) setJobs(data.jobs)
    } catch {
      // silent, jobs list opsional
    }
  }

  async function handleApply() {
    if (!selectedJobId || !candidateId) return
    setApplying(true)
    setError('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId, job_id: selectedJobId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Gagal apply, coba lagi.')
        return
      }
      setApplicationId(data.application_id)
    } catch {
      setError('Terjadi kesalahan koneksi saat apply.')
    } finally {
      setApplying(false)
    }
  }

  async function handleGenerate() {
    if (!rawText.trim()) {
      setError('Isi dulu pengalaman kerja/pendidikan kamu.')
      return
    }
    setError('')
    setLoading(true)
    setCvData(null)

    try {
      const res = await fetch('/api/candidate/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal generate CV, coba lagi.')
        return
      }

      setCvData(data.cv)
      setCandidateId(data.candidate_id)
      loadJobs()
    } catch (err) {
      setError('Terjadi kesalahan koneksi. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
        ResumeForge AI — Buat CV Kamu
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Tulis pengalaman kerja/pendidikan kamu apa adanya. AI bakal rapikan jadi CV
        profesional ramah ATS.
      </p>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Contoh: Saya kerja sebagai staff marketing di startup selama 1 tahun, bikin konten sosmed dan naikin followers instagram dari 500 jadi 3000..."
        rows={8}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 14,
          border: '1px solid #ccc',
          borderRadius: 8,
          marginBottom: 12,
          fontFamily: 'inherit',
        }}
      />

      {error && (
        <p style={{ color: '#DC2626', marginBottom: 12, fontSize: 14 }}>{error}</p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          backgroundColor: '#F59E0B',
          color: '#1B2A4A',
          fontWeight: 600,
          padding: '10px 24px',
          borderRadius: 6,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 32,
        }}
      >
        {loading ? 'Sedang membuat CV...' : 'Generate CV'}
      </button>

      {cvData && (
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 24,
            backgroundColor: '#F4F5F7',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1B2A4A' }}>
            {cvData.full_name}
          </h2>
          <p style={{ marginBottom: 16, color: '#333' }}>{cvData.summary}</p>

          <h3 style={{ fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
            Pengalaman Kerja
          </h3>
          {cvData.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 600 }}>
                {exp.role} — {exp.company}
              </p>
              <ul style={{ marginLeft: 18 }}>
                {exp.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3 style={{ fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>
            Pendidikan
          </h3>
          <ul style={{ marginLeft: 18, marginBottom: 16 }}>
            {cvData.education.map((edu, i) => (
              <li key={i}>{edu}</li>
            ))}
          </ul>

          <h3 style={{ fontWeight: 700, color: '#1B2A4A', marginBottom: 6 }}>Skills</h3>
          <p style={{ marginBottom: 20 }}>{cvData.skills.join(', ')}</p>

          <DownloadCVButton cv={cvData} />

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #ddd' }}>
            <h3 style={{ fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
              Lamar Posisi
            </h3>

            {applicationId ? (
              <p style={{ color: '#14B8A6', fontWeight: 600 }}>
                Berhasil apply! Lanjut ke{' '}
                <a href={`/assess/${applicationId}`} style={{ textDecoration: 'underline' }}>
                  halaman verifikasi
                </a>
                .
              </p>
            ) : jobs.length === 0 ? (
              <p style={{ color: '#777', fontSize: 14 }}>
                Belum ada lowongan tersedia. Minta HR buat lowongan dulu di halaman{' '}
                <code>/hr/new-job</code>.
              </p>
            ) : (
              <>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 6,
                    border: '1px solid #ccc',
                    marginBottom: 12,
                  }}
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
                  style={{
                    backgroundColor: '#1B2A4A',
                    color: 'white',
                    fontWeight: 600,
                    padding: '10px 24px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: applying ? 'not-allowed' : 'pointer',
                  }}
                >
                  {applying ? 'Mengirim lamaran...' : 'Save & Apply to Open Roles'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
