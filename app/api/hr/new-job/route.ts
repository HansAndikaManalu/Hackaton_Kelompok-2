import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'

const scenarioSchema = z.object({
  scenarios: z.array(z.string()).length(3),
})

const SYSTEM_PROMPT_ID = `Kamu adalah TalentPulse AI, asisten rekrutmen yang membantu HR memverifikasi klaim CV kandidat secara adil dan objektif. Tone: Efisien, Meyakinkan, Suportif — tidak menghakimi kandidat, fokus pada evaluasi kompetensi.

TUGAS:
Dari teks Job Description yang diberikan, buat 3 pertanyaan kasus situasional yang menguji kemampuan riil sesuai kualifikasi utama JD tersebut. Jika JD terlalu pendek/tidak lengkap, gunakan standar kualifikasi industri untuk posisi yang disebut.

ATURAN:
1. Pertanyaan harus berupa skenario kasus nyata (bukan pertanyaan teori/definisi), supaya bisa menguji kemampuan praktis.
2. Setiap pertanyaan harus bisa dijawab dalam beberapa kalimat singkat (bukan esai panjang).
3. Jangan bertanya hal yang bisa dijawab dengan mengarang tanpa bisa diverifikasi (misal "sebutkan pengalaman terbaikmu") — buat skenario spesifik yang butuh penalaran.
4. Tulis ketiga pertanyaan dalam Bahasa Indonesia.`

const SYSTEM_PROMPT_EN = `You are TalentPulse AI, a recruitment assistant that helps HR fairly and objectively verify a candidate's resume claims. Tone: Efficient, Convincing, Supportive — not judgmental toward candidates, focused on competency evaluation.

TASK:
From the given Job Description text, create 3 situational case questions that test real-world ability aligned with the JD's main qualifications. If the JD is too short/incomplete, use industry-standard qualifications for the mentioned position.

RULES:
1. Questions must be real case scenarios (not theory/definition questions), so they test practical ability.
2. Each question must be answerable in a few short sentences (not a long essay).
3. Don't ask things that can be answered by making things up without verification (e.g. "describe your best experience") — create specific scenarios that require reasoning.
4. Write all three questions in English.`

export async function POST(req: Request) {
  try {
    const { jobTitle, jdText, language, company, salaryRange, employmentType } = await req.json()
    const lang = language === 'en' ? 'en' : 'id'

    if (!jdText || jdText.trim().length === 0) {
      return NextResponse.json(
        { error: lang === 'en' ? 'Job Description text is required' : 'Teks Job Description wajib diisi' },
        { status: 400 }
      )
    }

    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: scenarioSchema,
      system: lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ID,
      prompt:
        lang === 'en'
          ? `Job Title: ${jobTitle || '(not specified)'}\n\nJob Description:\n${jdText}\n\nCreate 3 case scenario questions to verify candidates applying for this position.`
          : `Job Title: ${jobTitle || '(tidak disebutkan)'}\n\nJob Description:\n${jdText}\n\nBuat 3 pertanyaan skenario kasus untuk memverifikasi kandidat yang melamar posisi ini.`,
    })

    const { data: saved, error: dbError } = await supabaseAdmin
      .from('job_vacancies')
      .insert({
        title: jobTitle || 'Posisi Tanpa Judul',
        jd_text: jdText,
        scenarios: object.scenarios,
        company: company || null,
        salary_range: salaryRange || null,
        employment_type: employmentType || null,
      })
      .select('id')
      .single()

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      scenarios: object.scenarios,
      job_id: saved.id,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
