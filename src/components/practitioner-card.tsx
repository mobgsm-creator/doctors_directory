import Link from "next/link";
import { Star, MapPin, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Practitioner, Clinic } from "@/lib/types";
import Image from "next/image";
import ClinicLabels from "./Clinic/clinicLabels";
interface PractitionerCardProps {
  practitioner: Practitioner | Clinic;
}

export function PractitionerCard({ practitioner }: PractitionerCardProps) {
  const practitionerName = (practitioner as Practitioner).practitioner_name
    ? (practitioner as Practitioner).practitioner_name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : practitioner.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

  return (
    <Card className="relative pb-[60px] shadow-none group transition-all duration-300 rounded-27 border border-[var(--alto)] cursor-pointer">
      <CardHeader className="pb-0 px-2">
        <div className="flex items-start gap-4">
          <div className="text-center flex-1 min-w-0 items-center flex flex-col">
            <div className="w-[150px] h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 mb-3">
              <img
                src={
                  practitioner.image.replace("&w=256&q=75", "") ||
                  "/placeholder.svg"
                }
                alt="Profile photo"
                width={150}
                height={150}
                className="object-cover rounded-full min-w-full min-h-full"
                onError={(e) => {
    e.currentTarget.onerror = null; // prevent infinite loop
    e.currentTarget.src = "/directory/images/doc.png";
  }}
              />
            </div>
            <h3 className="mb-4 flex align-items-center justify-center font-semibold text-lg transition-colors text-balance">
              {practitionerName}
            </h3>

            {!("profession" in practitioner) && (
              <>
                <ClinicLabels clinic={practitioner} />
              </>
            )}

            {"practitioner_image_link" in practitioner &&
              practitioner.practitioner_name && (
                <p className="text-muted-foreground mb-2 text-pretty">
                  {practitioner.practitioner_title.trim()}
                </p>
              )}

            {!("practitioner_image_link" in practitioner) &&
              practitioner.category && (
                <p className="pt-2 mb-2 text-pretty">
                  {practitioner.category.trim()}
                </p>
              )}

            <div className="flex flex-row gap-2 pt-3 items-center text-sm">
              <div className="inline-flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < practitioner.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="border-l border-black pl-2 underline">
                ({practitioner.reviewCount} reviews)
              </span>
            </div>
            
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="text-pretty">{practitioner.gmapsAddress}</span>
        </div>

        {practitioner.reviewAnalysis?.procedures_offered?.categories.length! >
          0 && null}

        <div>
          <div className="flex flex-wrap gap-1">
            {true &&
              practitioner.reviewAnalysis?.procedures_offered?.categories
                .slice(0, 2)
                .map((modality, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {modality
                      .split(" ") // split into words
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      ) // capitalize each
                      .join(" ")}
                  </Badge>
                ))}
            {true &&
              practitioner.reviewAnalysis?.procedures_offered?.categories
                ?.length! > 2 && (
                <Badge variant="outline" className="text-xs">
                  +
                  {practitioner.reviewAnalysis?.procedures_offered?.categories!
                    .length! - 2}{" "}
                  more
                </Badge>
              )}
          </div>
        </div>
        <Link
          href={
            "practitioner_image_link" in practitioner &&
            practitioner.practitioner_name
              ? `/profile/${practitioner.practitioner_name}`
              : `/clinics/${(practitioner as Clinic).City}/clinic/${practitioner.slug}`
          }
          className="mt-6 absolute left-4 right-4 bottom-4 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
        >
          Contact
        </Link>
      </CardContent>
    </Card>
  );
}
