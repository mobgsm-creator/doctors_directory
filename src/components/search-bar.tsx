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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLocResults, setShowLocResults] = useState(false);
  const [activeField, setActiveField] = useState<keyof SearchFilters>();
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const handleSearch = async () => {
    //console.log("handle search");
    setIsLoading(true);
    setFilters(localFilters);
    //console.log(filters);

    await router.push("/search");
    //console.log("pushed");
    setIsLoading(false);
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto space-y-6 sm:block">
        {/* Main search bar with 3 sections */}

        <div className="flex flex-row items-center">
          <div className="block sm:hidden w-full">
            {/* Mobile Search */}
            <div
              className="flex items-center bg-white rounded-full shadow-sm border border-gray-200 px-4 py-3 w-full"
              onClick={() => {
                console.log("cicked");
                setShowResults(true);
                setShowLocResults(true);
              }}
            >
              <span className="text-gray-500 text-[12px]">
                Search practitioners, clinics, or locations
              </span>
            </div>
          </div>
          {/* Section 1: Select either Clinic or Practitioner */}
          <div className="relative hidden sm:block">
            <select
              value={localFilters.type}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="h-12 w-full bg-black text-white rounded-l-lg shadow-sm border-0 px-4 pr-6 py-3 font-medium hover:bg-black appearance-none"
            >
              <option value="Practitioner">Practitioner</option>
              <option value="Clinic">Clinic</option>
            </select>

            {/* Small border-only downward arrow */}
            <div className="pointer-events-none absolute top-1/2 right-3 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-white transform rotate-45 -translate-y-1/2"></div>
          </div>

          {/* Section 2: Filter by Procedure, Speciality, Specialist */}
          <div className="hidden sm:block flex-1 bg-white shadow-sm border border-r-0 border-gray-300 px-4 py-3">
            <Input
              placeholder="I'm searching for"
              value={localFilters.query}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              className="border-0 shadow-none p-0 h-auto w-60 text-base placeholder:text-gray-500"
              onFocus={() => filters.query && setShowResults(true)}
              onClick={() => setShowResults(true)}
            />
          </div>

          {/* Section 3: Location */}
          <div className="hidden sm:flex bg-white rounded-r-lg shadow-sm border border-gray-300 px-4 py-3 flex items-center gap-2">
            <Locate className="w-5 h-5 text-gray-600" />
            <Input
              placeholder="Location"
              value={localFilters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="border-0 shadow-none p-0 h-6 text-base placeholder:text-gray-500"
              onKeyDown={(e) => e.key === "Enter"}
              onFocus={() => filters.location && setShowLocResults(true)}
              onBlur={() => setTimeout(() => setShowLocResults(false), 200)}
              onClick={() => setShowLocResults(true)}
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            size="lg"
            className="ml-4 h-9 w-9 sm:h-12 sm:w-12 rounded-full sm:rounded-lg p-0 bg-black hover:bg-black text-white flex items-center justify-center flex-shrink-0"
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
            <div
              className={`grid ${
                showLocResults ? "grid-cols-3" : "grid-cols-2"
              } gap-6`}
            >
              {/* Popular conditions and procedures */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">
                  Popular conditions and procedures
                </h3>
                <div className="space-y-2 overflow-auto max-h-100">
                  {(modalities.filter((category: string) =>
                    category
                      .toLowerCase()
                      .includes(localFilters.query.toLowerCase())
                  ).length > 0
                    ? modalities.filter((category: string) =>
                        category
                          .toLowerCase()
                          .includes(localFilters.query.toLowerCase())
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
                            setLocalFilters((prev) => ({
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
                    category
                      .toLowerCase()
                      .includes(localFilters.query.toLowerCase())
                  ).length > 0
                    ? search_categories.filter((category: string) =>
                        category
                          .toLowerCase()
                          .includes(localFilters.query.toLowerCase())
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
                            setLocalFilters((prev) => ({
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
              {showLocResults && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Locations
                  </h3>
                  <div className="space-y-2 overflow-auto max-h-100">
                    {(locations.filter(
                      (loc) =>
                        typeof loc === "string" &&
                        loc
                          .toLowerCase()
                          .includes((localFilters.location || "").toLowerCase())
                    ).length > 0
                      ? locations.filter(
                          (loc) =>
                            typeof loc === "string" &&
                            loc
                              .toLowerCase()
                              .includes(
                                (localFilters.location || "").toLowerCase()
                              )
                        )
                      : locations
                    ).map((loc: string, index) => (
                      <div
                        key={loc}
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
                              setLocalFilters((prev) => ({
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
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
