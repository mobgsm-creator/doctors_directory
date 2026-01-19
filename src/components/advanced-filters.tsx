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
import { categories, modalities as services, locations } from "@/lib/data"

interface AdvancedFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  isOpen: boolean
  onToggle: () => void
}

export function AdvancedFilters({ filters, onFiltersChange, isOpen, onToggle }: Readonly<AdvancedFiltersProps>) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)
  
  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
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

  const activeFiltersCount =
    (localFilters.category && localFilters.category !== "All Categories" ? 1 : 0) +
    (localFilters.rating > 0 ? 1 : 0) +
    localFilters.services.length

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      

      <CollapsibleContent className="mt-4">
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filter Options</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1">
                <X className="h-3 w-3" />
                Clear All
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.slice(1).map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={localFilters.category === category}
                      onCheckedChange={(checked) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          category: checked ? category : "",
                        }))
                      }
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Minimum Rating</Label>
              <div className="px-2">
                <Slider
                  value={[localFilters.rating]}
                  onValueChange={([value]) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      rating: value,
                    }))
                  }
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                  <span>Any Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-black text-black" />
                    <span>{localFilters.rating > 0 ? `${localFilters.rating}+` : "0"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Services & Treatments</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`service-${service}`}
                      checked={localFilters.services.includes(service)}
                      onCheckedChange={(checked) => handleServiceToggle(service, checked as boolean)}
                    />
                    <Label htmlFor={`service-${service}`} className="text-sm cursor-pointer">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-accent-foreground text-accent">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
