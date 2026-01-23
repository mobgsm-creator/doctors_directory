"use client";
import { useState, useEffect, useTransition } from "react";
import { searchPractitioners } from "@/app/actions/search";
import { SearchBar } from "@/components/search-bar";
import { PractitionerCard } from "@/components/practitioner-card";
import { SearchResultsHeader } from "@/components/search-results-header";
import { AdvancedFilterSidebar } from "@/components/filterSidebar";
import {
  PractitionerCardSkeleton,
} from "@/components/loading-skeleton";
import type { SearchFilters } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Clinic, Practitioner, Product } from "@/lib/types";
import { useSearchStore } from "@/app/stores/datastore";
import {
  Sliders, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS_PER_PAGE = 9;

export default function SearchPage() {
  const treatmentFilters = {
  type: "Treatments",
  query: "",
  category: "",
  location: "",
  rating: 0,
  services: [],
};
  const pathname = usePathname();
  const { filters, setFilters } = useSearchStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [data, setData] = useState<(any|string)[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Fetch data when filters, page, or sort changes
  useEffect(() => {
  startTransition(() => {
    (async () => {
      const start = performance.now();

      const result = await searchPractitioners(
        pathname.includes("treatments") ? treatmentFilters : filters,
        currentPage,
        sortBy
      );

      const end = performance.now();
      console.log(`Search took ${end - start} ms`);

      setData(result.data);
   
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
    })();
  });
}, [filters, currentPage, sortBy]);


  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFilters = () => {
    document.body.classList.toggle("filter-active");
  };

  return (
    <main className="min-h-screen bg-[var(--primary-bg-color)]">
      <div className="bg-[var(--primary-bg-color)] backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/" prefetch={false}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto py-6  border-[#C4C4C4]">
        <SearchBar />
        <div className="block md:hidden">
          <Button
            onClick={handleToggleFilters}
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="w-full mt-4 bg-transparent rounded-full border-black border text-black hover:bg-transparent"
          >
            Filters
            <Sliders className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <section className="pt-2 py-10 md:px-4 bg-white md:bg-[var(--primary-bg-color)]">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="m-0 md:mb-4">
            <SearchResultsHeader
              totalResults={totalCount}
              currentPage={currentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onToggleFilters={() =>
                setShowAdvancedFilters(!showAdvancedFilters)
              }
              filters={filters}
            />
          </div>
          <div className="grid grid-cols-1 md:gap-8 md:grid-cols-12">
            <div className="col-span-1 md:col-span-3">
              <AdvancedFilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={showAdvancedFilters}
                onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
              />
            </div>

            {isPending ? (
              <div className="col-span-1 md:col-span-8">
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
              gap-4"
                >
                  {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <PractitionerCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="col-span-1 md:col-span-9 flex w-full flex-col justify-items-center ">
                {/* Render your data here */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid md:gap-6 md:grid-cols-2 lg:grid-cols-3"
                      : "space-y-4"
                  }
                >
                  {data.length === 0 && (
                    <p className="text-center col-span-1 md:col-span-8">
                      No results found.
                    </p>
                  )}
                  {data.map((item) =>
                    typeof item === "string" ? (
                      <PractitionerCard key={item} practitioner={item} />
                    ) : (
                      <PractitionerCard key={item.slug} practitioner={item} />
                    ),
                  )}
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      className="hover:cursor-pointer"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isPending}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;

                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          className="hover:cursor-pointer"
                          variant={
                            pageNumber === currentPage ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(pageNumber)}
                          disabled={isPending}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      className="hover:cursor-pointer"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isPending}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
