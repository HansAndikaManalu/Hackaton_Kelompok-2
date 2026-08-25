import { NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase'

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

    // 3. Konversi file CV atau persiapkan metadata
    const cvJson = {
      file_name: cvFile.name,
      file_size: cvFile.size,
      uploaded_at: new Date().toISOString(),
      summary: `CV diunggah oleh ${fullName}`,
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