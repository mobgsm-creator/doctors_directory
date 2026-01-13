import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileHeader } from "@/components/Product/profile-header";
import { ReviewCard } from "@/components/review-card"
import { decodeUnicodeEscapes } from "@/lib/utils";
import { GoogleMapsEmbed } from "@/components/gmaps-embed";
import { boxplotDatas_clinic } from "@/lib/data";
import { BoxPlotDatum, ItemMeta } from "@/lib/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Stats } from "@/components/visx-donut";
import ClinicDetailsMarkdown from "@/components/Product/ProductDetailsMD";
import { Product } from "@/lib/types";
import fs from "fs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import path from "path";
import PractitionerTabs from "@/components/Product/ProductTabs";
const flattenObject = (obj: any, parentKey = "", result: any = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};
const Section = ({ id, title, children }: any) => (
    <section id={id} className="mt-4 mb-4">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <div className="text-base leading-7">
        {children}
      </div>
    </section>
  );

interface ProfilePageProps {
  params: {
    slug: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "products_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Product[] = JSON.parse(fileContents);
  const { slug } = params;
  
  const clinic = clinics.find((p) => p.slug === slug);
  console.log(JSON.parse(clinic?.composition as string)[0]['component']  , slug)
  const similarProducts = clinics.filter((p) => p.category === clinic?.category && p.slug !== slug);
  

  if (!clinic) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="sticky top-0 z-10">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
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
              <BreadcrumbLink href={`/directory/products/${clinic.category}`} >{`${clinic.category}`}</BreadcrumbLink>
       
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{`${clinic.slug}`}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        </div>

      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        {/* Profile Header */}
        <ProfileHeader clinic={clinic} />

        <div className="px-4 md:px-0">
        
          <PractitionerTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="order-2 lg:order-1 col-span-1 lg:col-span-12">
              <ClinicDetailsMarkdown clinic={clinic} />
            </div>
            
          </div>

         
        
        </div>
      
      </div>
      
    </main>
  );
}

// export async function generateStaticParams() {

//   const filePath = path.join(process.cwd(), 'public', 'derms_processed.json');
//   const fileContents = fs.readFileSync(filePath, 'utf-8');
//   const clinics: Practitioner[] = JSON.parse(fileContents);
//   return clinics.map((clinic) => ({
//     slug: clinic.practitioner_name,
//   }));
// }

export async function generateMetadata({ params }: ProfilePageProps) {
  const filePath = path.join(process.cwd(), "public", "products_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Product[] = JSON.parse(fileContents);
  const clinic = clinics.find((p) => p.slug === params.slug);

  if (!clinic) {
    return {
      title: "Practitioner Not Found",
    };
  }

  const clinicName = clinic.slug;

  return {
    title: `${clinicName} - Healthcare Directory`,
    description: `View ${clinicName}, a product of ${clinic.brand} in the ${clinic.product_category} segment.}`,
    openGraph: {
      title: `${clinicName} - Consentz`,
      description: `View ${clinicName}, a product of ${clinic.brand} in the ${clinic.product_category} segment.`,
      images: [
        {
          url: clinic.image_url || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${clinicName} profile picture`,
        },
      ],
    },
  };
}
