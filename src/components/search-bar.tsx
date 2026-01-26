"use client";

import { useState, useRef, useEffect, startTransition } from "react";
import { Search, Locate, Loader2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { search_categories, locations } from "@/lib/data";
import { redirect, useRouter } from "next/navigation";
import { useSearchStore } from "@/app/stores/datastore";
import { usePathname } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

export function SearchBar() {
  const pathname = usePathname();
  const isSearchPage = pathname.includes("/search");
  const { filters, setFilters } = useSearchStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showLocResults, setShowLocResults] = useState(false);
  // If on /treatments, default type to 'Treatments'
  const [localFilters, setLocalFilters] = useState(() => {
    if (pathname.includes("/treatments")) {
      return { ...filters, type: "Treatments" };
    }
    return filters;
  });
  const [open, setOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'type' | 'category' | 'location' | null>(null);
  const dropdownRef = useRef(null);

  // Only allow 'Treatments' as type on /treatments page
  const options = pathname.includes("/treatments") ? ["Treatments"] : ["Practitioner", "Clinic", "Product", "Treatments"];
  
  const getDynamicPlaceholderText = () => {
    let parts = [];
    
    if (localFilters.type && localFilters.type !== "Practitioner") {
      parts.push(localFilters.type.toLowerCase());
    } else {
      parts.push("doctor, practitioner");
    }
    
    if (localFilters.query && localFilters.query.trim()) {
      parts.push(localFilters.query.toLowerCase());
    } else {
      parts.push("treatment");
    }
    
    if (localFilters.location && localFilters.location.trim()) {
      return `Find ${parts.join(", ")} in ${localFilters.location}`;
    }
    
    return `Find ${parts.join(", ")}`;
  };
  
  const handleSearch = async () => {
    setIsLoading(true);
    setFilters(localFilters);
    setShowResults(false);
    setIsExpanded(false);
    startTransition(() => {
      if (pathname.includes("/treatments")) {
        router.push("/treatments?" + new URLSearchParams({
          query: localFilters.query || "",
          type: localFilters.type || "",
          category: localFilters.category || "",
          location: localFilters.location || "",
        }).toString());
      } else {
        router.push("/search");
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (router) {
      router.prefetch("/search");
    }
  }, [router]);


  function SearchDropdown({ isMobile = false }) {
    if (isMobile && !activeDropdown) return null;
    if (!isMobile && !showResults && !activeDropdown) return null;
    
    const dropdownClasses = isMobile 
      ? "absolute top-full left-0 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50 mt-1"
      : "flex bg-white rounded-lg shadow-lg border border-gray-200 p-6";

    const gridClasses = isMobile 
      ? "w-full"
      : `grid grid-cols-1 sm:grid-cols-3 ${isSearchPage ? "gap-x-60" : "gap-6"}`;

    const filteredCategories = search_categories.filter((category: string) =>
      category.toLowerCase().includes(localFilters.query.toLowerCase())
    ).length > 0
      ? search_categories.filter((category: string) =>
          category.toLowerCase().includes(localFilters.query.toLowerCase())
        )
      : search_categories;

    const filteredLocations = locations.filter((loc) =>
      typeof loc === "string" &&
      loc.toLowerCase().includes((localFilters.location || "").toLowerCase())
    ).length > 0
      ? locations.filter((loc) =>
          typeof loc === "string" &&
          loc.toLowerCase().includes((localFilters.location || "").toLowerCase())
        )
      : locations;

    const handleTypeClick = (opt: string) => {
      setLocalFilters((prev) => ({ ...prev, type: opt }));
      setActiveDropdown(null);
      if (isMobile) setShowResults(false);
      else setShowResults(false);
    };

    const handleCategoryClick = (specialty: string) => {
      setLocalFilters((prev) => ({ ...prev, query: specialty }));
      setActiveDropdown(null);
      if (isMobile) setShowResults(false);
      else setShowResults(false);
    };

    const handleLocationClick = (loc: string) => {
      setLocalFilters((prev) => ({ ...prev, location: loc }));
      setActiveDropdown(null);
      if (isMobile) setShowResults(false);
      else setShowResults(false);
    };
    
    return (
      <div className={dropdownClasses}>
        <div className={gridClasses}>
          {(activeDropdown === 'type' || (!isMobile && showResults)) && (
            <div className="w-full">
              <h3 className="font-semibold text-left text-gray-900 mb-4">Type</h3>
              <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="w-full text-left text-sm font-medium flex items-center gap-3 p-2 rounded hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100"
                    onClick={() => handleTypeClick(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(activeDropdown === 'category' || (!isMobile && showResults)) && (
            <div className="w-full">
              <h3 className="font-semibold text-left text-gray-900 mb-4">Service Categories</h3>
              <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
                {filteredCategories.map((specialty: string) => (
                  <button
                    key={specialty}
                    onClick={() => handleCategoryClick(specialty)}
                    className="hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 text-left text-sm font-medium w-full flex items-center gap-3 p-2 rounded"
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(activeDropdown === 'location' || (!isMobile && showResults)) && (
            <div className="w-full">
              <h3 className="font-semibold text-left text-gray-900 mb-4">Location</h3>
              <div className="space-y-2 overflow-auto max-h-50 md:max-h-100">
                {filteredLocations.map((loc: string) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationClick(loc)}
                    className="text-left text-sm font-medium w-full flex items-center gap-3 hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 p-2 rounded"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  function SearchButton() {
    return (
         <div className='flex'>
          <Button
            onClick={handleSearch}
            size="lg"
            className="ml-4 h-12 w-12 sm:h-12.5 sm:w-12 rounded-full hover:cursor-pointer sm:rounded-lg p-0 bg-black hover:bg-black text-white flex items-center justify-center flex-shrink-0"
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
      <div className='relative flex flex-col'>
        <div className="w-full max-w-6xl mx-auto space-y-6 sm:block relative">
          
          <div className="block md:hidden">
            {!isExpanded ? (
              <div 
                className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsExpanded(true)}
              >
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <span className="text-gray-500 flex-1">{getDynamicPlaceholderText()}</span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </div>
            ) : (
              <div className=" rounded-lg p-4 shadow-lg">
                <div className="space-y-4">
                  <div className="relative">
                    <button
                      className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg text-left"
                      onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                      onBlur={() => setTimeout(() => setActiveDropdown(null), 350)}
                    >
                      <Input
                        value={localFilters.type || "Select type"}
                        readOnly
                        className="border-0 p-0 h-auto w-full text-base text-black cursor-pointer focus-visible:ring-offset-0 focus-visible:ring-0"
                        placeholder="Select type"
                      />
                      <div className="pointer-events-none absolute top-1/2 right-3 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-black transform rotate-45 -translate-y-1/2"></div>
                    </button>
                    {activeDropdown === 'type' && <SearchDropdown isMobile={true} />}
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="I'm searching for"
                      value={localFilters.query}
                      onChange={(e) =>
                        setLocalFilters((prev) => ({ ...prev, query: e.target.value }))
                      }
                      className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg h-12"
                      onFocus={() => setActiveDropdown('category')}
                      onClick={() => setActiveDropdown('category')}
                      onBlur={() => setTimeout(() => setActiveDropdown(null), 350)}
                    />
                    {activeDropdown === 'category' && <SearchDropdown isMobile={true} />}
                  </div>

                  <div className="relative">
                    <div className="relative">
                      <Locate className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        placeholder="Location"
                        value={localFilters.location}
                        onChange={(e) =>
                          setLocalFilters((prev) => ({ ...prev, location: e.target.value }))
                        }
                        className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg pl-10 h-12"
                        onFocus={() => setActiveDropdown('location')}
                        onClick={() => setActiveDropdown('location')}
                        onBlur={() => setTimeout(() => setActiveDropdown(null), 350)}
                      />
                    </div>
                    {activeDropdown === 'location' && <SearchDropdown isMobile={true} />}
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="w-full h-12 bg-black hover:bg-black text-white rounded-lg flex items-center justify-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                  </Button>

                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mx-auto block"
                  >
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:block">
            <div className="flex flex-row items-center mb-2">
              <div className="relative">
                <button
                  className="flex-1 bg-white border border-r-0 border-gray-300 px-4 py-3 rounded-l-lg"
                  onClick={() => setShowResults((o) => !o)}
                  onBlur={() => setTimeout(() => setShowResults(false), 350)}
                >
                  <Input
                    value={localFilters.type}
                    readOnly
                    className="border-0 p-0 h-auto w-23 sm:w-30 text-base text-black cursor-pointer focus-visible:ring-offset-0"
                  />
                  <div className="pointer-events-none absolute top-1/2 right-3 w-1.5 h-1.5 border-b-[1.5px] border-r-[1.5px] border-black transform rotate-45 -translate-y-1/2"></div>
                </button>
              </div>

              <div className="flex-1 bg-white shadow-sm border rounded-r-lg sm:rounded-r-none border-gray-300 px-4 py-3">
                <Input
                  placeholder="I'm searching for"
                  value={localFilters.query}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  className="border-0 shadow-none p-0 h-auto w-full text-base placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-0 active:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 active:ring-0"
                  onFocus={() => filters.query && setShowResults(true)}
                  onClick={() => setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 350)}
                />
              </div>

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
                  className="border-0 min-w-[80px] shadow-none p-0 h-6 text-base placeholder:text-gray-500 focus:outline-none focus:ring-0 focus:border-0 active:outline-none active:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0"
                  onKeyDown={(e) => e.key === "Enter"}
                  onFocus={() => filters.location && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 350)}
                  onClick={() => setShowResults(true)}
                />
              </div>
              
              <SearchButton />
            </div>
            
            {showResults && <SearchDropdown isMobile={false} />}
          </div>
        </div>
      </div>
    </>
  );
}