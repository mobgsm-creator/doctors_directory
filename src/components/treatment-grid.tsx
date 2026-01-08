import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, DollarSign, Users } from "lucide-react";
import { MobileFilters } from "./mobile-filters";

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
}

export function TreatmentGrid({ treatments, searchQuery, currentPage, totalPages, itemsPerPage }: TreatmentGridProps) {

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

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (page > 1) params.set('page', page.toString());
    const queryString = params.toString();
    return `/treatments${queryString ? `?${queryString}` : ''}`;
  };

  const getPageNumbers = () => {
    const delta = 2;
    const pages = [];
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      <MobileFilters />
      
      <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-10 animate-fade-in bg-white py-6 px-4 md:bg-transparent md:py-0 md:px-0 rounded-lg">
        {paginatedTreatments.length > 0 ? (
          paginatedTreatments.map((treatment, index) => {
            const enhancedTreatment = getEnhancedTreatment(treatment);
            return (
              <div
                key={treatment.name}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  href={`${treatment.slug}`}
                  title={`Learn about ${treatment.name} treatments and find qualified specialists`}
                >
                  <Card className="group bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#BDBDBD] md:border-0 rounded-lg sm:bg-transparent sm:border-0 sm:hover:border-accent/50 sm:flex sm:flex-col sm:gap-5">
                    <CardContent className="p-4 sm:p-0 sm:flex sm:items-center sm:justify-center sm:pt-0">
                      <div className="flex items-center gap-4 sm:flex-col sm:gap-5">
                        <div className="flex-shrink-0">
                          <img
                            src={treatment.image}
                            alt={`${treatment.name} treatment procedure`}
                            width={60}
                            height={60}
                            className="object-cover rounded-full w-30 h-30 sm:w-60 sm:h-60"
                          />
                        </div>
                        <div className="flex-1 min-w-0 sm:text-center">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary/70 transition-colors mb-3 sm:mb-0 sm:text-sm">
                            {treatment.name}
                          </h3>

                          <div className="space-y-2 sm:hidden">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ThumbsUp className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.satisfaction}%
                              </span>
                              <span>Satisfaction</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.averageCost}
                              </span>
                              <span>Average Cost</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.practitionerCount}
                              </span>
                              <span>Practitioners</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
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

            {currentPage > 3 && (
              <>
                <Button asChild variant="outline">
                  <Link href={getPageUrl(1)}>1</Link>
                </Button>
                {currentPage > 4 && <span className="px-2">...</span>}
              </>
            )}

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                asChild
                variant={page === currentPage ? "default" : "outline"}
              >
                <Link href={getPageUrl(page)}>{page}</Link>
              </Button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                {currentPage < totalPages - 3 && <span className="px-2">...</span>}
                <Button asChild variant="outline">
                  <Link href={getPageUrl(totalPages)}>{totalPages}</Link>
                </Button>
              </>
            )}

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