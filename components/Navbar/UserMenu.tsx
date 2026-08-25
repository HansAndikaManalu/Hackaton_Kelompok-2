"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  UserRound,
  FileText,
  Upload,
  Sparkles,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { handleSignOut } from "@/app/actions/auth";

type UserMenuProps = {
  userRole: "hr" | "candidate";
  userName: string;
};

export default function UserMenu({
  userRole,
  userName,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const isHR = userRole === "hr";

  const roleLabel = isHR
    ? "HR / Recruiter"
    : "Pencari Kerja";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      ref={menuRef}
      className="relative"
    >

      {/* ================= PROFILE BUTTON ================= */}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-slate-50"
      >

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {initials}
        </div>

        {/* Name + Role */}
        <div className="hidden text-left sm:block">

          <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
            {userName}
          </p>

          <p className="text-[11px] text-slate-500">
            {roleLabel}
          </p>

        </div>

        <ChevronDown
          size={16}
          className={`hidden text-slate-400 transition sm:block ${
            open ? "rotate-180" : ""
          }`}
        />

      </button>

      {/* ================= DROPDOWN ================= */}

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

          {/* User Header */}
          <div className="border-b border-slate-100 px-4 py-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {initials}
              </div>

              <div className="min-w-0">

                <p className="truncate text-sm font-semibold text-slate-900">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">
                  {roleLabel}
                </p>

              </div>

            </div>

          </div>

          {/* Menu */}
          <div className="p-2">

            {isHR ? (
              <>
                <MenuItem
                  href="/hr/dashboard/"
                  icon={<UserRound size={17} />}
                  label="Dashboard"
                />

                <MenuItem
                  href="/hr/new-job"
                  icon={<FileText size={17} />}
                  label="Kelola Lowongan"
                />

                <MenuItem
                  href="/hr/candidates"
                  icon={<UserRound size={17} />}
                  label="Cari Kandidat"
                />

                <MenuItem
                  href="/hr/profile"
                  icon={<Settings size={17} />}
                  label="Profil Perusahaan"
                />
              </>
            ) : (
              <>
                <MenuItem
                  href="/candidate/profile"
                  icon={<UserRound size={17} />}
                  label="Profil Saya"
                />

                <MenuItem
                  href="/candidate/cv"
                  icon={<FileText size={17} />}
                  label="CV Saya"
                />

                <MenuItem
                  href="/candidate/cv/upload"
                  icon={<Upload size={17} />}
                  label="Upload CV"
                />

                {/* Generate CV */}
                <MenuItem
                  href="/candidate/builder"
                  icon={<Sparkles size={17} />}
                  label="Generate CV"
                  highlight
                />
              </>
            )}

            <div className="my-2 border-t border-slate-100" />

            <MenuItem
              href="/settings"
              icon={<Settings size={17} />}
              label="Pengaturan"
            />

            {/* Logout */}
            <form action={handleSignOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />

                <span>Keluar</span>
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}


/* =========================================================
   MENU ITEM
========================================================= */

function MenuItem({
  href,
  icon,
  label,
  highlight = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
        highlight
          ? "font-medium text-blue-700 hover:bg-blue-50"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}

      <span>{label}</span>

      {highlight && (
        <span className="ml-auto rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
          Baru
        </span>
      )}
    </Link>
  );
}