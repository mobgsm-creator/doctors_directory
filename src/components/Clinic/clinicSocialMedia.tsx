"use client";

import { Facebook, Instagram, Twitter, Youtube, Mail, ExternalLink } from "lucide-react";

type Clinic = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  email?: string;
  website?: string;
};

export default function SocialMediaIcons({ clinic }: { clinic: Clinic }) {
  const handleOpen = (url: string) => {
    if (!url) return;
    // For email, prepend mailto: if missing
    if (url.includes("@") && !url.startsWith("mailto:")) {
      window.open(`mailto:${url}`, "_blank", "noopener,noreferrer");
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-row flex-wrap gap-3 items-center mt-4">
      {clinic.facebook && (
        <Facebook
          aria-label="Facebook"
          className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.facebook!)}
        />
      )}
      {clinic.instagram && (
        <Instagram
          aria-label="Instagram"
          className="h-5 w-5 text-gray-500 hover:text-pink-500 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.instagram!)}
        />
      )}
      {clinic.twitter && (
        <Twitter
          aria-label="Twitter"
          className="h-5 w-5 text-gray-500 hover:text-sky-500 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.twitter!)}
        />
      )}
      {clinic.youtube && (
        <Youtube
          aria-label="YouTube"
          className="h-5 w-5 text-gray-500 hover:text-red-600 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.youtube!)}
        />
      )}
      {clinic.email && (
        <Mail
          aria-label="Email"
          className="h-5 w-5 text-gray-500 hover:text-amber-500 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.email!)}
        />
      )}
      {clinic.website && (
        <ExternalLink
          aria-label="Website"
          className="h-5 w-5 text-gray-500 hover:text-gray-800 cursor-pointer transition-colors"
          onClick={() => handleOpen(clinic.website!)}
        />
      )}
    </div>
  );
}
