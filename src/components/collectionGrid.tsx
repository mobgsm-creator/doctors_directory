"use client"
import InfiniteScroll from "react-infinite-scroll-component";
import  { PractitionerCard } from "@/components/practitioner-card"
import { useState } from "react";
import { Product, Practitioner, Clinic } from "@/lib/types";

interface PractitionerCardProps {
  items: (Practitioner | Clinic | Product | string)[];

}

export default function ItemsGrid({ items}:PractitionerCardProps) {
  const ITEMS_PER_PAGE = 6;
  const [item, setItems] = useState(
    items.slice(0, ITEMS_PER_PAGE)
  );
  const [hasMore, setHasMore] = useState(
    items.length > ITEMS_PER_PAGE
  );

  const fetchMoreData = () => {
    const nextItems = items.slice(
      items.length,
      items.length + ITEMS_PER_PAGE
    );

    setItems((prev) => [...prev, ...nextItems]);

    if (items.length + nextItems.length >= items.length) {
      setHasMore(false);
    }
  };

  return (
    <div
      id="scrollableDiv"
      className="h-[920px] overflow-auto"
    >
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading…</p>}
        scrollableTarget="scrollableDiv" 
      >
   
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {item.map((clinic) => (
            <PractitionerCard
                key={typeof clinic === "string" ? clinic : ("practitioner_name" in clinic ? clinic.practitioner_name!+clinic.practitioner_title : clinic.slug)}
              practitioner={clinic}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}