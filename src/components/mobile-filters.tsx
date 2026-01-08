"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";

interface TreatmentFilters {
  concern: string;
  treatmentType: string;
  treatmentArea: string;
  practitionerType: string;
  priceRange: string;
}

interface MobileFiltersProps {
  filters?: TreatmentFilters;
  onFiltersChange?: (filters: TreatmentFilters) => void;
  onClearFilters?: () => void;
}

export function MobileFilters({ 
  filters = {
    concern: 'all',
    treatmentType: 'all',
    treatmentArea: 'all',
    practitionerType: 'all',
    priceRange: 'all'
  }, 
  onFiltersChange = () => {}, 
  onClearFilters = () => {} 
}: MobileFiltersProps) {
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setIsFilterActive(document.body.classList.contains("filter-active"));
    };

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleToggleFilters = () => {
    document.body.classList.toggle("filter-active");
  };

  const handleFilterChange = (key: keyof TreatmentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="block sm:hidden px-3">
        <Button
          onClick={handleToggleFilters}
          variant="outline"
          size="sm"
          className="w-full bg-transparent rounded-full border-black border text-black hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Mobile Filter Sidebar */}
      <Card
        className={`
          bg-white shadow-lg border border-gray-200 rounded-0 pb-[145px] px-4
          fixed top-0 left-0 h-screen w-full z-[9999] transition-transform duration-300 ease-in-out
          sm:hidden
          ${isFilterActive ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <CardHeader className="p-0 flex flex-row justify-between items-center py-4 border-b">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button
            type="button" 
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => document.body.classList.remove("filter-active")}
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-0 pt-4 space-y-6">
          {/* Concern Filter */}
          <div>
            <Label className="text-base font-medium mb-2 block">Concern:</Label>
            <Select value={filters.concern} onValueChange={(value) => handleFilterChange('concern', value)}>
              <SelectTrigger className="w-full h-12 bg-white border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="acne">Acne</SelectItem>
                <SelectItem value="anti-aging">Anti-Aging</SelectItem>
                <SelectItem value="pigmentation">Pigmentation</SelectItem>
                <SelectItem value="hair-loss">Hair Loss</SelectItem>
                <SelectItem value="body-contouring">Body Contouring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Treatment Type Filter */}
          <div>
            <Label className="text-base font-medium mb-2 block">Treatment Type:</Label>
            <Select value={filters.treatmentType} onValueChange={(value) => handleFilterChange('treatmentType', value)}>
              <SelectTrigger className="w-full h-12 bg-white border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="surgical">Surgical</SelectItem>
                <SelectItem value="non-surgical">Non-Surgical</SelectItem>
                <SelectItem value="laser">Laser</SelectItem>
                <SelectItem value="injectable">Injectable</SelectItem>
                <SelectItem value="skincare">Skincare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Treatment Area Filter */}
          <div>
            <Label className="text-base font-medium mb-2 block">Treatment Area:</Label>
            <Select value={filters.treatmentArea} onValueChange={(value) => handleFilterChange('treatmentArea', value)}>
              <SelectTrigger className="w-full h-12 bg-white border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="face">Face</SelectItem>
                <SelectItem value="body">Body</SelectItem>
                <SelectItem value="hair">Hair</SelectItem>
                <SelectItem value="skin">Skin</SelectItem>
                <SelectItem value="lips">Lips</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <Label className="text-base font-medium mb-2 block">Price Range:</Label>
            <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger className="w-full h-12 bg-white border border-gray-300">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="under-200">Under £200</SelectItem>
                <SelectItem value="200-500">£200 - £500</SelectItem>
                <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                <SelectItem value="over-1000">Over £1,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2 absolute bottom-4 left-4 right-4">
            <Button 
              onClick={() => document.body.classList.remove("filter-active")}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}