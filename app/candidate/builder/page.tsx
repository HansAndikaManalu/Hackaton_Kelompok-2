"use client";

import { useState } from "react";
import { DownloadCVButton } from "@/components/UI/DownloadCVButton";
import type { CVData } from "@/lib/cv";

export default function CandidateBuilderPage() {
  const [rawText, setRawText] = useState("");
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!rawText.trim()) {
      setError("Isi dulu pengalaman kerja/pendidikan kamu.");
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
        setError(data.error || "Gagal generate CV, coba lagi.");
        return;
      }

      setCvData(data.cv);
    } catch {
      setError("Terjadi kesalahan koneksi. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 32 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#1B2A4A",
          marginBottom: 8,
        }}
      >
        ResumeForge AI — Buat CV Kamu
      </h1>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Tulis pengalaman kerja/pendidikan kamu apa adanya. AI bakal rapikan jadi
        CV profesional ramah ATS.
      </p>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Contoh: Saya kerja sebagai staff marketing di startup selama 1 tahun, bikin konten sosmed dan naikin followers instagram dari 500 jadi 3000..."
        rows={8}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 14,
          border: "1px solid #ccc",
          borderRadius: 8,
          marginBottom: 12,
          fontFamily: "inherit",
        }}
      />

      {error && (
        <p style={{ color: "#DC2626", marginBottom: 12, fontSize: 14 }}>
          {error}
        </p>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          backgroundColor: "#F59E0B",
          color: "#1B2A4A",
          fontWeight: 600,
          padding: "10px 24px",
          borderRadius: 6,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 32,
        }}
      >
        {loading ? "Sedang membuat CV..." : "Generate CV"}
      </button>

      {cvData && (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 24,
            backgroundColor: "#F4F5F7",
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1B2A4A" }}>
            {cvData.full_name}
          </h2>
          <p style={{ marginBottom: 16, color: "#333" }}>{cvData.summary}</p>

          <h3 style={{ fontWeight: 700, color: "#1B2A4A", marginBottom: 6 }}>
            Pengalaman Kerja
          </h3>
          {cvData.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <p style={{ fontWeight: 600 }}>
                {exp.role} — {exp.company}
              </p>
              <ul style={{ marginLeft: 18 }}>
                {exp.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}

          <h3 style={{ fontWeight: 700, color: "#1B2A4A", marginBottom: 6 }}>
            Pendidikan
          </h3>
          <ul style={{ marginLeft: 18, marginBottom: 16 }}>
            {cvData.education.map((edu, i) => (
              <li key={i}>{edu}</li>
            ))}
          </ul>

          <h3 style={{ fontWeight: 700, color: "#1B2A4A", marginBottom: 6 }}>
            Skills
          </h3>
          <p style={{ marginBottom: 20 }}>{cvData.skills.join(", ")}</p>

          <DownloadCVButton cv={cvData} />
        </div>
      )}
    </main>
  );
}
