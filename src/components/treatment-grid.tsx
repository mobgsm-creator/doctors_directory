import Link from "next/link";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, DollarSign, Users } from "lucide-react";
import { PractitionerCard } from "./practitioner-card";
interface Treatment {
  name: string;
  image: string;
  slug: string;
  satisfaction?: number;
  averageCost?: string;
  practitionerCount?: number;
}

interface TreatmentGridProps {
  treatments: Treatment[];
  searchQuery?: string;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  getPageUrl: (page: number) => string;
}

export function TreatmentGrid({ treatments, searchQuery, currentPage, totalPages, itemsPerPage, getPageUrl }: Readonly<TreatmentGridProps>) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTreatments = treatments.slice(startIndex, endIndex);

  const getEnhancedTreatment = (treatment: Treatment): Treatment => {
    const mockData: Record<string, { satisfaction: number; averageCost: string; practitionerCount: number }> = {
      "Acne": { satisfaction: 82, averageCost: "$200-$800+", practitionerCount: 101 },
      "Botox": { satisfaction: 89, averageCost: "$150-$350", practitionerCount: 245 },
      "Fillers": { satisfaction: 85, averageCost: "$300-$600", practitionerCount: 178 }
    };
    
    const enhancement = mockData[treatment.name] || { 
      satisfaction: Math.floor(Math.random() * 20) + 75, 
      averageCost: `$${Math.floor(Math.random() * 500) + 200}-$${Math.floor(Math.random() * 500) + 600}+`,
      practitionerCount: Math.floor(Math.random() * 100) + 50 
    };
    
    return { ...treatment, ...enhancement };
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 animate-fade-in bg-white py-6 px-4 md:bg-transparent md:py-0 md:px-0 rounded-lg">
        {paginatedTreatments.length > 0 ? (
          paginatedTreatments.map((treatment, index) => {
            const enhancedTreatment = getEnhancedTreatment(treatment);
            return (
              <PractitionerCard key={treatment.name} practitioner={treatment} />
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <div className="text-gray-500 text-lg mb-2">No treatments found</div>
            <div className="text-gray-400 text-sm">
              {searchQuery ? `No results for "${searchQuery}"` : "Try searching for different keywords like 'skin', 'laser', or 'injection'"}
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Button asChild variant="outline">
                <Link href={getPageUrl(currentPage - 1)}>
                  Previous
                </Link>
              </Button>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else {
                const start = Math.max(1, currentPage - 2);
                const end = Math.min(totalPages, start + 4);
                const adjustedStart = Math.max(1, end - 4);
                pageNumber = adjustedStart + i;
                if (pageNumber > totalPages) return null;
              }
              
              return (
                <Button
                  key={pageNumber}
                  asChild
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                >
                  <Link href={getPageUrl(pageNumber)}>
                    {pageNumber}
                  </Link>
                </Button>
              );
            })}

            {currentPage < totalPages && (
              <Button asChild variant="outline">
                <Link href={getPageUrl(currentPage + 1)}>
                  Next
                </Link>
              </Button>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, treatments.length)} of {treatments.length} treatments
          </div>
        </div>
      )}
    </div>
  );
}