import {
  buildUrlSetXml,
  encodeCitySegment,
  mapPathsToSitemapUrls,
  uniqueStrings,
  xmlResponse,
} from '@/lib/sitemap'
import {
  ACCREDITATION_KEYS,
  getClinics,
  hasAccreditationArrayFlag,
} from '@/lib/sitemap-data'

export async function GET() {
  const clinics = getClinics()
  const paths: string[] = []

  for (const accreditation of ACCREDITATION_KEYS) {
    const cities = uniqueStrings(
      clinics
        .filter((clinic) => hasAccreditationArrayFlag(clinic, accreditation))
        .map((clinic) => clinic.City)
    )

    for (const city of cities) {
      paths.push(`/accredited/${accreditation}/clinics/${encodeCitySegment(city)}`)
    }
  }

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
