import { Clinic } from '@/lib/types'
import clinicsJson from "@/../public/clinics_processed_new_data.json"
import { MetadataRoute } from 'next'
const clinics = clinicsJson as unknown as Clinic[]
  
export default function sitemap(): MetadataRoute.Sitemap {
  const clinics = clinicsJson as unknown as Clinic[]
  return clinics.map((post) => ({
    url: `https://staging.consentz.com/clinics/${post.City}/clinic/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))
}