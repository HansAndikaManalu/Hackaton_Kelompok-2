"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { handleSignUp } from "@/app/actions/auth";
import {
  BriefcaseBusiness,
  Building2,
  Check,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"hr" | "candidate">("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await handleSignUp({
      email,
      password,
      role,
    });

    if (res.success) {
      router.push(
        role === "hr"
          ? "/login"
          : "/login"
      );
    } else {
      setError(res.error || "Gagal mendaftar");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/logo-heypulse.png"
              alt="heypulse.id"
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
              priority
            />
            <span className="text-xl font-bold tracking-tight text-teal-700">
              heypulse.id
            </span>
          </Link>

          {/* Login */}
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:block">
              Sudah punya akun?
            </span>

            <a
              href="/login"
              className="font-semibold text-teal-700 transition hover:text-teal-800"
            >
              Masuk
            </a>
          </div>

        </div>
      </header>

      {/* ================= REGISTER ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white px-5 py-12 sm:py-16">

        {/* Decorative background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-[480px]">

          {/* Heading */}
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <BriefcaseBusiness size={23} />
            </div>

            <h1 className="mt-5 text-[28px] font-bold tracking-tight text-slate-900">
              Buat akun heypulse.id
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Bergabung dan temukan kesempatan kerja yang
              sesuai dengan kemampuanmu.
            </p>

          </div>

          {/* ================= FORM CARD ================= */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_20px_rgba(15,23,42,0.05)] sm:p-8">

            {/* Error */}
            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                <span className="font-semibold">!</span>
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* ================= ROLE ================= */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Kamu mendaftar sebagai
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  {/* Candidate */}
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`relative rounded-xl border p-4 text-left transition ${
                      role === "candidate"
                        ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >

                    {/* Check */}
                    {role === "candidate" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        role === "candidate"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <BriefcaseBusiness size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Pencari Kerja
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Saya sedang mencari pekerjaan
                    </p>

                  </button>

                  {/* HR */}
                  <button
                    type="button"
                    onClick={() => setRole("hr")}
                    className={`relative rounded-xl border p-4 text-left transition ${
                      role === "hr"
                        ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >

                    {/* Check */}
                    {role === "hr" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}

                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        role === "hr"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Building2 size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Perusahaan
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Saya ingin mencari kandidat
                    </p>

                  </button>

                </div>

              </div>

              {/* ================= EMAIL ================= */}
              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* ================= PASSWORD ================= */}
              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Minimal 8 karakter.
                </p>

              </div>

              {/* ================= SUBMIT ================= */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading
                  ? "Mendaftarkan..."
                  : "Daftar Sekarang"}
              </button>

              {/* ================= TERMS ================= */}
              <p className="text-center text-xs leading-5 text-slate-400">
                Dengan mendaftar, kamu menyetujui{" "}
                <a
                  href="/terms"
                  className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                >
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a
                  href="/privacy"
                  className="font-medium text-teal-700 hover:text-teal-800 hover:underline"
                >
                  Kebijakan Privasi
                </a>
                .
              </p>

            </form>

          </div>

          {/* ================= BOTTOM ================= */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
            >
              Masuk sekarang
            </a>
          </p>

        </div>

      </section>

    </main>
  );
}