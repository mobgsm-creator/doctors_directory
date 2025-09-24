import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileHeader } from "@/components/profile-header"
import { ServicesSection } from "@/components/services-section"
import { PractitionerInsights } from "@/components/practitioner-insights"
import { ReviewCard } from "@/components/review-card"
import type { Practitioner } from "@/lib/types"
let cachedPractitioners: Practitioner[] | null = null;

async function getPractitioners(): Promise<Practitioner[]> {
  if (cachedPractitioners) return cachedPractitioners;

  const res = await fetch('http://localhost:3000/api/getData', { cache: 'no-store' });
  const data: any[] = await res.json();
  cachedPractitioners = data.map(transformPractitioner);
  return cachedPractitioners;
}

function safeParse(str: string) {
  try {
    
    
    return JSON.parse(str);
  } catch (e) {
    console.error("Parsing failed:", e);
    return null;
  }
}
function transformPractitioner(raw: any): Practitioner {
 
  return {
    id: raw["Unnamed: 0"].toString(),
    slug: raw.Name.toLowerCase().replace(/\s+/g, "-"),
    image: raw.Image,
    profession: raw["PROFESSION:"].trim(),
    regulatoryBody: raw["REGULATORY BODY:"],
    registrationPin: raw["REGISTRATION PIN NUMBER:"],
    qualification: raw["QUALIFICATION:\n(To Date)"].trim(),
    modality: JSON.parse(raw["MODALITY:"]),
    memberSince: raw["MEMBER SINCE:"],
    otherMemberships: raw["OTHER MEMBERSHIPS:"],
    restrictions: raw["RESTRICTIONS:"],
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

export default async function ProfilePage(props: ProfilePageProps) {
  const { params } = await props;
  const { slug } = await params;
  const practitioners = await getPractitioners();

  const practitioner = practitioners.find(p => p.slug === slug);
  
  

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

      <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Profile Header */}
        <ProfileHeader practitioner={practitioner} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Services & Treatments</TabsTrigger>
            <TabsTrigger value="insights">Professional Insights</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Reviews ({practitioner.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-8">
            <ServicesSection practitioner={practitioner} />
          </TabsContent>

          <TabsContent value="insights" className="mt-8">
            <PractitionerInsights practitioner={practitioner} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-foreground">Patient Reviews ({practitioner.reviewCount})</h2>
              </div>

              <div className="grid gap-6">
                {practitioner.gmapsReviews.map((review, index) => (
                  <ReviewCard key={index} review={review} />
                ))}
              </div>

              {practitioner.gmapsReviews.length === 0 && (
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

export async function generateStaticParams() {
  const practitioners = await getPractitioners();
  return practitioners.map((practitioner) => ({
    slug: practitioner.slug,
  }))
}


export async function generateMetadata(props: ProfilePageProps) {
  const { params } = await props
  const { slug } = await params;
  const practitioners = await getPractitioners();
  const practitioner = practitioners.find((p) => p.slug === slug)

  if (!practitioner) {
    return {
      title: "Practitioner Not Found",
    }
  }

  const practitionerName = practitioner.reviewAnalysis?.practitioners[0]?.name || "Practitioner"

  return {
    title: `${practitionerName} - Healthcare Directory`,
    description: `View the profile of ${practitionerName}, a qualified ${practitioner.profession} offering professional healthcare services. Read reviews and book appointments.`,
  }
}
