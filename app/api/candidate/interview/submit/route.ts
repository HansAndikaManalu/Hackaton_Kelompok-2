import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { createClient, supabaseAdmin } from '@/lib/supabase'

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

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId, answers } = body

    if (!jobId || !answers) {
      return NextResponse.json(
        { error: 'Data pendaftaran atau jawaban tidak lengkap.' },
        { status: 400 }
      )
    }

    // 1. Ambil user yang sedang login (bukan dari body, tapi dari sesi)
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Silakan login terlebih dahulu.' }, { status: 401 })
    }

    // 2. Ambil data job (title, jd_text, scenarios) dan profil kandidat
    const { data: job, error: jobError } = await supabaseAdmin
      .from('job_vacancies')
      .select('title, jd_text, scenarios')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job tidak ditemukan.' }, { status: 404 })
    }

    const { data: candidate } = await supabaseAdmin
      .from('candidate_profiles')
      .select('full_name, cv_json')
      .eq('id', user.id)
      .maybeSingle()

    // 3. Susun transkrip tanya-jawab dari scenarios (array string) + answers (object keyed index+1)
    const scenarios: string[] = job.scenarios ?? []
    const transcriptQa = scenarios.map((question, i) => ({
      question,
      answer: answers[String(i + 1)] ?? '',
    }))

    // 4. Evaluasi pakai AI
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: evalSchema,
      system: SYSTEM_PROMPT,
      prompt: `Job Title: ${job.title}\nJob Description: ${job.jd_text}\n\nCV Kandidat: ${JSON.stringify(
        candidate?.cv_json ?? {}
      )}\n\nTranskrip Tanya-Jawab:\n${JSON.stringify(transcriptQa, null, 2)}\n\nEvaluasi kesesuaian kandidat berdasarkan data di atas.`,
    })

    // 5. Cari row application yang SUDAH ADA dari step apply (bukan bikin baru)
    const { data: existingApp, error: findError } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('candidate_id', user.id)
      .maybeSingle()

    if (findError || !existingApp) {
      return NextResponse.json(
        { error: 'Data lamaran tidak ditemukan. Pastikan kamu sudah apply lewat halaman job terlebih dahulu.' },
        { status: 404 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({
        match_score: object.match_score,
        transcript: { qa: transcriptQa, pitch_summary: object.pitch_summary },
        status: 'completed',
      })
      .eq('id', existingApp.id)

    if (updateError) {
      console.error('Update Application Error:', updateError.message)
      return NextResponse.json({ error: 'Gagal menyimpan hasil assessment.' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Assessment berhasil dikirim.',
      match_score: object.match_score,
      pitch_summary: object.pitch_summary,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('Interview Submit Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
