import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const scenarioSchema = z.object({
  scenarios: z.array(z.string()).length(3),
})

const SYSTEM_PROMPT = `Kamu adalah TalentPulse AI, asisten rekrutmen yang membantu HR memverifikasi klaim CV kandidat secara adil dan objektif. Tone: Efisien, Meyakinkan, Suportif — tidak menghakimi kandidat, fokus pada evaluasi kompetensi.

TUGAS:
Dari teks Job Description yang diberikan, buat 3 pertanyaan kasus situasional yang menguji kemampuan riil sesuai kualifikasi utama JD tersebut. Jika JD terlalu pendek/tidak lengkap, gunakan standar kualifikasi industri untuk posisi yang disebut.

ATURAN:
1. Pertanyaan harus berupa skenario kasus nyata (bukan pertanyaan teori/definisi), supaya bisa menguji kemampuan praktis.
2. Setiap pertanyaan harus bisa dijawab dalam beberapa kalimat singkat (bukan esai panjang).
3. Jangan bertanya hal yang bisa dijawab dengan mengarang tanpa bisa diverifikasi (misal "sebutkan pengalaman terbaikmu") — buat skenario spesifik yang butuh penalaran.`

export async function POST(req: Request) {
  try {
    const { jobTitle, jdText } = await req.json()

    if (!jdText || jdText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Teks Job Description wajib diisi' },
        { status: 400 }
      )
    }

    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: scenarioSchema,
      system: SYSTEM_PROMPT,
      prompt: `Job Title: ${jobTitle || '(tidak disebutkan)'}\n\nJob Description:\n${jdText}\n\nBuat 3 pertanyaan skenario kasus untuk memverifikasi kandidat yang melamar posisi ini.`,
    })

    return NextResponse.json({ success: true, scenarios: object.scenarios })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
