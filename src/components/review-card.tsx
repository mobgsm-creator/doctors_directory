import { Star, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Review } from "@/lib/types"

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStarCount = (rating: string) => {
    return Number.parseInt(rating.split(" ")[0]) || 5
  }

  const starCount = getStarCount(review.rating)

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm bg-accent text-accent-foreground">
              {getInitials(review.reviewer_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">{review.reviewer_name}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < starCount ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <Badge variant="outline" className="text-xs">
                  {review.rating}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-3 w-3" />
              <span>{review.date}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-muted-foreground text-pretty leading-relaxed">{review.review_text}</p>

        {review.owner_response && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Owner Response
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">{review.owner_response}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
