'use server'

import { Clinic, Practitioner, SearchFilters } from "@/lib/types"

const ITEMS_PER_PAGE = 9

export async function searchPractitioners(
  filters: SearchFilters,
  page: number = 1,
  sortBy: string = "default"
) {
  // Fetch data on the server
  const response = await fetch("http://128.199.165.212:8765/api/getData", {
    cache: 'no-store' // or use appropriate caching strategy
  });
  const cachedData = await response.json();
  
  const { clinics, practitioners } = cachedData;
  // ---- Derive unique sets ----
  // const categories : string[] = Array.from(
  //   new Set([
  //     ...practitioners.map((c: Practitioner) => c.category).filter(Boolean),
      
  //   ])
  // );
  


  // let modalities : string[] = Array.from(
  //   new Set([
        
  //       ...practitioners.flatMap((p: Practitioner) =>{
  //         return p.modality.map(m => m.toLowerCase())}).filter(Boolean),
  //     ])
  // );
  // modalities =[...new Set(modalities)]
  // .map(item =>
  //   item
  //     .split(" ")                                   // split into words
  //     .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
  //     .join(" ")                                    // join back into a phrase
  // );
  // modalities.slice(800,100).map(item => console.log(item))

  // const professions = Array.from(
  //   new Set([
      
  //       practitioners.map((p: Practitioner) => p.profession).filter(Boolean),
  //     ])
  // );
  // //console.log(professions)
  // const locations: string[] = Array.from(
  //   new Set(
      
  //       practitioners.map((p: Practitioner) => {
  //         const parts = p.gmapsAddress?.split(",");
  //         return parts?.[parts.length - 2].trim().split(" ")[0]
  //       }).filter(Boolean)
  //     )
  // );
  //console.log(locations)

  // Apply filtering logic
  const filteredClinics = clinics.filter((clinic: Clinic) => {
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchableText = [
        clinic.slug,
        clinic.category,
        clinic.gmapsAddress,
        ...(clinic.reviewAnalysis?.procedures_offered?.categories || []),
      ].join(" ").toLowerCase()
      if (!searchableText.includes(query)) return false
    }

    if (filters.category && filters.category !== "All Categories") {
      if (clinic.category !== filters.category) return false
    }

    if (filters.location) {
      const location = filters.location.toLowerCase()
      if (!clinic.gmapsAddress.toLowerCase().includes(location)) return false
    }

    if (filters.services.length > 0) {
      const practitionerServices = clinic.reviewAnalysis?.procedures_offered?.categories || []
      const hasMatchingService = filters.services.some((service) =>
        practitionerServices.some((ps) => ps.includes(service.toLowerCase())),
      )
      if (!hasMatchingService) return false
    }

    if (filters.rating > 0) {
      if (clinic.rating < filters.rating) return false
    }

    return true
  })

  const filteredPractitioners = practitioners.filter((practitioner: Practitioner) => {
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchableText = [
        practitioner.Name,
        practitioner.profession,
        practitioner.category,
        practitioner.gmapsAddress,
        ...practitioner.modality.flat(),
        ...(practitioner.reviewAnalysis?.procedures_offered?.categories || []),
      ].join(" ").toLowerCase()
      if (!searchableText.includes(query)) return false
    }

    if (filters.category && filters.category !== "All Categories") {
      if (practitioner.category !== filters.category) return false
    }

    if (filters.location) {
      const location = filters.location.toLowerCase()
      if (!practitioner.gmapsAddress.toLowerCase().includes(location)) return false
    }

    if (filters.services.length > 0) {
      const practitionerServices = practitioner.modality.map((m) => m.toLowerCase())
      const hasMatchingService = filters.services.some((service) =>
        practitionerServices.some((ps) => ps.includes(service.toLowerCase())),
      )
      if (!hasMatchingService) return false
    }

    if (filters.rating > 0) {
      if (practitioner.rating < filters.rating) return false
    }

    return true
  })

  const filtered = filters.type === "Clinic" ? filteredClinics : filteredPractitioners

  // Sort results
  filtered.sort((a: any, b: any) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "reviews":
        return b.reviewCount - a.reviewCount
      default:
        return 0
    }
  })

  // Pagination
  const totalCount = filtered.length
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return {
    data: paginatedData,
    totalCount,
    totalPages,
    currentPage: page
  }
}