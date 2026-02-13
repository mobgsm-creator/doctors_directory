"use client";

import { ChevronDown, Locate } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { SearchDropdown } from "./search-dropdown";
import { SearchButton } from "./search-button";

interface MobileSearchViewProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  getDynamicPlaceholderText: () => string;
  localFilters: any;
  setLocalFilters: (updater: (prev: any) => any) => void;
  activeDropdown: 'type' | 'category' | 'location' | null;
  setActiveDropdown: (dropdown: 'type' | 'category' | 'location' | null) => void;
  options: string[];
  isSearchPage: boolean;
  setShowResults: (show: boolean) => void;
  handleSearch: () => void;
  isLoading: boolean;
  handlePageChange?: (page: number) => void;
}

export function MobileSearchView({
  isExpanded,
  setIsExpanded,
  getDynamicPlaceholderText,
  localFilters,
  setLocalFilters,
  activeDropdown,
  setActiveDropdown,
  options,
  isSearchPage,
  setShowResults,
  handleSearch,
  isLoading,
  handlePageChange,
}: MobileSearchViewProps) {
  return (
    <div className="block md:hidden">
      {!isExpanded ? (
        <button
          className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setIsExpanded(true)}
        >
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <span className="text-gray-500 flex-1">{getDynamicPlaceholderText()}</span>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </button>
      ) : (
        <div className="rounded-lg p-4 shadow-lg">
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
              {activeDropdown === 'type' && (
                <SearchDropdown
                  isMobile={true}
                  activeDropdown={activeDropdown}
                  showResults={false}
                  localFilters={localFilters}
                  options={options}
                  isSearchPage={isSearchPage}
                  setLocalFilters={setLocalFilters}
                  setActiveDropdown={setActiveDropdown}
                  setShowResults={setShowResults}
                />
              )}
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
              {activeDropdown === 'category' && (
                <SearchDropdown
                  isMobile={true}
                  activeDropdown={activeDropdown}
                  showResults={false}
                  localFilters={localFilters}
                  options={options}
                  isSearchPage={isSearchPage}
                  setLocalFilters={setLocalFilters}
                  setActiveDropdown={setActiveDropdown}
                  setShowResults={setShowResults}
                />
              )}
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
              {activeDropdown === 'location' && (
                <SearchDropdown
                  isMobile={true}
                  activeDropdown={activeDropdown}
                  showResults={false}
                  localFilters={localFilters}
                  options={options}
                  isSearchPage={isSearchPage}
                  setLocalFilters={setLocalFilters}
                  setActiveDropdown={setActiveDropdown}
                  setShowResults={setShowResults}
                />
              )}
            </div>

            <SearchButton isLoading={isLoading} onClick={() =>{handleSearch(); handlePageChange?.(1)}} />
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
  );
}