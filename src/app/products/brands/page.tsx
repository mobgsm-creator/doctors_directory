import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin } from "lucide-react";
import clinicsJson from "@/../public/clinics_processed_new.json";
import fs from "fs";
import path from "path";
import { brands } from "@/lib/data";
import { decodeUnicodeEscapes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export default async function ProfilePage() {
  const filePath = path.join(process.cwd(), "public", "products_processed_new.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Product[] = JSON.parse(fileContents);
 


  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
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
              <BreadcrumbLink href={`/products/brands`}>Brands</BreadcrumbLink>
            </BreadcrumbItem>
      
            
          </BreadcrumbList>
        </Breadcrumb>
        </div>

      </div>

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        {/* Profile Header */}
        
      <h3 className="text-lg font-semibold text-foreground mb-2">Top Brands</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand, index) => {
            const itemDetail = clinics.find((clinic) => clinic.brand === brand)
            return (
            <div key={brand} style={{ animationDelay: `${index * 50}ms` }}>
              <Link href={`/products/brands/${brand}`} className="block">
          <Card className="gap-0 w-100 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer" aria-labelledby={`brand-${brand}`}>
            <CardHeader className="pb-2 px-2">
              <h2 id={`brand-${brand}`} className='text-center'>
                {brand}
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-4 mr-0">
                      <img
                        src={
                          itemDetail?.image_url?.replaceAll('"', "") ||
                          "/placeholder.svg"
                        }
                        alt="Product"
                        className="object-cover rounded-lg min-w-full min-h-full"
                      />
                    </div>

                    
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-0 md:px-4 space-y-4">
              <div className="flex md:items-center md:justify-center gap-2 text-[11px] text-gray-600">
                <span className="text-pretty text-center">
                  {(itemDetail as Product)?.category.trim()}
                </span>
              </div>
              
            </CardContent>
          </Card>
        </Link>
            </div>
          )})}
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

// export async function generateMetadata() {
//   const filePath = path.join(process.cwd(), "public", "products_processed_new.json");
//   const fileContents = fs.readFileSync(filePath, "utf-8");
//   const clinics: Product[] = JSON.parse(fileContents);





//   return {
//     title: `${category} - Healthcare Directory`,
//     description: `View the best prices in the ${category} segment.}`,
//     openGraph: {
//       title: `${category} - Consentz`,
//       description: `View the best prices in the ${category} segment.`,
//       images: [
//         {
//           url: similarProducts[0]?.image_url || "/og-image.png",
//           width: 1200,
//           height: 630,
//           alt: `${category} profile picture`,
//         },
//       ],
//     },
//   };
// }
