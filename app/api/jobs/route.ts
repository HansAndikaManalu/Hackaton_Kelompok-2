import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: jobs, error } = await supabaseAdmin
      .from('job_vacancies')
      .select('id, title, jd_text, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch Jobs Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, jobs: jobs || [] })
  } catch (error: unknown) {
    console.error('API Jobs Internal Error:', error)
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}