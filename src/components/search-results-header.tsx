"use client"

import { SlidersHorizontal, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { SearchFilters } from "@/lib/types"

interface SearchResultsHeaderProps {
  totalResults: number
  currentPage: number
  itemsPerPage: number
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onToggleFilters: () => void
  filters: SearchFilters
}

export function SearchResultsHeader({
  totalResults,
  currentPage,
  itemsPerPage,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onToggleFilters,
  filters,
}: SearchResultsHeaderProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalResults)

  const activeFiltersCount =
    (filters.category && filters.category !== "All Categories" ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    filters.services.length

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          {totalResults > 0 ? "Healthcare Practitioners" : "No Results Found"}
        </h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {totalResults > 0 ? (
            <span>
              Showing {startIndex}-{endIndex} of {totalResults} practitioners
            </span>
          ) : (
            <span>Try adjusting your search criteria</span>
          )}

          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Filters Toggle */}
        <Button variant="outline" size="sm" onClick={onToggleFilters} className="gap-2 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="newest">Newest Members</SelectItem>
          </SelectContent>
        </Select>

        {/* View Mode */}
        <div className="flex border border-border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className="rounded-r-none"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
