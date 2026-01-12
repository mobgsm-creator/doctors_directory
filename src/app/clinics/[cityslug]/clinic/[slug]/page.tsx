import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star, ArrowLeft, MessageSquare, MapPin, ThumbsUp, DollarSign, Users } from "lucide-react";
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
import { TreatmentMap } from "@/app/treatments/page"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
const Section = ({ id, title, children }: any) => (
  <section id={id} className="mt-4 mb-4">
    <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
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
    cityslug: string;
    slug: string;
  };
}
const flattenObject = (obj: any, parentKey = "", result: any = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const { cityslug,slug } = params;
  const cityClinics: Clinic[] = clinics.filter((p) => p.City === cityslug);
  const uniqueTreatments = [
  ...new Set(
    cityClinics
      .filter(c => Array.isArray(c.Treatments))
      .flatMap(c => c.Treatments)
  )
];

  const clinic = clinics.find((p) => p.slug === slug);
  const hoursObj = clinic?.hours as unknown as Record<string, any>;
  const hours =
    hoursObj["Typical_hours_listed_in_directories"] ?? clinic?.hours;
  const flatHours = flattenObject(hours);
  const getEnhancedTreatment = (treatment: any) => {
    const mockData: Record<string, { satisfaction: number; averageCost: string; practitionerCount: number }> = {
      "Acne": { satisfaction: 82, averageCost: "$200-$800+", practitionerCount: 101 },
      "Botox": { satisfaction: 89, averageCost: "$150-$350", practitionerCount: 245 },
      "Fillers": { satisfaction: 85, averageCost: "$300-$600", practitionerCount: 178 }
    };
    
    const enhancement = mockData[treatment.name] || { 
      satisfaction: Math.floor(Math.random() * 20) + 75, 
      averageCost: `$${Math.floor(Math.random() * 500) + 200}-$${Math.floor(Math.random() * 500) + 600}+`,
      practitionerCount: Math.floor(Math.random() * 100) + 50 
    };
    
    return { ...treatment, ...enhancement };
  };


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
          <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/clinics">Clinics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/clinics/${cityslug}`}>{`${cityslug}`}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{`${clinic.slug}`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>
        
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <ProfileHeader clinic={clinic} />

        <div className="px-4 md:px-0">
          <ClinicTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
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
                              ? "fill-black text-black"
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
              {/* HOURS */}
              {flatHours && (
                <Section title="Hours" id="hours">
                  <div className="overflow-x-auto shadow-none">
                    <table className="w-full align-top text-sm bg-white border-collapse">
                      <tbody>
                        {Object.entries(flatHours).map(([day, time]) => (
                          <tr key={day}>
                            <td className="align-top border-0 px-1 py-1 font-medium">
                              {day?.toString()}
                            </td>
                            <td className="align-top border-0 px-1 py-1">
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
                                <td className="border-0 px-4 py-2 font-medium">
                                  {k?.toString()}
                                </td>
                                <td className="border-0 px-4 py-2">
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
          <h2 className='text-xl font-semibold text-foreground mb-2'>Patient Stories</h2>
          <div className= 'flex flex-row items-center mb-6 gap-3'>
          <div className='flex flex-col sm:flex-row gap-2'>
            
          {clinic.gmapsReviews &&
           <div className="grid gap-6 h-113 overflow-auto">



                {clinic.gmapsReviews.map((review, index) => (


                  <ReviewCard key={index} review={review} />


                ))}


              </div> }
              <GoogleMapsEmbed
          url={clinic.url!}
          
          className="w-full h-80"
        /></div>
        
      </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Clinics in ${cityslug}`}</h3>
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
                            {modality.replaceAll('"', "").charAt(0).toUpperCase() + modality.slice(1)}
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
        <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Specialities in ${cityslug}`}</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {uniqueTreatments.map((treatment, index) => {
            const enhancedTreatment = getEnhancedTreatment(treatment);
            const treatmentValue = treatment?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").replace("Hifu", "HIFU").replace("Coolsculpting", "CoolSculpting");
            return (
            <div>

                <Link
                  href={`/treatments/${treatmentValue}`}
                  title={`Learn about ${treatmentValue} treatments and find qualified specialists`}
                >
                  <Card className="group bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#BDBDBD] md:border-0 rounded-lg sm:bg-transparent sm:border-0 sm:hover:border-accent/50 sm:flex sm:flex-col sm:gap-5">
                    <CardContent className="p-4 sm:p-0 sm:flex sm:items-center sm:justify-center sm:pt-0">
                      <div className="flex items-center gap-4 sm:flex-col sm:gap-5">
                        <div className="flex-shrink-0">
                          <img
                            src={TreatmentMap[treatmentValue!]}
                            alt={`${treatmentValue} treatment procedure`}
                            width={60}
                            height={60}
                            className="object-cover rounded-full w-30 h-30 sm:w-60 sm:h-60"
                          />
                        </div>
                        <div className="flex-1 min-w-0 sm:text-center">
                          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary/70 transition-colors mb-3 sm:mb-0 sm:text-sm">
                            {treatmentValue}
                          </h3>

                          <div className="space-y-2 sm:hidden">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <ThumbsUp className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.satisfaction}%
                              </span>
                              <span>Satisfaction</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.averageCost}
                              </span>
                              <span>Average Cost</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="h-4 w-4 text-black" />
                              <span className="font-medium">
                                {enhancedTreatment.practitionerCount}
                              </span>
                              <span>Practitioners</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

            </div>
          )})}
        </div>
              
      </div>
    </main>
  );
}

// export async function generateStaticParams() {

//   const filePath = path.join(process.cwd(), 'public', '  ');
//   const fileContents = fs.readFileSync(filePath, 'utf-8');
//   const clinics: Clinic[] = JSON.parse(fileContents);
//   return clinics.map((clinic) => ({
//     cityslug: clinic.City,   // <-- MUST include this!
//     slug: clinic.slug,
//   }));
// }

export async function generateMetadata({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "clinics_processed_new.json");
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
