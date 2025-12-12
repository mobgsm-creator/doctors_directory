'use server'
import { cache } from "react";
import { Clinic, Practitioner, Product, SearchFilters } from "@/lib/types"
import clinicsJson from "../../../public/clinics_processed.json";
import practitionersJson from "../../../public/derms_processed.json";
import productsJson from "../../../public/products_processed.json";


export const loadData = cache(() => {

  const clinics = clinicsJson as unknown as Clinic[];
  const practitioners = practitionersJson as unknown as Practitioner[];
  const products = productsJson as unknown as Product[];


  return { clinics, practitioners, products };
});




const ITEMS_PER_PAGE = 9

export async function searchPractitioners(
  filters: SearchFilters,
  page: number = 1,
  sortBy: string = "default"
) {

  const { clinics, practitioners, products } = await loadData();


  
  const start = performance.now();
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
        practitioner.practitioner_name,
        practitioner.practitioner_qualifications,
        practitioner.category,
        practitioner.gmapsAddress,
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
      const practitionerServices = practitioner.reviewAnalysis?.procedures_offered?.categories || []
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

  const filteredProducts = products.filter((product: Product) => {
    if (filters.query) {
      const query = filters.query.toLowerCase()
      const searchableText = [
        product.product_name,
        product.product_category,
        product.brand,
        product.manufacturer,
      ].join(" ").toLowerCase()
      if (!searchableText.includes(query)) return false
    }

    return true
  })

  const filtered = filters.type === "Clinic" ? filteredClinics : filters.type === "Product" ? filteredProducts : filteredPractitioners

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
  const end = performance.now();
  console.log(end-start)
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