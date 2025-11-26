"use client";

import { useState } from "react";
import { Search, Locate, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchFilters } from "@/lib/types";
import { search_categories, modalities, locations } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/app/stores/datastore";

export function SearchBar() {
  const { filters, setFilters } = useSearchStore();
  const [localQuery, setLocalQuery] = useState("");
  const [localLocation, setLocalLocation] = useState("");
  console.log(localQuery);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeField, setActiveField] = useState<keyof SearchFilters>();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const handleSearch = async () => {
    console.log("handle search");
    setIsLoading(true);
    setFilters(filters);
    console.log(filters);

    await router.push("/search");
    console.log("pushed");
  };
  const visibleModalities =
    filters.query.trim().length === 0
      ? modalities
      : modalities.filter((m) =>
          m.toLowerCase().includes(filters.query.toLowerCase())
        );

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6 hidden sm:block">
        {/* Main search bar with 3 sections */}
        {/* Main search bar with 3 sections */}
        <div className="flex flex-col sm:flex-row items-center">
          <div className="border-2 flex rounded-xl border-ebb">
            {/* Section 1: Select either Clinic or Practitioner */}
            <Select
              value={filters.type}
              onValueChange={(value: string) => {
                setFilters((prev) => ({ ...prev, type: value }));
              }}
            >
              <SelectTrigger
                className="btn !rounded-tr-none !rounded-br-none !h-12
 w-32 flex-none bg-gray-800 text-white shadow-sm border-0 px-4 py-3 font-medium"
              >
                <SelectValue placeholder="Clinic"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Practitioner">Practitioner</SelectItem>
                <SelectItem value="Clinic">Clinic</SelectItem>
              </SelectContent>
            </Select>

            {/* Section 2: Filter by Procedure, Speciality, Specialist */}
            <div className="flex-1 bg-white rounded-none shadow-none border-none border-gray-300 px-4 py-3">
              <Input
                placeholder="I'm searching for"
                value={localQuery}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                }}
                className="border-0 shadow-none p-0 h-auto text-base placeholder:text-gray-500"
                onFocus={() => localQuery && setShowResults(true)}
                onClick={() => setShowResults(true)}
              />
            </div>

            {/* Section 3: Location */}
            <div
              className="flex-1 border-ebb border-l
 rounded-xl rounded-tl-none rounded-bl-none bg-white shadow-none px-4 py-3 flex items-center gap-2"
            >
              <Locate className="w-5 h-5 text-gray-600 flex-shrink-0" />
              <Input
                placeholder="Location"
                value={localLocation}
                onChange={(e) => {
                  setLocalLocation(e.target.value);
                }}
                className="border-0 shadow-none p-0 h-auto text-base placeholder:text-gray-500"
                onKeyDown={(e) => e.key === "Enter"}
                onFocus={() => localLocation && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                onClick={() => setShowResults(true)}
              />
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            size="lg"
            className="btn h-12 w-12 rounded ml-5 p-0 hover:bg-gray-700 text-white flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
          </Button>
        </div>
        {showResults && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-6">
              {/* Popular conditions and procedures */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular conditions and procedures
                </h3>
                <div className="space-y-2 overflow-auto max-h-100">
                  {(modalities.filter((category: string) =>
                    category.toLowerCase().includes(localQuery.toLowerCase())
                  ).length > 0
                    ? modalities.filter((category: string) =>
                        category
                          .toLowerCase()
                          .includes(localQuery.toLowerCase())
                      )
                    : modalities
                  ).map((condition: string, index) => (
                    <div
                      key={condition}
                      className="flex flex-col items-start gap-1"
                    >
                      {/* Index Badge */}

                      {/* Hover-highlight wrapper */}
                      <div
                        className="
                      w-full px-3 py-2 rounded-lg transition
                      hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100
                    "
                      >
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              query: condition,
                            }))
                          }
                          className="text-left text-sm font-medium w-full flex items-center gap-3"
                        >
                          {condition}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular specialties */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Service Cateogries
                </h3>
                <div className="space-y-2 overflow-auto max-h-100">
                  {(search_categories.filter((category: string) =>
                    category.toLowerCase().includes(localQuery.toLowerCase())
                  ).length > 0
                    ? search_categories.filter((category: string) =>
                        category
                          .toLowerCase()
                          .includes(localQuery.toLowerCase())
                      )
                    : search_categories
                  ).map((specialty: string, index) => (
                    <div
                      key={specialty}
                      className="flex flex-col items-start gap-1"
                    >
                      {/* Hover-highlight wrapper */}
                      <div
                        className="
                      w-full px-3 py-2 rounded-lg transition
                      hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100
                    "
                      >
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              query: specialty,
                            }))
                          }
                          className="text-left text-sm font-medium w-full flex items-center gap-3"
                        >
                          {specialty}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Locations */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Locations</h3>
                <div className="space-y-2 overflow-auto max-h-100">
                  {(locations.filter(
                    (loc) =>
                      typeof loc === "string" &&
                      loc
                        .toLowerCase()
                        .includes((localLocation || "").toLowerCase())
                  ).length > 0
                    ? locations.filter(
                        (loc) =>
                          typeof loc === "string" &&
                          loc
                            .toLowerCase()
                            .includes((localLocation || "").toLowerCase())
                      )
                    : locations
                  ).map((loc: string, index) => (
                    <div key={loc} className="flex flex-col items-start gap-1">
                      {/* Index Badge */}

                      {/* Hover-highlight wrapper */}
                      <div
                        className="
                      w-full px-3 py-2 rounded-lg transition
                      hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100
                    "
                      >
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              location: loc,
                            }))
                          }
                          className="text-left text-sm font-medium w-full flex items-center gap-3"
                        >
                          {loc}
                        </button>
                      </div>
                    </div>
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
          <span className="text-gray-500 text-sm">
            Search practitioners, clinics, or locations
          </span>
        </div>
        <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
          <DialogContent
            className="p-0 sm:max-w-lg max-w-full h-screen sm:h-auto rounded-none sm:rounded-lg"
            onInteractOutside={() => setShowMobileSearch(false)}
          >
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
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, type: value }))
                  }
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
                <h3 className="text-sm font-semibold mb-2">
                  Condition or Service
                </h3>
                <Input
                  placeholder="Search for condition, specialty, or service"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  onFocus={() => setActiveField("query")}
                />
                {activeField === "query" && filters.query && (
                  <div className="bg-white border border-gray-200 rounded-lg mt-2 shadow-md p-3 space-y-2 overflow-auto max-h-[200px]">
                    {modalities
                      .filter((m: string) =>
                        m.toLowerCase().includes(filters.query.toLowerCase())
                      )
                      .map((m) => (
                        <button
                          key={m}
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, query: m }))
                          }
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
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  onFocus={() => setActiveField("location")}
                />
                {activeField === "location" && filters.location && (
                  <div className="bg-white border border-gray-200 rounded-lg mt-2 shadow-md p-3 space-y-2 overflow-auto max-h-[200px]">
                    {locations
                      .filter((loc: string) =>
                        loc
                          .toLowerCase()
                          .includes(filters.location.toLowerCase())
                      )
                      .map((loc) => (
                        <button
                          key={loc}
                          onClick={() =>
                            setFilters((prev) => ({ ...prev, location: loc }))
                          }
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
                  setShowMobileSearch(false);
                  handleSearch();
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
  );
}
