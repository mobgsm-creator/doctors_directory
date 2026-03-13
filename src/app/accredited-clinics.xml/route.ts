import {
  buildUrlSetXml,
  mapPathsToSitemapUrls,
  xmlResponse,
} from '@/lib/sitemap'
import {
  ACCREDITATION_KEYS,
  getClinics,
  hasAccreditation,
} from '@/lib/sitemap-data'

export async function GET() {
  const clinics = getClinics()
  const paths = ACCREDITATION_KEYS.filter((accreditation) =>
    clinics.some((clinic) => hasAccreditation(clinic, accreditation))
  ).map((accreditation) => `/accredited/${accreditation}/clinics`)

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
