import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/Practitioner/profile-header";
import { ReviewCard } from "@/components/review-card";
import { GoogleMapsEmbed } from "@/components/gmaps-embed";
import { boxplotDatas_clinic } from "@/lib/data";
import { BoxPlotDatum, ItemMeta } from "@/lib/types";
import { Stats } from "@/components/visx-donut";
import ClinicDetailsMarkdown from "@/components/Practitioner/practitionerDetailsMD";
import { Clinic, Practitioner } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import fs from "fs";
import path from "path";
import PractitionerTabs from "@/components/Practitioner/PractitionerTabs";

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

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "derms_processed.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Practitioner[] = JSON.parse(fileContents);
  const { slug } = params;
  const clinic = clinics.find((p) => p.practitioner_name === slug);
  //console.log(clinic)

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
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <ProfileHeader clinic={clinic} />
        <PractitionerTabs />
        
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
                  <div className="col-span-1 lg:col-span-6">
                    <ClinicDetailsMarkdown clinic={clinic} />
        
         
                  </div>
                  <div className="col-span-1 lg:col-span-4">
            <div className="border border-gray-300 rounded-xl p-6">
              
              <div className="flex flex-row gap-2 pt-2 mb-4 items-center justify-center text-sm">
                <div className="inline-flex items-center gap-1">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < clinic.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className="border-l border-black pl-2 underline"
                  aria-label={`${clinic.reviewCount} reviews`}
                >
                  {clinic.gmapsReviews
                    ? clinic.gmapsReviews.filter(
                        (review) => review.rating === "5 stars"
                      ).length
                    : 0}
                  {"+ "} 5 Star Reviews
                </span>
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <Stats data={boxplotData} />
            
            </div>
          </div>
        </div>

       <div className="flex flex-col md:flex-row gap-6">
          {clinic.gmapsReviews && (
            <div className="grid gap-6 h-full md:h-113 overflow-auto">
              {clinic.gmapsReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </div>
          )}
          <GoogleMapsEmbed url={clinic.url!} className="w-full h-full md:h-80" />
        </div>
      </div>
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
  const filePath = path.join(process.cwd(), "public", "derms_processed.json");
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
