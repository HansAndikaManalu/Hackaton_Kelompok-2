import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Send,
} from "lucide-react";
import Link from "next/link";

export interface Job {
  id: string;
  title: string;
  jd_text?: string;
  created_at?: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const initial = job.title ? job.title.charAt(0).toUpperCase() : "J";

  const formattedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    : "Terbaru";

  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-teal-200 hover:shadow-sm">
      <div className="flex gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href={`/jobs/${job.id}`}
                className="text-base font-semibold text-slate-900 group-hover:text-teal-700"
              >
                {job.title}
              </Link>

              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {job.jd_text || "Deskripsi pekerjaan tidak tersedia."}
              </p>
            </div>

            <button className="shrink-0 text-slate-400 hover:text-teal-700">
              <Bookmark size={19} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                Fulltime / Remote
              </span>

              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={14} />
                Verified Job
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />
                {formattedDate}
              </span>
            </div>

            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition"
            >
              Lamar <Send size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}