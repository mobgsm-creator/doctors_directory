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
import { TreatmentMap } from "@/lib/data";

interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const citySlug = params.cityslug;
  const cityClinics: Clinic[] = clinics.filter((p) => p.City === citySlug);

  if (!cityClinics) {
    notFound();
  }

  return (
    <main className="bg-[var(--primary-bg-color)]">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-7 md:py-12 bg-white md:bg-[var(--primary-bg-color)]">
      <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0 md:pt-0 md:border-0 border-b border-[#C4C4C4]">
        <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">Top Clinics in {citySlug}</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {cityClinics.map((clinic, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <Card className="gap-0 relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
                <CardHeader className="pb-4 px-2">
                  <div className="flex items-start gap-4">
                    <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                      <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                        <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 md:mb-3 mr-0">
                          <img
                            src={
                              clinic.image.split("?w")[0] || "/placeholder.svg"
                            }
                            alt="Profile photo"
                            width={240}
                            height={240}
                            className="object-cover rounded-full w-60 h-60"
                          />
                        </div>
                        <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full">
                        <h3 className="mb-2 md:mb-4 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-md md:text-lg transition-colors text-balance">
                            {clinic.slug
                              .split("-")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </h3>

                          <div className="flex justify-center flex-wrap items-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs">
                              {clinic.category}
                            </span>
                          </div>

                          <p className="pt-2 mb-2 text-pretty">Specialties</p>
  
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 pt-3 items-center text-sm">
                            <div className="flex items-center gap-1">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < clinic.rating
                                        ? "fill-black text-black"
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
                <CardContent className="pt-0 px-0 md:px-4 space-y-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-pretty">{clinic.gmapsAddress}</span>
                  </div>

                  <Link
                    href={`/clinics/${clinic.City}/clinic/${clinic.slug}`}
                    className="mt-4 mb-0 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
                  >
                    Contact
                  </Link>

                  <div>
                    <div className="flex flex-wrap gap-1 pt-4">
                     {clinic.Treatments?.slice(0, 3).map((modality, index) => (
                        
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
                          {clinic.reviewAnalysis?.procedures_offered.categories
                            .length! - 3}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                  </div>
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
