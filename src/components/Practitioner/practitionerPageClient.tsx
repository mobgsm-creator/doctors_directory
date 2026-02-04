"use client"

import { useState } from "react"
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/Practitioner/profile-header";
import { GoogleMapsEmbed } from "@/components/gmaps-embed";
import { boxplotDatas_clinic } from "@/lib/data";
import { BoxPlotDatum, ItemMeta } from "@/lib/types";
import { Stats } from "@/components/visx-donut";
import ClinicDetailsMarkdown from "@/components/Practitioner/practitionerDetailsMD";
import { Practitioner } from "@/lib/types";
import fs from "fs";
import path from "path";
import PractitionerTabs from "@/components/Practitioner/PractitionerTabs";
import { flattenObject } from "@/lib/utils";
import ClinicTabsHeader from "@/components/Practitioner/clinicTabsHeader";
import { Section } from "@/components/ui/section";
import {Clinic } from "@/lib/types"
type Props = {
  clinic: Practitioner
  associatedClinics: string[]
  clinicIndex: Map<string, Clinic>
  boxplotData: BoxPlotDatum[]
}
export function PractitionerPageClient({
  clinic,
  associatedClinics,
  clinicIndex,
  boxplotData,
}: Props) {
  const [selectedClinic, setSelectedClinic] =
    useState(associatedClinics[0])

  const k = clinicIndex.get(selectedClinic)
  const hoursObj = k?.hours as unknown as Record<string, any>;
  const hours =
    hoursObj["Typical_hours_listed_in_directories"] ?? k?.hours;
  const flatHours = typeof hoursObj === 'object' ? flattenObject(hours) : hours
  const practitioner = {...k,...clinic}

  return (
    <>
      <ClinicTabsHeader clinic_list ={JSON.parse(clinic!.Associated_Clinics!)} selected={selectedClinic} onSelect={setSelectedClinic} />

      <div className="container mx-auto max-w-6xl pt-0 md:px-4 py-20 space-y-8">
        {/* Profile Header */}
        <ProfileHeader clinic={clinic} k_value={k} />

        <div className="px-4 md:px-0">
          <PractitionerTabs />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-10 mb-4">
            <div className="order-2 lg:order-1 col-span-1 lg:col-span-6">
              <ClinicDetailsMarkdown clinic={practitioner} />
            </div>
            <div className="order-1 lg:order-2 col-span-1 lg:col-span-4">
              <div className="border border-gray-300 rounded-xl p-6">
                <div className="flex flex-row gap-2 pt-2 mb-4 items-center justify-center text-sm">
                  <div className="inline-flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < k!.rating
                              ? "fill-black text-black"
                              : "/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span
                    className="border-l border-black pl-2 underline"
                    aria-label={`${practitioner.reviewCount} reviews`}
                  >
                    {practitioner.gmapsReviews
                      ? practitioner.gmapsReviews.filter(
                          (review : any) => review.rating === "5 stars"
                        ).length
                      : 0}
                    {"+ "} 5 Star Reviews
                  </span>
                </div>
                <div className="border-t border-gray-300 my-6"></div>
                <Stats data={boxplotData} />
              </div>
              {flatHours && (
                <Section title="Hours" id="hours">
                  <div className="overflow-x-auto shadow-none">
                    <table className="w-full align-top text-sm bg-white border-collapse">
                      <tbody>
                        {typeof flatHours === 'object' ? Object.entries(flatHours).map(([day, time]) => (
                          <tr key={day}>
                            <td className="align-top border-0 px-1 py-1 font-medium">
                              {day?.toString()}
                            </td>
                            <td className="align-top border-0 px-1 py-1">
                              {time?.toString()}
                            </td>
                          </tr>
                        )):<tr>Not listed</tr>}
                      </tbody>
                    </table>
                  </div>
                </Section>
              )}
              {/* PAYMENTS */}
              <Section title="Payment Options" id="payments">
                {Array.isArray(practitioner.Payments) ? (
                  <ul className="list-disc ml-6 space-y-1">
                    {practitioner.Payments.map((p: any, idx: number) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                ) : practitioner.Payments && typeof practitioner.Payments === "object" ? (
                  <div className="overflow-x-auto shadow-none">
                    <table className="w-full text-sm bg-white">
                      <tbody>
                        {Object.entries(practitioner.Payments).map(
                          ([k, v]) =>
                            k !== "Source" && (
                              <tr key={k}>
                                <td className="border-0 px-4 py-2 font-medium">
                                  {k?.toString()}
                                </td>
                                <td className="border-0 px-4 py-2">
                                  {v?.toString()}
                                </td>
                              </tr>
                            )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  practitioner.Payments || "Not listed"
                )}
              </Section>
            
            </div>
          </div>
          <div className='flex flex-col sm:flex-row gap-2'>
            
         
              <GoogleMapsEmbed
          url={practitioner.url}
          
          className="w-full h-auto md:h-80"
        />  
        
      </div>

         
        </div>
      </div>
   
    </>
  )
}
