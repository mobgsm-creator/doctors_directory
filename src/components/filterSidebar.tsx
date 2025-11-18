"use client"

import { useEffect, useState } from "react"
import { ChevronDown, X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import type { SearchFilters } from "@/lib/types"
import { search_categories, modalities } from "@/lib/data"
import { Separator } from "./ui/separator"

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export function AdvancedFilterSidebar({ filters, onFiltersChange, isOpen, onToggle }: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
  }
  const handleModalityChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedModalities([...selectedModalities, brand])
    } else {
      setSelectedModalities(selectedModalities.filter((b) => b !== brand))
    }
  }

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      type: filters.type,
      query: filters.query, // Keep the search query
      category: "",
      location: filters.location, // Keep the location
      rating: 0,
      services: [],
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const handleServiceToggle = (service: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      services: checked ? [...prev.services, service] : prev.services.filter((s) => s !== service),
    }))
  }
  return (
  <>
     
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="w-60 space-y-6">
      <div>
        <input
          type="text"
          value={localFilters.query}
          onChange={(e) => setLocalFilters((prev) => ({ ...prev, query: e.target.value }))}
          placeholder="Search products..."
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
      </div>

        {/* Brand Filter */}
        <div>
          <h3 className="font-medium mb-3">Procedure</h3>
          <div className="max-h-400 space-y-2 overflow-auto">
            {modalities.length > 0 ? (
              modalities.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedModalities.includes(brand)}
                    onCheckedChange={(checked) => handleModalityChange(brand, checked as boolean)}
                  />
                  <label
                    htmlFor={brand}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {brand}
                  </label>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No brands found.</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Price Range Filter
        {view === 'products' && (
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider value={priceRange} onValueChange={setPriceRange} max={50000} min={0} step={500} className="mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₹{priceRange[0].toLocaleString()}</span>
              <span>₹{priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>)} */}

        <Separator />

       

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={handleClearFilters} variant="outline" className="w-full">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card></>
  )
}