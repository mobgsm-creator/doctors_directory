import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion } from "@/components/ui/accordion"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { Practitioner } from "@/lib/types"
import { TagGalaxy } from "@/components/tag-galaxy"
import { useMemo } from "react"
interface ServicesSectionProps {
  practitioner: Practitioner
}

export function ServicesSection({ practitioner }: ServicesSectionProps) {
  const reviewAnalysis = practitioner.reviewAnalysis
  const practitionerData = reviewAnalysis!.practitioners[0]
  // function toCloud(words: string[] | undefined, group: string) {
  //   return (words ?? []).map((w, i, arr) => ({
  //     text: w,
  //     group,
  //     // naive weight by position/length; replace with frequency or embedding strength if available
  //     weight: Math.max(0.05, Math.min(1, (w.length % 10) / 10 + (arr.length ? i / arr.length : 0) * 0.3)),
  //   }))
  // }
  function capitalizeFirstLetter(arr: string[]) {
    return arr.filter(Boolean) // remove falsy or empty values
  .map(str => 
    str
      .toLowerCase()
      .replaceAll('"',"")
      .replace(/\b\w/g, char => char.toUpperCase()) // capitalize first letter of each word
  )
}

  const clusters = useMemo(() => {
    return [
      {
        header: "Treatment Modalities",
        keywords: capitalizeFirstLetter(Array.from(new Set([
          ...(practitioner.modality ?? []),
          ...((reviewAnalysis?.products?.injectables) ?? []),
          ...((reviewAnalysis?.products?.skin_treatments) ?? []),
          ...((reviewAnalysis!.procedures_offered?.categories) ?? [])
        ])))
      },
      { header: "Patient Experience", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(reviewAnalysis!.procedures_offered?.patient_experience ?? []),
        ...((reviewAnalysis?.products?.product_experience) ?? []),
        ...((reviewAnalysis?.treatment_outcomes) ?? []),
      ]))) },
      { header: "Clinic Environment", keywords: capitalizeFirstLetter(reviewAnalysis!.clinic_environment) ?? [] },
      { header: "Recommendations", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(reviewAnalysis!.referrals_recommendations ?? []), 
        ...(reviewAnalysis!.reviewer_demographics?.loyalty_repeat_visits ?? [])
      ])))},
      { header: "Interpersonal Skills", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(practitionerData.interpersonal_skills ?? []),
        ...(practitionerData.attributes ?? []),
        ...(practitionerData.trust_signals ?? [])
      ]))) },
       
      
    ].filter((c) => (c.keywords?.length ?? 0) > 0)
  }, [reviewAnalysis, practitionerData])

  //const cloudWords = useMemo(() => clusters.flatMap((c) => toCloud(c.keywords, c.header)), [clusters])


  return (
    <div className="space-y-6">
      {/* Tag Galaxy */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tag Galaxy</CardTitle>
      
        </CardHeader>
        <CardContent>
          <TagGalaxy
            data={clusters.map((c) => ({ header: c.header, keywords: c.keywords }))}
            className="w-full"
            width={920}
            height={440}
          />
        </CardContent>
      </Card> */}
     
      {/* Expandable sections for scanning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-3">
            {clusters.map((c) => (
              <AccordionItem key={c.header} value={c.header}>
                <AccordionTrigger className="text-left">{c.header}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {c.keywords.slice(0, 60).map((k) => (
                      <Badge key={k} variant="secondary">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      </div>
  )
}
