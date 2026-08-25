import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { createClient, supabaseAdmin } from '@/lib/supabase'

const scenarioSchema = z.object({
  scenarios: z.array(z.string()).length(3),
})

const SYSTEM_PROMPT = `Kamu adalah TalentPulse AI, asisten rekrutmen yang membantu HR memverifikasi klaim CV kandidat secara adil dan objektif. Tugasmu adalah membuat 3 pertanyaan skenario kasus nyata (case-based) yang relevan berdasarkan Job Description yang diberikan.`

export async function POST(req: Request) {
  try {
    // 1. Inisialisasi Supabase Server Client untuk verifikasi user session
    const supabase = await createClient()

    // 2. Cek Auth HR
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized. Silakan login terlebih dahulu.' },
        { status: 401 }
      )
    }

    // 3. Validasi & Parsing Request Body
    let body: { jobTitle?: string; jdText?: string } = {}
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'Format JSON body tidak valid' },
        { status: 400 }
      )
    }

    const { jobTitle, jdText } = body

    if (!jdText || jdText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Teks Job Description wajib diisi' },
        { status: 400 }
      )
    }

    // 4. Generate Skenario dari AI (Model valid)
    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: scenarioSchema,
      system: SYSTEM_PROMPT,
      prompt: `Job Title: ${jobTitle || '(tidak disebutkan)'}\n\nJob Description:\n${jdText}\n\nBuat 3 pertanyaan skenario kasus untuk memverifikasi kandidat yang melamar posisi ini.`,
    })

    // 5. Simpan ke Database menggunakan supabaseAdmin (Bypass RLS)
    const { data: newJob, error: dbError } = await supabaseAdmin
      .from('job_vacancies')
      .insert({
        title: jobTitle || 'Untitled Job',
        jd_text: jdText,
        scenarios: object.scenarios,
        hr_id: user.id,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database Error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      job: newJob,
      job_id: newJob.id,
      scenarios: object.scenarios,
    })
  } catch (error: unknown) {
    console.error('API Error:', error)
    const message =
      error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}