import { NextResponse } from 'next/server'
import { createClient, supabaseAdmin } from '@/lib/supabase'
import { sendAcceptanceEmail, sendRejectionEmail } from '@/lib/email'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const { applicationId } = await params
    const supabase = await createClient()

    // 1. Verifikasi HR yang login
    const {
      data: { user: hrUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !hrUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: hrProfile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', hrUser.id)
      .single()

    // 2. Ambil action & reason dari body
    const body = await req.json()
    const action = body.action as 'accept' | 'reject'
    const reason = body.reason as string | undefined

    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 })
    }

    if (action === 'reject' && (!reason || reason.trim().length === 0)) {
      return NextResponse.json({ error: 'Alasan penolakan wajib diisi' }, { status: 400 })
    }

    // 3. Ambil detail aplikasi + job + candidate
    const { data: application, error: appError } = await supabaseAdmin
      .from('applications')
      .select(`
        id,
        job_id,
        candidate_id,
        job_vacancies ( title ),
        candidate_profiles ( full_name )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      return NextResponse.json({ error: 'Lamaran tidak ditemukan' }, { status: 404 })
    }

    const { data: candidateProfile } = await supabaseAdmin
      .from('profiles')
      .select('email')
      .eq('id', application.candidate_id)
      .single()

    const jobTitle = (application.job_vacancies as unknown as { title: string })?.title ?? 'Posisi'
    const candidateName = (application.candidate_profiles as unknown as { full_name: string })?.full_name ?? 'Kandidat'
    const candidateEmail = candidateProfile?.email

    // 4. Update status di database
    const newStatus = action === 'accept' ? 'shortlisted' : 'rejected'
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update({ status: newStatus })
      .eq('id', applicationId)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // 5. Kirim email (non-fatal kalau gagal)
    if (candidateEmail) {
      try {
        if (action === 'accept') {
          await sendAcceptanceEmail({
            candidateEmail,
            candidateName,
            jobTitle,
            hrEmail: hrProfile?.email ?? '',
          })
        } else {
          await sendRejectionEmail({
            candidateEmail,
            candidateName,
            jobTitle,
            reason: reason!,
          })
        }
      } catch (emailErr) {
        console.error('Gagal kirim email keputusan (non-fatal):', emailErr)
      }
    }

    return NextResponse.json({ success: true, status: newStatus })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}