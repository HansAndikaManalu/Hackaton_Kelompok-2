// src/components/candidate-builder/CandidateForm.tsx
"use client";

import { FileText, Loader2, Sparkles, ArrowRight } from "lucide-react";

interface CandidateFormProps {
  rawText: string;
  setRawText: (value: string) => void;
  error: string;
  loading: boolean;
  onGenerate: () => void;
}

export function CandidateForm({
  rawText,
  setRawText,
  error,
  loading,
  onGenerate,
}: CandidateFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* Card Header */}
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Ceritakan tentang kamu
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Masukkan informasi yang ingin dimasukkan ke CV
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="p-5 sm:p-6">
        <label
          htmlFor="rawText"
          className="mb-2 block text-sm font-semibold text-slate-800"
        >
          Pengalaman & background
        </label>

        <textarea
          id="rawText"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder={`Contoh:

Saya bekerja sebagai Staff Marketing di TokoKita selama 1 tahun (2023–2024).

Saya mengelola konten Instagram dan berhasil meningkatkan followers dari 500 menjadi 3.000 melalui strategi video Reels.

Saya lulusan S1 Manajemen Universitas ABC (2019–2023).

Skills saya: Digital Marketing, Social Media, Canva, dan Microsoft Office.`}
          rows={13}
          className="w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />

        {/* Error */}
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Bottom */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            Semakin lengkap informasi yang kamu berikan, semakin baik hasil CV
            yang dapat dibuat.
          </p>

          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Menyusun CV...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Buat CV
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}