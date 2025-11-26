
import type { SearchFilters } from "@/lib/types"
import { SearchBar } from "@/components/search-bar"


export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            The Home of Aesthetics & Wellbeing
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Connect ethical aesthetics and healthcare professionals. Discover patient reviews, real aesthetic reviews, and book with confidence.
          </p>
          <SearchBar />
          </div>
        <div className="flex justify-center">
          <img 
            src="/home-page-phone-image.png" 
            alt="Mobile app interface" 
            className="max-w-xs"
          />
        </div>
      </section>
      

  )
}
