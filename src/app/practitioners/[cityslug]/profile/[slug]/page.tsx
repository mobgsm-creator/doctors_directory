import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/Practitioner/profile-header";
import { GoogleMapsEmbed } from "@/components/gmaps-embed";
import { boxplotDatas_clinic } from "@/lib/data";
import { BoxPlotDatum, ItemMeta } from "@/lib/types";
import { Stats } from "@/components/visx-donut";
import ClinicDetailsMarkdown from "@/components/Practitioner/practitionerDetailsMD";
import { Practitioner } from "@/lib/types";
import fs from "fs";
import path from "path";
import PractitionerTabs from "@/components/Practitioner/PractitionerTabs";
import { flattenObject } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import clinicsJson from "@/../public/clinics_processed_new.json";
import { Clinic } from "@/lib/types";
import ClinicTabsHeader from "@/components/Practitioner/clinicTabsHeader";
import { PractitionerPageClient } from "@/components/Practitioner/practitionerPageClient";
const clinicsData = clinicsJson as unknown as Clinic[];
const clinics = clinicsData
  const clinicIndex = new Map(
  clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
)

function mergeBoxplotDataFromDict(
  base: BoxPlotDatum[],
  incoming: Record<string, ItemMeta>
): BoxPlotDatum[] {
  return base.map((datum) => {
    const match = incoming[datum.label];
    const result = { ...datum, item: { ...datum.item, ...match } };
    return result;
  });
}

interface ProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
  const filePath = path.join(process.cwd(), "public", "derms_processed_new_5403.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Practitioner[] = JSON.parse(fileContents);
  const { slug } = params;
  const clinic = clinics.find((p) => p.practitioner_name === slug);
  const k = clinicIndex.get(JSON.parse(clinic!.Associated_Clinics!)[0])
  const hoursObj = k?.hours as unknown as Record<string, any>;
  const hours =
    hoursObj["Typical_hours_listed_in_directories"] ?? k?.hours;
  const flatHours = typeof hoursObj === 'object' ? flattenObject(hours) : hours
  const practitioner = {...k,...clinic}
  
  

  const boxplotData = mergeBoxplotDataFromDict(
    boxplotDatas_clinic,
    clinic?.weighted_analysis ?? {}
  );

  if (!clinic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/" prefetch={false}>
            <Button variant="ghost" size="sm" className="gap-2 hover:cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>
      
       <PractitionerPageClient clinic={clinic} associatedClinics={JSON.parse(clinic!.Associated_Clinics!)} clinicIndex={clinicIndex} boxplotData={boxplotData} />

     
    </main>
  );
}

// export async function generateStaticParams() {

//   const filePath = path.join(process.cwd(), 'public', 'derms_processed.json');
//   const fileContents = fs.readFileSync(filePath, 'utf-8');
//   const clinics: Practitioner[] = JSON.parse(fileContents);
//   return clinics.map((clinic) => ({
//     slug: clinic.practitioner_name,
//   }));
// }

export async function generateMetadata({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "derms_processed_new_5403.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Practitioner[] = JSON.parse(fileContents);
  const clinic = clinics.find((p) => p.practitioner_name === params.slug);

  if (!clinic) {
    return {
      title: "Practitioner Not Found",
    };
  }

  const clinicName = clinic.practitioner_name;

  return {
    title: `${clinicName} - Healthcare Directory`,
    description: `View the profile of ${clinicName}, a qualified ${clinic.practitioner_title} offering professional healthcare services. Read reviews and book appointments.`,
  };
}
