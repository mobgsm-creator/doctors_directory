"use client"
import { useState, useMemo } from "react"
import { SearchBar } from "@/components/search-bar"
import { PractitionerCard } from "@/components/practitioner-card"
import { PractitionerListItem } from "@/components/practitioner-list-item"
import { SearchResultsHeader } from "@/components/search-results-header"
import { AdvancedFilters } from "@/components/advanced-filters"
import { PractitionerCardSkeleton, PractitionerListSkeleton } from "@/components/loading-skeleton"
import type { SearchFilters } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchStore, useDataStore } from "@/app/stores/datastore"
const ITEMS_PER_PAGE = 9

export default async function SearchPage() {

    
  const { clinics, practitioners } = useDataStore()
  const { filters, setFilters } = useSearchStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
 

  const filteredAndSortedData = useMemo(() => {
    

    const filteredClinics = clinics.filter((clinic) => {
      // Query filter
      if (filters.query) {
        const query = filters.query.toLowerCase()
        const searchableText = [
          clinic.slug,
          clinic.category,
          clinic.gmapsAddress,
          ...(clinic.reviewAnalysis?.procedures_offered?.categories || []),
        ]
          .join(" ")
          .toLowerCase()

        if (!searchableText.includes(query)) return false
      }
      

      // Category filter
      if (filters.category && filters.category !== "All Categories") {
        if (clinic.category !== filters.category) return false
      }

      // Location filter
      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (!clinic.gmapsAddress.toLowerCase().includes(location)) return false
      }

      // Services filter
      if (filters.services.length > 0) {
        const practitionerServices = clinic.reviewAnalysis?.procedures_offered?.categories || []
        const hasMatchingService = filters.services.some((service) =>
          practitionerServices.some((ps) => ps.includes(service.toLowerCase())),
        )
        if (!hasMatchingService) return false
      }

      // Rating filter
      if (filters.rating > 0) {
        if (clinic.rating < filters.rating) return false
      }

      return true
    })

    const filteredPractitioners = practitioners.filter((practitioner) => {
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
  
    const filtered = filters.type === "Clinic" ? filteredClinics: filteredPractitioners
  
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

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedPractitioners = filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

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
      <SearchBar onSearch={setFilters} />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Search Results Header */}
          <div className="animate-fade-in">
            <SearchResultsHeader
              totalResults={filteredAndSortedData.length}
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
                    handleFiltersChange({ type: "", query: "", category: "", location: "", rating: 0, services: [] })
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
