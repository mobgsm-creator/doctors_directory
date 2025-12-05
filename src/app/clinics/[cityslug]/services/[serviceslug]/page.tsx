import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Clinic, Practitioner } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin } from "lucide-react";
import fs from "fs";
import path from "path";

interface ProfilePageProps {
  params: {
    cityslug: string;
    serviceslug: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const { cityslug, serviceslug } = params;
  console.log(cityslug, serviceslug);
  const filteredClinics = clinics.filter((clinic) => {
    // Filter by city
    const cityMatch =
      clinic.City?.toLowerCase() === cityslug.toLowerCase();

    // Filter by offered service category
    const categories =
      clinic.reviewAnalysis?.procedures_offered?.categories ?? [];

    const serviceMatch = categories.some(
      (cat: string) => cat.toLowerCase() === serviceslug.toLowerCase()
    );

    return cityMatch && serviceMatch;
  });

  if (!filteredClinics) {
    notFound();
  }

  return (
    <main className="bg-[var(--primary-bg-color)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-10">Top {serviceslug} Providers in {cityslug}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {filteredClinics.map((clinic, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <Card className="h-full relative pb-[60px] shadow-none group transition-all duration-300 rounded-27 border border-[var(--alto)] cursor-pointer">
                <CardHeader className="pb-0 px-2">
                  <div className="flex items-start gap-4">
                    <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                      
                      <div className="w-[150px] h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 mb-3">
                          <img
                            src={clinic.image.split("?w")[0] || "/placeholder.svg"}
                            alt="Profile photo"
                            width={240}
                            height={240}
                            className="object-cover rounded-full w-60 h-60"
                          />
                        </div>

                        <h3 className="mb-4 flex align-items-center justify-center font-semibold text-lg transition-colors text-balance">
                          {clinic.slug
                            .split("-")
                            .map(
                              (word) => word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </h3>

                        <div className="flex justify-center flex-wrap items-center gap-2">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs">
                            {clinic.category}
                          </span>
                        </div>

                        <p className="pt-2 mb-2 text-pretty">
                          Specialties
                        </p>
                          
                        <div className="flex flex-row gap-2 pt-3 items-center text-sm">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < clinic.rating
                                       ? "fill-yellow-400 text-yellow-400"
                                        : "text-muted-foreground/30"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="border-l border-black pl-2 underline">
                            ({clinic.reviewCount} reviews)
                          </span>
                        </div>

                      </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                
                  <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-pretty">
                        {clinic.gmapsAddress}
                      </span>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1">
                        {clinic.reviewAnalysis?.procedures_offered.categories
                          .slice(0, 3)
                          .map((modality, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs text-wrap"
                            >
                              {modality.replaceAll('"', "")}
                            </Badge>
                          ))}
                        {clinic.reviewAnalysis?.procedures_offered.categories
                          .length! > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +
                            {clinic.reviewAnalysis?.procedures_offered
                              .categories.length! - 3}{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </div>
                  <Link 
                    href={`/clinics/${clinic.City}/${clinic.slug}`}
                    className="mt-6 absolute left-4 right-4 bottom-4 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
                  >
                    Contact
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   const practitioners = await getPractitioners();
//   return practitioners.map((practitioner) => ({
//     slug: practitioner.slug,
//   }))
// }

// export async function generateMetadata({ params }: ProfilePageProps) {
//   const clinics = await getClinics();
//   const clinic = clinics.find((p) => p.slug === params.slug)

//   if (!clinic) {
//     return {
//       title: "Practitioner Not Found",
//     }
//   }

//   const clinicName = clinic.slug

//   return {
//     title: `${clinicName} - Healthcare Directory`,
//     description: `View the profile of ${clinicName}, a qualified ${clinic.category} offering professional healthcare services. Read reviews and book appointments.`,
//   }
// }
