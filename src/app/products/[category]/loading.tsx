import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default async function Loading({ params }: { params: { category: string } }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/" prefetch={false}>
            <Button variant="ghost" size="sm" className="gap-2 hover:cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
              Back to Directory
            </Button>
          </Link>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-4 w-24" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <div className="px-4 md:px-0">
          <Skeleton className="h-7 w-48 mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 9 }, (_, index) => (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <Card className="gap-0 w-100 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
                <CardHeader className="pb-2 px-2">
                  <div className="flex items-start gap-4">
                    <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                      <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                        <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-4 mr-0">
                          <Skeleton className="w-full h-full rounded-lg" />
                        </div>

                        <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full space-y-2">
                          <Skeleton className="h-5 w-20 rounded-full" />

                          <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-0 md:px-4 space-y-4">
                  <div className="flex md:items-center md:justify-center gap-2 text-[11px] text-gray-600">
                    <Skeleton className="h-4 w-24" />
                  </div>

                  <div className="flex flex-wrap md:items-center md:justify-center gap-1">
                    {Array.from({ length: 3 }, (_, i) => (
                      <Skeleton key={i} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}