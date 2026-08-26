"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateSubscription } from "@/app/actions/auth";
import { Check, Sparkles } from "lucide-react";

export default function SubscribePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleActivate = async () => {
    setLoading(true);
    setError("");

    const res = await activateSubscription();

    if (res.success) {
      router.push("/hr/dashboard");
      router.refresh();
    } else {
      setError(res.error || "Gagal mengaktifkan langganan.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
          <Sparkles size={22} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Aktifkan Akses HR
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Untuk menggunakan fitur rekrutmen (buat lowongan, seleksi kandidat
          otomatis via AI, dashboard ranking), akun HR/Perusahaan perlu
          berlangganan.
        </p>

        <ul className="mt-6 space-y-3">
          {[
            "Buat lowongan tanpa batas",
            "Seleksi kandidat otomatis via AI",
            "Dashboard ranking & match score",
            "Export shortlist kandidat",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
              <Check size={18} className="mt-0.5 shrink-0 text-teal-600" />
              {item}
            </li>
          ))}
        </ul>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleActivate}
          disabled={loading}
          className="mt-6 h-11 w-full rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "Mengaktifkan..." : "Aktifkan Langganan (Demo)"}
        </button>

        <p className="mt-4 text-center text-xs text-slate-400">
          *Simulasi untuk keperluan demo — tidak ada pembayaran nyata.
        </p>
      </div>
    </main>
  );
}