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
import ClinicTabs from "@/components/Clinic/clinicTabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ProfileHeaderSkeleton, 
  ContentSectionsSkeleton, 
  SidebarSkeleton, 
  ReviewsSkeleton 
} from "@/components/loading-skeleton";

export default async function Loading({ params }: { params: { cityslug: string; slug: string } }) {

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/" prefetch={false}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 hover:cursor-pointer"
            >
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
                <BreadcrumbLink href="/clinics">Clinics</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        <ProfileHeaderSkeleton />

        <div className="px-4 md:px-0">
          <ClinicTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
            <ContentSectionsSkeleton />
            <SidebarSkeleton />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex flex-col sm:flex-row gap-2">
              <ReviewsSkeleton />
              
              <div className="w-full sm:w-80">
                <Skeleton className="w-full h-80 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
