import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('job_vacancies').select('count').single()
  
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }

  return NextResponse.json({
    status: 'ok',
    database: 'connected',
    data,
    timestamp: new Date().toISOString()
  })
}