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
import  { PractitionerCard } from "@/components/practitioner-card"
import cityJson from "../../../../public/city_data_processed.json"
import practitionerJson from "../../../../public/derms_processed_new_5403.json"
import { fixMojibake, decodeUnicodeEscapes } from "@/lib/utils"

interface ProfilePageProps {
  params: {
    cityslug: string;
    slug: string;
  };
}

const filePath = path.join(process.cwd(), "public", "clinics_processed_new_data.json");
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const clinics: Clinic[] = JSON.parse(fileContents);
  const practitioners = (practitionerJson as unknown as Practitioner[])
  const clinicIndex = new Map(
  clinics.filter(c=>c.slug !== undefined).map(c => [c.slug!, c])
)
 const all_practitioners: Practitioner[] =
  practitioners.map((p) => {
    const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0]);
    return { ...p, ...clinic };
  });

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

export default async function ProfilePage({ params }: Readonly<ProfilePageProps>) {
  const citySlug = params.cityslug;
  const city_practitioners: Practitioner[] = all_practitioners.filter(p=>p.City === citySlug) 
  const cityClinics: Clinic[] = clinics.filter((p) => p.City === citySlug);
  const cityData: City = (cityJson as unknown as City[]).find((p) => p.City === citySlug)!;
  const uniqueTreatments = [
  ...new Set(
    cityClinics
      .filter(c => Array.isArray(c.Treatments))
      .flatMap(c => c.Treatments)
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
      .flatMap(c => c.Treatments)
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
      <section className="mb-8">
        <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">About {citySlug}</h1>
        <section className="space-y-6 text-muted-foreground">
  {/* Overview Section */}
  <div>


    <div className="mt-2 space-y-2">
      <p>
        <strong><h2>Population:</h2></strong>
      </p>
      <ul className="list-disc list-inside">
        {createBullets(cityData.city_overview_population_estimate)}
      </ul>

      <p>
        <strong><h2>Lifestyle Characteristics:</h2></strong>
      </p>
      <ul className="list-disc list-inside">
        {createBullets(cityData.city_overview_lifestyle_characteristics)}
      </ul>

      <p>
        <strong><h2>Medical Infrastructure:</h2></strong>
      </p>
      <ul className="list-disc list-inside">
        {createBullets(cityData.city_overview_medical_infrastructure_presence)}
      </ul>
    </div>
  </div>

  
</section>
      </section>

      {/* Market Size & Competitive Landscape */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Market Size
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Number of Clinics:</h2></strong>{" "}
            {cityData.market_size_indicators_number_of_clinics}
          </p>
          <p>
            <strong><h2>Total Reviews:</h2></strong>{" "}
            {cityData.market_size_indicators_review_volume_total}
          </p>
          <p>
            <strong><h2>Average Citywide Rating:</h2></strong>{" "}
            {cityData.market_size_indicators_average_rating_citywide}
          </p>
          <p>
            <strong><h2>NHS Presence:</h2></strong>{" "}
            {createBullets(cityData.competitor_landscape_nhs_presence)}
          </p>
          <div className="mt-2 space-y-2">

      <ul className="list-disc list-inside">
        {createBullets(cityData.beauty_spend_indicators_market_maturity_level)}
      </ul>

      <p>
        <strong><h2>Private Market Strength:</h2></strong>
      </p>
      <ul className="list-disc list-inside">
        {createBullets(cityData.market_size_indicators_estimated_private_aesthetic_market_strength)}
      </ul>
    </div>
        </div>
        
        <div>


    
  </div>
      </section>

      {/* Specializations */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Treatments
        </h1>
        <div className="flex flex-wrap gap-1">
          {uniqueTreatments &&
            uniqueTreatments.map(
              (modality, index) => 
                { 
                  const treatments = modality?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                  
                  return (
                  
                <Link key={modality} href={`/treatments/${treatments}`}>
                  <Badge variant="outline" className="text-md bg-gray-100 border-0">
                    {treatments}
                  </Badge>
                </Link> )}
              
            )}
        </div>
      </section>

      {/* Regulatory Environment */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Regulatory & Compliance Environment
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Primary Regulator:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_primary_regulator)}
          </p>
          <p>
            <strong><h2>Prescribing Requirements:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_prescribing_requirements)}
          </p>
          <p>
            <strong><h2>Inspection Framework:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_inspection_framework)}
          </p>
        </div>
      </section>

      {/* Insurance & Financing */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Insurance & Financing
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Private Insurance Usage:</h2></strong>{" "}
            {createBullets(cityData.insurance_and_financing_private_insurance_usage)}
          </p>
          <p>
            <strong><h2>Cosmetic Finance Availability:</h2></strong>{" "}
            {createBullets(cityData.insurance_and_financing_cosmetic_finance_availability)}
          </p>
        </div>
      </section>

      {/* Seasonality & Trends */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Seasonality & Local Trends
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Peak Booking Periods:</h2></strong>{" "}
            {cityData.seasonality_and_local_trends_peak_booking_periods.map((period:string)=><span key={period} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{period}</span>)}
          </p>
          <p>
            <strong><h2>Social Media Trends:</h2></strong>{" "}
            {cityData.social_media_trends_content_trends.map((period:string)=><span key={period} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{period}</span>)}
          </p>
        </div>
      </section>

      {/* Referral Networks */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Referral Networks & Teaching Hospital Links
        </h1>
        <p className='text-muted-foreground'>{createBullets(cityData.referral_networks_teaching_hospital_links)}</p>
      </section>

      {/* Accessibility */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Accessibility & Location Factors
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Public Transport Proximity:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_public_transport_proximity)}
          </p>
          <p>
            <strong><h2>Parking Availability:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_parking_availability)}
          </p>
          <p>
            <strong><h2>City Centre vs Suburban Distribution:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_city_centre_vs_suburban_distribution)}
          </p>
        </div>
      </section>

      {/* Medical Tourism */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Medical Tourism Potential
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Tourism Volume Indicator:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_tourism_volume_indicator)}
          </p>
          <p>
            <strong><h2>Hotel Density Near Clinics:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_hotel_density_near_clinics)}
          </p>
          <p>
            <strong><h2>Airport Proximity:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_airport_proximity)}
          </p>
          <p>
            <strong><h2>Overall Medical Tourism Viability:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_medical_tourism_viability)}
          </p>
        </div>
      </section>
      <h1 className="text-lg md:text-xl font-semibold mb-3"> Aesthetics Pricing in {citySlug}</h1>
      <section className="mb-8">
        {cityClinics[0].Fees && typeof cityClinics[0].Fees === "object" ? (
          <div className="overflow-x-auto shadow-none">
            <table className="w-full text-sm" data-testid='fees'>
              <tbody>
                {Object.entries(cityClinics[0].Fees).map(
                  ([k, v]) =>
                    
                  
                      <tr className='text-muted-foreground' key={k}>
                        <td className="align-top border-0 px-1 py-1 font-medium">{(v as any)?.['treatment']}</td>
                        <td className="align-top border-0 px-1 py-1">
                          {(v as any)?.['price'].split("(")[0]}</td>
                      </tr>
                    )
                }
              </tbody>
            </table>
          </div>
        ) : (
          cityClinics[0].Fees || "Not listed"
        )}</section>
        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">Top Clinics in {citySlug}</h1>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {cityClinics.map((clinic, index) => (
            <PractitionerCard key={clinic.slug} practitioner={clinic} />
          ))}
        </div>
        <div className="px-4 md:px-0 space-y-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Healthcare Providers in ${citySlug}`}</h3>
          <MoreItems items={city_practitioners.length === 0 ? defaultClinics : city_practitioners} />
          <div className={`${uniqueTreatments.length === 0 ? 'block' : 'hidden'}`}>
          <h3 className="text-lg font-semibold text-foreground mb-2">{`Top Specialities in ${citySlug}`}</h3>
          <MoreItems items={uniqueTreatments.length === 0 ? cityData.Unique_Specializations : uniqueTreatments} />
          </div>
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
