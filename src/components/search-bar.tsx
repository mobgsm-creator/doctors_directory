"use client";

import { useState, useRef } from "react";
import { Search, Locate, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { search_categories, locations } from "@/lib/data";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/app/stores/datastore";
import { usePathname } from "next/navigation";

export function SearchBar() {
  const pathname = usePathname();
  const isSearchPage = pathname.includes("/search");
  const { filters, setFilters } = useSearchStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLocResults, setShowLocResults] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  console.log(showResults)
  const options = ["Practitioner", "Clinic", "Product","Treatments"];
  const handleSearch = async () => {
    //console.log("handle search");
    setIsLoading(true);
    setFilters(localFilters);
    setShowResults(false);
    await router.push("/search");
    //console.log("pushed");
    setIsLoading(false);


  };
  function SearchDropdown() {
    return (
      <>
      <div className="flex flex-col md:flex-rows gap-2">
         
          {showResults && (
            <div
              className={`flex bg-white rounded-lg shadow-lg border border-gray-200 p-6
            
              }  `}
            >
              <div
                className={`grid grid-cols-1 sm:grid-cols-3 ${isSearchPage ? "gap-x-60" : "gap-6"} `}
              >
                {/*Type */}
                <div>
                  <h3 className="font-semibold text-left text-gray-900 mb-4">
                    Type
                  </h3>
                  <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
                    {options.map((opt) => (
                <button
                  key={opt}
                  className="hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => {
                    setLocalFilters((prev) => ({ ...prev, type: opt }));
                    setOpen(false);
                  }}
                >
                   <div
                          className="
                      w-full px-3 py-2 rounded-lg transition
                      hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100
                    "
                        >
                          <div  className="text-left text-sm font-medium w-full flex items-center gap-3">
                  {opt}
                  </div>
                        </div>
                </button>
              ))}
                  </div>
                </div>

                {/* Popular specialties */}
                <div>
                  <h3 className="font-semibold text-left text-gray-900 mb-4">
                    Service Categories
                  </h3>
                  <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
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

                {(<div>
                  <h3 className="font-semibold text-left text-gray-900 mb-4">
                    Location
                  </h3>
                  <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
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
                          .includes((localFilters.location || "").toLowerCase())
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
                </div>)}
                

                {/* Popular Locations */}
              </div>
              
            </div>
          )}

          
          
        </div>
      </>

    )
  }
  function SearchButton() {
    return (
         <div className='flex'>
          {/* Search Button */}
          
          <Button
            onClick={handleSearch}
            size="lg"
            className="ml-4 h-12 w-12 sm:h-12.5 sm:w-12 rounded-full sm:rounded-lg p-0 bg-black hover:bg-black text-white flex items-center justify-center flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <Search className="h-6 w-6" />
            )}
          </Button>
        </div>
    )
  }
  return (
    <>
    <div className='relative flex'>
      <div className=" w-full max-w-6xl mx-auto space-y-6 sm:block relative">
        {/* Main search bar with 3 sections */}
        
        <div className="flex flex-row items-center mb-2">
        
          {/* Section 1: Select either Clinic or Practitioner */}
          <div className="relative">
            <button
              className="flex-1 bg-white shadow-sm border border-r-0 border-gray-300 px-4 py-3 rounded-l-lg "
              onClick={() => setShowResults((o) => !o)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            >
              <Input
                value={localFilters.type}
                readOnly
                className="border-0 shadow-none p-0 h-auto w-23 sm:w-30 text-base text-black cursor-pointer focus:outline-none 
                focus:ring-0 
                focus:border-0
                active:outline-none 
                active:ring-0
                focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
                "
              />
              {/* Small border-only downward arrow */}
              <div className="pointer-events-none absolute top-1/2 right-3 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-black transform rotate-45 -translate-y-1/2"></div>
            </button>
          </div>

          {/* Section 2: Filter by Procedure, Speciality, Specialist */}
          <div className="flex-1 bg-white shadow-sm border rounded-r-lg sm:rounded-r-none border-gray-300 px-4 py-3">
            <Input
              placeholder="I'm searching for"
              value={localFilters.query}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              className="border-0 shadow-none p-0 h-auto sm:w-66 text-base placeholder:text-gray-500 focus:outline-none 
                focus:ring-0 
                focus:border-0
                active:outline-none 
                focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
                active:ring-0"
              onFocus={() => filters.query && setShowResults(true)}
              onClick={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
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
              className="
                border-0 min-w-[80px] shadow-none p-0 h-6 text-base
                placeholder:text-gray-500
                focus:outline-none 
                focus:ring-0 
                focus:border-0
                active:outline-none 
                active:ring-0
                focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
              "
              onKeyDown={(e) => e.key === "Enter"}
              onFocus={() => filters.location && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onClick={() => setShowResults(true)}
            />
          </div>
          
          
          
         
          
          </div>
          <SearchDropdown />
              
          
          
          
              
        
        
      </div><SearchButton /></div>
    </>
  );
}