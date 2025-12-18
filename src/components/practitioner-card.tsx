import Link from "next/link";
import { Star, MapPin, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Practitioner, Clinic, Product } from "@/lib/types";
import Image from "next/image";
import ClinicLabels from "./Clinic/clinicLabels";
import { modalities } from "@/lib/data";
const TreatmentMap: Record<string, string> = {
  "Acne": "/directory/treatments/acne.webp",
  "Alopecia": "/directory/treatments/alopecia.webp",
  "Anti Wrinkle Treatment": "/directory/treatments/anti wrinkle treatment.webp",
  "Aqualyx": "/directory/treatments/aqualyx.webp",
  "Aviclear": "/directory/treatments/aviclear.webp",
  "B12 Injection": "/directory/treatments/b12.webp",
  "Birthmarks": "/directory/treatments/birthmarks.webp",
  "Botox": "/directory/treatments/botox.webp",
  "Breast Augmentation": "/directory/treatments/breast-augmentation.webp",
  "Cheek Enhancement": "/directory/treatments/cheek-enhancement.webp",
  "Chemical Peel": "/directory/treatments/chemical-peel.webp",
  "Chin Enhancement": "/directory/treatments/chin-enhancement.webp",
  "Aesthetic Skin Consultation": "/directory/treatments/consultation.webp",
  "Contact Dermatitis": "/directory/treatments/contact-dermatitis.webp",
  "CoolSculpting": "/directory/treatments/coolsculpting.webp",
  "Cysts Treatment": "/directory/treatments/cyst-treatment.webp",
  "Dermapen Treatment": "/directory/treatments/dermapen.webp",
  "Dermatitis Treatment": "/directory/treatments/dermatitis-treatment.webp",
  "Dermatology Treatments": "/directory/treatments/dermatology-treatments.webp",
  "Eczema Treatment": "/directory/treatments/exzema-treatment.webp",
  "Eyebrows and Lashes": "/directory/treatments/eyebrow-lashes.webp",
  "Facial Treatments": "/directory/treatments/facial-treatments.webp",
  "Hair Treatments": "/directory/treatments/hair.webp",
  "HIFU": "/directory/treatments/hifu.webp",
  "Hives Treatment": "/directory/treatments/hives.webp",
  "Hyperhidrosis": "/directory/treatments/Hyperhidrosis.webp",
  "Inflammatory Skin Conditions": "/directory/treatments/inflammatory skin conditions.webp",
  "IPL Treatment": "/directory/treatments/ipl-treatments.webp",
  "Keloid Removal": "/directory/treatments/keloid removal.webp",
  "Tattoo Removal": "/directory/treatments/laser-tattoo-removal.webp",
  "Laser Treatments": "/directory/treatments/laser-treatments.webp",
  "Fillers": "/directory/treatments/lip-filler-6485474_640.webp",
  "Liposuction": "/directory/treatments/liposuction illustration.webp",
  "Lips": "/directory/treatments/lips.webp",
  "Lymphatic Drainage": "/directory/treatments/lymphatic-drainage.webp",
  "Marionettes": "/directory/treatments/marionettes.webp",
  "Massage": "/directory/treatments/massage.webp",
  "Melanoma Treatment": "/directory/treatments/melanoma-treatments.webp",
  "Melasma Treatment": "/directory/treatments/melasma.webp",
  "Microneedling": "/directory/treatments/micro-needling.webp",
  "Microblading": "/directory/treatments/microblading.webp",
  "Microneedling with Radiofrequency": "/directory/treatments/microneedling with radiofrequency.webp",
  "Moles": "/directory/treatments/moles.webp",
  "Nails": "/directory/treatments/nail-polish-2112358_640.webp",
  "Obagi": "/directory/treatments/obagi.webp",
  "Patch Testing": "/directory/treatments/patch-testing.webp",
  "Photodynamic Therapy (PDT)": "/directory/treatments/photodynamic therapy.webp",
  "Pigmentation Treatment": "/directory/treatments/pigmentation-treatments.webp",
  "Polynucleotide Treatment": "/directory/treatments/polynucleotide-treatment.webp",
  "Profhilo": "/directory/treatments/profhilo.webp",
  "Platelet Rich Plasma": "/directory/treatments/prp.webp",
  "Psoriasis": "/directory/treatments/psoriasis.webp",
  "Rash Treatment": "/directory/treatments/rash-treatment.webp",
  "Rosacea Treatment": "/directory/treatments/rosacea.webp",
  "Scarring": "/directory/treatments/scarring.webp",
  "Seborrheic Keratosis Treatment": "/directory/treatments/seborrheic keratosis.webp",
  "Seborrhoeic Dermatitis": "/directory/treatments/seborrhoeic dermatitis.webp",
  "Rhinoplasty": "/directory/treatments/side-view-doctor-checking-patient-before-rhinoplasty.webp",
  "Skin Texture and Tightening": "/directory/treatments/skin texture and tightening.webp",
  "Skin Booster": "/directory/treatments/skin-booster.webp",
  "Skin Cancer": "/directory/treatments/skin-cancer.webp",
  "Skin Lesions": "/directory/treatments/skin-lesions.webp",
  "Skin Tags": "/directory/treatments/skin-tags.webp",
  "Tear Trough Treatment": "/directory/treatments/tear-through-treatments.webp",
  "Threading": "/directory/treatments/threading.webp",
  "Varicose Vein Procedure": "/directory/treatments/varicose-vein.webp",
  "Verruca Treatment": "/directory/treatments/verruca treatment.webp",
  "Vitamin Therapy": "/directory/treatments/vitamin-therapy.webp",
  "Vulval Dermatology": "/directory/treatments/vulval-dermatology.webp",
  "Weight Loss": "/directory/treatments/weight-loss.webp"
};
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
  return typeof obj === "object" && obj !== null && "City" in obj;
}

