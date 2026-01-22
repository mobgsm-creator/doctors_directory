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
import { ProductGridSkeleton } from "@/components/loading-skeleton";

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

        <ProductGridSkeleton />
      </div>
    </main>
  );
}