"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters } from "@/lib/types";
import { search_categories, modalities } from "@/lib/data";
import { Separator } from "./ui/separator";

interface AdvancedFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AdvancedFilterSidebar({
  filters,
  onFiltersChange,
  isOpen,
  onToggle,
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [selectedModalities, setSelectedModalities] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState<string>("all");
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setIsFilterActive(document.body.classList.contains("filter-active"));
    };

    check();

    const observer = new MutationObserver(check);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onToggle(); // Close sidebar
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      type: filters.type,
      query: filters.query,
      category: "",
      location: filters.location,
      rating: 0,
      services: [],
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    setSelectedModalities([]);
    setSelectedDistance("all");
    onToggle(); // Close sidebar
  };

  const handleServiceToggle = (service: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      services: checked
        ? [...prev.services, service]
        : prev.services.filter((s) => s !== service),
    }));
  };

  return (
    <>
      <aside aria-label="Filter sidebar">
        <Card
          className={`
          bg-transparent shadow-none border border-transparent rounded-0 pb-[145px] px-4 md:px-0 md:py-0 relative
          md:relative md:block md:h-auto w-full md:bg-transparent md:translate-x-0
          fixed top-0 left-0 h-screen bg-white z-[9999] md:z-[1] transition-transform duration-300 ease-in-out
          ${isFilterActive ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <CardHeader className="p-0 flex justify-between items-center">
            <CardTitle className="font-semibold text-xl text-black mb-6">
              Filters
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="inline-flex md:hidden p-2"
              onClick={() => document.body.classList.remove("filter-active")}
            >
              <X className="w-4 h-4 text-medium" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 w-full h-full space-y-4 static">
            <div>
              <h3 className="sr-only">Search</h3>
              <input
                type="text"
                value={localFilters.query}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    query: e.target.value,
                  }))
                }
                placeholder="Search products..."
                className="w-full px-3 py-2 text-base border rounded-md bg-white"
              />
            </div>

            <div className="mb-6">
              <label className="block text-base font-medium text-black mb-2">
                Procedure:
              </label>
              <Select
                value={
                  selectedModalities.length > 0 ? selectedModalities[0] : "all"
                }
                onValueChange={(value) => {
                  if (value === "all") {
                    setSelectedModalities([]);
                  } else {
                    setSelectedModalities([value]);
                  }
                }}
              >
                <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {modalities.length > 0 ? (
                    modalities.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-options" disabled>
                      No brands found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-base font-medium text-black mb-2">
                Distance:
              </label>
              <Select
                value={selectedDistance}
                onValueChange={(value) => {
                  setSelectedDistance(value);
                }}
              >
                <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="5km">Within 5km</SelectItem>
                  <SelectItem value="10km">Within 10km</SelectItem>
                  <SelectItem value="25km">Within 25km</SelectItem>
                  <SelectItem value="50km">Within 50km</SelectItem>
                  <SelectItem value="100km">Within 100km</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-white md:bg-transparent space-y-2 px-4 w-full absolute py-2 md:py-0 md:px-0 md:static bottom-0 left-0 righ-0">
              <Button
                variant="outline"
                onClick={handleApplyFilters}
                className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-white hover:cursor-pointer"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full hover:cursor-pointer"
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </>
  );
}
