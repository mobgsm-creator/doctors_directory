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
import  { PractitionerCard } from "@/components/practitioner-card"
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed_new_data.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const citySlug = params.cityslug;
  const cityClinics: Clinic[] = clinics.filter((p) => p.City === citySlug);

  if (!cityClinics) {
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
                  <BreadcrumbPage>{citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        
        </div>
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">Top Clinics in {citySlug}</h1>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {cityClinics.map((clinic, index) => (
            <PractitionerCard key={clinic.slug} practitioner={clinic} />
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
