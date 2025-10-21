import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/Clinic/profile-header"
import { ReviewCard } from "@/components/review-card"
import { GoogleMapsEmbed } from "@/components/gmaps-embed"
import type { Clinic } from "@/lib/types"
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
import { boxplotDatas_clinic } from "@/lib/data"
import { BoxPlotDatum, ItemMeta } from "@/lib/types"
import PerformanceSummary from "@/components/performace-summary"
import VisxDonutChart from "@/components/visx-donut"
import { ServicesSection } from "@/components/Clinic/services-section"
import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(), 'public', 'clinics.json');
const fileContents = fs.readFileSync(filePath, 'utf-8');
let cachedClinics : Clinic[] = [];
function mergeBoxplotDataFromDict(
  base: BoxPlotDatum[],
  incoming: Record<string, ItemMeta>
): BoxPlotDatum[] {
  return base.map(datum => {
    const match = incoming[datum.label]
    const result = { ...datum, item: { ...datum.item, ...match } }
    return result
  })
}
async function getClinics(): Promise<Clinic[]> {
  if (cachedClinics.length > 0) {
    return cachedClinics;
  }

  const data = JSON.parse(fileContents);

  
  
  
  cachedClinics = data.map(transformClinic);
  
  return cachedClinics;
}

function safeParse(str: string) {
  try {
    
    
    return JSON.parse(str);
  } catch (e) {
    //console.error("Parsing failed:", e, "Input String: ",str);  
    return null;
  }
}
function transformClinic(raw: any): Clinic {
 
  return {
    slug: raw.slug.toLowerCase()
    .replace(/&|\+/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[()]/g, ''),
    image: raw.image,
    url: raw.links,
    rating: parseFloat(raw.rating),
    reviewCount: parseInt(raw.review_count),
    category: raw.category,
    gmapsAddress: parse_addresses(raw.gmaps_address),
    //gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: safeParse(raw.gmaps_reviews),
    reviewAnalysis: safeParse(raw["Review Analysis"]),
    weighted_analysis: safeParse(raw["weighted_analysis"]),
    City: raw.City,
  };
}
interface ProfilePageProps {
  params: {
    citySlug: string
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { slug } = params;
  //console.log(slug)
  
  const clinics = await getClinics();

 
  const clinic = clinics.find(p => p.slug=== slug);
  const boxplotData = mergeBoxplotDataFromDict(
    boxplotDatas_clinic,
    clinic?.weighted_analysis ?? {}
  )
  
  
  

  if (!clinic) {
    notFound()
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
        <VisxDonutChart data={boxplotData} height={200} />
      <PerformanceSummary data={boxplotData} />
        
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
      <ServicesSection clinic={clinic} />
      </div>

      
      
    </main>
  )
}

// export async function generateStaticParams() {
//   const practitioners = await getPractitioners();
//   return practitioners.map((practitioner) => ({
//     slug: practitioner.slug,
//   }))
// }


export async function generateMetadata({ params }: ProfilePageProps) {
  const clinics = await getClinics();
  const clinic = clinics.find((p) => p.slug === params.slug)

  if (!clinic) {
    return {
      title: "Practitioner Not Found",
    }
  }

  const clinicName = clinic.slug

  return {
    title: `${clinicName} - Healthcare Directory`,
    description: `View the profile of ${clinicName}, a qualified ${clinic.category} offering professional healthcare services. Read reviews and book appointments.`,
  }
}