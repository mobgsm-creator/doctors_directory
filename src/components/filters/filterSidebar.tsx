"use client";

import { useEffect, useState } from "react";
import { Sliders, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SearchFilters } from "@/lib/types";
import { TreatmentForm } from "@/components/filters/TreatmentForm";
import { ClinicFilters } from "@/components/filters/ClinicFilters";
import { PractitionerFilters } from "@/components/filters/PractitionerFilters";
import { ProductFilters } from "@/components/filters/ProductFilters";
import { useSearchStore } from "@/app/stores/datastore";
import {usePathname, useRouter } from "next/navigation";
interface AdvancedFiltersProps {
  pageType?: string
}



export function AdvancedFilterSidebar({ pageType }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { filters, setFilters } = useSearchStore();
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const pathname = usePathname();
  const Router = useRouter();
  const onToggle = () => {
    
  setIsOpen(!isOpen);
  setIsFilterActive(true); // Reset active state when toggling
};
  const [treatmentFilters, setTreatmentFilters] = useState({
    concern: "all",
    treatmentType: "all",
    treatmentArea: "all",
    priceRange: "all"
  });

  const [clinicFilters, setClinicFilters] = useState({
    servicesOffered: "all",
    location: "",
    rating: "all",
    distance: "all",
    query: ""
  });

  const [practitionerFilters, setPractitionerFilters] = useState({
    practitioner_specialty: "all",
    practitioner_qualifications: "all",
    City: "all",
    rating: "all",
    query: ""
  });

  const [productFilters, setProductFilters] = useState({
    product_category: "all",
    brand: "all",
    distributor_cleaned: "all",
    category: "all",
    query: ""
  });

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    let updatedFilters: SearchFilters = {
      type: filters.type,
      query: "",
      category: "",
      location: "",
      rating: 0,
      services: [],
    };
    
    if (filters.type === "Treatments") {
      updatedFilters.category = treatmentFilters.concern !== "all" ? treatmentFilters.concern : "";
      const activeFilters = [];
      if (treatmentFilters.treatmentType !== "all") activeFilters.push(treatmentFilters.treatmentType);
      if (treatmentFilters.treatmentArea !== "all") activeFilters.push(treatmentFilters.treatmentArea);
      updatedFilters.services = activeFilters;
    } else if (filters.type === "Clinic") {
      updatedFilters.query = clinicFilters.query || "";
      updatedFilters.services = clinicFilters.servicesOffered !== "all" ? [clinicFilters.servicesOffered] : [];
      updatedFilters.location = clinicFilters.location !== "all" ? clinicFilters.location : "";
      updatedFilters.rating = clinicFilters.rating !== "all" ? Number.parseInt(clinicFilters.rating) : 0;
    } else if (filters.type === "Practitioner") {
      updatedFilters.query = practitionerFilters.query || "";
      updatedFilters.services = practitionerFilters.practitioner_specialty !== "all" ? [practitionerFilters.practitioner_specialty] : [];
      updatedFilters.location = practitionerFilters.City !== "all" ? practitionerFilters.City : "";
      updatedFilters.rating = practitionerFilters.rating !== "all" ? Number.parseInt(practitionerFilters.rating) : 0;
      updatedFilters.category = practitionerFilters.practitioner_qualifications !== "all" ? practitionerFilters.practitioner_qualifications : "";
    } else if (filters.type === "Product") {
      updatedFilters.query = productFilters.query || "";
      updatedFilters.services = productFilters.product_category !== "all" ? [productFilters.product_category] : [];
      updatedFilters.category = productFilters.brand !== "all" ? productFilters.brand : "";
      updatedFilters.location = productFilters.distributor_cleaned !== "all" ? productFilters.distributor_cleaned : "";
    }
    
    setFilters(updatedFilters);

    if (pathname !== "/search") {
      Router.push("/search");
    }
   
    onToggle();
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      type: filters.type,
      query: "",
      category: "",
      location: "",
      rating: 0,
      services: [],
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    
    setTreatmentFilters({
      concern: "all",
      treatmentType: "all",
      treatmentArea: "all",
      priceRange: "all"
    });
    setClinicFilters({
      servicesOffered: "all",
      location: "",
      rating: "all",
      distance: "all",
      query: ""
    });
    setPractitionerFilters({
      practitioner_specialty: "all",
      practitioner_qualifications: "all",
      City: "all",
      rating: "all",
      query: ""
    });
    setProductFilters({
      product_category: "all",
      brand: "all",
      distributor_cleaned: "all",
      category: "all",
      query: ""
    });
    
    onToggle();
  };

  const handleTreatmentFilterChange = (key: string, value: string) => {
    setTreatmentFilters(prev => ({ ...prev, [key]: value }));
    setLocalFilters(prev => ({
      ...prev,
      category: key === "concern" ? value : prev.category,
    }));
  };

  const handleClinicFilterChange = (key: string, value: string) => {
    setClinicFilters(prev => ({ ...prev, [key]: value }));
    setLocalFilters(prev => ({
      ...prev,
      query: key === "query" ? value : prev.query,
      services: key === "servicesOffered" && value !== "all" ? [value] : prev.services,
      location: key === "distance" ? value : prev.location,
      rating: key === "rating" && value !== "all" ? Number.parseInt(value) : prev.rating,
    }));
  };

  const handlePractitionerFilterChange = (key: string, value: string) => {
    setPractitionerFilters(prev => ({ ...prev, [key]: value }));
    setLocalFilters(prev => ({
      ...prev,
      query: key === "query" ? value : prev.query,
      services: key === "practitioner_specialty" && value !== "all" ? [value] : prev.services,
      location: key === "City" ? value : prev.location,
      rating: key === "rating" && value !== "all" ? Number.parseInt(value) : prev.rating,
      category: key === "practitioner_qualifications" ? value : prev.category,
    }));
  };

  const handleProductFilterChange = (key: string, value: string) => {
    setProductFilters(prev => ({ ...prev, [key]: value }));
    setLocalFilters(prev => ({
      ...prev,
      query: key === "query" ? value : prev.query,
      services: key === "product_category" && value !== "all" ? [value] : prev.services,
      category: key === "brand" ? value : prev.category,
      location: key === "distributor_cleaned" ? value : prev.location,
    }));
  };

  return (
    <>
    
      <aside aria-label="Filter sidebar">
        <div className="block md:hidden">
          <Button
            onClick={onToggle}
            variant={"ghost"}
            size="sm"
            className="w-full mt-4 bg-transparent rounded-full border-black border text-black hover:bg-transparent"
          >
            Filters
            <Sliders className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <Card
          className={`
          bg-transparent h-[460px] shadow-none border border-transparent rounded-0 pb-[145px] px-4 md:px-0 md:py-0 relative
          md:relative md:block md:h-auto w-full md:bg-transparent md:translate-x-0
          fixed top-0 left-0 bg-white z-[1] transition-transform duration-300 ease-in-out
          ${isFilterActive ? "translate-x-0" : "-translate-x-full"} ${isOpen ? "block" : "hidden"}
        `}
        >
          <CardHeader className="p-0 flex justify-between items-center">
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="inline-flex md:hidden p-2"
              onClick={() => onToggle()}
            >
              <X className="w-4 h-4 text-medium" />
            </Button>
          </CardHeader>

          <CardContent className="p-0 w-full h-full space-y-4 static">
            {filters.type === "Treatments" && (
              <TreatmentForm
                filters={treatmentFilters}
                onChange={handleTreatmentFilterChange}
                onClear={() => {
                  setTreatmentFilters({
                    concern: "all",
                    treatmentType: "all",
                    treatmentArea: "all",
                    priceRange: "all",
                  });
                  setFilters({
                    type: filters.type,
                    query: "",
                    category: "",
                    location: "",
                    rating: 0,
                    services: [],
                  });
                }}
              />
            )}

            {filters.type === "Clinic" && (
              <ClinicFilters
                filters={clinicFilters}
                onChange={handleClinicFilterChange}
                onClear={() => {
                  setClinicFilters({
                    servicesOffered: "all",
                    location: "",
                    rating: "all",
                    distance: "all",
                    query: "",
                  });
                  setFilters({
                    type: filters.type,
                    query: "",
                    category: "",
                    location: "",
                    rating: 0,
                    services: [],
                  });
                }}
                setIsFilterActive={setIsFilterActive}
              />
            )}

            {filters.type === "Practitioner" && (
              <PractitionerFilters
                filters={practitionerFilters}
                onChange={handlePractitionerFilterChange}
                onClear={() => {
                  setPractitionerFilters({
                    practitioner_specialty: "all",
                    practitioner_qualifications: "all",
                    City: "all",
                    rating: "all",
                    query: "",
                  });
                  setFilters({
                    type: filters.type,
                    query: "",
                    category: "",
                    location: "",
                    rating: 0,
                    services: [],
                  });
                }}
                setIsFilterActive={setIsFilterActive}
              />
            )}

            {filters.type === "Product" && (
              <ProductFilters
                filters={productFilters}
                onChange={handleProductFilterChange}
                onClear={() => {
                  setProductFilters({
                    product_category: "all",
                    brand: "all",
                    distributor_cleaned: "all",
                    category: "all",
                    query: "",
                  });
                  setFilters({
                    type: filters.type,
                    query: "",
                    category: "",
                    location: "",
                    rating: 0,
                    services: [],
                  });
                }}
                setIsFilterActive={setIsFilterActive}
              />
            )}

            <div className="bg-white md:bg-transparent space-y-2 px-4 w-full absolute py-2 md:py-0 md:px-0 md:static bottom-0 left-0 righ-0">
              <Button
                variant="default"
                onClick={handleApplyFilters}
                className="w-full bg-black hover:bg-black text-white hover:cursor-pointer"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </>
  );
}
