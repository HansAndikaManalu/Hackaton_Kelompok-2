import { Navbar } from "@/components/Navbar/Navbar";
import HeroSearch from "@/components/Home/HeroSearch";
import CategoryList from "@/components/Home/CategoryList";
import JobSection from "@/components/Home/JobSection";
import EmployerCTA from "@/components/Home/EmployerCTA";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <HeroSearch />

      <main className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <CategoryList />

        <JobSection />

        <EmployerCTA />
      </main>

      <Footer />
    </div>
  );
}