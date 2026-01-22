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
import { 
  TreatmentHeroSkeleton, 
  TreatmentStatsSkeleton, 
  TreatmentContentSkeleton 
} from "@/components/loading-skeleton";

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
          <TreatmentHeroSkeleton />
          <TreatmentStatsSkeleton />

          <div className="space-y-6">
            <div className="flex gap-4 border-b">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-10 w-24" />
              ))}
            </div>

            <TreatmentContentSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}