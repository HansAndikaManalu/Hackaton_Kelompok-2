import { ArrowRight } from "lucide-react";
import JobCard from "./JobCard";
import { jobs } from "@/lib/jobs";

export default function JobSection() {
  return (
    <section className="mt-14">

      <div className="flex items-end justify-between">

        <div>
          <h2 className="text-xl font-bold">
            Lowongan terbaru
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Lowongan yang baru dipublikasikan oleh perusahaan.
          </p>
        </div>

        <button className="hidden items-center gap-2 text-sm font-semibold text-blue-700 sm:flex">
          Lihat semua
          <ArrowRight size={16} />
        </button>

      </div>

      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
          />
        ))}
      </div>

    </section>
  );
}