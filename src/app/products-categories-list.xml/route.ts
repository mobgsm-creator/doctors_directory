import productsJson from '@/../public/products_processed_new.json'
import {
  buildUrlSetXml,
  encodeSegment,
  mapPathsToSitemapUrls,
  uniqueStrings,
  xmlResponse,
} from '@/lib/sitemap'
import { Product } from '@/lib/types'

export async function GET() {
  const products = productsJson as unknown as Product[]
  const categories = uniqueStrings(products.map((product) => product.category))
  const paths = categories.map(
    (category) => `/products/category/${encodeSegment(category)}`
  )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
