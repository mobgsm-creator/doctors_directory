"use client"
import { useEffect, useState } from "react"
import { HeroSection } from "@/components/hero-section"
import type { SearchFilters} from "@/lib/types"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/app/stores/datastore"
import LogoLoop from './LogoLoop';
import Header from "@/components/header"
import { SearchBar } from "./search-bar"
import { Button } from "@/components/ui/button"
import { Smile, Scissors, Wind, Zap, Heart, Check } from "lucide-react"
const imageLogos = [

  { src: "/HIS.jpg", alt: "HIS", href: "https://www.healthcareimprovementscotland.scot/" },
  { src: "/HIW.jpg", alt: "HIW", href: "https://www.hiw.org.uk" },
  { src: "/jccp.jpg", alt: "JCCP", href: "https://www.jccp.org.uk/" },
  { src: "/qcc.jpg", alt: "CQC", href: "https://cqc.org.uk" },
  { src: "/rqia.jpg", alt: "RQIA", href: "https://www.rqia.org.uk/" },
  { src: "/save-face-partner.jpg", alt: "Save Face", href: "https://www.saveface.co.uk/" },

];
const specialists = [
  { name: 'Facial Aesthetics', image: '/smile.png' },
  { name: 'Cosmetology', image: '/derm-skin.png' },
  { name: 'Hair & Scalp', image: '/hair.png' },
  { name: 'Skin Technology & Laser', icon: Zap },
  { name: 'Wellness', icon: Heart },
];


const treatments = [
  { name: 'Facial', image: '/facial.png' },
  { name: 'Neck', image: '/neck.png' },
  { name: 'Eyes', image: '/eye.png' },
  { name: 'Skin', image: '/skin.png' },
  { name: 'Jawline', image: '/jaw.png' },
];
const ITEMS_PER_PAGE = 9





export default function HomePage() {

  return (
    <main>

      <HeroSection />
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Contact a Specialist</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {specialists.map((specialist, index) => {
              const IconComponent = specialist.icon
              ? specialist.icon
              : () => (
                  <img
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                );
            
              return (
                <div key={index} className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-black transition">
                    <IconComponent className="w-10 h-10 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-center">{specialist.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Most Popular Treatments */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Most Popular Treatments</h2>
            <Button className="bg-black text-white hover:bg-gray-800">
              See all Treatments
            </Button>
          </div>
          <div className="relative">
            <div className="grid grid-cols-5 gap-4 overflow-x-auto pb-4">
              {treatments.map((treatment, index) => (
                <div key={index} className="flex-shrink-0 w-48">
                  <img 
                    src={treatment.image || "/placeholder.svg"} 
                    alt={treatment.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <p className="mt-4 font-medium text-center">{treatment.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <LogoLoop

        logos={imageLogos}

        speed={120}

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
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Building trust and clarity in healthcare</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Our commitment', desc: 'We deliver a home to real ethical professionals. All professionals boast on our platform are verified and trusted by patients.' },
              { title: 'Insight that matters', desc: 'We ensure that patient reviews are genuine, with verified services with confidence by providing transparent information.' },
              { title: 'Safe & reliable', desc: 'We protect your data and ensure secure medical quality information is secured and protected from abuse, helping them.' },
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-8">
                <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-bold text-lg mb-4">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* For Service Providers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">For Service Providers</h2>
              <p className="text-gray-600 mb-8">Harness medical-grade care with our digital</p>
              <ul className="space-y-4 mb-8">
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Streamline and calibrate your clinical expertise</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Customize, engage, and better understand your</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Access real-time insights to continually enhance your</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Integrate with like-minded healthcare partners</span>
                </li>
              </ul>
              <Button className="bg-black text-white hover:bg-gray-800">
                Learn More
              </Button>
            </div>
            <div className="flex justify-center">
              <img 
                src="/pc-img.png" 
                alt="Healthcare dashboard on laptop" 
                className="max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Ready to Get Started?</h2>
            <p className="text-gray-300">Join over 250+ clinics already growing with Consentz</p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-200">
            BOOK DEMO
          </Button>
        </div>
      </section>

      




      
    </main>
  )
}
