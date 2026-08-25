import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { cvSchema } from "@/lib/cv";
import { supabaseAdmin } from "@/lib/supabase";

const SYSTEM_PROMPT_ID = `Kamu adalah ResumeForge AI, asisten penulis CV profesional yang Efisien, Meyakinkan, dan Suportif — bukan menghakimi.
TUGAS:
Ubah input pengalaman kerja/pendidikan mentah dari pelamar menjadi CV terstruktur ramah ATS menggunakan metode STAR (Situation, Task, Action, Result) dan action verbs yang kuat.
ATURAN:
1. Jangan mengarang pencapaian/angka yang tidak disebut user — jika user tidak memberi angka dampak, gunakan frasa kualitatif yang jujur (bukan angka fiktif).
2. Setiap poin pengalaman kerja harus dimulai dengan action verb kuat (contoh: "Memimpin", "Merancang", "Meningkatkan"), bukan kalimat pasif.
3. Sertakan bagian: Ringkasan Profil, Pengalaman Kerja (format STAR), Pendidikan, Skills.
4. Nada bahasa: profesional tapi tidak kaku.
5. Tulis seluruh isi CV (summary, experience points, dll) dalam Bahasa Indonesia.`;

const SYSTEM_PROMPT_EN = `You are ResumeForge AI, a professional resume writer that is Efficient, Convincing, and Supportive — never judgmental.
TASK:
Transform the applicant's raw work/education experience into a structured, ATS-friendly resume using the STAR method (Situation, Task, Action, Result) and strong action verbs.
RULES:
1. Never fabricate achievements or numbers the user didn't mention — if no impact number is given, use honest qualitative phrasing (not fictional numbers).
2. Every experience point must start with a strong action verb (e.g. "Led", "Designed", "Increased"), not passive phrasing.
3. Include sections: Profile Summary, Work Experience (STAR format), Education, Skills.
4. Tone: professional but not stiff.
5. Write the entire CV content (summary, experience points, etc.) in English.`;

export async function POST(req: Request) {
  try {
    const { rawText, language } = await req.json();
    const lang = language === "en" ? "en" : "id";

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: lang === "en" ? "Work experience input is required" : "Input pengalaman kerja wajib diisi" },
        { status: 400 }
      );
    }

    const { object } = await generateObject({
      model: google("gemini-3.6-flash"),
      schema: cvSchema,
      system: lang === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_ID,
      prompt:
        lang === "en"
          ? `Transform the following raw experience into a structured resume:\n\n${rawText}`
          : `Ubah pengalaman mentah berikut menjadi CV terstruktur:\n\n${rawText}`,
    });

    const { data: saved, error: dbError } = await supabaseAdmin
      .from("candidate_profiles")
      .insert({ full_name: object.full_name, cv_json: object })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cv: object,
      candidate_id: saved.id,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
