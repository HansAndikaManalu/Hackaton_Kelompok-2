import { Navbar } from "@/components/Navbar/Navbar";
import Footer from "@/components/Home/Footer";
import JobList from "@/components/Jobs/JobList";

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Lowongan Kerja
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Temukan posisi yang sesuai dengan keahlianmu.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <JobList />
      </section>

      <Footer />
    </div>
  );
}