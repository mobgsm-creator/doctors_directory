import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileHeader } from "@/components/Clinic/profile-header"
import { ReviewCard } from "@/components/review-card"
import { GoogleMapsEmbed } from "@/components/gmaps-embed"
import { boxplotDatas_clinic } from "@/lib/data"
import { BoxPlotDatum, ItemMeta } from "@/lib/types"
import VisxDonutChart from "@/components/visx-donut"
import { ServicesSection } from "@/components/Clinic/services-section"
import ClinicDetailsMarkdown from "@/components/Clinic/clinicDetailsMD"
import { Clinic } from "@/lib/types"


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

interface ProfilePageProps {
  params: {
    citySlug: string
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const response = await fetch("http://128.199.165.212:8765/api/getData", {
    next: { revalidate: 3600 * 24 * 365 } // Cache for 1 hour
  });
  const {clinics, }: {clinics:Clinic[]} = await response.json();

  const { slug } = params;
  const clinic = clinics.find(p => p.slug === slug);

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
       
        <VisxDonutChart data={boxplotData} />


      
      <ClinicDetailsMarkdown clinic={clinic} />
    
        
        
      <ServicesSection clinic={clinic} />
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
  const response = await fetch("http://128.199.165.212:8765/api/getData", {
    next: { revalidate: 3600 * 24 * 365 } // Cache for 1 hour
  });
  const {clinics, }: {clinics:Clinic[]} = await response.json();
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