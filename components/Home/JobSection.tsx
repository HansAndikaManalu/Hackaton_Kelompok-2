'use client'

import { useEffect, useState } from 'react'
import { ArrowRight } from "lucide-react";
import JobCard, { Job } from "./JobCard";

export default function JobSection() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs')
        const result = await res.json()

        if (res.ok && result.success) {
          setJobs(result.jobs || [])
        } else {
          setError(result.error || 'Gagal memuat lowongan.')
        }
      } catch {
        setError('Terjadi kesalahan koneksi.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return (
    <section className="mt-14">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Lowongan terbaru
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Lowongan yang baru dipublikasikan oleh perusahaan.
          </p>
        </div>

        <button className="hidden items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 sm:flex">
          Lihat semua
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Memuat data lowongan...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            Belum ada lowongan pekerjaan yang dipublikasikan.
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))
        )}
      </div>
    </section>
  );
}