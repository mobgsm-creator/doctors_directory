export interface Clinic {
  slug: string
  image: string
  url: string
  rating: number
  reviewCount: number
  category: string
  gmapsAddress: string
  //gmapsLink: string
  gmapsPhone: string
  gmapsReviews?: Review[]
  reviewAnalysis?: ReviewAnalysis
  weighted_analysis?: WeightedAnalysis
  City: string
  facebook: string
  twitter: string	
  Linkedin: string	
  instagram: string	
  youtube: string	
  website: string	
  email: string	
  isSaveFace: boolean	
  isDoctor: boolean	
  isJCCP: [boolean, string] | null	
  isCQC: [boolean, string] | null	
  isHIW: [boolean, string] | null
  isHIS: [boolean, string] | null	
  isRQIA: [boolean, string] | null	
  about_section: string	
  accreditations: string	
  awards: string
  affiliations: string
  hours: string	
  Practitioners: string	
  Insurace: string	
  Payments: string	
  Fees: string	
  x_twitter: string


}
interface WeightedAnalysis {
  [category: string]: ItemMeta
}
export interface Practitioner {
  slug: string
  image: string
  url: string
  rating: number
  reviewCount: number
  category: string
  gmapsAddress: string
  //gmapsLink: string
  gmapsPhone: string
  gmapsReviews?: Review[]
  reviewAnalysis?: ReviewAnalysis
  weighted_analysis?: WeightedAnalysis
  City: string
  facebook: string
  twitter: string	
  Linkedin: string	
  instagram: string	
  youtube: string	
  website: string	
  email: string	
  isSaveFace: boolean	
  isDoctor: boolean	
  isJCCP: [boolean, string] | null	
  isCQC: [boolean, string] | null	
  isHIW: [boolean, string] | null
  isHIS: [boolean, string] | null	
  isRQIA: [boolean, string] | null	
  about_section: string	
  accreditations: string	
  awards: string
  affiliations: string
  hours: string	
  Practitioners: string	
  Insurace: string	
  Payments: string	
  Fees: string	
  x_twitter: string
  practitioner_image_link: string
  practitioner_roles: string
  practitioner_qualifications: string
  practitioner_awards: string
  practitioner_media: string
  practitioner_experience: string
  practitioner_name:string
  practitioner_title: string	,
  practitioner_specialty:string,	
  practitioner_education:string,	


}
export interface ItemMeta {
  weighted_score: number
  confidence: number
  num_mentions: number
  top_sentence: string[]
}
export interface BoxPlotDatum {
  // Short key for internal reference (matches your stats keys)
  key: string
  // Human-readable label for display (matches your provided display names)
  label: string
  stats: BoxStats
  item: ItemMeta
}
export interface BoxStats {
  min: number
  q1: number
  median: number
  q3: number
  max: number
  mean: number
}
export interface Review {
  reviewer_name: string
  rating: string
  date: string
  review_text?: string
  owner_response: string | null
  text?: string
}
export interface ReviewAnalysis {
  practitioners: Array<{
    name: string
    role_title: string
    attributes: string[]
    trust_signals: string[]
    interpersonal_skills: string[]
    experience_level?: string   // optional
  }>
  procedures_offered: {
    categories: string[]
    patient_experience: string[]
    process_mentions?: string[]       // optional
    special_mentions?: string[]       // optional
  }
  products: {
    injectables: string[]
    skin_treatments?: string[]
    product_experience: string[]
  }
  reviewer_demographics: {
    loyalty_repeat_visits: string[]
  }
  clinic_environment: string[]
  professionalism_safety: string[]
  treatment_outcomes: string[]
  referrals_recommendations: string[]
  owner_response_sentiment?: string[]
  pain_points?: string[]
  treatment_journey?: string[]
  negative_keywords?: string[]
}

export interface SearchFilters {
  type: string
  query: string
  category: string
  location: string
  rating: number
  services: string[]
  
}
