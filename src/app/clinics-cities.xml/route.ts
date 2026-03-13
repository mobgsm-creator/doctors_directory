import {
  buildUrlSetXml,
  encodeCitySegment,
  mapPathsToSitemapUrls,
  uniqueStrings,
  xmlResponse,
} from '@/lib/sitemap'
import { getClinics } from '@/lib/sitemap-data'

export async function GET() {
  const cities = uniqueStrings(getClinics().map((clinic) => clinic.City))
  const paths = cities.map((city) => `/clinics/${encodeCitySegment(city)}`)

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
