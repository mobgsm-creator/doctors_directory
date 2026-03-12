import { buildUrlSetXml, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const xml = buildUrlSetXml(mapPathsToSitemapUrls(['/practitioners/treatment-by-city']))
  return xmlResponse(xml)
}
