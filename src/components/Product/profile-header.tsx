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
import type { Product } from "@/lib/types";

import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  clinic: Product;
}

export function ProfileHeader({ clinic }: ProfileHeaderProps) {
  const practitionerName = clinic.product_name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const roleTitle = clinic.brand;

  return (
    <Card className="md:mt-2 flex flex-col gap-6 md:rounded-xl px-0 md:px-6 py-6 relative shadow-none group transition-all duration-300 md:rounded-27 border-t border-b border-[#C4C4C4] md:border-t-[1px] md:border md:border-[var(--alto)] bg-white md:bg-[var(--primary-bg-color)]">
      <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-4 items-center">
        <div className="flex flex-row flex-wrap pb-4 md:pb-0 md:mb-4 px-0 lg:mb-0 items-start border-b border-[#C4C4C4] md:border-0">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center w-[115px] md:w-[200px] mr-2 md:mr-4">
            <div className="relative group">
              {/* Elegant frame with shadow */}
              <div className="absolute -inset-1 rounded-full blur opacity-25 transition duration-300" />
              <div className="w-[80px] h-[80px] md:w-[200px] md:h-[200px] flex items-center justify-center overflow-hidden rounded-lg bg-grey-300">
                <img
                  src={
                    clinic.image_url?.replaceAll('"', "") || "/placeholder.svg"
                  }
                  alt={practitionerName}
                  className="object-cover rounded-lg min-w-full min-h-full"
                />
              </div>
            </div>
          </div>

          {/* Main Information Section */}
          <div className="gap-0 flex items-start flex-col w-[calc(100%-123px)] md:w-[calc(100%-230px)]">
            {/* Name and credentials */}
            <div className="flex w-full md:w-auto flex-col md:flex-row gap-2 mb-2 items-start md:items-center">
              <h1 className="inline text-left mb-0 md:m-0 font-semibold text-md md:text-2xl transition-colors md:text-left">
                {practitionerName}
              </h1>
            </div>

            <div className="flex flex-row gap-2 mb-0 items-center">
              <p className="text-pretty md:font-bold text-sm md:text-md">
                {roleTitle}
              </p>
              <span className="relative pl-3 text-sm before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-black">
                {clinic.product_category}
              </span>
            </div>

            <div className="hidden md:block">
              {/* Contact Information */}

              <div className="flex flex-wrap gap-4 my-2">
                <span>{clinic.product_subcategory}</span>
              </div>
            </div>

            {/* Specializations preview */}
            <div className="flex flex-wrap gap-2 pt-2">
              {clinic.certifications_and_compliance?.map((spec: string) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs px-3 py-1 mb-1"
                >
                  {spec
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="block md:hidden">
          {/* Contact Information */}

          <div className="flex flex-wrap gap-4 my-2">
            <span>{clinic.product_subcategory}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
