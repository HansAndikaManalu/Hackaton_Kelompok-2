import { NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Cek autentikasi HR
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

    // 2. Ambil daftar lowongan milik HR tersebut + Hitung jumlah pelamarnya
    //    Pakai supabaseAdmin supaya count applications tidak terblokir RLS
    const { data: jobs, error: dbError } = await supabaseAdmin
      .from('job_vacancies')
      .select(`
        id,
        title,
        created_at,
        applications (
          count
        )
      `)
      .eq('hr_id', user.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    // 3. Format response agar jumlah pelamar mudah dibaca di frontend
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      created_at: job.created_at,
      total_applicants: job.applications?.[0]?.count ?? 0,
    }))

    return NextResponse.json({
      success: true,
      total_jobs: formattedJobs.length,
      jobs: formattedJobs,
    })
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}