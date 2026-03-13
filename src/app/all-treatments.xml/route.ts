import { TreatmentMap } from '@/lib/data'
import {
  buildUrlSetXml,
  encodeSegment,
  mapPathsToSitemapUrls,
  xmlResponse,
} from '@/lib/sitemap'

export async function GET() {
  const paths = Object.keys(TreatmentMap).map(
    (name) => `/treatments/${encodeSegment(name)}`
  )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}