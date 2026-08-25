// src/app/candidate/page.tsx
"use client";

import { useState } from "react";
import type { CVData } from "@/lib/cv";
import { CandidateHeader } from "@/components/CandidatedBuilder/Header";
import { CandidateForm } from "@/components/CandidatedBuilder/Form";
import { CandidateSidebar } from "@/components/CandidatedBuilder/Sidebar";
import { CVPreview } from "@/components/CandidatedBuilder/Preview";

export default function CandidateBuilderPage() {
  const [rawText, setRawText] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!rawText.trim()) {
      setError(
        "Isi pengalaman, pendidikan, atau background kamu terlebih dahulu."
      );
      return;
    }

    setError("");
    setLoading(true);
    setCvData(null);

    try {
      const res = await fetch("/api/candidate/builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat CV. Silakan coba lagi.");
        return;
      }

      setCvData(data.cv);
      setCandidateId(data.candidate_id ?? null);
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50">
      <CandidateHeader />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="mb-4 flex items-center justify-end gap-2">
          <span className="text-xs font-medium text-slate-500">Bahasa CV:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setLanguage("id")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                language === "id"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                language === "en"
                  ? "bg-teal-600 text-white"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              English
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <CandidateForm
              rawText={rawText}
              setRawText={setRawText}
              error={error}
              loading={loading}
              onGenerate={handleGenerate}
            />
          </div>

          <CandidateSidebar />
        </div>

        {cvData && <CVPreview cvData={cvData} />}
      </section>
    </main>
  );
}
