import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"
import type { Clinic, Practitioner } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Star, MapPin  } from "lucide-react"
import fs from "fs";
import path from 'path';


interface ProfilePageProps {
  params: {
    cityslug: string
    slug: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
 
  const filePath = path.join(process.cwd(), 'public', 'clinics_processed.json');
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const clinics: Clinic[] = JSON.parse(fileContents);
  const citySlug = params.cityslug;
  const cityClinics:Clinic[]= clinics.filter(p => p.City === citySlug);

  

  
  

  if (!cityClinics) {
    notFound()
  }

  return (
    <main>
   
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {cityClinics.map((clinic, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
                <Link href={`/clinics/${clinic.City}/${clinic.slug}`}>
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-accent/50">
                            <CardHeader >
                            <h2 className='flex justify-center font-semibold text-sm text-foreground group-hover:text-primary/70 transition-colors text-balance'>{clinic.slug.split("-")
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}</h2>
                            <div className="flex justify-center flex-wrap items-center gap-2">
                                <span className="flex items-center rounded-full bg-accent text-accent-foreground/90 px-3 py-1 text-xs sm:text-sm">
                                    
                                    {clinic.category}
                                </span>
                                
                                </div>
                            
                                                            </CardHeader>
                            <CardContent className='pt-0 flex justify-center '>
                            
                    <div className="flex flex-col items-center text-sm">
                    <img
                        src={clinic.image.split("?w")[0] || "/placeholder.svg"}
                        alt="Profile photo"
                        width={240}
                        height={240}
                        className="object-cover rounded-full w-60 h-60"
                    />
                <div className="flex items-center gap-1">
                  
                  <div className="flex items-center mt-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < clinic.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                  
                </div>
                <span className="text-muted-foreground mt-1 ">({clinic.reviewCount} reviews)</span>

                <div className="flex items-start gap-2 text-sm mt-12">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-pretty">{clinic.gmapsAddress}</span>
          </div>      
          <Separator className='mt-4' />

          <div>
            <h4 className="flex justify-center font-medium text-sm mb-2 text-foreground mt-2">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {clinic.reviewAnalysis?.procedures_offered.categories.slice(0, 3).map((modality, index) => (
                <Badge key={index} variant="outline" className="text-xs text-wrap">
                  {modality.replaceAll('"',"")}
                </Badge>
              ))}
              {clinic.reviewAnalysis?.procedures_offered.categories.length! > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{clinic.reviewAnalysis?.procedures_offered.categories.length! - 3} more
                </Badge>
              ) }
            </div>
          </div>         
              </div>
              
                            </CardContent>

                        
                        </Card>
                        </Link>
            </div>
            ))}
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


// export async function generateMetadata({ params }: ProfilePageProps) {
//   const clinics = await getClinics();
//   const clinic = clinics.find((p) => p.slug === params.slug)

//   if (!clinic) {
//     return {
//       title: "Practitioner Not Found",
//     }
//   }

//   const clinicName = clinic.slug

//   return {
//     title: `${clinicName} - Healthcare Directory`,
//     description: `View the profile of ${clinicName}, a qualified ${clinic.category} offering professional healthcare services. Read reviews and book appointments.`,
//   }
// }