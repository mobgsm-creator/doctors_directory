"use client"

import { useState, useEffect, useMemo } from "react"
import { HeroSection } from "@/components/hero-section"
import { PractitionerCard } from "@/components/practitioner-card"
import { PractitionerListItem } from "@/components/practitioner-list-item"
import { SearchResultsHeader } from "@/components/search-results-header"
import { AdvancedFilters } from "@/components/advanced-filters"
import { PractitionerCardSkeleton, PractitionerListSkeleton } from "@/components/loading-skeleton"
import type { SearchFilters, Practitioner } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
const ITEMS_PER_PAGE = 9



function transformPractitioner(raw: any): Practitioner {
 
  return {
    //id: raw["ID"].toString(),
    Name: raw.Name,
    slug: raw.Name.toLowerCase().replace(/\s+/g, "-"),
    image: !raw.Image || raw.Image === "https://www.jccp.org.uk/content/images/no-image.jpg"
  ? parse_text(raw.image)
  : raw.Image,

    profession: parse_text(raw["PROFESSION:"]).trim(),
    // regulatoryBody: raw["REGULATORY BODY:"],
    // registrationPin: raw["REGISTRATION PIN NUMBER:"],
    qualification: raw["QUALIFICATION: (To Date)"].trim(),
     modality: consolidate(raw["SPECIALTIES"]),
    // memberSince: raw["MEMBER SINCE:"],
    // otherMemberships: raw["OTHER MEMBERSHIPS:"],
    // restrictions: raw["RESTRICTIONS:"],
    // url: raw.url,
     rating: parse_numbers(raw.rating),
     reviewCount: parse_numbers(raw.review_count),
     category: raw.category,
     gmapsAddress: parse_addresses(raw.gmaps_address),
    // gmapsLink: raw.gmaps_link,
    // gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    // gmapsReviews: JSON.parse(raw.gmaps_reviews),
    // reviewAnalysis: safeParse(raw["Review Analysis"]),
  };
}

export default function HomePage() {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    location: "",
    rating: 0,
    services: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const res = await fetch("/api/getData");
        const data = await res.json();
      
        const transformedData = data.map(transformPractitioner);
      
        
        setPractitioners(transformedData);
        //console.log(practitioners.length)
   
      } catch (err) {
        console.error(err);
      } finally {
        //console.log("done")
      }
    };

    fetchPractitioners();
  }, []);

 

  const filteredAndSortedPractitioners = useMemo(() => {

    const filtered = practitioners.filter((practitioner) => {
      // Query filter
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchableText = [
          practitioner.Name,
          practitioner.profession,
          practitioner.category,
          practitioner.gmapsAddress,
          ...practitioner.modality.flat(),
          ...(practitioner.reviewAnalysis?.procedures_offered?.categories || []),
        ]
          .join(" ")
          .toLowerCase()

        if (!searchableText.includes(query)) return false
      }
      

      // Category filter
      if (filters.category && filters.category !== "All Categories") {
        if (practitioner.category !== filters.category) return false
      }

      // Location filter
      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (!practitioner.gmapsAddress.toLowerCase().includes(location)) return false
      }

      // Services filter
      if (filters.services.length > 0) {
        const practitionerServices = practitioner.modality.map((m) => m.toLowerCase())
        const hasMatchingService = filters.services.some((service) =>
          practitionerServices.some((ps) => ps.includes(service.toLowerCase())),
        )
        if (!hasMatchingService) return false
      }

      // Rating filter
      if (filters.rating > 0) {
        if (practitioner.rating < filters.rating) return false
      }

      return true
    })
  

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviewCount - a.reviewCount
        
        default:
          return 0
      }
    })

    return filtered
  }, [filters, sortBy, practitioners])

  const totalPages = Math.ceil(filteredAndSortedPractitioners.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPractitioners = filteredAndSortedPractitioners.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const handleSearch = async (newFilters: SearchFilters) => {
    setIsLoading(true)
    setFilters(newFilters)
    setCurrentPage(1)
    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsLoading(false)
  }

  const handleFiltersChange = async (newFilters: SearchFilters) => {
    setIsLoading(true)
    setFilters(newFilters)
    setCurrentPage(1)
    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 200))
    setIsLoading(false)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <main className="min-h-screen">
      <HeroSection onSearch={handleSearch} />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Search Results Header */}
          <div className="animate-fade-in">
            <SearchResultsHeader
              totalResults={filteredAndSortedPractitioners.length}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
              filters={filters}
            />
          </div>

          {/* Advanced Filters */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={showAdvancedFilters}
            onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
          />

          {isLoading ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
                    <PractitionerCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
                    <PractitionerListSkeleton key={i} />
                  ))}
                </div>
              )}
            </>
          ) : paginatedPractitioners.length > 0 ? (
            <>
              {/* Results Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {paginatedPractitioners.map((practitioner, index) => (
                    <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                      <PractitionerCard practitioner={practitioner} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  {paginatedPractitioners.map((practitioner, index) => (
                    <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                      <PractitionerListItem practitioner={practitioner} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 pt-8 animate-fade-in">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page: number
                      if (totalPages <= 7) {
                        page = i + 1
                      } else if (currentPage <= 4) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i
                      } else {
                        page = currentPage - 3 + i
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-foreground mb-2">No practitioners found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any practitioners matching your criteria. Try broadening your search or removing some
                  filters.
                </p>
                <Button
                  onClick={() =>
                    handleFiltersChange({ query: "", category: "", location: "", rating: 0, services: [] })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
