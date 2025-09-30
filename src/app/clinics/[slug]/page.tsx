import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/Clinic/profile-header"
import { ServicesSection } from "@/components/Clinic/services-section"
import { PractitionerInsights } from "@/components/Clinic/practitioner-insights"
import { ReviewCard } from "@/components/review-card"
import type { Clinic } from "@/lib/types"
import fs from 'fs';
import path from 'path';
const filePath = path.join(process.cwd(), 'public', 'clinics.json');
const fileContents = fs.readFileSync(filePath, 'utf-8');
let cachedClinics : Clinic[] = [];

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
    console.error("Parsing failed:", e);
    return null;
  }
}
function transformClinic(raw: any): Clinic {
 
  return {
    slug: raw.Name.toLowerCase().replace(/\s+/g, "-"),
    image: raw.Image,
    url: raw.url,
    rating: parseFloat(raw.rating),
    reviewCount: parseInt(raw.review_count),
    category: raw.category,
    gmapsAddress: raw.gmaps_address.replace(/\n/g, "").trim(),
    gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: JSON.parse(raw.gmaps_reviews),
    reviewAnalysis: safeParse(raw["Review Analysis"]),
  };
}
interface ProfilePageProps {
  params: {
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  
  
  const clinics = await getClinics();
  
  const clinic = clinics.find(p => p.slug=== params.slug);
  
  

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

        {/* Tabs for Services, Insights, Reviews */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services & Treatments</TabsTrigger>
            <TabsTrigger value="insights">Professional Insights</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews ({clinic.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-8">
            <ServicesSection clinic={clinic} />
          </TabsContent>

          <TabsContent value="insights" className="mt-8">
            <PractitionerInsights clinic={clinic} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Patient Reviews ({clinic.reviewCount})</h2>
              </div>

              <div className="grid gap-6">
                {clinic.gmapsReviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </div>

              {clinic.gmapsReviews.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">Be the first to leave a review for this practitioner.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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