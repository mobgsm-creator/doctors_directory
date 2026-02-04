"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterForm } from "./FilterForm";
import { MobileDrawer } from "./MobileDrawer";

export function TreatmentFiltersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentSort = searchParams.get("sort") ?? "name-asc";

  const filters = {
    concern: searchParams.get("concern") ?? "all",
    treatmentType: searchParams.get("treatmentType") ?? "all",
    treatmentArea: searchParams.get("treatmentArea") ?? "all",
  };

  const updateSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const newSort = currentSort === "name-asc" ? "name-desc" : "name-asc";
    params.set("sort", newSort);
    params.delete("page");
    router.push(`/treatments?${params.toString()}`);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/treatments?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query = searchParams.get("query");
    if (query) {
      router.push(`/treatments?query=${encodeURIComponent(query)}`);
    } else {
      router.push("/treatments");
    }
  };

  const filterForm = (
    <FilterForm
      filters={filters}
      onChange={updateFilter}
      onClear={clearFilters}
    />
  );

  return (
    <>
      <div className="hidden lg:block w-64 sticky top-4 h-fit p-6 rounded-lg">
        {filterForm}
      </div>

      <div className="block w-full lg:hidden px-4">
        <div className="flex gap-3 justify-between">
          <button 
            onClick={updateSort}
            className="flex-1 px-4 py-3 bg-white border border-black rounded-full flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <span>Sort by</span>
            <svg 
              width="12" 
              height="8" 
              viewBox="0 0 12 8" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className={currentSort === "name-desc" ? "rotate-180" : ""}
            >
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="flex-1 px-4 py-3 bg-white border border-black rounded-full flex items-center justify-center gap-2 text-gray-700 font-medium"
          >
            <span>Filters</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <MobileDrawer onClose={() => setIsMobileOpen(false)}>
          {filterForm}
        </MobileDrawer>
      )}
    </>
  );
}