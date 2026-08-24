'use client'

import { useState } from 'react'

export default function NewJobPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [jdText, setJdText] = useState('')
  const [scenarios, setScenarios] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleGenerate() {
    if (!jdText.trim()) {
      setError('Isi dulu teks Job Description-nya.')
      return
    }
    setError('')
    setLoading(true)
    setScenarios(null)

    try {
      const res = await fetch('/api/hr/new-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, jdText }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal generate skenario, coba lagi.')
        return
      }

      setScenarios(data.scenarios)
    } catch {
      setError('Terjadi kesalahan koneksi. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1B2A4A', marginBottom: 8 }}>
        TalentPulse — Buat Lowongan & Skenario Verifikasi
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Masukkan Job Description, AI bakal buatkan 3 pertanyaan kasus buat
        memverifikasi kandidat yang melamar.
      </p>

      <input
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        placeholder="Judul posisi (contoh: Backend Developer)"
        style={{
          width: '100%',
          padding: 10,
          fontSize: 14,
          border: '1px solid #ccc',
          borderRadius: 8,
          marginBottom: 12,
          fontFamily: 'inherit',
        }}
      />

      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        placeholder="Tempel teks Job Description di sini..."
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
        {loading ? 'Sedang membuat skenario...' : 'Create Assessment'}
      </button>

      {scenarios && (
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 24,
            backgroundColor: '#F4F5F7',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1B2A4A', marginBottom: 16 }}>
            3 Pertanyaan Skenario Verifikasi
          </h2>
          <ol style={{ marginLeft: 20 }}>
            {scenarios.map((s, i) => (
              <li key={i} style={{ marginBottom: 12, lineHeight: 1.5 }}>
                {s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </main>
  )
}
