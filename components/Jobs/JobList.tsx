"use client";

import { useEffect, useState } from "react";
import JobCard, { Job } from "@/components/Home/JobCard";
import { Loader2 } from "lucide-react";

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal memuat lowongan.");
        }
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
        <Loader2 className="animate-spin" size={20} />
        Memuat lowongan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Belum ada lowongan yang tersedia saat ini.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}