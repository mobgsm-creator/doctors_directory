import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/Practitioner/profile-header"
import { ServicesSection } from "@/components/Practitioner/services-section"
import type { Practitioner } from "@/lib/types"
import VisxBoxPlot from "@/components/boxplot-graph"
import { boxplotDatas } from "@/lib/data"
import { BoxPlotDatum, ItemMeta } from "@/lib/types"
import { ReviewCard } from "@/components/review-card"
import fs from 'fs';
import path from 'path';
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
const filePath = path.join(process.cwd(), 'public', 'derms.json');
const fileContents = fs.readFileSync(filePath, 'utf-8');
let cachedPractitioners: Practitioner[] = [];
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

async function getPractitioners(): Promise<Practitioner[]> {
  if (cachedPractitioners.length > 0) {
    return cachedPractitioners;
  }

  const data = JSON.parse(fileContents);

  
  
  
  cachedPractitioners = data.map(transformPractitioner);
  return cachedPractitioners;
}

function safeParse(str: string) {
  try {
    
    
    return JSON.parse(str);
  } catch (e) {
    console.error("Parsing failed:", e, "Input String: ",str);
    return null;
  }
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
const meanFill = "var(--color-chart-4)"
const categoryColorFor = (label: string) => categoryColorByLabel[label] ?? "#888888"
function transformPractitioner(raw: any): Practitioner {
 
  return {
    //id: raw["ID"].toString(),
    Name: raw.Name,
    slug: raw.Name.toLowerCase().replace(/\s+/g, "-"),
    image: raw.Image === 'https://www.jccp.org.uk/content/images/no-image.jpg' ? raw.image : raw.Image,
    profession: parse_text(raw["PROFESSION:"]).trim(),
    //regulatoryBody: parse_text(raw["REGULATORY BODY:"]),
    // registrationPin: raw["REGISTRATION PIN NUMBER:"],
    qualification: raw["QUALIFICATION: (To Date)"].trim(),
    modality: consolidate(raw["SPECIALTIES"]),
    // memberSince: raw["MEMBER SINCE:"],
    // otherMemberships: raw["OTHER MEMBERSHIPS:"],
    // restrictions: raw["RESTRICTIONS:"],
     url: raw.url,
     rating: parse_numbers(raw.rating),
     reviewCount: parse_numbers(raw.review_count),
     category: raw.category,
     gmapsAddress: parse_addresses(raw.gmaps_address),
    // gmapsLink: raw.gmaps_link,
    // gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: JSON.parse(raw.gmaps_reviews),
    reviewAnalysis: safeParse(raw["Review Analysis"]),
    weighted_analysis: safeParse(raw["weighted_analysis"]),
  };
}
interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  
  const practitioners = await getPractitioners();
  
  const practitioner = practitioners.find(p => p.slug === params.slug);
  console.log(practitioner?.gmapsReviews)
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
        {practitioner.gmapsReviews &&
         <div className="grid gap-6">



                {practitioner.gmapsReviews.map((review, index) => (


                  <ReviewCard key={index} review={review} />


                ))}


              </div> }
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
  const practitioners = await getPractitioners();
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