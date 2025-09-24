export interface Practitioner {
  id: string
  slug: string
  image: string
  profession: string
  regulatoryBody: string
  registrationPin: string
  qualification: string
  modality: string[][]
  memberSince: string
  otherMemberships: string
  restrictions: string
  url: string
  rating: number
  reviewCount: number
  category: string
  gmapsAddress: string
  gmapsLink: string
  gmapsPhone: string
  gmapsReviews: Review[]
  reviewAnalysis: ReviewAnalysis
}

export interface Review {
  reviewer_name: string
  rating: string
  date: string
  review_text: string
  owner_response: string | null
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
}

export interface SearchFilters {
  query: string
  category: string
  location: string
  rating: number
  services: string[]
}
