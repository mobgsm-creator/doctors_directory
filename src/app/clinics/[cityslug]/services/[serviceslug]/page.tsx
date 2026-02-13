import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Clinic } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import fs from "fs";
import path from "path";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
interface ProfilePageProps {
  params: {
    cityslug: string;
    serviceslug: string;
  };
}
import { PractitionerCard } from "@/components/practitioner-card";

export default function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const { cityslug, serviceslug } = params;
  const decodedCitySlug = decodeURIComponent(cityslug)
  .toLowerCase()
  .replace(/\s+/g, "");
  const decodedServiceSlug = decodeURIComponent(serviceslug)
  .toLowerCase()
  .replace(/\s+/g, "");
  const filteredClinics = clinics.filter((clinic) => {
    // Filter by city
    
    const cityMatch = clinic.City?.toLowerCase() === decodedCitySlug.toLowerCase();
    // Filter by offered service category
    const categories =
      clinic.Treatments ?? [];
    
  


    

const serviceMatch = categories.some((cat: string) =>
  cat.toLowerCase().replace(/\s+/g, "") === decodedServiceSlug
);



    return cityMatch && serviceMatch
  });

  if (!filteredClinics) {
    notFound();
  }

  return (
    <main className="bg-(--primary-bg-color)">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12">
      <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0 md:pt-0 md:border-0 border-b border-[#C4C4C4]">
        <div className="sticky top-0 z-10">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" size="sm" className="gap-2 hover:cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory/clinics">All Clinics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                 <BreadcrumbItem>
                  <BreadcrumbLink href={`/directory/clinics/${cityslug}`}>{cityslug.charAt(0).toUpperCase() + cityslug.slice(1)}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{serviceslug.charAt(0).toUpperCase() + serviceslug.replace("%20", " ").slice(1)}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        
        </div>
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">
            Top {serviceslug.replace("%20", " ")} Providers in {cityslug}
          </h1></div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {filteredClinics.slice(0,3).map((clinic, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <PractitionerCard key={clinic.slug} practitioner={clinic} />
            </div>
                                      // <PractitionerCard key={clinic.slug} practitioner={clinic} />
                                 
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
