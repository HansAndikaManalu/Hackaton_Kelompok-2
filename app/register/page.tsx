"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/app/actions/auth";
import { BriefcaseBusiness, Building2, Check } from "lucide-react";

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
          ? "/"
          : "/"
      );
    } else {
      setError(res.error || "Gagal mendaftar");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">

          <a
            href="/"
            className="text-xl font-bold tracking-tight text-blue-700"
          >
            TalentStream
          </a>

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-slate-500 sm:block">
              Sudah punya akun?
            </span>

            <a
              href="/login"
              className="font-semibold text-blue-700 hover:text-blue-800"
            >
              Masuk
            </a>
          </div>

        </div>
      </header>

      {/* Register */}
      <section className="px-5 py-12 sm:py-16">

        <div className="mx-auto w-full max-w-[480px]">

          {/* Heading */}
          <div className="text-center">

            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
              Buat akun TalentStream
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Bergabung dan temukan kesempatan kerja yang
              sesuai dengan kemampuanmu.
            </p>

          </div>

          {/* Form Card */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)] sm:p-8">

            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Role */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Kamu mendaftar sebagai
                </label>

                <div className="grid grid-cols-2 gap-3">

                  {/* Candidate */}
                  <button
                    type="button"
                    onClick={() => setRole("candidate")}
                    className={`relative rounded-lg border px-4 py-4 text-left transition ${
                      role === "candidate"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >

                    {role === "candidate" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={12} />
                      </span>
                    )}

                    <BriefcaseBusiness
                      size={20}
                      className={
                        role === "candidate"
                          ? "text-blue-700"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Pencari Kerja
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Saya sedang mencari pekerjaan
                    </p>

                  </button>

                  {/* HR */}
                  <button
                    type="button"
                    onClick={() => setRole("hr")}
                    className={`relative rounded-lg border px-4 py-4 text-left transition ${
                      role === "hr"
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >

                    {role === "hr" && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                        <Check size={12} />
                      </span>
                    )}

                    <Building2
                      size={20}
                      className={
                        role === "hr"
                          ? "text-blue-700"
                          : "text-slate-400"
                      }
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Perusahaan
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Saya ingin mencari kandidat
                    </p>

                  </button>

                </div>

              </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email kamu"
                  className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Password */}
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
                  className="h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Minimal 8 karakter.
                </p>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading
                  ? "Mendaftarkan..."
                  : "Daftar Sekarang"}
              </button>

              {/* Terms */}
              <p className="text-center text-xs leading-5 text-slate-400">
                Dengan mendaftar, kamu menyetujui{" "}
                <a
                  href="/terms"
                  className="text-blue-700 hover:underline"
                >
                  Syarat & Ketentuan
                </a>{" "}
                dan{" "}
                <a
                  href="/privacy"
                  className="text-blue-700 hover:underline"
                >
                  Kebijakan Privasi
                </a>
                .
              </p>

            </form>

          </div>

          {/* Bottom */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Sudah punya akun?{" "}
            <a
              href="/login"
              className="font-semibold text-blue-700 hover:underline"
            >
              Masuk sekarang
            </a>
          </p>

        </div>

      </section>

    </main>
  );
}