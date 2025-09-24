"use client"

import { useState } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { categories, services } from "@/lib/data"
import type { SearchFilters } from "@/lib/types"

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      query: "",
      category: "",
      location: "",
      rating: 0,
      services: [],
    },
  )

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleServiceToggle = (service: string) => {
    setFilters((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search practitioners, treatments, or specialties..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="pl-10 h-12 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <div className="relative flex-1 md:max-w-xs">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            className="pl-10 h-12 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        <Button onClick={handleSearch} size="lg" className="h-12 px-8">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Services:</span>
        </div>
      </div>

      {/* Service badges */}
      <div className="flex flex-wrap gap-2">
        {services.map((service) => (
          <Badge
            key={service}
            variant={filters.services.includes(service) ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => handleServiceToggle(service)}
          >
            {service}
          </Badge>
        ))}
      </div>

      {/* Active filters display */}
      {(filters.services.length > 0 || filters.category) && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: "" }))}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {filters.services.map((service) => (
            <Badge key={service} variant="secondary" className="gap-1">
              {service}
              <button onClick={() => handleServiceToggle(service)} className="ml-1 hover:text-destructive">
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
