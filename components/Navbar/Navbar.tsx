import Link from "next/link";
import { cookies } from "next/headers";
import UserMenu from "./UserMenu";
import { supabaseAdmin } from "@/lib/supabase";

export async function Navbar() {
  const cookieStore = await cookies();

  const userId = cookieStore.get("user_id")?.value;
  const userRole = cookieStore.get("user_role")?.value;

  let userName = "User";

  // Ambil nama asli dari database jika user sudah login
  if (userId) {
    if (userRole === "candidate") {
      // 1. Coba ambil dari candidate_profiles
      const { data: candidateData } = await supabaseAdmin
        .from("candidate_profiles")
        .select("full_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (candidateData?.full_name) {
        userName = candidateData.full_name;
      } else {
        // Fallback ke email di tabel profiles jika full_name belum diisi
        const { data: profileData } = await supabaseAdmin
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .maybeSingle();

        if (profileData?.email) {
          userName = profileData.email.split("@")[0]; // Ambil nama depan dari email
        }
      }
    } else {
      // 2. Jika HR, ambil email dari tabel profiles
      const { data: profileData } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("id", userId)
        .maybeSingle();

      if (profileData?.email) {
        userName = profileData.email.split("@")[0]; // Ambil username sebelum '@'
      }
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-blue-700"
        >
          TalentStream
        </Link>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <div className="hidden items-center gap-7 md:flex">
          <Link
            href="/jobs"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
          >
            Lowongan
          </Link>

          <Link
            href="/companies"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
          >
            Perusahaan
          </Link>

          <Link
            href="/salaries"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
          >
            Gaji
          </Link>

          <Link
            href="/career"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-700"
          >
            Tips Karier
          </Link>
        </div>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}
        <div className="flex items-center">
          {userId && userRole ? (
            /*
             * ============================
             * SUDAH LOGIN
             * ============================
             */
            <UserMenu
              userRole={userRole === "hr" ? "hr" : "candidate"}
              userName={userName}
            />
          ) : (
            /*
             * ============================
             * BELUM LOGIN
             * ============================
             */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}