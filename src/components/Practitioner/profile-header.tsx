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
    <div className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 rounded-27 border border-[var(--alto)] bg-[var(--primary-bg-color)]" />
      
      {/* Decorative accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
      
      <Card className="relative border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <div className="p-8 lg:p-12">
          <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr_auto] gap-8 lg:gap-12 items-start">
            
            {/* Profile Image Section */}
            <div className="flex flex-col items-center xl:items-start">
              <div className="relative group">
                {/* Elegant frame with shadow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300" />
                <div className="relative w-32 h-32 lg:w-40 lg:h-40 overflow-hidden rounded-full border-4 border-white shadow-2xl">
                  <img
                    src={clinic.image.replace("&w=256&q=75", "") || "/placeholder.svg"}
                    alt={practitionerName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    
                  />
                </div>
                
                {/* Status indicator */}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg" />
              </div>
              
              {/* Quick stats */}
              <div className="mt-4 flex flex-col items-center xl:items-start gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-slate-700">{clinic.rating}</span>
                  <span className="text-xs text-slate-500">({clinic.reviewCount})</span>
                </div>
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Available Today
                </Badge>
              </div>
            </div>

            {/* Main Information Section */}
            <div className="flex flex-col gap-6">
              {/* Name and credentials */}
              <div className="text-center xl:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight mb-2">
                  {practitionerName}
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-3 mb-4">
                  <p className="text-lg text-slate-600 font-medium">
                    {roleTitle}
                  </p>

                </div>
                <ClinicLabels clinic={clinic} />
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-slate-600">
                  <MapPin className="w-5 h-5 mt-0.5 text-slate-400 shrink-0" />
                  <span className="text-sm leading-relaxed">{clinic.gmapsAddress}</span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={`tel:${clinic.gmapsPhone}`}
                    className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">{clinic.gmapsPhone}</span>
                  </a>
                  
                  <a 
                    href="mailto:consultation@example.com"
                    className="flex items-center gap-2 text-slate-600 hover:text-amber-600 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </a>
                </div>
              </div>

              {/* Specializations preview */}
              <div className="flex flex-wrap gap-2">
                {clinic.reviewAnalysis?.procedures_offered.categories
                .map((spec) => (
                  <Badge 
                    key={spec}
                    variant="outline" 
                    className="border-slate-200 text-slate-600 hover:text-amber-600 transition-colors bg-[var(--primary-bg-color)]"
                  >
                    {spec.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="flex flex-col gap-4 min-w-[200px]">
              <Button 
              variant="outline"
                size="lg"
                className="bg-[var(--primary-bg-color)] hover:text-amber-600 text-black font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Consultation
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                className="bg-[var(--primary-bg-color)] hover:text-amber-600 text-black font-medium shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                Request Pricing
              </Button>
              
              <div className="pt-2 border-t border-slate-100">
                <SocialMediaIcons clinic={clinic} />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
