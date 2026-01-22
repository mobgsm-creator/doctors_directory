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

export default async function Loading({ params }: { params: { slug: string } }) {
  return (
    <main className="bg-[var(--primary-bg-color)]">
      <div className="bg-white">
        <div className="bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto max-w-7xl px-4 py-4">
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
                  <BreadcrumbLink href="/directory/treatments">
                    Treatments
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Skeleton className="h-4 w-20" />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Skeleton className="h-4 w-32" />
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-12 space-y-8">
          <div className="text-center space-y-6">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
            
            <div className="flex justify-center">
              <Skeleton className="h-64 w-96 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="text-center space-y-2">
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                
                <div className="space-y-4">
                  <Skeleton className="h-6 w-36" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-6 w-52" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-1" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="border rounded-lg p-6 space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="px-4 md:px-0 space-y-6 mt-8">
            <Skeleton className="h-5 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}