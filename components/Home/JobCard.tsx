import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";

export interface Job {
  id: number;
  company: string;
  initial: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm">

      <div className="flex gap-4">

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600">
          {job.initial}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-4">

            <div>
              <a
                href={`/jobs/${job.id}`}
                className="text-base font-semibold text-slate-900 group-hover:text-blue-700"
              >
                {job.title}
              </a>

              <p className="mt-1 text-sm text-slate-600">
                {job.company}
              </p>
            </div>

            <button className="shrink-0 text-slate-400 hover:text-blue-700">
              <Bookmark size={19} />
            </button>

          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">

            <span className="flex items-center gap-1.5">
              <MapPin size={14} />
              {job.location}
            </span>

            <span className="flex items-center gap-1.5">
              <BriefcaseBusiness size={14} />
              {job.type}
            </span>

            <span className="font-medium text-slate-700">
              {job.salary}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock3 size={14} />
              {job.posted}
            </span>

          </div>

        </div>

      </div>

    </article>
  );
}