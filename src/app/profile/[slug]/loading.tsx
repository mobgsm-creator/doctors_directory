import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import PractitionerTabs from "@/components/Practitioner/PractitionerTabs";

export default async function Loading({ params }: { params: { slug: string } }) {
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
        </div>
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <div className="px-4 md:px-0 space-y-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-0">
          <PractitionerTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
            <div className="order-2 lg:order-1 col-span-1 lg:col-span-6 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-28 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-36 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-36" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 col-span-1 lg:col-span-4 space-y-6">
              <div className="border border-gray-300 rounded-xl p-6 space-y-6">
                <div className="flex flex-row gap-2 items-center justify-center">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Skeleton key={i} className="h-4 w-4 rounded-sm" />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="border-t border-gray-300"></div>
                <div className="flex justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-20" />
                <div className="space-y-2">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>

              <div className="w-full aspect-video">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
            <div className="col-span-1 lg:col-span-6 space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Skeleton key={j} className="h-3 w-3 rounded-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}