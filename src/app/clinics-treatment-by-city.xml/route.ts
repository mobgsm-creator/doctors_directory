import { buildUrlSetXml, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const xml = buildUrlSetXml(mapPathsToSitemapUrls(['/clinics/treatment-by-city']))
  return xmlResponse(xml)
}
