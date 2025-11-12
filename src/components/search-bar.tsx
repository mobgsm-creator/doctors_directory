"use client"

import { useState, useEffect } from "react"
import { Search, Locate } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SearchFilters } from "@/lib/types"
import { categories, modalities,locations } from "@/lib/data"
;
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void
  initialFilters?: SearchFilters
}

export function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
 

  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      type: "Clinic",
      query: "",
      category: "",
      location: "",
      rating: 0,
      services: [],
     
    },
  )

  const [showResults, setShowResults] = useState(false)
  const [activeField, setActiveField] = useState<keyof SearchFilters>()
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const handleSearch = () => {
    onSearch(filters)
  }

  return (
    <>
    <div className="w-full max-w-6xl mx-auto space-y-6 hidden sm:block">
      {/* Main search bar with 3 sections */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Section 1: Select either Clinic or Practitioner */}
        <Select value={filters.type } onValueChange={(value: string) => {
            setFilters((prev) => ({ ...prev, type: value }));
          }}>
            <SelectTrigger className="h-[40px] w-[180px] flex-none bg-white rounded-full shadow-sm border border-gray-200 px-4 py-3">
              <SelectValue placeholder="Practitioner"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Practitioner">Practitioner</SelectItem>
              <SelectItem value="Clinic">Clinic</SelectItem>
            </SelectContent>
          </Select>

        {/* Section 2: Filter by Procedure, Speciality, Specialist */}
        <div className="flex-1 bg-white rounded-full shadow-sm border border-gray-200 px-4 py-3">
        <Input
            placeholder="What are you searching for"
            value={filters.query}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, query: e.target.value }))
              setShowResults(e.target.value.length > 0)
            }}
            className="border-0 shadow-none p-0 h-auto text-base placeholder:text-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => filters.query && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
 
        </div>

        {/* Section 3: Location */}
        <div className="flex-1 bg-white rounded-full shadow-sm border border-gray-200 px-4 py-3 flex items-center gap-2">
          <Locate />
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => {
              setFilters((prev) => ({ ...prev, location: e.target.value }))
              setShowResults(e.target.value.length > 0)
            }}
            className="border-0 shadow-none p-0 h-auto text-base placeholder:text-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onFocus={() => filters.location && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          size="lg"
          className="h-14 w-14 rounded-full p-0 bg-black hover:bg-gray-800 flex items-center justify-center"
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
      {showResults && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Popular conditions and procedures */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Popular conditions and procedures</h3>
              <div className="space-y-2 overflow-auto max-h-100">
                {modalities.filter((category : string) => category.toLowerCase().includes(filters.query.toLowerCase())).map((condition : string) => (
                  <button
                    key={condition}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, query: condition }))
                   
                    }}
                    className="block text-left text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular specialties */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Service Cateogries</h3>
              <div className="space-y-2 overflow-auto max-h-100">
                {categories.filter((category : string) => category.toLowerCase().includes(filters.query.toLowerCase())).map((specialty: string) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, query: specialty }))
                  
                    }}
                    className="block text-left text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Locations */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Locations</h3>
              <div className="space-y-2 overflow-auto max-h-100">
              {locations.filter((loc) => typeof loc === 'string' && loc.toLowerCase().includes((filters.location || '').toLowerCase())).map((loc: string) => (
                  <button
                    key={loc}
                    onClick={() => {
                      const selectedLocation = loc;
                      setFilters((prev) => ({ ...prev, location: selectedLocation }))
                    
                    }}
                    className="block text-left text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

  
            
          </div>
        </div>
      )}
    </div>
    
    <div className="block sm:hidden">
      {/* Mobile Search */}
      <div
        className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 px-4 py-2 w-full"
        onClick={() => setShowMobileSearch(true)}
      >
        <Search className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-gray-500 text-sm">Search practitioners, clinics, or locations</span>
       
          

      </div>
      <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
  <DialogContent className="p-0 sm:max-w-lg max-w-full h-screen sm:h-auto rounded-none sm:rounded-lg"
  onInteractOutside={() => setShowMobileSearch(false)}>
    <DialogHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg">Search</span>
        </div>
      </DialogHeader>

    <div className="p-4 space-y-6 overflow-y-auto">
      {/* Section 1: Type */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Type</h3>
        <Select
          value={filters.type}
          onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="w-full bg-gray-50 border border-gray-200">
            <SelectValue placeholder="Practitioner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Practitioner">Practitioner</SelectItem>
            <SelectItem value="Clinic">Clinic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section 2: Query */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Condition or Service</h3>
        <Input
          placeholder="Search for condition, specialty, or service"
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          onFocus={() => setActiveField("query")}
        />
        {activeField === "query" && filters.query && (
          <div className="bg-white border border-gray-200 rounded-lg mt-2 shadow-md p-3 space-y-2 overflow-auto max-h-[200px]">
            {modalities.filter((m: string) => m.toLowerCase().includes(filters.query.toLowerCase())).map((m) => (
              <button
                key={m}
                onClick={() => setFilters(prev => ({ ...prev, query: m }))}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Section 3: Location */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Location</h3>
        <Input
          placeholder="Enter city or area"
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          onFocus={() => setActiveField("location")}
        />
        {activeField === "location" && filters.location && (
          <div className="bg-white border border-gray-200 rounded-lg mt-2 shadow-md p-3 space-y-2 overflow-auto max-h-[200px]">
            {locations.filter((loc: string) =>
              loc.toLowerCase().includes(filters.location.toLowerCase())
            ).map((loc) => (
              <button
                key={loc}
                onClick={() => setFilters(prev => ({ ...prev, location: loc }))}
                className="block w-full text-left text-blue-600 hover:text-blue-800"
              >
                {loc}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search button */}
      <Button
        onClick={() => {
          setShowMobileSearch(false)
          handleSearch()
        }}
        className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800"
      >
        <Search className="mr-2 h-5 w-5" />
        Search
      </Button>
    </div>
  </DialogContent>
</Dialog>

    </div>
    </>
  )
}
