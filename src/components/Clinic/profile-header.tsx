import {
  Star,
  MapPin,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ExternalLink,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Clinic } from "@/lib/types";
import SocialMediaIcons from "../Clinic/clinicSocialMedia";
import ClinicLabels from "./clinicLabels";
interface ProfileHeaderProps {
  clinic: Clinic;
}

export function ProfileHeader({ clinic }: ProfileHeaderProps) {
  const practitionerName = clinic.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const roleTitle = clinic.category;

  return (
    <Card className="mt-2 flex flex-col gap-6 rounded-xl px-6 py-6 relative shadow-none group transition-all duration-300 rounded-27 border border-[var(--alto)] bg-[var(--primary-bg-color)]">
      <div className="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-1 items-center">
        
        <div className="flex flex-col md:flex-row mb-4 lg:mb-0 items-center gap-4">
          
          <div className="w-40 h-40 md:w-60 md:h-60 flex items-center justify-center overflow-hidden rounded-full bg-grey-300">
            <img
              src={clinic.image.replace("&w=256&q=75", "") || "/placeholder.svg"}
              alt={"/placeholder.svg"}
              className="rounded-full flex object-cover min-w-full min-h-full w-[180px] h-[180px] md:w-[240px] md:h-[240px]"
              
            />
          </div>

          <div className="gap-0 flex items-center md:items-start flex-col sm:ml-4 ">
            
            <div className="flex w-full md:w-auto flex-col gap-2 mb-4 items-center md:items-start">
                <h1 className="mb-1 flex align-items-center justify-center font-semibold text-2xl transition-colors text-balance text-center md:text-left">
                  {practitionerName}
                </h1>
                <ClinicLabels clinic={clinic} />
            </div>
            
            <div className="flex flex-row gap-2 mb-2 items-center">
              <p className="text-pretty font-medium">
                  {roleTitle}
              </p>
            </div>
          
            <address className="mb-2 not-italic text-xs leading-relaxed flex items-start justify-start sm:items-start gap-2">
              <MapPin
                className="h-4 w-4 mt-1 shrink-0 "
                aria-hidden="true"
              />
              <span className="block max-w-[300px] break-words sm:whitespace-normal">
                {clinic.gmapsAddress}
              </span>
            </address>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-xs">
                <Phone className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                {clinic.gmapsPhone}
              </span>
            </div>
 
          </div>

        </div>

        <div className="flex flex-col gap-3 justify-center">
          <Button variant="default" className="shadow-none h-auto rounded-lg text-md px-7 py-3 text-white hover:cursor-pointer">
            Request Consultation
          </Button>
          <Button variant="outline" className="shadow-none border-black h-auto rounded-lg text-md px-7 py-3 hover:cursor-pointer">
            Request Pricing
          </Button>
          <SocialMediaIcons clinic={clinic} />
        </div>
      </div>
    </Card>
  );
}
