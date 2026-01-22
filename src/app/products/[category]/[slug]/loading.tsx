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
import PractitionerTabs from "@/components/Product/ProductTabs";
import { ProfileHeaderSkeleton } from "@/components/loading-skeleton";

export default async function Loading({ params }: { params: { category: string; slug: string } }) {
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
                <BreadcrumbLink href="/directory">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/directory/products">Products</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-4 w-24" />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-4 w-32" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <ProfileHeaderSkeleton />

        <div className="px-4 md:px-0">
          <PractitionerTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="order-2 lg:order-1 col-span-1 lg:col-span-12 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-36" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-44" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="h-6 w-6 rounded-full flex-shrink-0 mt-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-28" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="border rounded-lg p-4 text-center space-y-2">
                      <Skeleton className="h-5 w-24 mx-auto" />
                      <Skeleton className="h-6 w-16 mx-auto" />
                      <Skeleton className="h-4 w-20 mx-auto" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0 space-y-6">
          <Skeleton className="h-5 w-56" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-20 w-20 rounded-lg mx-auto" />
                <Skeleton className="h-5 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
                <div className="flex justify-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 3 }, (_, j) => (
                    <Skeleton key={j} className="h-5 w-12 rounded-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}