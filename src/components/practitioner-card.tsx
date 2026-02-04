import Link from "next/link";
import { Star, MapPin,  } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Practitioner, Clinic, Product } from "@/lib/types";
import { decodeUnicodeEscapes } from "@/lib/utils";
import ClinicLabels from "./Clinic/clinicLabels";
import { modalities } from "@/lib/data";
import { TreatmentMap } from "@/lib/data";

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
  let practitioner_title_clean = practitioner && "practitioner_title" in (practitioner as Practitioner) ? (practitioner as Practitioner).practitioner_title.split(",").slice(0,2).join(", ").trim() : ""
  if(practitioner_title_clean.length < 10) {
    
    practitioner_title_clean = practitioner_title_clean
  }
  else {
    practitioner_title_clean = practitioner_title_clean.split(",")[0].trim()
  }
  let practitionerName = ""
  if(isPractitioner(practitioner)){
  practitionerName = practitioner.practitioner_name
    ? practitioner.practitioner_name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : practitioner.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }
  else if(isClinic(practitioner)){
    practitionerName = practitioner.slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") 
  } 


  return (
    <>
      {(isPractitioner(practitioner) || isClinic(practitioner)) && (
        

        <article aria-labelledby={`${isPractitioner(practitioner) ? "practitioner" : "clinic"}-name-${practitioner.slug}`}>
          <Link
              href={
                "practitioner_image_link" in practitioner &&
                practitioner.practitioner_name
                  ? `/profile/${
                      practitioner.practitioner_name
                    }`
                  : `/clinics/${practitioner.City}/clinic/${
                      practitioner.slug
                    }`
              }
            prefetch={false}
            >
          <Card className="gap-0 relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
          
          <header>
             <CardHeader className="pb-4 px-2">
            
            <h2 id={`practitioner-name-${practitioner.slug} `} className="sr-only">
              {practitionerName}
            </h2>
            
            <div className="flex items-start gap-4">
              <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                  <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 md:mb-3 mr-0">
                    <img
                      src={
                        practitioner.image.replace("&w=256&q=75", "") ||
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
                    <h3 className="mb-2 md:mb-4 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-md md:text-lg transition-colors text-balance">
                      {practitionerName}
                    </h3>

                    {!("profession" in practitioner) && (
                      <>
                        <ClinicLabels clinic={practitioner} />
                      </>
                    )}

                    {"practitioner_name" in practitioner && (
                      
                        <p className="text-muted-foreground mb-2 text-pretty">
                          {
                            practitioner_title_clean
                            }
                        </p>
                      )}

                    {!("practitioner_name" in practitioner) &&
                      practitioner.category && (
                        <p className="pt-2 mb-2">
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
                            i < practitioner.rating
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
             <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0 flex-shrink-0" aria-hidden="true" />
              <span className="text-pretty">
                {practitioner.gmapsAddress.split(",")[
                  practitioner.gmapsAddress.split(",").length - 2
                ] +
                  ", " +
                  practitioner.gmapsAddress.split(",")[
                    practitioner.gmapsAddress.split(",").length - 1
                  ]}
              </span>
            </div>

            <Link
              href={
                "practitioner_name" in practitioner &&
                practitioner.practitioner_name
                  ? `/profile/${
                      practitioner.practitioner_name
                    }`
                  : `/clinics/${practitioner.City}/clinic/${
                      practitioner.slug
                    }`
                
              }
              className="mt-4 mb-0 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
              prefetch={false}
            >
              Contact
             </Link>

             {practitioner.Treatments?.length! > 0 && null}

             <div>
                <h4 className="sr-only">Treatments offered</h4>
              <ul className="flex flex-wrap gap-1 pt-4" aria-label="Treatments offered">
                {practitioner.Treatments &&
                  practitioner.Treatments.slice(0, 2)
                    .map((modality, index) => (
                      <li key={index}>
                        <Badge variant="outline" className="text-xs">
                          {modality
                            .split(" ") // split into words
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ) // capitalize each
                            .join(" ")}
                        </Badge>
                      </li>
                    ))}
                {practitioner.Treatments &&
                  practitioner.Treatments.length > 2 && (
                    <li>
                      <Badge variant="outline" className="text-xs">
                        +
                        {practitioner.Treatments.length - 2}{" "}
                        more
                      </Badge>
                    </li>
                  )}
              </ul>
            </div>
            </CardContent>


        </Card></Link>
        </article>
      )}
      {isProduct(practitioner) && (
        <Link href={`/products/${practitioner.category}/${practitioner.slug}`} className="block" prefetch={false}>
          <Card className="gap-0 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer" aria-labelledby={`product-name-${practitioner.slug}`}>
            <CardHeader className="pb-2 px-2">
              <h2 id={`product-name-${practitioner.slug}`} className="sr-only">
                {decodeUnicodeEscapes(practitioner.product_name)}
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-4 mr-0">
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
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden md:mb-3 mr-0">
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
