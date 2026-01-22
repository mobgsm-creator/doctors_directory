'use server'
import { cache } from "react";
import { Clinic, Practitioner, Product, SearchFilters } from "@/lib/types"
import clinicsJson from "../../../public/clinics_processed_new.json";
import practitionersJson from "../../../public/derms_processed_new.json";
import productsJson from "../../../public/products_processed_new.json";
import { modalities } from "@/lib/data";

export const loadClinics = cache(() => {
  const clinicsData = clinicsJson as unknown as Clinic[];
  return clinicsData.map((clinic): Pick<Clinic, "slug" | "City" | "image" | "category" | "gmapsAddress" | "Treatments" | "rating" | "reviewCount" | "isCQC" | "isHIW" | "isJCCP" | "isDoctor" | "isHIS" | "isRQIA" | "isSaveFace"> => ({
    slug: clinic.slug,
    image: clinic.image,
    category: clinic.category,
    gmapsAddress: clinic.gmapsAddress,
    Treatments: clinic.Treatments,
    rating: clinic.rating,
    reviewCount: clinic.reviewCount,
    isCQC: clinic.isCQC,
    isHIW: clinic.isHIW,
    isHIS: clinic.isHIS,
    isJCCP: clinic.isJCCP,
    isDoctor: clinic.isDoctor,
    isSaveFace: clinic.isSaveFace,
    isRQIA: clinic.isRQIA,
    City: clinic.City,
  }));
});

export const loadPractitioners = cache(() => {
  const practitionersData = practitionersJson as unknown as Practitioner[];
  return practitionersData.map((practitioner): Pick<Practitioner, "slug" | "City" | "image" | "category" | "gmapsAddress" | "Treatments" | "rating" | "reviewCount" | "isCQC" | "isHIW" | "isJCCP" | "isDoctor" | "isHIS" | "isRQIA" | "isSaveFace" | "practitioner_name" | "practitioner_title" | "practitioner_qualifications"> => ({
    slug: practitioner.slug,
    image: practitioner.image,
    category: practitioner.category,
    gmapsAddress: practitioner.gmapsAddress,
    Treatments: practitioner.Treatments,
    rating: practitioner.rating,
    reviewCount: practitioner.reviewCount,
    isCQC: practitioner.isCQC,
    isHIW: practitioner.isHIW,
    isHIS: practitioner.isHIS,
    isJCCP: practitioner.isJCCP,
    isDoctor: practitioner.isDoctor,
    isSaveFace: practitioner.isSaveFace,
    isRQIA: practitioner.isRQIA,
    City: practitioner.City,
    practitioner_name: practitioner.practitioner_name,
    practitioner_title: practitioner.practitioner_title,
    practitioner_qualifications: practitioner.practitioner_qualifications,
  }));
});

export const loadProducts = cache(() => {
  const productsData = productsJson as unknown as Product[];
  return productsData.map((product): Pick<Product, "category" | "product_name" | "brand" | "manufacturer" | "distributor_cleaned" | "image_url" | "slug"> => ({
    product_name: product.product_name,
    brand: product.brand,
    manufacturer: product.manufacturer,
    distributor_cleaned: product.distributor_cleaned,
    category: product.category,
    image_url: product.image_url,
    slug: product.slug,
  }));
});

export const loadTreatments = cache((): string[] => {
  return Array.isArray(modalities) ? modalities : [];
});

export const loadData = cache((type?: string) => {
  if (type) {
    switch (type) {
      case "Clinic":
        return { 
          clinics: loadClinics(), 
          practitioners: [] as ReturnType<typeof loadPractitioners>, 
          products: [] as ReturnType<typeof loadProducts>, 
          treatments: [] as string[]
        };
      case "Product":
        return { 
          clinics: [] as ReturnType<typeof loadClinics>, 
          practitioners: [] as ReturnType<typeof loadPractitioners>, 
          products: loadProducts(), 
          treatments: [] as string[]
        };
      case "Treatments":
        return { 
          clinics: [] as ReturnType<typeof loadClinics>, 
          practitioners: [] as ReturnType<typeof loadPractitioners>, 
          products: [] as ReturnType<typeof loadProducts>, 
          treatments: loadTreatments() 
        };
      default:
        return { 
          clinics: [] as ReturnType<typeof loadClinics>, 
          practitioners: loadPractitioners(), 
          products: [] as ReturnType<typeof loadProducts>, 
          treatments: [] as string[]
        };
    }
  }
  
  return { 
    clinics: loadClinics(), 
    practitioners: loadPractitioners(), 
    products: loadProducts(), 
    treatments: loadTreatments() 
  };
});




const ITEMS_PER_PAGE = 9

