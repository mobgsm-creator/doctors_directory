"use client"
import  { PractitionerCard } from "@/components/practitioner-card"
import { useCallback, useEffect, useRef, useState } from "react";
import { Product, Practitioner, Clinic } from "@/lib/types";
import { isCity, isTreatment } from "@/lib/utils";

interface PractitionerCardProps {
  items: (Practitioner | Clinic | Product | string)[];
  customLink?:string
}

export default function ItemsGrid({ items, customLink}: PractitionerCardProps) {

  const ITEMS_PER_PAGE = (isCity(items[0]) || isTreatment(items[0])) ? 24 : 12; 
  const [itemsList, setItemsList] = useState(items.slice(0, ITEMS_PER_PAGE))
  const [hasMore, setHasMore] = useState(
    items.length > ITEMS_PER_PAGE
  );
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setItemsList(items.slice(0, ITEMS_PER_PAGE));
    setHasMore(items.length > ITEMS_PER_PAGE);
  }, [items, ITEMS_PER_PAGE]);

  const fetchMoreData = useCallback(() => {
    setItemsList((prev) => {
      if (prev.length >= items.length) {
        setHasMore(false);
        return prev;
      }

      const newLength = prev.length + ITEMS_PER_PAGE;
      if (newLength >= items.length) {
        setHasMore(false);
      }

      return items.slice(0, newLength);
    });
  }, [items, ITEMS_PER_PAGE]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMoreData();
        }
      },
      {
        root: null,
        rootMargin: "200px 0px",
        threshold: 0,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchMoreData, hasMore, itemsList.length]);

  return (
    <div className="w-full">
      <div className="md:bg--(--primary-bg-color) grid md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {itemsList.map((clinic) => (
          <PractitionerCard
            key={typeof clinic === "string" ? clinic : ("practitioner_name" in clinic ? clinic.practitioner_name! + clinic.practitioner_title : clinic.slug)}
            practitioner={clinic}
            customLink={customLink}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="py-4 text-center">
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}