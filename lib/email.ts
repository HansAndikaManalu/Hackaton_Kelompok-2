import { Resend } from 'resend'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = 'onboarding@resend.dev'

export async function sendNewApplicationEmail({
  hrEmail,
  jobTitle,
  candidateName,
}: {
  hrEmail: string
  jobTitle: string
  candidateName: string
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: hrEmail,
      subject: `Lamaran baru untuk posisi ${jobTitle}`,
      html: `<p>Halo,</p><p><strong>${candidateName}</strong> baru saja melamar posisi <strong>${jobTitle}</strong> di heypulse.id.</p><p>Silakan cek dashboard rekrutmen kamu untuk melihat detail kandidat dan hasil evaluasi AI.</p><p>Salam,<br/>Tim heypulse.id</p>`,
    })
  } catch (err) {
    console.error('Gagal kirim email notifikasi HR:', err)
  }
}

export async function sendAcceptanceEmail({
  candidateEmail,
  candidateName,
  jobTitle,
  hrEmail,
}: {
  candidateEmail: string
  candidateName: string
  jobTitle: string
  hrEmail: string
}) {
  const { text } = await generateText({
    model: google('gemini-3.6-flash'),
    system: `Kamu adalah asisten HR yang menulis email pemberitahuan diterima untuk pelamar kerja. Tulis dengan nada profesional, hangat, dan positif dalam Bahasa Indonesia. Gunakan nama asli yang diberikan, jangan pakai placeholder.`,
    prompt: `Tulis email pemberitahuan bahwa kandidat bernama "${candidateName}" DITERIMA untuk melanjutkan proses rekrutmen posisi "${jobTitle}". Sertakan instruksi bahwa kandidat bisa menghubungi HR melalui email ${hrEmail} untuk proses selanjutnya. Jangan tulis subjek email, cukup isi emailnya saja. Maksimal 150 kata.`,
  })

  await resend.emails.send({
    from: FROM_EMAIL,
    to: candidateEmail,
    subject: `Selamat! Kamu lolos seleksi untuk posisi ${jobTitle}`,
    html: `<div style="font-family: sans-serif; white-space: pre-line; line-height: 1.6;">${text}</div>`,
  })
}

export async function sendRejectionEmail({
  candidateEmail,
  candidateName,
  jobTitle,
  reason,
}: {
  candidateEmail: string
  candidateName: string
  jobTitle: string
  reason: string
}) {
  const { text } = await generateText({
    model: google('gemini-3.6-flash'),
    system: `Kamu adalah asisten HR yang menulis email penolakan lamaran kerja. Tulis dengan nada sopan, empatik, dan tetap menghargai usaha kandidat, dalam Bahasa Indonesia. Gunakan nama asli yang diberikan, jangan pakai placeholder. Jangan terlalu blak-blakan soal kekurangan kandidat.`,
    prompt: `Tulis email pemberitahuan bahwa kandidat bernama "${candidateName}" TIDAK LOLOS seleksi posisi "${jobTitle}". Alasan dari HR (jadikan dasar, sampaikan dengan halus): "${reason}". Akhiri dengan harapan baik untuk pencarian kerja selanjutnya. Jangan tulis subjek email, cukup isi emailnya saja. Maksimal 150 kata.`,
  })

  await resend.emails.send({
    from: FROM_EMAIL,
    to: candidateEmail,
    subject: `Update Lamaran: Posisi ${jobTitle}`,
    html: `<div style="font-family: sans-serif; white-space: pre-line; line-height: 1.6;">${text}</div>`,
  })
}