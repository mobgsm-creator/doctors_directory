import { Clinic } from '@/lib/types'
import clinicsJson from "@/../public/clinics_processed_new_data.json"
import { NextResponse } from 'next/server'
export async function GET() {
  const clinics = clinicsJson as unknown as Clinic[]

  const urls = clinics
    .map(
      (post) => `
  <url>
    <loc>https://staging.consentz.com/clinics/${post.City}/clinic/${post.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}