import { notFound } from "next/navigation";
import Link from "next/link";
import { getAccreditationImages } from "@/lib/utils";
import type { Clinic, Practitioner,Accreditation } from "@/lib/types";;
import {edu, accreditations} from "@/lib/data";
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import clinicsJson from "@/../public/clinics_processed_new_data.json";
import accreditationsJson from "@/../public/accreditations_processed_new.json";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import fs from "fs";
import path from "path";
import { PractitionerCard } from "@/components/practitioner-card";


const clinicsData = clinicsJson as unknown as Clinic[];
const clinics = clinicsData
  const clinicIndex = new Map(
  clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
)

export default async function ProfilePage() {
    const recognitionsWithImages = getAccreditationImages(accreditationsJson as unknown as Accreditation[])
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
  return (
    <main className="bg-(--primary-bg-color)">
      <div className="mx-auto max-w-6xl md:px-4 py-4 md:py-12">
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0 md:pt-0 md:border-0 border-b border-[#C4C4C4]">
          <div className="sticky top-0 z-10">
            <Link href="/" prefetch={false}>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 hover:cursor-pointer hover:bg-white hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/practitioners">
                    Practitioners
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/credentials">
                    Credentialed Providers
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">
            Credentialed Practitioners
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Browse Recognized Practitioners by Credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-0">
          {recognitionsWithImages.map((credential) => {
            return (
              <PractitionerCard
                key={credential.slug}
                practitioner={credential}
              />
            );
          })}
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
