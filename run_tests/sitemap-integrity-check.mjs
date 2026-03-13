#!/usr/bin/env node

const baseUrl = (process.argv[2] || process.env.SITEMAP_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')
const maxFailuresToPrint = 50
const concurrency = Number.parseInt(process.env.SITEMAP_CONCURRENCY || '40', 10)

const extractLocs = (xml) => {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  return matches.map((m) => m[1].trim()).filter(Boolean)
}

const normalizeUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.toString()
  } catch {
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
  }
}

const fetchText = async (url) => {
  const response = await fetch(url, { redirect: 'follow' })
  const text = await response.text()
  return { response, text }
}

const main = async () => {
  const startedAt = Date.now()
  const indexUrl = `${baseUrl}/directory/sitemap.xml`
  console.log(`Checking sitemap index: ${indexUrl}`)

  const { response: indexResponse, text: indexXml } = await fetchText(indexUrl)
  if (!indexResponse.ok) {
    throw new Error(`Failed to fetch sitemap index (${indexResponse.status}) at ${indexUrl}`)
  }

  const sitemapUrls = extractLocs(indexXml).map(normalizeUrl)
  if (sitemapUrls.length === 0) {
    throw new Error('No sitemap <loc> entries found in sitemap index')
  }

  console.log(`Found ${sitemapUrls.length} sitemap files`)

  const pageUrls = []
  for (const sitemapUrl of sitemapUrls) {
    const { response, text } = await fetchText(sitemapUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap file (${response.status}) at ${sitemapUrl}`)
    }

    const locs = extractLocs(text)
      .map(normalizeUrl)
      .filter((loc) => !loc.endsWith('.xml'))
    pageUrls.push(...locs)
  }

  const uniquePageUrls = [...new Set(pageUrls)]
  console.log(`Checking ${uniquePageUrls.length} unique page URLs for non-404 status`)

  const failures = []
  let checked = 0
  let nextIndex = 0

  const worker = async () => {
    while (true) {
      const currentIndex = nextIndex
      nextIndex += 1
      if (currentIndex >= uniquePageUrls.length) return

      const url = uniquePageUrls[currentIndex]

      try {
        const response = await fetch(url, { redirect: 'follow' })
        if (response.status >= 400) {
          failures.push({ url, status: response.status })
        }
      } catch (error) {
        failures.push({ url, status: 'network-error', message: String(error) })
      }

      checked += 1
      if (checked % 1000 === 0) {
        console.log(`Progress: ${checked}/${uniquePageUrls.length}`)
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.max(1, concurrency) }, () => worker())
  )

  const elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1)

  if (failures.length > 0) {
    console.error(`\nSitemap integrity failed: ${failures.length} URL(s) returned >= 400`) 
    for (const failure of failures.slice(0, maxFailuresToPrint)) {
      const details = failure.message ? ` (${failure.message})` : ''
      console.error(`- [${failure.status}] ${failure.url}${details}`)
    }
    if (failures.length > maxFailuresToPrint) {
      console.error(`...and ${failures.length - maxFailuresToPrint} more`) 
    }
    console.error(`Completed in ${elapsedSec}s`)
    process.exit(1)
  }

  console.log(`Sitemap integrity passed: ${uniquePageUrls.length} URL(s) checked in ${elapsedSec}s`)
}

try {
  await main()
} catch (error) {
  console.error(error)
  process.exit(1)
}
