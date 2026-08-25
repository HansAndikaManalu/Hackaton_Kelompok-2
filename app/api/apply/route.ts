import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { candidate_id, job_id } = await req.json()

    if (!candidate_id || !job_id) {
      return NextResponse.json(
        { error: 'candidate_id dan job_id wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert({ candidate_id, job_id, status: 'pending' })
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, application_id: data.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
