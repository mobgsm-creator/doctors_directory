import { Star, MapPin, Phone, Facebook, Instagram, Twitter, Youtube, ExternalLink, Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Clinic } from "@/lib/types"
import SocialMediaIcons from "../Clinic/clinicSocialMedia"
import ClinicLabels from "./clinicLabels"
interface ProfileHeaderProps {
  clinic: Clinic
}

export function ProfileHeader({ clinic }: ProfileHeaderProps) {
  const practitionerName = clinic.slug
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
  const roleTitle = clinic.category

  return (

    <Card className="justify-center border-border/50 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-center">
      <div className="w-60 h-60 flex items-center justify-center overflow-hidden rounded-full border p-1 drop-shadow-sm bg-white">
        <img
            src={clinic.image.replace("&w=256&q=75","") || "/placeholder.svg"}
            alt={"/placeholder.svg"}
            className="border rounded-full flex object-cover p-1 drop-shadow-sm min-w-full min-h-full"
            width={180} height={180}

          /></div>
          <div className ='gap-1 flex items-center flex-col sm:ml-4 '>
            <h1 className="flex flex-col justify-center text-balance text-lg sm:text-xl font-semibold text-foreground leading-tight">
              {practitionerName}
              <span className="flex justify-center text-muted-foreground font-normal">
          
                {roleTitle}
              </span>
            
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground/90 px-3 py-1 text-xs sm:text-sm">
                <Phone className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                {clinic.gmapsPhone}
              </span>
              
            </div>
            
            <address className="ml-6 not-italic text-muted-foreground text-xs leading-relaxed flex items-center justify-center sm:items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="block max-w-[300px] break-words sm:whitespace-normal">{clinic.gmapsAddress}</span>
            </address>
            <div className="flex items-center justify-center sm:justify-start mt-4">
             {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < clinic.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs text-muted-foreground" aria-label={`${clinic.reviewCount} reviews`}>
                  {clinic.reviewCount.toLocaleString()} reviews
              </span>
            </div>
             {/* --- Buttons --- */}
             
           <ClinicLabels clinic={clinic} />
            <SocialMediaIcons clinic={clinic} />
            
             

        </div>
        <div className="ml-10 flex flex-col gap-3 mt-6">
      <Button variant="default" className="rounded-full px-6 py-8">
        Request Consultation
      </Button>
      <Button variant="outline" className="rounded-full px-6 py-8">
        Request Pricing
      </Button>
    </div>
      </div></Card>
)
}

