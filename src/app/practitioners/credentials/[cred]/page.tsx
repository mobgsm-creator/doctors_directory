import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Clinic, Practitioner } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import clinicsJson from "@/../public/clinics_processed_new.json";
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
import { PractitionerCard } from "@/components/practitioner-card";
const clinicsData = clinicsJson as unknown as Clinic[];
const clinics = clinicsData
  const clinicIndex = new Map(
  clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
)
interface ProfilePageProps {
  params: {
    cred: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "derms_processed_new_5403.json");
   const fileContents = fs.readFileSync(filePath, "utf-8");
   const clinics: Practitioner[] = JSON.parse(fileContents);
     const practitioners = clinics
  .map(p => {
    const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0])
    
    if (!clinic) return null
    return {
      ...clinic,
      practitioner_name: p.practitioner_name,
      practitioner_title: p.practitioner_title,
      practitioner_qualifications: p.practitioner_qualifications,
      practitioner_awards: p.practitioner_awards,
    }
  
  })
  .filter((item) => item !==null).filter(Boolean)

  const { cred } = params;
  const credslug = decodeURIComponent(cred).toLowerCase().replace(/\s+/g, "");
  const filteredClinics = practitioners.filter((clinic) => {
    // Filter by city
    const qualifications = clinic.practitioner_qualifications
    const awards = clinic.practitioner_awards
    const qMatch = qualifications?.toLowerCase().replace(/\s+/g, "").includes(credslug)
    const aMatch = awards?.toLowerCase().replace(/\s+/g, "").includes(credslug)
   


    return qMatch || aMatch
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
                  <BreadcrumbLink href="/directory/practitioners">Practitioners</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory/practitioners/credentials">Credentials</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/directory/practitioners/credentials/${cred.replaceAll("%20", " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`}>{cred.replaceAll("%20", " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
\              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0"><h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">
            {cred.replaceAll("%20", " ").split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Recognized Providers
          </h1></div>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {filteredClinics.map((clinic, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <PractitionerCard key={clinic.practitioner_name!+clinic.practitioner_title} practitioner={clinic} />
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
