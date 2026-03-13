import { Clinic } from '@/lib/types'
import clinicsJson from "@/../public/clinics_processed_new_data.json"
import { buildUrlSetXml, encodeCitySegment, encodeSegment, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const clinics = clinicsJson as unknown as Clinic[]

  const paths = clinics
    .filter((clinic) => Boolean(clinic.slug) && Boolean(clinic.City))
    .map(
      (clinic) =>
        `/clinics/${encodeCitySegment(clinic.City)}/clinic/${encodeSegment(clinic.slug as string)}`
    )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
