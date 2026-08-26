import { NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { cvSchema } from '@/lib/cv'
// @ts-expect-error - pdf-parse tidak punya tipe resmi yang cocok dengan ESM import
import pdf from 'pdf-parse/lib/pdf-parse.js'

const CV_PARSE_SYSTEM_PROMPT = `Kamu adalah asisten yang mengubah teks mentah hasil ekstraksi CV/resume PDF menjadi data terstruktur. Baca teks yang diberikan, lalu susun ke dalam skema: full_name, summary (ringkasan singkat kandidat), experience (role, company, points sebagai daftar pencapaian), education, dan skills. Kalau ada informasi yang tidak ditemukan di teks, kosongkan array-nya (jangan mengarang data).`

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // 1. Cek autentikasi user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu.' },
        { status: 401 }
      )
    }

    // 2. Extract FormData dari Request
    const formData = await req.formData()
    const jobId = formData.get('jobId') as string
    const fullName = formData.get('fullName') as string
    const cvFile = formData.get('cv') as File | null

    if (!jobId || !fullName || !cvFile) {
      return NextResponse.json(
        { error: 'Nama lengkap dan file CV wajib diisi.' },
        { status: 400 }
      )
    }

    // 3. Ekstrak teks dari PDF, lalu parse jadi struktur CV pakai AI
    let cvJson: {
      full_name: string
      summary: string
      experience: { role: string; company: string; points: string[] }[]
      education: string[]
      skills: string[]
      file_name: string
      file_size: number
      uploaded_at: string
    }

    try {
      const arrayBuffer = await cvFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const pdfData = await pdf(buffer)
      const rawText = pdfData.text?.trim()

      if (!rawText || rawText.length < 30) {
        // PDF kosong / hasil scan gambar tanpa teks yang bisa dibaca
        throw new Error('Teks PDF tidak terbaca atau terlalu pendek')
      }

      const { object: parsed } = await generateObject({
        model: google('gemini-3.6-flash'),
        schema: cvSchema,
        system: CV_PARSE_SYSTEM_PROMPT,
        prompt: `Nama pelamar (dari form, jadikan acuan utama jika berbeda dengan yang ada di teks): ${fullName}\n\nTeks hasil ekstraksi CV:\n${rawText}`,
      })

      cvJson = {
        ...parsed,
        full_name: fullName || parsed.full_name,
        file_name: cvFile.name,
        file_size: cvFile.size,
        uploaded_at: new Date().toISOString(),
      }
    } catch (parseErr) {
      // Fallback: kalau ekstraksi/parsing gagal (PDF hasil scan, korup, dll),
      // tetap simpan metadata dasar supaya proses apply tidak macet total.
      console.error('CV Parse Error, fallback ke metadata dasar:', parseErr)
      cvJson = {
        full_name: fullName,
        summary: `CV diunggah oleh ${fullName} (teks tidak berhasil diekstrak otomatis)`,
        experience: [],
        education: [],
        skills: [],
        file_name: cvFile.name,
        file_size: cvFile.size,
        uploaded_at: new Date().toISOString(),
      }
    }

    // 4. Update/Insert ke candidate_profiles
    const { error: profileError } = await supabaseAdmin
      .from('candidate_profiles')
      .upsert(
        {
          id: user.id,
          full_name: fullName,
          cv_json: cvJson,
        },
        { onConflict: 'id' }
      )

    if (profileError) {
      console.error('Profile Upsert Error:', profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // 5. Entri ke tabel applications
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('candidate_id', user.id)
      .maybeSingle()

    if (!existingApp) {
      const { error: appError } = await supabaseAdmin.from('applications').insert({
        job_id: jobId,
        candidate_id: user.id,
        status: 'applied',
      })

      if (appError) {
        console.error('Applications Insert Error:', appError)
        return NextResponse.json({ error: appError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    console.error('API Apply Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}