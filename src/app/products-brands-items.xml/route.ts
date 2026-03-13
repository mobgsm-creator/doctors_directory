import productsJson from '@/../public/products_processed_new.json'
import {
  buildUrlSetXml,
  encodeSegment,
  encodeSegmentForRouteParam,
  mapPathsToSitemapUrls,
  xmlResponse,
} from '@/lib/sitemap'
import { Product } from '@/lib/types'

export async function GET() {
  const products = productsJson as unknown as Product[]

  const paths = products
    .filter((product) => Boolean(product.slug) && Boolean(product.brand))
    .map(
      (product) =>
        `/products/brands/${encodeSegmentForRouteParam(product.brand as string)}/${encodeSegment(product.slug)}`
    )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
