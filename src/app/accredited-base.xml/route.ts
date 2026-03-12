import { buildUrlSetXml, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const xml = buildUrlSetXml(mapPathsToSitemapUrls(['/accredited']))
  return xmlResponse(xml)
}
