import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CandidateHeaderProps {
  onBack?: () => void; 
}

export function CandidateHeader({ onBack }: CandidateHeaderProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* Tombol Kembali */}
        <div className="mb-6">

          <Link
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Kembali</span>
          </Link>

        </div>

        {/* Content Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
              CV Builder
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Buat CV profesional kamu
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Ceritakan pengalaman dan latar belakangmu. TalentStream akan
              membantu menyusunnya menjadi CV yang rapi dan mudah dibaca oleh
              sistem ATS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}