"use client"
import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import type { SearchFilters} from "@/lib/types"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/app/stores/datastore"
import LogoLoop from './LogoLoop';
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
  
  const [isLoading, setIsLoading] = useState(false)

 


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

      
    </main>
  )
}
