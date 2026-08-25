import Link from "next/link";
import { Link2, Presentation } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-lg font-bold text-teal-700">
              heypulse.id
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
              Platform untuk membantu kamu menemukan pekerjaan
              dan membangun karier.
            </p>
          </div>

          {/* Pencari Kerja */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Untuk Pencari Kerja
            </h4>
            <div className="mt-3 space-y-2">
              <Link href="/jobs" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Cari Lowongan
              </Link>
              <Link href="/companies" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Perusahaan
              </Link>
              <Link href="/career" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Tips Karier
              </Link>
            </div>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Untuk Perusahaan
            </h4>
            <div className="mt-3 space-y-2">
              <Link href="/employer/jobs/create" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Pasang Lowongan
              </Link>
              <Link href="/employer/candidates" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Cari Kandidat
              </Link>
              <Link href="/employer" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Employer Center
              </Link>
            </div>
          </div>

          {/* heypulse.id */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              heypulse.id
            </h4>
            <div className="mt-3 space-y-2">
              <Link href="/about" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Tentang Kami
              </Link>
              <Link href="/privacy" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Kebijakan Privasi
              </Link>
              <Link href="/contact" className="block text-sm text-slate-500 transition hover:text-teal-700">
                Hubungi Kami
              </Link>
            </div>
          </div>

          {/* Sosial Media */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Ikuti Kami
            </h4>
            <div className="mt-3 space-y-2">
              <Link
                href="https://www.instagram.com/heypulse.id?igsi=dnVvaXowb3dwZDFo&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-teal-700"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                </svg>
                @heypulse.id
              </Link>
              <Link
                href="https://linktr.ee/Heypulse.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-teal-700"
              >
                <Link2 size={16} />
                Heypulse.id
              </Link>
              <Link
                href="https://canva.link/cbcwi6g8d059s4j"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-teal-700"
              >
                <Presentation size={16} />
                Lihat Presentasi
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">
            © 2026 heypulse.id. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}