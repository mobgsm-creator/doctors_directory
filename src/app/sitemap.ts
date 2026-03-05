import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://staging.consentz.com'
  return [
    {
      url: `${baseUrl}/directory/clinics/all_clinics/sitemap.xml`,
      lastModified: new Date(),
    },
  ]
}
