"use client"
import Link from "next/link";
import { Star, MapPin,  } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Practitioner, Clinic, Product } from "@/lib/types";
import { decodeUnicodeEscapes, fixMojibake } from "@/lib/utils";
import ClinicLabels from "./Clinic/clinicLabels";
import { modalities } from "@/lib/data";
import { TreatmentMap } from "@/lib/data";
import { Button } from "./ui/button";
import practitionersJson from "@/../public/derms_processed_new_5403.json";

const practitionersData = practitionersJson as unknown as Practitioner[];
const practitionersIndex = new Map<string, Practitioner[]>();

for (const p of practitionersData) {
  const clinics = JSON.parse(p.Associated_Clinics as string) as string[];

  for (const clinic of clinics) {
    const bucket = practitionersIndex.get(clinic) ?? [];
    bucket.push(p);
    practitionersIndex.set(clinic, bucket);
  }
}

interface PractitionerCardProps {
  practitioner: Practitioner | Clinic | Product | string;
}
function isTreatment(obj:unknown): obj is string{
  return typeof obj === "string" && modalities.includes(obj);
}
function isPractitioner(obj: unknown): obj is Practitioner {

  return typeof obj === "object" && obj !== null && "practitioner_name" in obj;
}

function isClinic(obj: unknown): obj is Clinic {
  return typeof obj === "object" && obj !== null && "isJCCP" in obj;
}

function isProduct(obj: unknown): obj is Product {
  return typeof obj === "object" && obj !== null && "product_name" in obj;
}


