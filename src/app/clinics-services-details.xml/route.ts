import {
  buildUrlSetXml,
  encodeCitySegment,
  encodeSegment,
  mapPathsToSitemapUrls,
  xmlResponse,
} from '@/lib/sitemap'
import { getClinics } from '@/lib/sitemap-data'

export async function GET() {
  const pairs = new Set<string>()

  for (const clinic of getClinics()) {
    if (!clinic.City || !Array.isArray(clinic.Treatments)) continue
    for (const treatment of clinic.Treatments) {
      if (typeof treatment !== 'string' || treatment.trim().length === 0) continue
      pairs.add(`${clinic.City}::${treatment}`)
    }
  }

  const paths = [...pairs].map((pair) => {
    const [city, treatment] = pair.split('::')
    return `/clinics/${encodeCitySegment(city)}/services/${encodeSegment(treatment)}`
  })

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
