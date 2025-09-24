import Link from "next/link"
import { Star, MapPin, Phone, Calendar, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import type { Practitioner } from "@/lib/types"

interface PractitionerListItemProps {
  practitioner: Practitioner
}

export function PractitionerListItem({ practitioner }: PractitionerListItemProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const practitionerName = practitioner.reviewAnalysis[0]?.practitioners[0]?.name || "Practitioner"

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-border/50 hover:border-accent/50">
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-2 border-border flex-shrink-0">
            <AvatarImage src={practitioner.image || "/placeholder.svg"} alt={practitionerName} />
            <AvatarFallback className="text-lg font-semibold bg-accent text-accent-foreground">
              {getInitials(practitionerName)}
            </AvatarFallback>
          </Avatar>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <Link href={`/profile/${practitioner.slug}`}>
                  <h3 className="font-semibold text-xl text-foreground group-hover:text-accent transition-colors text-balance cursor-pointer">
                    {practitionerName}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-2 text-pretty">
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

              <div className="flex gap-2 ml-4">
                <Link href={`/profile/${practitioner.slug}`}>
                  <Button size="sm">View Profile</Button>
                </Link>
              </div>
            </div>

            <Separator />

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-pretty">{practitioner.gmapsAddress}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{practitioner.gmapsPhone}</span>
                </div>

                {practitioner.gmapsLink && (
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
                )}
              </div>

              {/* Professional Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Member since {new Date(practitioner.memberSince).getFullYear()}
                  </span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Regulatory Body: </span>
                  <span className="text-foreground">{practitioner.regulatoryBody}</span>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">PIN: </span>
                  <span className="text-foreground">{practitioner.registrationPin}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Specialties */}
            <div>
              <h4 className="font-medium text-sm mb-2 text-foreground">Specialties</h4>
              <div className="flex flex-wrap gap-1">
                {practitioner.modality.slice(0, 4).map((modality, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {modality[0]}
                  </Badge>
                ))}
                {practitioner.modality.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{practitioner.modality.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
