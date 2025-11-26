"use client";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero-section";
import type { SearchFilters } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useSearchStore } from "@/app/stores/datastore";
import LogoLoop from "./LogoLoop";
import Header from "@/components/header";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import { 
  Smile, 
  Scissors, 
  Wind, 
  Zap, 
  Heart, 
  Check, 
  Handshake, 
  ChartBarDecreasing, 
  Circle, 
  CircleCheck 
} from "lucide-react";

const imageLogos = [
  {
    src: "/HIS.jpg",
    alt: "HIS",
    href: "https://www.healthcareimprovementscotland.scot/",
  },
  { src: "/HIW.jpg", alt: "HIW", href: "https://www.hiw.org.uk" },
  { src: "/jccp.jpg", alt: "JCCP", href: "https://www.jccp.org.uk/" },
  { src: "/qcc.jpg", alt: "CQC", href: "https://cqc.org.uk" },
  { src: "/rqia.jpg", alt: "RQIA", href: "https://www.rqia.org.uk/" },
  {
    src: "/save-face-partner.jpg",
    alt: "Save Face",
    href: "https://www.saveface.co.uk/",
  },
];

const specialists = [
  { name: "Facial Aesthetics", image: "images/ico-facial.png" },
  { name: "Cosmetology", image: "images/ico-dermatology.png" },
  { name: "Hair & Scalp", image: "images/ico-hairandscalp.png" },
  { name: "Skin Technology & Laser", image: "images/ico-skin.png" },
  { name: "Wellness", image: "images/ico-wellness.png" },
];

const treatments = [
  { name: "Facial", image: "images/img-1.png" },
  { name: "Hands", image: "images/img-2.png" },
  { name: "Eyes", image: "images/img-3.png" },
  { name: "Skin", image: "images/img-4.png" },
  { name: "Hairline", image: "images/img-5.png" },
];

const ITEMS_PER_PAGE = 9;

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <section className="bg-white-50 py-15 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl md:text-4xl font-bold text-center mb-16">
            Contact a Specialist
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 align-items-center">
            {specialists.map((specialist, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center transition">
                  <img
                    src={specialist.image || "/placeholder.svg"}
                    alt={specialist.name || "Placeholder"}
                    className="w-[100px] h-[100px] object-cover rounded-lg"
                  />
                </div>
                <p className="text-base font-medium text-center">{specialist.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Most Popular Treatments */}
      <section className="py-15 md:py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center flex-col justify-between mb-12">
            <h2 className="text-xl md:text-4xl font-bold text-center mb-10">
              Most Popular Treatments
            </h2>
            <Button className="bg-[var(--mineshaft)] hover:bg-black h-auto rounded-lg text-lg px-8 py-4 text-white">
              See all Treatments
            </Button>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-items-center items-center gap-4 pb-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex-shrink-0">
                  <img
                    src={treatment.image || "/placeholder.svg"}
                    alt={treatment.name}
                    className="w-32 h-32 md:w-38 md:h-38 lg:w-45 lg:h-45 ml-auto mr-auto object-cover rounded-lg"
                  />
                  <p className="mt-4 text-base font-medium text-center">{treatment.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LogoLoop
        logos={imageLogos}
        speed={100}
        direction="left"
        logoHeight={48}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Regulatory Compliance"
      />
      {/* Trust Section */}
      <section className="py-15 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl md:text-4xl font-bold text-center mb-10 md:mb-16">
            Building trust and clarity in healthcare
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                icon: Handshake,
                title: "Our commitment",
                desc: "We deliver a home to real ethical professionals. All professionals boast on our platform are verified and trusted by patients.",
              },
              {
                icon: ChartBarDecreasing,
                title: "Insight that matters",
                desc: "We ensure that patient reviews are genuine, with verified services with confidence by providing transparent information.",
              },
              {
                icon: CircleCheck,
                title: "Safe & reliable",
                desc: "We protect your data and ensure secure medical quality information is secured and protected from abuse, helping them.",
              },
            ].map((item, index) => (
              <div key={index} className="info-card bg-[var(--alabaster)] border-1 border-[var(--alto)] rounded-xl py-8 px-6 md:py-12 md:px-8 flex items-center flex-col">
                 <item.icon className="w-12 h-12 mb-8 hidden md:flex" />
                <h3 className="font-bold text-lg mb-4">{item.title}</h3>
                <p className="text-base font-normal text-center text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* For Service Providers Section */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-2 items-center">
            <div>
              <h2 className="text-lg md:text-3xl text-center md:text-left md:text-4xl font-bold mb-6">
                For Service Providers
              </h2>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                  Gather verified patient reviews with our digital platform.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                  Showcase and validate your clinical expertise.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                  Connect, engage, and better understand your patients.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                  Access real-time insights to continually enhance your care.
                  </span>
                </li>
                <li className="flex gap-3 items-start">
                  <CircleCheck className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-base">
                  Connect with like-minded healthcare professionals.
                  </span>
                </li>
              </ul>
              <div className="text-center md:text-left mb-10 md:mb-0">
                <Button className="bg-[var(--mineshaft)] hover:bg-black h-auto rounded-lg text-lg px-8 py-4 text-white">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="images/laptop-healthcare-interface.png"
                alt="Healthcare dashboard on laptop"
                className="max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started CTA Section */}
      <section className="bg-[var(--dune)] py-20 text-white hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-gray-300">
              Join over 250+ clinics already growing with Consentz
            </p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-200">BOOK DEMO</Button>
        </div>
      </section>
    </main>
  );
}
