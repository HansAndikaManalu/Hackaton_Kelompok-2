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
  const [cvData, setCvData] = useState<CVData | null>(null);
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
        body: JSON.stringify({ rawText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal membuat CV. Silakan coba lagi.");
        return;
      }

      setCvData(data.cv);
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