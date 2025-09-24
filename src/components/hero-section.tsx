import { SearchBar } from "./search-bar"
import type { SearchFilters } from "@/lib/types"

interface HeroSectionProps {
  onSearch: (filters: SearchFilters) => void
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Find Qualified Healthcare
            <span className="text-accent block">Practitioners</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            Discover certified aesthetic and healthcare professionals in your area. Browse verified profiles, read
            authentic reviews, and book with confidence.
          </p>
        </div>

        <SearchBar onSearch={onSearch} />

        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Verified Practitioners</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Authentic Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Regulatory Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
