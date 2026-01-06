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
    <Card className="md:mt-2 flex flex-col gap-6 md:rounded-xl px-0 md:px-6 py-6 relative shadow-none group transition-all duration-300 md:rounded-27 border-t border-b border-[#C4C4C4] md:border-t-[1px] md:border md:border-[var(--alto)] bg-white md:bg-[var(--primary-bg-color)]">

      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-4 items-center">
        <div className="flex flex-row flex-wrap pb-4 md:pb-0 md:mb-4 md:px-4 md:px-0 lg:mb-0 items-center border-b border-[#C4C4C4] md:border-0">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center w-[115px] md:w-[140px] mr-2 md:mr-4">
            <div className="relative group">
              {/* Elegant frame with shadow */}
              <div className="absolute -inset-1 rounded-full blur opacity-25 transition duration-300" />
                <div className="w-[80px] h-[80px] md:w-[140px] md:h-[140px] flex items-center justify-center overflow-hidden rounded-full bg-grey-300">
                  <img
                    src={
                      clinic.image.replace("&w=256&q=75", "") ||
                      "/placeholder.svg"
                    }
                    alt={practitionerName}
                    className="object-cover rounded-full min-w-full min-h-full"
                  />
                </div>

                {/* Status indicator */}
                <div className="absolute top-0 right-2 md:top-4 md:right-6 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
            </div>

            {/* Quick stats */}
            <div className="mt-1 md:mt-4 flex flex-col items-center xl:items-center gap-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-black text-black" />
                <span className="text-sm font-medium text-black">
                  {clinic.rating}
                </span>
                <span className="text-sm text-black">
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
          <div className="gap-0 flex items-start flex-col w-[calc(100%-123px)] md:w-[calc(100%-180px)]">
            {/* Name and credentials */}
            <div className="flex w-full md:w-auto flex-col md:flex-row gap-2 mb-2 items-start md:items-center">
              <h1 className="inline text-left mb-0 md:m-0 font-semibold text-md md:text-2xl transition-colors md:text-left">
                {practitionerName}
              </h1>
              <ClinicLabels clinic={clinic} />
            </div>

            <div className="flex flex-row gap-2 mb-3 items-center">
              <p className="text-pretty md:font-bold text-sm md:text-md">{roleTitle}</p>
             </div>

             <div className="hidden md:block">
                 <h2 className="sr-only">Contact Information</h2>

                 <div className="flex items-start gap-3 my-2">
                  <MapPin className="h-4 w-4 mt-1 shrink-0 " />
                  <span className="text-sm">{clinic.gmapsAddress}</span>
                </div>

                <div className="flex flex-wrap gap-4 my-2">
                  <a
                    href={`tel:${clinic.gmapsPhone}`}
                    className="flex items-center gap-2 text-sm transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    <span>{clinic.gmapsPhone}</span>
                  </a>

                   <a
                     href="mailto:consultation@example.com"
                     className="flex items-center gap-2 text-sm transition-colors"
                   >
                     <Mail className="h-3.5 w-3.5 mr-1.5" />
                     <span>Email</span>
                   </a>
                 </div>

                 <h2 className="sr-only">Specializations</h2>
                 <ul className="flex flex-wrap gap-2 pt-2" aria-label="Specializations">
                   {clinic.reviewAnalysis?.procedures_offered.categories.map(
                     (spec) => (
                       <li key={spec}>
                         <Badge
                           variant="outline"
                           className="border-black  hover:text-black transition-colors bg-[var(--primary-bg-color)]"
                         >
                           {spec
                             .split("-")
                             .map(
                               (word) => word.charAt(0).toUpperCase() + word.slice(1)
                             )
                             .join(" ")}
                         </Badge>
                       </li>
                     )
                   )}
                 </ul>
             </div>

          </div>
        </div>

        <div className="block md:hidden">
                 <h2 className="sr-only">Contact Information</h2>

                 <div className="flex items-start gap-3 my-2">
                  <MapPin className="h-4 w-4 mt-1 shrink-0 " />
                  <span className="text-sm">{clinic.gmapsAddress}</span>
                </div>

                <div className="flex flex-wrap gap-4 my-2">
                  <a
                    href={`tel:${clinic.gmapsPhone}`}
                    className="flex items-center gap-2 text-sm transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    <span>{clinic.gmapsPhone}</span>
                  </a>

                  <a
                    href="mailto:consultation@example.com"
                    className="flex items-center gap-2 text-sm transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    <span>Email</span>
                   </a>
                 </div>

                 <h2 className="sr-only">Specializations</h2>
                 <ul className="flex flex-wrap gap-2 pt-2" aria-label="Specializations">
                   {clinic.reviewAnalysis?.procedures_offered.categories.map(
                     (spec) => (
                       <li key={spec}>
                         <Badge
                           variant="outline"
                           className="border-black hover:text-black transition-colors bg-transparent"
                         >
                           {spec
                             .split("-")
                             .map(
                               (word) => word.charAt(0).toUpperCase() + word.slice(1)
                             )
                             .join(" ")}
                         </Badge>
                       </li>
                     )
                   )}
                 </ul>
            </div>

        {/* Action Buttons Section */}
        <div className="flex flex-col gap-4">
    

          <Button
            asChild
            variant="outline"
            className="shadow-none border-black h-auto rounded-lg text-md px-7 py-3 hover:cursor-pointer"
          >
            <a
              href={clinic.email || clinic.website ||
  clinic.instagram ||
  clinic.facebook ||
  clinic.twitter ||
  clinic.Linkedin || // <- use lowercase to match JS naming conventions
  "#" }
              target="_blank"
              rel="noopener noreferrer"
            >
              Book Consultation
            </a>
          </Button>



          <Button
          asChild
          variant="outline"
          className="shadow-none border-black h-auto rounded-lg text-md px-7 py-3 hover:cursor-pointer"
          >
          <a
            href={clinic.website ||
  clinic.instagram ||
  clinic.facebook ||
  clinic.twitter ||
  clinic.Linkedin || // <- use lowercase to match JS naming conventions
  "#" }
            target="_blank"
            rel="noopener noreferrer"
          >
            Request Pricing
          </a>
          </Button>


          <SocialMediaIcons clinic={clinic} />
        </div>
      </div>
    </Card>
  );
}
