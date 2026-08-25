// src/components/candidate-builder/CandidateSidebar.tsx
import { CheckCircle2, Lightbulb } from "lucide-react";

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
        {number}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </div>
  );
}

export function CandidateSidebar() {
  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-24 space-y-4">
        {/* How it works */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-900">
            Cara kerjanya
          </h3>
          <div className="mt-5 space-y-5">
            <Step
              number="01"
              title="Ceritakan pengalamanmu"
              description="Tulis pengalaman kerja, pendidikan, proyek, atau kemampuanmu."
            />
            <Step
              number="02"
              title="TalentStream menyusunnya"
              description="Informasi kamu diubah menjadi struktur CV yang lebih profesional."
            />
            <Step
              number="03"
              title="Review dan download"
              description="Periksa hasil CV lalu download ketika sudah sesuai."
            />
          </div>
        </div>

        {/* ATS Information */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-blue-700">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Format ramah ATS
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-600">
                Struktur CV dibuat sederhana agar informasi penting lebih mudah
                dibaca oleh sistem Applicant Tracking System.
              </p>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <Lightbulb
              size={18}
              className="mt-0.5 shrink-0 text-amber-500"
            />
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Tips</h3>
              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Jangan hanya menulis posisi pekerjaan. Tambahkan pencapaian,
                tanggung jawab, tools yang digunakan, dan hasil pekerjaanmu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}