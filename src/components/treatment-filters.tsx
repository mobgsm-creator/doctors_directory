"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TreatmentFilters {
  concern: string;
  treatmentType: string;
  treatmentArea: string;
  practitionerType: string;
  priceRange: string;
}

interface TreatmentFiltersProps {
  filters?: TreatmentFilters;
  onFiltersChange?: (filters: TreatmentFilters) => void;
  onClearFilters?: () => void;
  className?: string;
}

export function TreatmentFilters({ 
  filters = {
    concern: 'all',
    treatmentType: 'all',
    treatmentArea: 'all',
    practitionerType: 'all',
    priceRange: 'all'
  }, 
  onFiltersChange = () => {}, 
  onClearFilters = () => {}, 
  className = "" 
}: TreatmentFiltersProps) {
  const handleFilterChange = (key: keyof TreatmentFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className={`w-64 hidden lg:block sticky top-4 h-fit p-6  rounded-lg ${className}`}>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

      {/* Concern Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Concern:
        </label>
        <Select value={filters.concern} onValueChange={(value) => handleFilterChange('concern', value)}>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue className="text-black" placeholder="All"/>
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
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Type:
        </label>
        <Select value={filters.treatmentType} onValueChange={(value) => handleFilterChange('treatmentType', value)}>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
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
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Area:
        </label>
        <Select value={filters.treatmentArea} onValueChange={(value) => handleFilterChange('treatmentArea', value)}>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
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

      {/* Practitioner Type Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Practitioner Type:
        </label>
        <Select value={filters.practitionerType} onValueChange={(value) => handleFilterChange('practitionerType', value)}>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="dermatologist">Dermatologist</SelectItem>
            <SelectItem value="plastic-surgeon">
              Plastic Surgeon
            </SelectItem>
            <SelectItem value="aesthetic-practitioner">
              Aesthetic Practitioner
            </SelectItem>
            <SelectItem value="nurse">Nurse Practitioner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Price Range:
        </label>
        <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
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

      <Button
        variant="outline"
        onClick={onClearFilters}
        className="w-full"
      >
        Clear All
      </Button>
    </div>
  );
}