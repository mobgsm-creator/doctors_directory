import Link from "next/link"
import { Star, MapPin, Phone, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Practitioner } from "@/lib/types"

interface PractitionerCardProps {
  practitioner: Practitioner
}

export function PractitionerCard({ practitioner }: PractitionerCardProps) {

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
  .join(" ") || "Practitioner"

  return (
    <Link href={`/profile/${practitioner.slug}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 hover:border-accent/50">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={practitioner.image || "/placeholder.svg"} alt={practitionerName} />
              <AvatarFallback className="text-lg font-semibold bg-accent text-accent-foreground">
                {getInitials(practitionerName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors text-balance">
                {practitionerName}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 text-pretty">
                {practitioner.profession.split("|")[2]?.trim() || practitioner.profession}
              </p>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{practitioner.rating}</span>
                  <span className="text-muted-foreground">({practitioner.reviewCount} reviews)</span>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {practitioner.category}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground text-pretty">{practitioner.gmapsAddress}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{practitioner.gmapsPhone}</span>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-sm mb-2 text-foreground">Specialties</h4>
            <div className="flex flex-wrap gap-1">
              {practitioner.modality.slice(0, 3).map((modality, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {modality[0]}
                </Badge>
              ))}
              {practitioner.modality.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{practitioner.modality.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Member since {new Date(practitioner.memberSince).getFullYear()}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
