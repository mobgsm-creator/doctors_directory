import productsJson from '@/../public/products_processed_new.json'
import {
  buildUrlSetXml,
  encodeSegment,
  mapPathsToSitemapUrls,
  xmlResponse,
} from '@/lib/sitemap'
import { Product } from '@/lib/types'

export async function GET() {
  const products = productsJson as unknown as Product[]

  const paths = products
    .filter((product) => Boolean(product.slug) && Boolean(product.category))
    .map(
      (product) =>
        `/products/category/${encodeSegment(product.category)}/${encodeSegment(product.slug)}`
    )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
