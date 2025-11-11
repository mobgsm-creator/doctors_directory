import { Star, MapPin, ShieldCheck } from "lucide-react"
import { Card} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Practitioner } from "@/lib/types"
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

  return (

      <Card className="justify-center border-border/50 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-center">
        <div className="w-60 h-60 flex items-center justify-center overflow-hidden rounded-full border p-1 drop-shadow-sm bg-white">
          <img
              src={practitioner.image.replace("&w=256&q=75","") || "/placeholder.svg"}
              alt={"/placeholder.svg"}
              className="border rounded-full flex object-cover p-1 drop-shadow-sm min-w-full min-h-full"
              width={180} height={180}

            /></div>
            <div className ='gap-1 flex items-center flex-col sm:ml-4 '>
              <h1 className="flex flex-col justify-center text-balance text-lg sm:text-2xl font-semibold text-foreground leading-tight">
                {practitionerName}
                <span className="flex justify-center text-muted-foreground font-normal">
              
                  {roleTitle}
                </span>
              
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground/90 px-3 py-1 text-xs sm:text-sm">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  {practitioner.qualification}
                </span>
                
              </div>
              
              <address className="ml-6 not-italic text-muted-foreground text-xs leading-relaxed flex items-center justify-center sm:items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="block max-w-[300px] break-words sm:whitespace-normal">{practitioner.gmapsAddress}</span>
              </address>
              <div className="flex items-center justify-center sm:justify-start mt-4">
               {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < practitioner.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-xs text-muted-foreground" aria-label={`${practitioner.reviewCount} reviews`}>
                    {practitioner.reviewCount.toLocaleString()} reviews
                </span>
              </div>
               {/* --- Buttons --- */}
      
           

          </div>
          <div className="flex ml-10 flex-col gap-3 mt-6">
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
 
      
        
          {/* Avatar and basic info */}
          

          {/* Main info */}
          {/* <div className="flex-1">
          
       
            
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
                
                {/* <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{practitioner.rating}</span>
                <span className="text-muted-foreground">({practitioner.reviewCount} reviews)</span>
              </div></div></div>
             
            </div> */}
            

    
{/* 
            <Separator className='mt-8'/>

            {/* Contact and location info */}
            {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-pretty">{practitioner.gmapsAddress}</span>
                  </div> */} 
                 
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
                {/* </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  
                  <div>
                  
                    <span className="text-foreground">{practitioner.qualification}</span>
                  </div> */}
                  {/* {practitioner.otherMemberships && (
                    <div>
                      <span className="text-muted-foreground">Other Memberships: </span>
                      <span className="text-foreground">{practitioner.otherMemberships}</span>
                    </div>
                  )} */}
                {/* </div>
                
                
              </div>
              
            </div>
            <div className='mt-4'>
              <GoogleMapsEmbed
          url={practitioner.url!}
          height="150"
          className="w-full"
        /></div>
          </div>  */}


    
