"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { handleSignIn } from "@/app/actions/auth";
import { BriefcaseBusiness } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    const res = await handleSignIn({
      email,
      password,
    });

    if (res.success) {
      if (res.role === "hr") {
        router.push("/hr/dashboard");
      } else {
        router.push("/candidate");
      }
    } else {
      setError(res.error || "Gagal masuk");
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

          {/* Register */}
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:block">
              Belum punya akun?
            </span>

            <Link
              href="/register"
              className="font-semibold text-teal-700 transition hover:text-teal-800"
            >
              Daftar
            </Link>
          </div>

        </div>
      </header>

      {/* ================= LOGIN ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 to-white px-5 py-12 sm:py-16">

        {/* Decorative background */}
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-100/40 blur-3xl" />

        <div className="relative z-10 mx-auto w-full max-w-[440px]">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <BriefcaseBusiness size={23} />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-5 text-center">

            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Selamat datang kembali
            </h1>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Masuk ke akun heypulse.id untuk melanjutkan perjalanan karier
              atau mengelola proses rekrutmen.
            </p>

          </div>

          {/* Form Card */}
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

              {/* Email */}
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
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-teal-700 transition hover:text-teal-800 hover:underline"
                  >
                    Lupa password?
                  </Link>

                </div>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

            </form>

          </div>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-teal-700 transition hover:text-teal-800 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>

        </div>

      </section>

    </main>
  );
}