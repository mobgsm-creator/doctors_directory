import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileHeader } from "@/components/Practitioner/profile-header"
import { ServicesSection } from "@/components/Practitioner/services-section"
import { boxplotDatas } from "@/lib/data"
import { BoxPlotDatum, ItemMeta } from "@/lib/types"
import VisxDonutChart from "@/components/visx-donut"
import { ReviewCard } from "@/components/review-card"
import { GoogleMapsEmbed } from "@/components/gmaps-embed"
import PerformanceSummary from "@/components/performace-summary"
import { getPractitioners, } from "@/lib/cachedData"


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

const qColors = {
  q1: "#1a1a1a", // Min → Q1
  q2: "#4a4a4a", // Q1 → Median
  q3: "#7a7a7a", // Median → Q3
  q4: "#b0b0b0", // Q3 → Max
}

const categoryColorByLabel: Record<string, string> = {
  "Clinical Expertise": "#E63946",
  "Communication": "#F77F00",
  "Treatment Results": "#FCBF49",
  "Bedside Manner": "#06A77D",
  "Trust & Safety": "#118AB2",
  "Environment": "#073B4C",
  "Personalization": "#9B59B6",
  "Post-Care": "#E91E63",
  "Professionalism": "#2E7D32",
  "Staff Support": "#00BCD4",
  "Value & Transparency": "#FF6F00",
  "Pain Management & Comfort": "#8B4789",
  "Anxiety & Nervousness Management": "#7CB342",
  "Booking & Accessibility": "#FFB300",
  "Honesty & Realistic Expectations": "#5C6BC0",
  "Long-term Relationship & Loyalty": "#D32F2F",
}

interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const practitioners = await getPractitioners()
  const width = typeof window !== "undefined" ? window.innerWidth : 0;
  const isMobile = width >= 640 ? false : true;
  
  const practitioner = practitioners.find(p => p.slug === params.slug);
  const boxplotData = mergeBoxplotDataFromDict(
    boxplotDatas,
    practitioner?.weighted_analysis ?? {}
  )
  
  
  

  if (!practitioner) {
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

      <div className="container mx-auto max-w-6xl px-4 space-y-8">
        {/* Profile Header */}
        <ProfileHeader practitioner={practitioner} />
        <div className="flex flex-col">
        <VisxDonutChart data={boxplotData}  />
        
        <PerformanceSummary data={boxplotData} /></div> 
        <ServicesSection practitioner={practitioner} />
        <div className='flex flex-col sm:flex-row gap-2'>
          {practitioner.gmapsReviews &&
           <div className="grid gap-6 h-113 overflow-auto">



                {practitioner.gmapsReviews.map((review, index) => (


                  <ReviewCard key={index} review={review} />


                ))}


              </div> }
              <GoogleMapsEmbed
          url={practitioner.url!}
          
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
  const practitioners = await getPractitioners()

  const practitioner = practitioners.find((p) => p.slug === params.slug)

  if (!practitioner) {
    return {
      title: "Practitioner Not Found",
    }
  }

  const practitionerName = practitioner.Name || practitioner.reviewAnalysis?.practitioners[0]?.name || "Practitioner"

  return {
    title: `${practitionerName} - Healthcare Directory`,
    description: `View the profile of ${practitionerName}, a qualified ${practitioner.profession} offering professional healthcare services. Read reviews and book appointments.`,
  }
}