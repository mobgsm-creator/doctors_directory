import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface Treatment {
  name: string;
  image: string;
  slug: string;
}

interface TreatmentGridProps {
  treatments: Treatment[];
  searchQuery?: string;
}

export function TreatmentGrid({ treatments, searchQuery }: TreatmentGridProps) {
  return (
    <div className="grid grow grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-fade-in">
      {treatments.length > 0 ? (
        treatments.map((treatment, index) => (
          <div key={treatment.name} style={{ animationDelay: `${index * 50}ms` }}>
            <Link
              href={`${treatment.slug}`}
              title={`Learn about ${treatment.name} treatments and find qualified specialists`}
            >
              <Card className="group flex flex-col gap-5 bg-transparent hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer md:border-0 hover:border-accent/50">
                <CardContent className="flex p-0 items-center justify-center pt-0">
                  <img
                    src={treatment.image}
                    alt={`${treatment.name} treatment procedure`}
                    width={240}
                    height={240}
                    className="flex items-center justify-center object-cover rounded-full w-60 h-60"
                  />
                </CardContent>

                <CardHeader>
                  <h2 className="flex justify-center font-semibold text-sm text-foreground group-hover:text-primary/70 transition-colors text-balance">
                    {treatment.name}
                  </h2>
                </CardHeader>
              </Card>
            </Link>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <div className="text-gray-500 text-lg mb-2">No treatments found</div>
          <div className="text-gray-400 text-sm">
            {searchQuery ? `No results for "${searchQuery}"` : "Try searching for different keywords like 'skin', 'laser', or 'injection'"}
          </div>
        </div>
      )}
    </div>
  );
}