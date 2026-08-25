import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-blue-700"
            >
              TalentStream
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
              <Link
                href="/jobs"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Cari Lowongan
              </Link>

              <Link
                href="/companies"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Perusahaan
              </Link>

              <Link
                href="/career"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
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
              <Link
                href="/employer/jobs/create"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Pasang Lowongan
              </Link>

              <Link
                href="/employer/candidates"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Cari Kandidat
              </Link>

              <Link
                href="/employer"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Employer Center
              </Link>
            </div>
          </div>

          {/* TalentStream */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              TalentStream
            </h4>

            <div className="mt-3 space-y-2">
              <Link
                href="/about"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Tentang Kami
              </Link>

              <Link
                href="/privacy"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Kebijakan Privasi
              </Link>

              <Link
                href="/contact"
                className="block text-sm text-slate-500 transition hover:text-blue-700"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400">
            © 2026 TalentStream. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}