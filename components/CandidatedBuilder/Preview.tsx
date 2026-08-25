// src/components/candidate-builder/CVPreview.tsx
import { DownloadCVButton } from "@/components/UI/DownloadCVButton";
import type { CVData } from "@/lib/cv";

function CVSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <h4 className="border-b border-slate-200 pb-2 text-xs font-bold uppercase tracking-widest text-blue-800">
        {title}
      </h4>
      <div className="pt-4">{children}</div>
    </section>
  );
}

export function CVPreview({ cvData }: { cvData: CVData }) {
  return (
    <section className="mt-8">
      {/* Result Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            Hasil
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Preview CV kamu
          </h2>
        </div>
        <DownloadCVButton cv={cvData} />
      </div>

      {/* CV Paper */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl p-7 sm:p-10 lg:p-12">
          {/* PROFILE */}
          <div className="border-b border-slate-300 pb-5">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-slate-900">
              {cvData.full_name}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {cvData.summary}
            </p>
          </div>

          {/* EXPERIENCE */}
          <CVSection title="Pengalaman Kerja">
            {cvData.experience.map((exp, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">
                      {exp.role}
                    </h5>
                    <p className="text-sm font-medium text-slate-600">
                      {exp.company}
                    </p>
                  </div>
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-600">
                  {exp.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CVSection>

          {/* EDUCATION */}
          <CVSection title="Pendidikan">
            <ul className="space-y-2 text-sm text-slate-700">
              {cvData.education.map((edu, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{edu}</span>
                </li>
              ))}
            </ul>
          </CVSection>

          {/* SKILLS */}
          <CVSection title="Keahlian">
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, i) => (
                <span
                  key={i}
                  className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CVSection>
        </div>
      </div>
    </section>
  );
}