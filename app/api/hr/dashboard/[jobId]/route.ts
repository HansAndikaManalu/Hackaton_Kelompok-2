import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params
    const supabase = await createClient()

    // 1. Ambil detail job
    const { data: job, error: jobError } = await supabase
      .from('job_vacancies')
      .select('id, title, jd_text')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job tidak ditemukan' }, { status: 404 })
    }

    // 2. Ambil pelamar (applications) beserta profilnya
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('id, match_score, transcript, status, candidate_profiles(full_name, cv_json)')
      .eq('job_id', jobId)
      .order('match_score', { ascending: false, nullsFirst: false })

    if (appError) {
      return NextResponse.json({ error: appError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, job, applications })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}