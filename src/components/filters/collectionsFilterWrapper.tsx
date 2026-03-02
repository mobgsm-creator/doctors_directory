"use client";

import { useSearchStore } from "@/app/stores/datastore";
import { useEffect } from "react";
import { AdvancedFilterSidebar } from "./filterSidebar";
export function CollectionsFilter({ pageType }: { pageType: string }) {
  const setFilters = useSearchStore((s) => s.setFilters);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      type: pageType,
    }));
  }, [pageType, setFilters]);

  return (
    <>
      <AdvancedFilterSidebar pageType={pageType} />
 
    </>
  );
}