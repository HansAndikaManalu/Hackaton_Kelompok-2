import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">

        <Link
          href="/"
          className="text-[22px] font-bold tracking-tight text-blue-700"
        >
          TalentStream
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/jobs"
            className="text-sm font-medium text-slate-900"
          >
            Lowongan
          </Link>

          <Link
            href="/companies"
            className="text-sm font-medium text-slate-500 hover:text-blue-700"
          >
            Perusahaan
          </Link>

          <Link
            href="/career"
            className="text-sm font-medium text-slate-500 hover:text-blue-700"
          >
            Tips Karier
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden px-3 py-2 text-sm font-medium text-slate-700 sm:block"
          >
            Masuk
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Daftar
          </Link>
        </div>

      </div>
    </header>
  );
}