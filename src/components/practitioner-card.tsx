import Link from "next/link"
import { Star, MapPin, Phone, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Practitioner } from "@/lib/types"
import Image from "next/image"
interface PractitionerCardProps {
  practitioner: Practitioner
}

export function PractitionerCard({ practitioner }: PractitionerCardProps) {
   const practitionerName = practitioner.slug
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ") || "Practitioner"

  return (
    <Link href={`/profile/${practitioner.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-accent/50">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
          

            <div className="flex-1 min-w-0 items-center flex flex-col">
              <h3 className="flex justify-center font-semibold text-sm text-foreground group-hover:text-primary/70 transition-colors text-balance">
                {practitionerName}
              </h3>
              <p className="flex justify-center text-sm text-muted-foreground mb-2 text-pretty">
                {practitioner.profession.split("|")[2]?.trim() || practitioner.profession}
              </p>
              <div className="w-60 h-60 flex items-center justify-center overflow-hidden rounded-full border p-1 drop-shadow-sm bg-white">
  <Image
    src={practitioner.image.replace("&w=256&q=75","") || "/placeholder.svg"}
    alt="Profile photo"
    width={240}
    height={240}
    className="object-cover rounded-full min-w-full min-h-full"
  />
</div>

              <div className="flex flex-col items-center text-sm">
                <div className="flex items-center gap-1">
                  
                  <div className="flex items-center mt-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < practitioner.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                  
                </div>
                <span className="text-muted-foreground mt-1 ">({practitioner.reviewCount} reviews)</span>

               
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-pretty">{practitioner.gmapsAddress}</span>
          </div>

        

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2 text-foreground">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {practitioner.modality.slice(0, 3).map((modality, index) => (
                <Badge key={index} variant="outline" className="text-xs text-wrap">
                  {modality.replaceAll('"',"")}
                </Badge>
              ))}
              {practitioner.modality.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{practitioner.modality.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          
        </CardContent>
      </Card>
    </Link>
  )
}
