import { buildUrlSetXml, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const xml = buildUrlSetXml(mapPathsToSitemapUrls(['/treatments']))
  return xmlResponse(xml)
}
