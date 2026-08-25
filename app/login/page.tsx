"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        router.push("/pelamar");
      }
    } else {
      setError(res.error || "Gagal masuk");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* ================= HEADER ================= */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-blue-700"
          >
            TalentStream
          </Link>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:block">
              Belum punya akun?
            </span>

            <Link
              href="/register"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Daftar
            </Link>
          </div>

        </div>
      </header>

      {/* ================= LOGIN ================= */}
      <section className="px-5 py-12 sm:py-16">

        <div className="mx-auto w-full max-w-[440px]">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <BriefcaseBusiness size={22} />
            </div>
          </div>

          {/* Heading */}
          <div className="mt-5 text-center">

            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Selamat datang kembali
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Masuk ke akun TalentStream untuk melanjutkan.
            </p>

          </div>

          {/* Form Card */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-8">

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
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
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                    className="text-xs font-medium text-blue-700 hover:underline"
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
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
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
              className="font-semibold text-blue-700 hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>

        </div>

      </section>

    </main>
  );
}