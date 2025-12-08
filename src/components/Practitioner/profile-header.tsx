import {
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Award,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Practitioner } from "@/lib/types";
import SocialMediaIcons from "../Clinic/clinicSocialMedia";
import ClinicLabels from "./clinicLabels";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  clinic: Practitioner;
}

export function ProfileHeader({ clinic }: ProfileHeaderProps) {
  const practitionerName = clinic.practitioner_name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const roleTitle = clinic.category;

  return (
    <Card className="mt-2 flex flex-col gap-6 rounded-xl px-6 py-6 relative shadow-none group transition-all duration-300 rounded-27 border border-[var(--alto)] bg-[var(--primary-bg-color)]">
      <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] gap-8 lg:gap-12 items-center">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center xl:items-center">
          <div className="relative group">
            {/* Elegant frame with shadow */}
            <div className="absolute -inset-1 rounded-full blur opacity-25 transition duration-300" />
            <div className="w-40 h-40 md:w-50 md:h-50 flex items-center justify-center overflow-hidden rounded-full bg-grey-300">
              <img
                src={
                  clinic.image.replace("&w=256&q=75", "") || "/placeholder.svg"
                }
                alt={practitionerName}
                className="rounded-full flex object-cover min-w-full min-h-full w-[180px] h-[180px] md:w-[240px] md:h-[240px]"
              />
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 right-6 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
          </div>

          {/* Quick stats */}
          <div className="mt-4 flex flex-col items-center xl:items-center gap-1">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-slate-700">
                {clinic.rating}
              </span>
              <span className="text-xs text-slate-500">
                ({clinic.reviewCount})
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              Available Today
            </Badge>
          </div>
        </div>

        {/* Main Information Section */}
        <div className="gap-0 flex items-center md:items-start flex-col sm:ml-4 ">
          {/* Name and credentials */}
          <div className="flex w-full md:w-auto flex-col gap-2 mb-4 items-center md:items-start">
            <h1 className="mb-1 flex align-items-center justify-center font-semibold text-2xl transition-colors text-balance text-center md:text-left">
              {practitionerName}
            </h1>
            <ClinicLabels clinic={clinic} />
          </div>
          <div className="flex flex-row gap-2 mb-2 items-center">
            <p className="text-pretty font-medium">{roleTitle}</p>
          </div>

          {/* Contact Information */}

          <div className="flex items-start gap-3 my-2">
            <MapPin className="h-4 w-4 mt-1 shrink-0 " />
            <span className="text-xs">
              {clinic.gmapsAddress}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 my-2">
            <a
              href={`tel:${clinic.gmapsPhone}`}
              className="flex items-center gap-2 text-xs transition-colors"
            >
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              <span>{clinic.gmapsPhone}</span>
            </a>

            <a
              href="mailto:consultation@example.com"
              className="flex items-center gap-2 text-xs transition-colors"
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              <span>Email</span>
            </a>
          </div>

          {/* Specializations preview */}
          <div className="flex flex-wrap gap-2 pt-2">
            {clinic.reviewAnalysis?.procedures_offered.categories.map(
              (spec) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className="border-black  hover:text-black transition-colors bg-[var(--primary-bg-color)]"
                >
                  {spec
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              )
            )}
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-4 min-w-[200px]">
          <Button
            variant="default"
            size="lg"
            className="shadow-none h-auto rounded-lg text-md px-7 py-3 text-white hover:cursor-pointer"
          >
            Book Consultation
          </Button>

          <Button
            variant="outline"
            className="shadow-none border-black h-auto rounded-lg text-md px-7 py-3 hover:cursor-pointer"
          >
            Request Pricing
          </Button>

          <SocialMediaIcons clinic={clinic} />
        </div>
      </div>
    </Card>
  );
}
