import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId, answers, candidateId } = body

    if (!jobId || !answers) {
      return NextResponse.json(
        { error: 'Data pendaftaran atau jawaban tidak lengkap.' },
        { status: 400 }
      )
    }

    // Ubah sesuai dengan struktur tabel di ERD Supabase Anda
    // Berdasarkan ERD: Tabel 'applications' menyimpan 'transcript' (jsonb) dan 'job_id'
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          job_id: jobId,
          candidate_id: candidateId || null, // Sesuaikan jika ada auth / session candidate
          transcript: answers, // Menyimpan jawaban kuis/interview ke kolom transcript
          status: 'applied',
        },
      ])
      .select()

    if (error) {
      console.error('Supabase Application Insert Error:', error.message)
      return NextResponse.json(
        { error: 'Gagal menyimpan jawaban assessment.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Assessment berhasil dikirim.',
      data,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}