import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Header  from "@/components/header"
import { Footer } from "@/components/footer"
import { ScrollToTop } from "@/components/scroll-to-top"
  
import "./globals.css"

export const metadata: Metadata = {
  title: "Healthcare Directory - Find Qualified Practitioners",
  description:
    "Discover qualified healthcare and aesthetic practitioners in your area. Browse profiles, read reviews, and find the right professional for your needs.",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" className="root">
      <body className={`${GeistSans.variable} ${GeistMono.variable} text-textColor font-noto-arabic`}>
      <div className="overflow-hidden">
          <Header />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <ScrollToTop />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
