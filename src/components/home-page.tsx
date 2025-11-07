"use client"
import { useState } from "react"
import { HeroSection } from "@/components/hero-section"
import type { SearchFilters} from "@/lib/types"
import { useRouter } from "next/navigation"
import { useSearchStore } from "@/app/stores/datastore"
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
    <main className="min-h-screen">
      <HeroSection onSearch={handleSearch} />

      
    </main>
  )
}
