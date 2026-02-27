import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import {cityMap} from "@/lib/data"
import ItemsGrid from "@/components/collectionGrid"

export default function HomePage() {
  
    return (
        <main className="bg-(--primary-bg-color)">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12 ">
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0 md:pt-0 md:border-0 border-b border-[#C4C4C4]">
          <div className="sticky top-0 z-10">
            <Link href="/" prefetch={false}>
              <Button variant="ghost" size="sm" className="gap-2 hover:cursor-pointer">
                <ArrowLeft className="h-4 w-4" />
                Back to Directory
              </Button>
            </Link>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/directory/clinics">All Clinics</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
        <ItemsGrid items={Object.keys(cityMap)}/>
        </div>
        </main>
    )
}