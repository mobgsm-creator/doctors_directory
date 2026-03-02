"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MoreItemsScroller({
  children,
  scrollAmount = 300,
}: {
  children: React.ReactNode;
  scrollAmount?: number;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const update = () => {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    };

    update();
    container.addEventListener("scroll", update);
    return () => container.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="relative">
        <div className='w-[80%] mx-auto'>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar scroll-smooth"
      >
        {children}
      </div></div>

      {canScrollLeft && (
        <Button onClick={scrollLeft} className="absolute left-0 top-1/2">
          <ChevronLeft />
        </Button>
      )}

      {canScrollRight && (
        <Button onClick={scrollRight} className="absolute right-0 top-1/2">
          <ChevronRight />
        </Button>
      )}
    </div>
  );
}