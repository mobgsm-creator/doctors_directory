import { Star, MapPin, Phone, Calendar, ExternalLink, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GoogleMapsEmbed } from "@/components/gmaps-embed"
import { Separator } from "@/components/ui/separator"
import type { Practitioner } from "@/lib/types"
import Image from "next/image"
interface ProfileHeaderProps {
  practitioner: Practitioner
}

export function ProfileHeader({ practitioner }: ProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const practitionerName = practitioner.slug
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
  const roleTitle = practitioner.profession
  console.log(practitioner.image)
  return (
    <Card className="border-border/50 mt-8">
 
      
        
          {/* Avatar and basic info */}
          

          {/* Main info */}
          <div className="flex-1">
          
       
            
            <div className='flex flex-col items-center sm:flex-row sm:ml-24'>
          
                <Image
             src={practitioner.image.replace("&w=256&q=75","") || "/placeholder.svg"}
             alt={"/placeholder.svg"}
             className="border rounded-lg flex object-contain p-1 drop-shadow-sm"
             width={360} height={360}

           /><div className ='flex flex-col mt-8 sm:mt-24 sm:ml-36 items-center'>
              <h1 className="flex text-3xl font-bold text-foreground mb-2 text-balance">{practitionerName}</h1>
              <p className="flex text-xl text-muted-foreground mb-4 text-pretty">{roleTitle}</p>

              {/* <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {practitioner.category}
                </Badge>
                {/* <Badge variant="outline">{practitioner.regulatoryBody}</Badge> */}
                
                <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{practitioner.rating}</span>
                <span className="text-muted-foreground">({practitioner.reviewCount} reviews)</span>
              </div></div></div>
             
            </div>
            

    

            <Separator className='mt-8'/>

            {/* Contact and location info */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-pretty">{practitioner.gmapsAddress}</span>
                  </div>
                 
                  {/* {practitioner.gmapsLink && (
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={practitioner.gmapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 transition-colors"
                      >
                        View on Maps
                      </a>
                    </div>
                  )} */}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  
                  <div>
                  
                    <span className="text-foreground">{practitioner.qualification}</span>
                  </div>
                  {/* {practitioner.otherMemberships && (
                    <div>
                      <span className="text-muted-foreground">Other Memberships: </span>
                      <span className="text-foreground">{practitioner.otherMemberships}</span>
                    </div>
                  )} */}
                </div>
                
                
              </div>
              
            </div>
            <div className='mt-4'>
              <GoogleMapsEmbed
          url={practitioner.url!}
          height="150"
          className="w-full"
        /></div>
          </div>


    </Card>
  )
}
