"use client"
import { useEffect, useState } from "react"
import { HeroSection } from "@/components/hero-section"
import type { SearchFilters} from "@/lib/types"
import { useRouter } from "next/navigation"
import { useSearchStore, useDataStore } from "@/app/stores/datastore"
import LogoLoop from './LogoLoop';
import { SearchBar } from "./search-bar"
const imageLogos = [

  { src: "/HIS.jpg", alt: "HIS", href: "https://www.healthcareimprovementscotland.scot/" },
  { src: "/HIW.jpg", alt: "HIW", href: "https://www.hiw.org.uk" },
  { src: "/jccp.jpg", alt: "JCCP", href: "https://www.jccp.org.uk/" },
  { src: "/qcc.jpg", alt: "CQC", href: "https://cqc.org.uk" },
  { src: "/rqia.jpg", alt: "RQIA", href: "https://www.rqia.org.uk/" },
  { src: "/save-face-partner.jpg", alt: "Save Face", href: "https://www.saveface.co.uk/" },

];
const ITEMS_PER_PAGE = 9





export default function HomePage() {

  const router = useRouter()
  const {filters, setFilters} = useSearchStore()
  const { fetchData,clinics, practitioners } = useDataStore()
  
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    fetchData()
  }, [])


 


  const handleSearch = async (newFilters: SearchFilters) => {
    setIsLoading(true)
    setFilters(newFilters)
    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300))
    router.push("/search")
  }



  return (
    <main>
      <HeroSection onSearch={handleSearch} />
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

      <section className="py-20 bg-gray-50 text-center">
  <h2 className="text-3xl font-bold mb-6">Why Choose Verified Clinics</h2>
  <p className="max-w-2xl mx-auto text-gray-600 mb-10">
    We only list clinics verified by top healthcare regulators like CQC, HIS, and JCCP — ensuring you’re in safe hands.
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
    {[
      { title: "Safety First", desc: "Clinics adhere to strict safety and hygiene standards." },
      { title: "Qualified Practitioners", desc: "All practitioners are vetted and licensed." },
      { title: "Transparent Reviews", desc: "Patient feedback verified from trusted sources." },
    ].map((item) => (
      <div key={item.title} className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition">
        <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

<section className="py-16 bg-blue-50 text-center px-6 md:px-12">
  <h2 className="text-3xl font-bold mb-6 text-blue-900">
    What This Data Means
  </h2>
  <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed mb-10">
    These charts show how people in the community feel about different parts of
    their clinic experience. Each category, like <strong>Trust</strong> or{" "}
    <strong>Communication</strong>, comes from real reviews and feedback shared
    by patients. The taller the bars or wider the boxes, the more people talked
    about it and how strongly they felt.
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        📊 The Scores
      </h3>
      <p className="text-gray-600">
        Every score shows how positive or strong people’s feelings were. Higher
        scores mean more trust, comfort, and happiness with the clinic or
        practitioner.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        💬 The Mentions
      </h3>
      <p className="text-gray-600">
        “Mentions” tell us how many people talked about that topic in their
        reviews. For example, if lots of people mention{" "}
        <strong>Communication</strong>, it means that part really stood out to
        them.
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        🤝 Community Voice
      </h3>
      <p className="text-gray-600">
        This data doesn’t come from one opinion — it comes from many voices
        together. That helps us understand what patients truly value and how
        clinics can keep improving.
      </p>
    </div>
  </div>

  <p className="mt-12 text-gray-700 text-base italic">
    In short: these numbers are a reflection of how people <strong>feel</strong>
    — their trust, comfort, and experiences — shown in a fair and simple way.
  </p>
</section>

<section className="py-20 bg-white text-center px-6 md:px-12">
  <h2 className="text-3xl font-bold mb-6 text-gray-900">
    Explore Procedures & Conditions
  </h2>
  <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed mb-10">
    From simple skin refreshers to advanced rejuvenation — our community of
    clinics and practitioners covers hundreds of trusted, medical-grade
    treatments. Each one is reviewed and performed by trained professionals to
    help you look and feel your best, safely.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto text-left">
    {/* Injectables */}
    <div className="bg-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-blue-800 mb-3">
        💉 Injectables
      </h3>
      <p className="text-gray-700 mb-4">
        Smooth lines, add volume, or balance facial features with treatments
        like Botox, dermal fillers, and skin boosters.
      </p>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Botox / Anti-wrinkle Injections</li>
        <li>• Lip & Cheek Fillers</li>
        <li>• Profhilo & Skin Boosters</li>
        <li>• Non-surgical Rhinoplasty</li>
      </ul>
    </div>

    {/* Skin Rejuvenation */}
    <div className="bg-green-50 rounded-2xl p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-green-800 mb-3">
        🌿 Skin Rejuvenation
      </h3>
      <p className="text-gray-700 mb-4">
        Treatments that refresh your skin’s glow, smoothness, and hydration using
        gentle medical-grade facials, peels, or energy-based devices.
      </p>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Chemical Peels & Facials</li>
        <li>• Microneedling & PRP</li>
        <li>• Morpheus8 / HIFU / Ultherapy</li>
        <li>• Laser & Light Rejuvenation</li>
      </ul>
    </div>

    {/* Body Contouring */}
    <div className="bg-pink-50 rounded-2xl p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-pink-800 mb-3">
        💪 Body Contouring
      </h3>
      <p className="text-gray-700 mb-4">
        Shape and tone your body with safe, non-surgical options like fat
        dissolving injections, CoolSculpting, or radiofrequency tightening.
      </p>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Aqualyx Fat-dissolving</li>
        <li>• CoolSculpting / Emsculpt Neo</li>
        <li>• Vaser Liposuction</li>
        <li>• BodyTite / Endolift</li>
      </ul>
    </div>

    {/* Hair & Scalp */}
    <div className="bg-yellow-50 rounded-2xl p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-yellow-800 mb-3">
        💇 Hair & Scalp Health
      </h3>
      <p className="text-gray-700 mb-4">
        Restore confidence with modern hair regrowth and scalp care therapies,
        performed by experienced clinicians.
      </p>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• PRP / PRF for Hair Loss</li>
        <li>• DHI / FUE Hair Transplants</li>
        <li>• Mesotherapy for Hair</li>
        <li>• Scalp Micropigmentation</li>
      </ul>
    </div>
  </div>

  <p className="mt-12 text-gray-700 text-base italic">
    Whether you’re looking to smooth, lift, rejuvenate, or restore — our verified
    clinics offer safe, science-backed solutions for every skin and confidence
    journey.
  </p>

  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
  >
    Find a Treatment Near You
  </button>
</section>



<section className="py-20 text-center bg-white">
  <h2 className="text-3xl font-bold mb-8">How It Works</h2>
  <div className="flex flex-col sm:flex-row justify-center items-center gap-8 max-w-5xl mx-auto">
    {[
      { step: "1", title: "Search", desc: "Find clinics or practitioners by name or treatment." },
      { step: "2", title: "Compare", desc: "See verified profiles, reviews, and credentials." },
      { step: "3", title: "Book", desc: "Connect safely with trusted professionals." },
    ].map((item) => (
      <div key={item.step} className="p-6 rounded-2xl border w-64 hover:shadow-lg transition">
        <div className="text-4xl font-bold text-blue-600 mb-2">{item.step}</div>
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-gray-600">{item.desc}</p>
      </div>
    ))}
  </div>
</section>

<section className="py-16 bg-blue-600 text-white text-center">
  <h2 className="text-3xl font-bold mb-4">Find Your Verified Clinic Today</h2>
  <p className="mb-6 text-blue-100">Search by treatment, practitioner, or location — it’s fast and safe.</p>
  <button
    onClick={() => router.push("/search")}
    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50"
  >
    Start Searching
  </button>
</section>
<SearchBar onSearch={handleSearch} />



      
    </main>
  )
}
