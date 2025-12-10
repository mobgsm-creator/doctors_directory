"use client";

import { useEffect, useState } from "react";
import { ChevronDown, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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

  const handleModalityChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedModalities([...selectedModalities, brand]);
    } else {
      setSelectedModalities(selectedModalities.filter((b) => b !== brand));
    }
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
      <Card
        className={`
          bg-transparent shadow-none border border-transparent rounded-0 pb-[145px] px-4 md:px-0 md:py-0 relative
          md:relative md:block md:h-auto w-full md:bg-transparent md:translate-x-0
          fixed top-0 left-0 h-screen bg-white z-50 transition-transform duration-300 ease-in-out
          ${isFilterActive ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <CardHeader className="p-0 flex justify-between items-center">
          <CardTitle className="text-lg mb-0 md:mb-4">Filters</CardTitle>
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
            <input
              type="text"
              value={localFilters.query}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, query: e.target.value }))
              }
              placeholder="Search products..."
              className="w-full px-3 py-2 text-sm border rounded-md bg-white"
            />
          </div>

          <div>
            <h3 className="font-medium mb-3">Procedure</h3>
            <div className="space-y-2 overflow-auto max-h-[inherit] h-[calc(100vh-300px)] md:max-h-200">
              {modalities.length > 0 ? (
                modalities.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      className="bg-white"
                      checked={selectedModalities.includes(brand)}
                      onCheckedChange={(checked) =>
                        handleModalityChange(brand, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={brand}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No brands found.</p>
              )}
            </div>
          </div>

          <div className="bg-white md:bg-transparent space-y-2 px-4 w-full absolute py-2 md:py-0 md:px-0 md:static bottom-0 left-0 righ-0">
            <Button
              variant="outline"
              onClick={handleApplyFilters}
              className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-white"
            >
              Apply Filters
            </Button>
            <Button
              variant="link"
              onClick={handleClearFilters}
              className="w-full"
            >
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