export function PractitionerCard({ practitioner }: PractitionerCardProps) {


  let practitionerName = ""
  let practitioners : Practitioner[] = []
  if(isPractitioner(practitioner)){
  practitionerName = practitioner.practitioner_name
    ? practitioner.practitioner_name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : practitioner.slug!
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
  
  else if(isClinic(practitioner)){
    practitionerName = practitioner.slug!.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    practitioners = practitionersIndex.get(practitioner.slug as string) ?? []
  } 
  


  return (
    <>
      {(isPractitioner(practitioner) || isClinic(practitioner)) && (
        

        <article aria-labelledby={`${isPractitioner(practitioner) ? "practitioner" : "clinic"}-name-${practitioner.slug}`}>
          <Link
              href={
                "practitioner_awards" in practitioner &&
                practitioner.practitioner_name
                  ? `/practitioners/${practitioner.City}/profile/${
                      practitioner.practitioner_name
                    }`
                  : `/clinics/${practitioner.City}/clinic/${
                      practitioner.slug
                    }`
              }
            prefetch={false}
            className='z-10'
            >
          <Card className="gap-0 relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t rounded-27 md:border md:border-(--alto) cursor-pointer">
          
          <header>
             <CardHeader className="pb-4 px-2">
            
            <h2 id={`practitioner-name-${practitioner.slug} `} className="sr-only">
              {practitionerName}
            </h2>
            
            <div className="flex items-start gap-4">
              <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                  <div className="w-20 h-20 md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 md:mb-3 mr-0">
                    <img
                      src={
                        practitioner.image!.replace("&w=256&q=75", "") ||
                        "/placeholder.svg"
                      }
                      alt="Profile"
                      className="object-cover rounded-full min-w-full min-h-full"
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src = "/directory/images/doc.png";
                      }}
                    />
                  </div>

                  <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full">
                    <h3 className="text-base font-semibold text-primary flex text-left md:text-center md:align-items-center md:justify-center text-md md:text-xl transition-colors">
                      {practitionerName}
                    </h3>

                    {!("profession" in practitioner) && (
                      <>
                        <ClinicLabels clinic={practitioner as Clinic} />
                      </>
                    )}

                    {"practitioner_name" in practitioner && (
                      
                        <p className="text-muted-foreground mb-2 font-semibold text-balance leading-tight truncate">
                          {
                            practitioner.practitioner_title?.split(",")[0].trim()
                            }
                        </p>
                      )}

                    {!("practitioner_name" in practitioner) &&
                      practitioner.category && (
                        <p className="text-muted-foreground mb-2 font-semibold text-balance leading-tight truncate">
                          {practitioner.category.trim()}
                        </p>
                      )}
                   </div>
                 </div>

                 <h4 className="sr-only">Rating</h4>
                 <div className="flex flex-row gap-2 pt-3 items-center justify-start md:justify-center w-full text-sm" aria-label={`Rating: ${practitioner.rating} out of 5 stars, ${practitioner.reviewCount} reviews`}>
                  <div className="inline-flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className={`h-4 w-4 ${
                            i < practitioner.rating!
                              ? "fill-black text-black"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="border-l border-black pl-2 underline">
                    ({practitioner.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            </CardHeader>
           </header>

           <CardContent className="pt-0 px-0 md:px-4 space-y-4">
             <h4 className="sr-only">Location</h4>
             <div className="flex items-start gap-2 text-sm text-muted-foreground/80">
              <MapPin className="h-4 w-4 mt-0 shrink-0" aria-hidden="true" />
              <span className="leading-snug truncate">
                {practitioner.gmapsAddress!.split(",")[
                  practitioner.gmapsAddress!.split(",").length - 2
                ] +
                  ", " +
                  practitioner.gmapsAddress!.split(",")[
                    practitioner.gmapsAddress!.split(",").length - 1
                  ]}
              </span>
            </div>

            <Button
              
              className="mt-4 mb-0 w-full flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center cursor-pointer justify-center text-white hover:bg-white hover:text-black"
        
            >
              Contact
             </Button>

             {practitioner.Treatments?.length! > 0 && null}

             <div>
                <h4 className="sr-only">Treatments offered</h4>
              <ul className="flex flex-wrap gap-1 pt-4" aria-label="Treatments offered">
                {practitioner.Treatments &&
                  practitioner.Treatments.slice(0, 2)
                    .map((modality, index) => (
                      <li key={index}>
                        <Badge asChild variant="outline" className="text-xs">
                          <a
                            href={`/directory/treatments/${modality}`}
                            onClick={(e) => e.stopPropagation()}
                          >{modality
                            .split(" ") // split into words
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ) // capitalize each
                            .join(" ")}</a>
                          
                        </Badge>
                      </li>
                    ))}
                {practitioner.Treatments &&
                  practitioner.Treatments.length > 2 && (
                    <li>
                      <Badge asChild variant="outline" className="text-xs">
                        <a
                            href={`/directory/treatments`}
                            onClick={(e) => e.stopPropagation()}
                          >
                        +
                        {practitioner.Treatments.length - 2}{" "}
                        more</a>
                      </Badge>
                    </li>
                  )}
              </ul>
            </div>

            <div className="border-t border-gray-300 my-6"></div>
            <div className="w-full overflow-x-auto">
            <div className="flex flex-row gap-4">
              {practitioners.map((p: any, idx: number) => (
                <Card 
                  asChild
                  key={p.practitioner_name+p.practitioner_title}
                  className="min-w-full max-h-30 group relative overflow-hidden rounded-xl border border-border/80 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98] cursor-pointer">
                      <div className="p-6">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/10 to-primary/5 ring-2 ring-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-base font-semibold text-primary">
                            {p.practitioner_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <h3 className="text-xl font-semibold text-balance leading-tight group-hover:text-primary transition-colors truncate">
                             <a
                            href={`/directory/practitioners/${practitioner.City}/profile/${p.practitioner_name}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {p.practitioner_name.split('-').map((word:string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </a></h3>
                          <p className="text-sm font-medium text-secondary-foreground mt-1 truncate">
                            {decodeUnicodeEscapes(fixMojibake(p.Title.split(",")[0]))}
                          </p>
                        </div>
                      </div></div>
                    
    
                  </Card>))}</div></div>
            </CardContent>


        </Card></Link>
        </article>
      )}
      {isProduct(practitioner) && (
        <Link href={`/products/${practitioner.category}/${practitioner.slug}`} className="block" prefetch={false}>
          <Card className="gap-0 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t rounded-27 md:border md:border-(--alto) cursor-pointer" aria-labelledby={`product-name-${practitioner.slug}`}>
            <CardHeader className="pb-2 px-2">
              <h2 id={`product-name-${practitioner.slug}`} className="sr-only">
                {decodeUnicodeEscapes(practitioner.product_name)}
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                    <div className="w-20 h-20 md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-4 mr-0">
                      <img
                        src={
                          practitioner.image_url?.replaceAll('"', "") ||
                          "/placeholder.svg"
                        }
                        alt="Product"
                        className="object-cover rounded-lg min-w-full min-h-full"
                      />
                    </div>

                    <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full">
                      {practitioner.product_name && (
                        <p className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-gray-200 text-[10px] px-3 py-1 mb-2">
                          {decodeUnicodeEscapes(practitioner?.distributor_cleaned.trim())}
                        </p>
                      )}

                      <h3 className="mb-2 md:mb-0 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-xs md:text-md leading-relaxed text-balance line-clamp-2">
                        {decodeUnicodeEscapes(practitioner.product_name)}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-0 md:px-4 space-y-4">
              <div className="flex md:items-center md:justify-center gap-2 text-[11px] text-gray-600">
                <span className="text-pretty text-center">
                  {decodeUnicodeEscapes(practitioner.category.trim())}
                </span>
              </div>
              <div>
                <ul className="flex flex-wrap md:items-center md:justify-center gap-1 text-center" aria-label="Product prices">
                  {practitioner.all_prices &&
                    practitioner.all_prices.map((value: any, index: number) => (
                      <li key={index}>
                        <Badge variant="outline" className="text-[11px] font-normal text-gray-500">
                          {value.price}
                        </Badge>
                      </li>
                    ))}
                 
              
                </ul>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
      {isTreatment(practitioner) && (
        <Link href={`/treatments/${practitioner}`} className="block border-0" prefetch={false}>
          <Card className="gap-0 h-full relative bg-transparent px-4 md:px-0 shadow-none md:border-0 duration-300 cursor-pointer" aria-labelledby={`treatment-name-${practitioner}`}>
            <CardHeader className="px-2 border-0">
              <h2 id={`treatment-name-${practitioner}`} className="sr-only">
                {practitioner}
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-0 md:flex-col md:items-center">
                    <div className="w-20 h-20 md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden md:mb-3 mr-0">
                      <img
                        src={
                          TreatmentMap[practitioner] ||
                          "/placeholder.svg"
                        }
                        alt="Treatment"
                        className="object-cover rounded-full w-full h-full"
                      />
                    </div>

                    <h3 className="mb-3 md:mb-0 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-md md:text-lg transition-colors text-balance">
                      {practitioner}
                    </h3>
                  </div>
                </div>
              </div>
              
            </CardHeader>
          </Card>
        </Link>
      )}
    </>
  );
}
