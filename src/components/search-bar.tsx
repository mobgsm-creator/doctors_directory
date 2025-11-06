"use client"

import { useState, useEffect } from "react"
import { Search, Locate } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { SearchFilters } from "@/lib/types"
import { useDataStore } from "@/app/stores/datastore";
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
  const {fetchData,clinics,modalities,categories,professions,locations, loading } = useDataStore();

  useEffect(() => {
    fetchData();  // <-- this must run to fill the store
  }, [fetchData]);


  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      type: "Practitioner",
      query: "",
      category: "",
      location: "",
      rating: 0,
      services: [],
     
    },
  )

  const [showResults, setShowResults] = useState(false)

  const handleSearch = () => {
    onSearch(filters)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
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
              <div className="space-y-2">
                {modalities.filter((category : string) => category.toLowerCase().includes(filters.query.toLowerCase())).slice(0,15).map((condition : string) => (
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
              <div className="space-y-2">
                {categories.filter((category : string) => category.toLowerCase().includes(filters.query.toLowerCase())).slice(0,15).map((specialty: string) => (
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
              <div className="space-y-2">
              {locations.filter((loc) => typeof loc === 'string' && loc.toLowerCase().includes((filters.location || '').toLowerCase())).slice(0,15).map((loc: string) => (
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

  )
}
