'use client'

import { useState } from 'react'

export default function NewJobPage() {
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [salaryRange, setSalaryRange] = useState('')
  const [employmentType, setEmploymentType] = useState('Full-time')
  const [jdText, setJdText] = useState('')
  const [language, setLanguage] = useState<'id' | 'en'>('id')
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
        body: JSON.stringify({
          jobTitle,
          jdText,
          language,
          company,
          salaryRange,
          employmentType,
        }),
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
        heypulse.id — Buat Lowongan & Skenario Verifikasi
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Masukkan Job Description, AI bakal buatkan 3 pertanyaan kasus buat
        memverifikasi kandidat yang melamar.
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: '#777', marginRight: 8, alignSelf: 'center' }}>
          Bahasa skenario:
        </span>
        <div style={{ display: 'inline-flex', border: '1px solid #ddd', borderRadius: 8, padding: 4 }}>
          <button
            type="button"
            onClick={() => setLanguage('id')}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: language === 'id' ? '#14B8A6' : 'transparent',
              color: language === 'id' ? 'white' : '#666',
            }}
          >
            Indonesia
          </button>
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              padding: '4px 12px',
              borderRadius: 6,
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: language === 'en' ? '#14B8A6' : 'transparent',
              color: language === 'en' ? 'white' : '#666',
            }}
          >
            English
          </button>
        </div>
      </div>

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

      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Nama perusahaan"
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

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <input
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          placeholder="Rentang gaji (contoh: Rp8jt – Rp12jt)"
          style={{
            flex: 1,
            padding: 10,
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: 8,
            fontFamily: 'inherit',
          }}
        />
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          style={{
            padding: 10,
            fontSize: 14,
            border: '1px solid #ccc',
            borderRadius: 8,
            fontFamily: 'inherit',
          }}
        >
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

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
