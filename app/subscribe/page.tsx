"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateSubscription } from "@/app/actions/auth";
import { Check, Sparkles, Zap } from "lucide-react";

const MONTHLY_PRICE = 299000;
const YEARLY_MONTHLY_EQUIVALENT = Math.round(MONTHLY_PRICE * 0.9);
const YEARLY_TOTAL = YEARLY_MONTHLY_EQUIVALENT * 12;

const BASE_FEATURES = [
  "Buat lowongan tanpa batas",
  "Seleksi kandidat otomatis via AI",
  "Dashboard ranking & match score",
  "Export shortlist kandidat",
];

const YEARLY_EXTRA_FEATURES = [
  "Model AI Prioritas — evaluasi lebih akurat & mendalam",
  "5 pertanyaan skenario per lowongan (vs 3 di paket bulanan)",
  "Riwayat kandidat tanpa batas waktu",
  "Dukungan prioritas",
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SubscribePage() {
  const router = useRouter();
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");
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

  const isYearly = plan === "yearly";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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

        {/* TOGGLE PAKET */}
        <div className="mt-6 flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setPlan("monthly")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              plan === "monthly"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Bulanan
          </button>
          <button
            type="button"
            onClick={() => setPlan("yearly")}
            className={`relative flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
              plan === "yearly"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Tahunan
            <span className="ml-1.5 rounded-full bg-teal-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              Hemat 10%
            </span>
          </button>
        </div>

        {/* HARGA */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900">
              {formatRupiah(isYearly ? YEARLY_MONTHLY_EQUIVALENT : MONTHLY_PRICE)}
            </span>
            <span className="text-sm text-slate-500">/bulan</span>
          </div>
          {isYearly && (
            <p className="mt-1.5 text-xs text-slate-500">
              Ditagih {formatRupiah(YEARLY_TOTAL)}/tahun — hemat{" "}
              {formatRupiah((MONTHLY_PRICE - YEARLY_MONTHLY_EQUIVALENT) * 12)}{" "}
              dibanding bulanan
            </p>
          )}
        </div>

        {/* FITUR DASAR (SEMUA PAKET) */}
        <ul className="mt-6 space-y-3">
          {BASE_FEATURES.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 text-sm text-slate-700"
            >
              <Check size={18} className="mt-0.5 shrink-0 text-teal-600" />
              {item}
            </li>
          ))}
        </ul>

        {/* FITUR TAMBAHAN KHUSUS TAHUNAN */}
        {isYearly && (
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
            <div className="mb-2.5 flex items-center gap-1.5">
              <Zap size={14} className="text-teal-700" />
              <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
                Bonus khusus paket Tahunan
              </p>
            </div>
            <ul className="space-y-2.5">
              {YEARLY_EXTRA_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <Check size={18} className="mt-0.5 shrink-0 text-teal-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

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
          {loading
            ? "Mengaktifkan..."
            : `Aktifkan Langganan ${isYearly ? "Tahunan" : "Bulanan"} (Demo)`}
        </button>
        <p className="mt-4 text-center text-xs text-slate-400">
          *Simulasi untuk keperluan demo — tidak ada pembayaran nyata.
        </p>
      </div>
    </main>
  );
}
