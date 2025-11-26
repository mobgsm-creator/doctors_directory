import type { SearchFilters } from "@/lib/types";
import { SearchBar } from "@/components/search-bar";

export function HeroSection() {
  return (
    <section className="hero-holder">
      <section className="max-w-7xl text-center md:text-left mx-auto px-6 pb-20 pt-8 md:pb-0 md:pt-20 grid md:grid-cols-2 gap-12 items-start">
        <div className="pt-5">
          <h1 className="text-3xl md:text-5xl mb-6">
            The Home of Aesthetics & Wellbeing
          </h1>
          <p className="text-sm text-md-lg mb-8">
            Discover certified aesthetic and healthcare professionals. Browse
            verified profiles, read authentic reviews, and book with confidence.
          </p>
          <SearchBar />
        </div>
        <div className="flex justify-center hidden md:flex">
          <img
            src="images/img001.png"
            alt="Mobile app interface"
            className="max-w-xs"
          />
        </div>
      </section>
    </section>
  );
}
