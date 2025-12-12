import { Star, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/lib/types";

import Image from "next/image";
interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStarCount = (rating: string) => {
    return Number.parseInt(rating.split(" ")[0]) || 5;
  };

  const starCount = getStarCount(review.rating);

  return (
    <Card className="border shadow-none rounded-lg mb-4">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <img
            src={review.reviewer_name ? "/directory/googlemaps.png" : "/directory/doctify.jpg"}
            alt="Label"
            width={40}
            height={40}
            className="object-cover rounded-full "
          />
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm bg-accent text-accent-foreground">
              {getInitials(review.reviewer_name ?? "anonymous")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">
                {review.reviewer_name ?? "Anonymous"}
              </h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < starCount
                          ? "fill-black text-black"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
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
        <p className="text-muted-foreground text-pretty leading-relaxed">
          {review.review_text ?? review.text}
        </p>

        {review.owner_response && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                Owner Response
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground text-pretty">
              {review.owner_response}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
