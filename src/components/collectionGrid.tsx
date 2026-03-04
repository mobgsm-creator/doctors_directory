"use client"
import InfiniteScroll from "react-infinite-scroll-component";
import  { PractitionerCard } from "@/components/practitioner-card"
import { useState } from "react";
import { Product, Practitioner, Clinic } from "@/lib/types";
import { isCity, isTreatment } from "@/lib/utils";

interface PractitionerCardProps {
  items: (Practitioner | Clinic | Product | string)[];

}

export default function ItemsGrid({ items}:PractitionerCardProps) {

  
  const ITEMS_PER_PAGE = (isCity(items[0]) || isTreatment(items[0])) ? 18 : 12; 
  const[itemsList,setItemsList] = useState(items.slice(0,ITEMS_PER_PAGE))
  const [hasMore, setHasMore] = useState(
    items.length > ITEMS_PER_PAGE
  );
  const fetchMoreData = () => {
    setItemsList(prev => {
  const newLength = prev.length + ITEMS_PER_PAGE;
  if (newLength >= items.length) {
      setHasMore(false);
    }

  return items.slice(0, newLength);
});

  };

  return (
    <div
      id="scrollableDiv"
      className={`${items.length > 4 ? "h-[920px]" : "h-[540px]"} overflow-y-auto`}
    >
      <InfiniteScroll
        dataLength={itemsList.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p className="text-center py-4">Loading…</p>}
        scrollableTarget="scrollableDiv" 
      >
   
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
          {itemsList.map((clinic) => 

          (
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