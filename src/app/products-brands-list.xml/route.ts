import productsJson from '@/../public/products_processed_new.json'
import { Product } from '@/lib/types'
import {
  buildUrlSetXml,
  encodeSegmentForRouteParam,
  mapPathsToSitemapUrls,
  uniqueStrings,
  xmlResponse,
} from '@/lib/sitemap'

export async function GET() {
  const products = productsJson as unknown as Product[]
  const brands = uniqueStrings(products.map((product) => product.brand))
  const paths = brands.map(
    (brand) => `/products/brands/${encodeSegmentForRouteParam(brand)}`
  )

  const xml = buildUrlSetXml(mapPathsToSitemapUrls(paths))
  return xmlResponse(xml)
}
