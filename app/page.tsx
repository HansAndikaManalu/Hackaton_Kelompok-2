import Link from "next/link";
import { Navbar } from "@/components/Navbar/Navbar";
import Footer from "@/components/Home/Footer";
import {
  FileText,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-teal-50/60 to-white">
        <div className="mx-auto max-w-6xl px-5 py-20 text-center lg:px-8">
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-700">
            Rekrutmen yang lebih cerdas
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            CV rapi untuk pelamar,
            <br className="hidden sm:block" /> kandidat tervalidasi untuk HR.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            heypulse.id membantu pelamar menyusun CV profesional ramah ATS
            dalam hitungan detik, sekaligus membantu HR memverifikasi
            kemampuan kandidat lewat simulasi kasus otomatis — tanpa
            screening call berulang.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Mulai Sekarang
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Sudah punya akun? Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO DEMO */}
      <section className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
        <div className="text-center">
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold text-teal-700">
            Lihat langsung
          </span>
          <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
            Intip cara kerja heypulse.id
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">
            Video singkat tentang bagaimana heypulse.id membantu pelamar dan HR
            mempercepat proses rekrutmen.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <video
            className="w-full aspect-video bg-slate-900"
            controls
            preload="metadata"
            poster="/videos/demo-poster.jpg"
          >
            <source src="/videos/demo.mp4" type="video/mp4" />
            Browser kamu tidak mendukung pemutaran video.
          </video>
        </div>
      </section>

      {/* VALUE PROP DUA SISI */}
      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-8">
            <span className="inline-block rounded-md bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Untuk Pelamar
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Bikin CV profesional dalam hitungan detik
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Ceritakan pengalamanmu apa adanya. AI kami merapikannya jadi CV
              terstruktur, ramah ATS, dan siap dikirim ke perusahaan
              impianmu.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-8">
            <span className="inline-block rounded-md bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
              Untuk HR / Recruiter
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Validasi kandidat tanpa screening call berulang
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Setiap kandidat yang melamar otomatis diuji lewat simulasi
              kasus berbasis Job Description-mu, lengkap dengan skor
              kesesuaian dan ringkasan siap pakai.
            </p>
          </div>
        </div>
      </section>

      {/* FITUR UTAMA */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Cara kerjanya
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <FileText size={22} />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                Susun CV
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Ceritakan pengalamanmu, AI menyusunnya jadi CV rapi.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <Sparkles size={22} />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                Lamar Posisi
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Kirim CV langsung ke lowongan yang kamu inginkan.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <ClipboardCheck size={22} />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                Uji Kompetensi
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Jawab simulasi kasus singkat untuk buktikan kemampuanmu.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <BarChart3 size={22} />
              </div>
              <h4 className="mt-4 text-sm font-semibold text-slate-900">
                HR Menilai
              </h4>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                HR melihat skor kesesuaian & ringkasan langsung di dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA PENUTUP */}
      <section className="mx-auto max-w-4xl px-5 py-20 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Siap coba heypulse.id?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 sm:text-base">
          Daftar sekarang, baik sebagai pelamar yang ingin CV lebih baik,
          maupun HR yang ingin proses rekrutmen lebih cepat dan akurat.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Daftar Gratis
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
          >
            Masuk
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}