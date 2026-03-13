import { buildUrlSetXml, mapPathsToSitemapUrls, xmlResponse } from '@/lib/sitemap'

export async function GET() {
  const xml = buildUrlSetXml(mapPathsToSitemapUrls(['/products/brands']))
  return xmlResponse(xml)
}
