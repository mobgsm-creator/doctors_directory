import { notFound } from "next/navigation";
import Link from "next/link";
import { MoreItems } from "@/components/MoreItems";
import type { Clinic, City,Practitioner } from "@/lib/types";
import fs from "fs";
import path from "path";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react"
import  ItemsGrid  from "@/components/collectionGrid";
import cityJson from "../../../../public/city_data_processed.json"
import practitionerJson from "../../../../public/derms_processed_new_5403.json"
import { fixMojibake, decodeUnicodeEscapes } from "@/lib/utils"
import { CityPageData } from "@/components/cityPageData";
import { cityMap } from "@/lib/data";
interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}

const filePath = path.join(process.cwd(), "public", "clinics_processed_new_data.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
//   const practitioners = (practitionerJson as unknown as Practitioner[])
//   const clinicIndex = new Map(
//   clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
// )
//  const all_practitioners: Practitioner[] =
//   practitioners.map((p) => {
//     const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0]);
//     return { ...p, ...clinic };
//   });

  function createBullets(text:string){
    const spliText = text.split(";")
    if(spliText.length <= 1) {
      return decodeUnicodeEscapes(text)
    }
    else {
      return (
        <div className='mt-2 space-y-2'>
         <ul className="list-disc list-inside pl-6 space-y-1">
          {spliText.map((item, key)=>
          {const clened_item = decodeUnicodeEscapes(fixMojibake(fixMojibake(fixMojibake(item.trim()))));
            return (
          <li className="text-sm leading-relaxed" key={key} > {clened_item.trim().charAt(0).toUpperCase() + clened_item.trim().slice(1)}</li>)})}
  </ul></div>
      )
    }
  }

export default function ProfilePage({ params }: Readonly<ProfilePageProps>) {
  const citySlug = params.cityslug;
  // const city_practitioners: Practitioner[] = all_practitioners.filter(p=>p.City === citySlug) 
  const cityClinics: Clinic[] = clinics.filter((p) => p.City === citySlug);
  const cityData: City = (cityJson as unknown as City[]).find((p) => p.City === citySlug)!;
  const uniqueTreatments = [
  ...new Set(
    cityClinics
      .filter(c => Array.isArray(c.Treatments)).filter(c => c.Treatments !== undefined)
      .flatMap(c => c.Treatments).filter((t): t is string => typeof t === "string")
  )
];
  if (!cityClinics) {
    notFound();
  }
  const defaultClinics: Clinic[] = clinics.filter((p) => p.City === "London");
  const defaultTreatments = [
  ...new Set(
      defaultClinics
      .filter(c => Array.isArray(c.Treatments))
      .flatMap(c => c.Treatments).filter((t): t is string => typeof t === "string")
  )
];



  return (
    <main className="bg-(--primary-bg-color)">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12">
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
                <BreadcrumbItem>
                  <BreadcrumbPage>{citySlug.charAt(0).toUpperCase() + citySlug.slice(1)}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        
        </div>
        {/* City Overview */}
        <CityPageData cityData={cityData} uniqueTreatments={(uniqueTreatments as string[])} cityClinics={cityClinics} citySlug={citySlug} />
        
      
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">Top Clinics in {citySlug}</h1>
          </div>

        <ItemsGrid items={cityClinics} />
        <div className="px-4 md:px-0 space-y-6">

          <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Specialities in ${citySlug}`}</h3>
          <ItemsGrid items={uniqueTreatments.length === 0 ? defaultTreatments : uniqueTreatments} />
          <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Cities in the UK`}</h3>
          <ItemsGrid items={Object.keys(cityMap)}/>


          {/* <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Brands`}</h3>
          <MoreItems items={uniqueTreatments} /> */}
          
        </div>
      </div>
    </main>
  );
}

// export async function generateStaticParams() {
//   const practitioners = await getPractitioners();
//   return practitioners.map((practitioner) => ({
//     slug: practitioner.slug,
//   }))
// }

// export async function generateMetadata({ params }: ProfilePageProps) {
//   const clinics = await getClinics();
//   const clinic = clinics.find((p) => p.slug === params.slug)

//   if (!clinic) {
//     return {
//       title: "Practitioner Not Found",
//     }
//   }

//   const clinicName = clinic.slug

//   return {
//     title: `${clinicName} - Healthcare Directory`,
//     description: `View the profile of ${clinicName}, a qualified ${clinic.category} offering professional healthcare services. Read reviews and book appointments.`,
//   }
// }