function isProduct(obj: unknown): obj is Product {
  return typeof obj === "object" && obj !== null && "product_name" in obj;
}

export function PractitionerCard({ practitioner }: PractitionerCardProps) {
  let practitionerName = ""
  if(isPractitioner(practitioner)){
  practitionerName = (practitioner as Practitioner).practitioner_name
    ? (practitioner as Practitioner).practitioner_name
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : practitioner.slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
  }


  return (
    <>
      {(isPractitioner(practitioner) || isClinic(practitioner)) && (
        <Card className="gap-0 relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
          <CardHeader className="pb-4 px-2">
            <div className="flex items-start gap-4">
              <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                  <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 md:mb-3 mr-0">
                    <img
                      src={
                        practitioner.image.replace("&w=256&q=75", "") ||
                        "/placeholder.svg"
                      }
                      alt="Profile photo"
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

                    {"practitioner_image_link" in practitioner &&
                      (practitioner as Practitioner).practitioner_name && (
                        <p className="text-muted-foreground mb-2 text-pretty">
                          {(
                            practitioner as Practitioner
                          ).practitioner_title.trim()}
                        </p>
                      )}

                    {!("practitioner_image_link" in practitioner) &&
                      practitioner.category && (
                        <p className="pt-2 mb-2">
                          {practitioner.category.trim()}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex flex-row gap-2 pt-3 items-center justify-start md:justify-center w-full text-sm">
                  <div className="inline-flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
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

          <CardContent className="pt-0 px-0 md:px-4 space-y-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 mt-0 flex-shrink-0" />
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
                "practitioner_image_link" in practitioner &&
                (practitioner as Practitioner).practitioner_name
                  ? `/profile/${
                      (practitioner as Practitioner).practitioner_name
                    }`
                  : `/clinics/${(practitioner as Clinic).City}/clinic/${
                      practitioner.slug
                    }`
              }
              className="mt-4 mb-0 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
            >
              Contact
            </Link>

            {practitioner.Treatments?.length! > 0 && null}

            <div>
              <div className="flex flex-wrap gap-1 pt-4">
                {true &&
                  practitioner.Treatments?.slice(0, 2)
                    .map((modality, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {modality
                          .split(" ") // split into words
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) // capitalize each
                          .join(" ")}
                      </Badge>
                    ))}
                {true &&
                  practitioner.Treatments?.length! > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +
                      {practitioner.Treatments?.length! - 2}{" "}
                      more
                    </Badge>
                  )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {isProduct(practitioner) && (
        <Link href={`/products/${practitioner.slug}`} className="block">
          <Card className="gap-0 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
            <CardHeader className="pb-2 px-2">
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-3 mr-0">
                      <img
                        src={
                          practitioner.image_url?.replaceAll('"', "") ||
                          "/placeholder.svg"
                        }
                        alt="Profile photo"
                        className="object-cover rounded-lg min-w-full min-h-full"
                      />
                    </div>

                    <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full">
                      {practitioner.product_name && (
                        <p className="flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs px-3 py-1 mb-4">
                          {practitioner?.brand?.trim()}
                        </p>
                      )}

                      <h3 className="mb-3 md:mb-0 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-md md:text-lg transition-colors text-balance">
                        {practitioner.product_name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 px-0 md:px-4 space-y-4">
              <div className="flex md:items-center md:justify-center gap-2 text-sm">
                <span className="text-pretty text-center">
                  {practitioner.manufacturer?.trim()}
                </span>
              </div>
              <div>
                <div className="flex flex-wrap md:items-center md:justify-center gap-1 text-center">
                  {true &&
                    practitioner.all_prices.map((value: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {value.price}
                      </Badge>
                    ))}
                  {/* {true &&
              practitioner.reviewAnalysis?.procedures_offered?.categories
                ?.length! > 2 && (
                <Badge variant="outline" className="text-xs">
                  +
                  {practitioner.reviewAnalysis?.procedures_offered?.categories!
                    .length! - 2}{" "}
                  more
                </Badge>
              )} */}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}
      {isTreatment(practitioner) && (
        <Link href={`/treatments/${practitioner}`} className="block">
          <Card className="gap-0 h-full relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
            <CardHeader className="pb-2 px-2">
              <div className="flex items-start gap-4">
                <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                  <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                    <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-lg bg-gray-300 md:mb-3 mr-0">
                      <img
                        src={
                          TreatmentMap[practitioner] ||
                          "/placeholder.svg"
                        }
                        alt="Profile photo"
                        className="object-cover rounded-lg min-w-full min-h-full"
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