export async function searchPractitioners(
  filters: SearchFilters,
  page: number = 1,
  sortBy: string = "default"
) {
  const { clinics, practitioners, products, treatments } = await loadData(filters.type);

  const start = performance.now();
  
  let filtered: any[] = []
  
  if (filters.type === "Clinic") {
    filtered = (await clinics).filter((clinic) => {
      if (filters.query) {
        const queryWords = filters.query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
        const searchableText = [
          clinic.slug,
          clinic.category,
          clinic.gmapsAddress,
          ...(clinic.Treatments || []),
        ].join(" ").toLowerCase()
        const hasAllWords = queryWords.every(word => searchableText.includes(word))
        if (!hasAllWords) return false
      }

      if (filters.category && filters.category !== "All Categories") {
        if (clinic.category !== filters.category) return false
      }

      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (!clinic.gmapsAddress.toLowerCase().includes(location)) return false
      }

      if (filters.services.length > 0) {
        const practitionerServices = clinic.Treatments || []
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
  } else if (filters.type === "Product") {
    filtered = (await products).filter((product) => {
      if (filters.query) {
        const queryWords = filters.query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
        const searchableText = [
          product.product_name,
          product.category,
          product.brand,
          product.manufacturer,
        ].join(" ").toLowerCase()
        const hasAllWords = queryWords.every(word => searchableText.includes(word))
        if (!hasAllWords) return false
      }

      if (filters.category && filters.category !== "All Categories") {
        if (product.brand !== filters.category) return false
      }

      if (filters.location) {
        if (product.distributor_cleaned !== filters.location) return false
      }

      if (filters.services.length > 0) {
        const hasMatchingService = filters.services.some((service) =>
          product.category.toLowerCase().includes(service.toLowerCase())
        )
        if (!hasMatchingService) return false
      }

      return true
    })
  } else if (filters.type === "Treatments") {
    filtered = (await treatments).filter((treatment: string) => {
      if (filters.query) {
        const queryWords = filters.query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
        const treatmentText = treatment.toLowerCase()
        const hasAllWords = queryWords.every(word => treatmentText.includes(word))
        if (!hasAllWords) return false
      }

      if (filters.category && filters.category !== "All Categories") {
        const treatmentCategories = {
          "acne": ["Acne", "Rosacea Treatment", "Eczema Treatment", "Psoriasis", "Dermatitis Treatment"],
          "anti-aging": ["Anti Wrinkle Treatment", "Botox", "Fillers", "Chemical Peel", "Microneedling", "Profhilo"],
          "pigmentation": ["Pigmentation Treatment", "Melasma Treatment", "IPL Treatment"],
          "hair-loss": ["Alopecia", "Hair Treatments"],
          "body-contouring": ["CoolSculpting", "Liposuction", "Aqualyx", "Lymphatic Drainage"]
        }
        
        const categoryTreatments = treatmentCategories[filters.category as keyof typeof treatmentCategories] || []
        if (!categoryTreatments.includes(treatment)) return false
      }

      if (filters.services.length > 0) {
        const serviceMapping = {
          "surgical": ["Surgery", "Liposuction", "Breast Augmentation", "Rhinoplasty"],
          "non-surgical": ["Botox", "Fillers", "Chemical Peel", "Microneedling", "HIFU", "CoolSculpting", "Profhilo"],
          "laser": ["Laser Treatments", "IPL Treatment", "Tattoo Removal", "Aviclear"],
          "injectable": ["Botox", "Fillers", "Aqualyx", "B12 Injection", "Profhilo", "Platelet Rich Plasma"],
          "skincare": ["Chemical Peel", "Microneedling", "Facial Treatments", "Obagi"],
          "face": ["Anti Wrinkle Treatment", "Botox", "Fillers", "Chemical Peel", "Cheek Enhancement", "Chin Enhancement", "Lips", "Marionettes", "Tear Trough Treatment"],
          "body": ["CoolSculpting", "Liposuction", "Breast Augmentation", "Aqualyx", "Lymphatic Drainage"],
          "hair": ["Alopecia", "Hair Treatments"],
          "skin": ["Acne", "Pigmentation Treatment", "Melasma Treatment", "Rosacea Treatment", "Eczema Treatment"],
          "lips": ["Lips", "Fillers"]
        }

        const hasMatchingService = filters.services.some((service) => {
          const mappedTreatments = serviceMapping[service as keyof typeof serviceMapping] || []
          return mappedTreatments.some(mappedTreatment => 
            treatment.toLowerCase().includes(mappedTreatment.toLowerCase()) ||
            mappedTreatment.toLowerCase().includes(treatment.toLowerCase())
          ) || treatment.toLowerCase().includes(service.toLowerCase())
        })
        if (!hasMatchingService) return false
      }

      return true
    })
  } else {
    filtered = (await practitioners).filter((practitioner) => {
      if (filters.query) {
        const queryWords = filters.query.toLowerCase().split(/\s+/).filter(word => word.length > 0)
        const searchableText = [
          practitioner.practitioner_name,
          practitioner.practitioner_qualifications,
          practitioner.category,
          practitioner.gmapsAddress,
          ...(practitioner.Treatments || []),
        ].join(" ").toLowerCase()
        const hasAllWords = queryWords.every(word => searchableText.includes(word))
        if (!hasAllWords) return false
      }

      if (filters.category && filters.category !== "All Categories") {
        if (practitioner.category !== filters.category) return false
      }

      if (filters.location) {
        const location = filters.location.toLowerCase()
        if (!practitioner.gmapsAddress.toLowerCase().includes(location)) return false
      }

      if (filters.services.length > 0) {
        const practitionerServices = practitioner.Treatments || []
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
  }

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