import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'

const evalSchema = z.object({
  match_score: z.number().min(0).max(100),
  pitch_summary: z.string(),
})

const SYSTEM_PROMPT = `Kamu adalah TalentPulse AI, asisten rekrutmen yang membantu HR memverifikasi klaim CV kandidat secara adil dan objektif. Tone: Efisien, Meyakinkan, Suportif — tidak menghakimi kandidat, fokus pada evaluasi kompetensi.

TUGAS:
Bandingkan jawaban kandidat terhadap CV dan Job Description. Hasilkan:
1. Match Score (0-100) — gabungan kesesuaian CV dan kualitas jawaban tes
2. Candidate Pitch Summary — ringkasan 2-3 kalimat untuk HR, objektif dan berbasis bukti dari jawaban kandidat (bukan asumsi)

ATURAN:
- Jangan memberi skor ekstrem (0 atau 100) tanpa bukti yang sangat jelas
- Jelaskan secara singkat alasan di balik skor di dalam pitch_summary (transparansi untuk HR)`

// GET: ambil data skenario + info job buat ditampilkan ke kandidat
export async function GET(
  req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params

    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('id, status, job_vacancies(title, jd_text, scenarios), candidate_profiles(full_name)')
      .eq('id', applicationId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Application tidak ditemukan' }, { status: 404 })
    }

    return NextResponse.json({ success: true, application: data })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST: terima jawaban kandidat, evaluasi, simpan hasil ke DB
export async function POST(
  req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params
    const { answers } = await req.json()

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json({ error: 'Jawaban wajib diisi' }, { status: 400 })
    }

    // ambil ulang context (CV, JD, scenarios) buat bahan evaluasi
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('job_vacancies(title, jd_text, scenarios), candidate_profiles(full_name, cv_json)')
      .eq('id', applicationId)
      .single()

    if (fetchError || !application) {
      return NextResponse.json({ error: 'Application tidak ditemukan' }, { status: 404 })
    }

    const job = Array.isArray(application.job_vacancies)
      ? application.job_vacancies[0]
      : application.job_vacancies
    const candidate = Array.isArray(application.candidate_profiles)
      ? application.candidate_profiles[0]
      : application.candidate_profiles

    const scenarios: string[] = job?.scenarios ?? []
    const transcript = scenarios.map((q, i) => ({
      question: q,
      answer: answers[i] ?? '',
    }))

    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: evalSchema,
      system: SYSTEM_PROMPT,
      prompt: `Job Title: ${job?.title}\nJob Description: ${job?.jd_text}\n\nCV Kandidat: ${JSON.stringify(
        candidate?.cv_json
      )}\n\nTranskrip Tanya-Jawab:\n${JSON.stringify(transcript, null, 2)}\n\nEvaluasi kesesuaian kandidat berdasarkan data di atas.`,
    })

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        match_score: object.match_score,
        transcript: { qa: transcript, pitch_summary: object.pitch_summary },
        status: 'completed',
      })
      .eq('id', applicationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      match_score: object.match_score,
      pitch_summary: object.pitch_summary,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
