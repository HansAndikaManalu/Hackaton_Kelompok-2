"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Building2,
  PlusCircle,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: "/hr/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hr/jobs", label: "Lowongan Saya", icon: Briefcase },
  { href: "/hr/jobs/create", label: "Buat Lowongan", icon: PlusCircle },
  { href: "/hr/candidates", label: "Daftar Pelamar", icon: Users },
  { href: "/hr/company", label: "Profil Perusahaan", icon: Building2 },
];

export default function HRSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* ================= BRAND ================= */}
        <div className="flex h-[72px] items-center justify-between border-b border-slate-100 px-5">
          <Link
            href="/hr/dashboard"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Building2 size={19} strokeWidth={2.2} />
            </div>

            <div className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-slate-900">
                HR Portal
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Recruitment Center
              </span>
            </div>
          </Link>

          {/* Close Mobile */}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={19} />
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="flex-1 overflow-y-auto px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Menu Utama
          </p>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/hr/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {/* Active Indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600" />
                  )}

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600"
                    }`}
                  >
                    <Icon size={17} strokeWidth={2} />
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================= QUICK ACTION ================= */}
          <div className="mt-8">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Aksi Cepat
            </p>

            <Link
              href="/hr/jobs/create"
              onClick={onClose}
              className="group flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-3 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700">
                <PlusCircle size={17} />
              </div>

              <div>
                <p className="text-[13px] font-semibold text-slate-800">
                  Buat Lowongan
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Cari kandidat baru
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 px-3.5 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                HR
              </div>

              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-slate-700">
                  Recruitment Team
                </p>
                <p className="text-[10px] text-slate-400">
                  HR Workspace
                </p>
              </div>
            </div>
          </div>

          <p className="mt-3 text-center text-[10px] text-slate-400">
            © 2026 Recruitment Platform
          </p>
        </div>
      </aside>
    </>
  );
}