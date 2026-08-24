import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const resumeSchema = z.object({
  full_name: z.string(),
  summary: z.string(),
  experience: z.array(
    z.object({
      role: z.string(),
      company: z.string(),
      points: z.array(z.string()),
    })
  ),
  education: z.array(z.string()),
  skills: z.array(z.string()),
})

const SYSTEM_PROMPT = `Kamu adalah ResumeForge AI, asisten penulis CV profesional yang Efisien, Meyakinkan, dan Suportif — bukan menghakimi.

TUGAS:
Ubah input pengalaman kerja/pendidikan mentah dari pelamar menjadi CV terstruktur ramah ATS menggunakan metode STAR (Situation, Task, Action, Result) dan action verbs yang kuat.

ATURAN:
1. Jangan mengarang pencapaian/angka yang tidak disebut user — jika user tidak memberi angka dampak, gunakan frasa kualitatif yang jujur (bukan angka fiktif).
2. Setiap poin pengalaman kerja harus dimulai dengan action verb kuat (contoh: "Memimpin", "Merancang", "Meningkatkan"), bukan kalimat pasif.
3. Sertakan bagian: Ringkasan Profil, Pengalaman Kerja (format STAR), Pendidikan, Skills.
4. Nada bahasa: profesional tapi tidak kaku.`

export async function POST(req: Request) {
  try {
    const { rawText } = await req.json()

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input pengalaman kerja wajib diisi' },
        { status: 400 }
      )
    }

    const { object } = await generateObject({
      model: google('gemini-3.6-flash'),
      schema: resumeSchema,
      system: SYSTEM_PROMPT,
      prompt: `Ubah pengalaman mentah berikut menjadi CV terstruktur:\n\n${rawText}`,
    })

    return NextResponse.json({ success: true, cv: object })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
