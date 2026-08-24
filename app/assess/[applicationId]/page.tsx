'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type ApplicationData = {
  id: string
  status: string
  job_vacancies: { title: string; jd_text: string; scenarios: string[] }
  candidate_profiles: { full_name: string }
}

export default function AssessPage() {
  const params = useParams<{ applicationId: string }>()
  const applicationId = params.applicationId

  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [loadingInit, setLoadingInit] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ match_score: number; pitch_summary: string } | null>(
    null
  )

  useEffect(() => {
    async function loadApplication() {
      try {
        const res = await fetch(`/api/assess/${applicationId}`)
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Gagal memuat data assessment.')
          return
        }
        setApplication(data.application)
      } catch {
        setError('Terjadi kesalahan koneksi.')
      } finally {
        setLoadingInit(false)
      }
    }
    if (applicationId) loadApplication()
  }, [applicationId])

  async function handleNext() {
    if (!currentAnswer.trim()) return

    const updatedAnswers = [...answers, currentAnswer]
    setAnswers(updatedAnswers)
    setCurrentAnswer('')

    const scenarios = application?.job_vacancies?.scenarios ?? []

    if (currentStep + 1 < scenarios.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // sudah jawab semua pertanyaan, submit buat dievaluasi
      setSubmitting(true)
      setError('')
      try {
        const res = await fetch(`/api/assess/${applicationId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: updatedAnswers }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Gagal mengevaluasi jawaban.')
          return
        }
        setResult({ match_score: data.match_score, pitch_summary: data.pitch_summary })
      } catch {
        setError('Terjadi kesalahan koneksi saat submit jawaban.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  if (loadingInit) {
    return <main style={{ padding: 32 }}>Memuat assessment...</main>
  }

  if (error && !application) {
    return (
      <main style={{ padding: 32 }}>
        <p style={{ color: '#DC2626' }}>{error}</p>
      </main>
    )
  }

  const scenarios = application?.job_vacancies?.scenarios ?? []

  return (
    <main style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>
        Verifikasi Kandidat — {application?.job_vacancies?.title}
      </h1>
      <p style={{ color: '#555', marginBottom: 24 }}>
        Halo {application?.candidate_profiles?.full_name}, jawab 3 pertanyaan berikut
        untuk memverifikasi kemampuan kamu.
      </p>

      {!result && scenarios.length > 0 && (
        <div
          style={{
            border: '1px solid #eee',
            borderRadius: 8,
            padding: 20,
            backgroundColor: '#F4F5F7',
          }}
        >
          <p style={{ fontSize: 12, color: '#14B8A6', fontWeight: 600, marginBottom: 8 }}>
            Pertanyaan {currentStep + 1} dari {scenarios.length}
          </p>
          <p style={{ marginBottom: 16, lineHeight: 1.5 }}>{scenarios[currentStep]}</p>

          <textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Tulis jawaban kamu di sini..."
            rows={5}
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

          {error && (
            <p style={{ color: '#DC2626', marginBottom: 12, fontSize: 14 }}>{error}</p>
          )}

          <button
            onClick={handleNext}
            disabled={submitting || !currentAnswer.trim()}
            style={{
              backgroundColor: '#F59E0B',
              color: '#1B2A4A',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: 6,
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting
              ? 'Mengevaluasi jawaban...'
              : currentStep + 1 < scenarios.length
              ? 'Jawaban Selanjutnya'
              : 'Selesai & Kirim'}
          </button>
        </div>
      )}

      {result && (
        <div
          style={{
            border: '1px solid #14B8A6',
            borderRadius: 8,
            padding: 24,
            backgroundColor: '#F4F5F7',
          }}
        >
          <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 600, marginBottom: 4 }}>
            Match Score
          </p>
          <p style={{ fontSize: 36, fontWeight: 700, color: '#14B8A6', marginBottom: 16 }}>
            {result.match_score}/100
          </p>
          <p style={{ fontSize: 14, color: '#1B2A4A', fontWeight: 600, marginBottom: 4 }}>
            Ringkasan untuk HR
          </p>
          <p style={{ lineHeight: 1.5 }}>{result.pitch_summary}</p>
        </div>
      )}
    </main>
  )
}
