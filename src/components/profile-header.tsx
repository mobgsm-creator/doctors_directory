import { Star, MapPin, Phone, Calendar, ExternalLink, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
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
    <Card className="border-border/50">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center lg:items-start">
            <Avatar className="h-32 w-32 border-4 border-border mb-4">
              <AvatarImage src={practitioner.image || "/placeholder.svg"} alt={practitionerName} />
              <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">
                {getInitials(practitionerName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{practitioner.rating}</span>
                <span className="text-muted-foreground">({practitioner.reviewCount} reviews)</span>
              </div>
            </div>

            <Button className="w-full lg:w-auto" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Contact Practitioner
            </Button>
          </div>

          {/* Main info */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">{practitionerName}</h1>
              <p className="text-xl text-muted-foreground mb-4 text-pretty">{roleTitle}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  {practitioner.category}
                </Badge>
                <Badge variant="outline">{practitioner.regulatoryBody}</Badge>
                <Badge variant="outline">PIN: {practitioner.registrationPin}</Badge>
              </div>
            </div>

            <Separator />

            {/* Contact and location info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Contact Information</h3>
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
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Professional Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Member since {new Date(practitioner.memberSince).getFullYear()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Qualification: </span>
                    <span className="text-foreground">{practitioner.qualification}</span>
                  </div>
                  {practitioner.otherMemberships && (
                    <div>
                      <span className="text-muted-foreground">Other Memberships: </span>
                      <span className="text-foreground">{practitioner.otherMemberships}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
