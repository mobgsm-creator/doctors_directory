
import { SearchBar } from "@/components/search-bar";


export function HeroSection() {
  return (
    <div className="bg-[var(--primary-bg-color)]">
      <section className="
        bg-[var(--primary-bg-color)] 
        max-w-7xl 
        text-center 
        md:text-left 
        mx-auto 
        px-6 
        py-2
        grid 
        md:grid-cols-2 
        gap-12 
        items-center"
        style={{ height: "calc(100vh - 88px)" }}>
        <div className="pt-5">
          <h1
            className="text-3xl md:text-5xl mb-6 text-[var(--mineshaft)] font-[var(--font-noto)]"
            style={{ fontFamily: "var(--font-noto)" }}
          >
            The Home of Aesthetics & Wellbeing
          </h1>
          <p className="text-sm md:text-lg mb-8">
            Discover certified aesthetic and healthcare professionals. Browse
            verified profiles, read authentic reviews, and book with confidence.
          </p>
          <SearchBar />
        </div>
        <div className="flex justify-center hidden md:flex">
          <img
            src="images/Consentz Aesthetic Clinic Directory.webp"
            alt="Mobile app interface"
            className="max-w-xs"
          />
        </div>
      </section>
    </div>
  );
}
