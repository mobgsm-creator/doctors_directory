import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/Clinic/profile-header";
import { ReviewCard } from "@/components/review-card";
import { GoogleMapsEmbed } from "@/components/gmaps-embed";
import { boxplotDatas_clinic } from "@/lib/data";
import { BoxPlotDatum, ItemMeta } from "@/lib/types";
import { Stats } from "@/components/visx-donut";
import ClinicDetailsMarkdown from "@/components/Clinic/clinicDetailsMD";
import { Clinic } from "@/lib/types";
import fs from "fs";
import path from "path";
import ClinicTabs from "@/components/Clinic/clinicTabs";
const Section = ({ id, title, children }: any) => (
  <section id={id} className="mb-6">
    <h2 className="text-xl font-semibold text-foreground mb-4">{title}</h2>
    <div className="text-base leading-7">{children}</div>
  </section>
);

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
    citySlug: string;
    slug: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const { slug } = params;
  const clinic = clinics.find((p) => p.slug === slug);
  const hoursObj = clinic?.hours as unknown as Record<string, any>;
  const hours =
    hoursObj["Typical_hours_listed_in_directories"] ?? clinic?.hours;

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
      <div className="bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <ProfileHeader clinic={clinic} />

        <div className="px-4 md:px-0">
          <ClinicTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10">
            
            <div className="order-2 lg:order-1 col-span-1 lg:col-span-6">
              <ClinicDetailsMarkdown clinic={clinic} />
            </div>

            <div className="order-1 lg:order-2 col-span-1 lg:col-span-4">
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
                {/* HOURS */}
                {hours && typeof hours === "object" && (
                  <Section title="Hours" id="hours">
                    <div className="overflow-x-auto shadow-none">
                      <table className="w-full text-sm bg-white border-collapse">
                        <tbody>
                          {Object.entries(hours).map(([day, time]) => (
                            <tr key={day}>
                              <td className="border border-gray-200 px-4 py-2 font-medium text-foreground">
                                {day?.toString()}
                              </td>
                              <td className="border border-gray-200 px-4 py-2 ">
                                {time?.toString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Section>
                )}
                {/* PAYMENTS */}
                <Section title="Payment Options" id="payments">
                  {Array.isArray(clinic.Payments) ? (
                    <ul className="list-disc ml-6 space-y-1">
                      {clinic.Payments.map((p: any, idx: number) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  ) : clinic.Payments && typeof clinic.Payments === "object" ? (
                    <div className="overflow-x-auto shadow-none">
                      <table className="w-full text-sm bg-white">
                        <tbody>
                          {Object.entries(clinic.Payments).map(
                            ([k, v]) =>
                              k !== "Source" && (
                                <tr key={k}>
                                  <td className="border px-4 py-2 font-medium">
                                    {k?.toString()}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {v?.toString()}
                                  </td>
                                </tr>
                              )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    clinic.Payments || "Not listed"
                  )}
                </Section>
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
            <GoogleMapsEmbed
              url={clinic.url!}
              className="w-full h-full md:h-80"
            />
          </div>
          
        </div>
      </div>
    </main>
  );
}

// export async function generateStaticParams() {

//   const filePath = path.join(process.cwd(), 'public', 'clinics_processed.json');
//   const fileContents = fs.readFileSync(filePath, 'utf-8');
//   const clinics: Clinic[] = JSON.parse(fileContents);
//   return clinics.map((clinic) => ({
//     cityslug: clinic.City,   // <-- MUST include this!
//     slug: clinic.slug,
//   }));
// }

export async function generateMetadata({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const clinic = clinics.find((p) => p.slug === params.slug);

  if (!clinic) {
    return {
      title: "Practitioner Not Found",
    };
  }

  const clinicName = clinic.slug;

  return {
    title: `${clinicName} - Healthcare Directory`,
    description: `View the profile of ${clinicName}, a qualified ${clinic.category} offering professional healthcare services. Read reviews and book appointments.`,
  };
}
