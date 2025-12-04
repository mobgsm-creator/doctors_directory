import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";

import "./globals.css";
export const metadata: Metadata = {
  title: "Aesthetic Directory - List Your Clinic & Grow Your Practice",
  description:
    "Join the premier Aesthetic Directory. Increase your visibility, showcase your treatments, and connect with high-quality leads looking for aesthetic services.",

  robots: {
    index: true,
    follow: true,
    nocache: false,
    "max-snippet": -1,
    "max-video-preview": -1,
    "max-image-preview": "large",
  },

  alternates: {
    canonical: "https://staging.consentz.com/directory",
  },
};
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="root">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-base`}
        
      >
        <div className="overflow-hidden">
          <Header />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <ScrollToTop />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
