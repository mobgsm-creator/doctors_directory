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
  function toCloud(words: string[] | undefined, group: string) {
    return (words ?? []).map((w, i, arr) => ({
      text: w,
      group,
      // naive weight by position/length; replace with frequency or embedding strength if available
      weight: Math.max(0.05, Math.min(1, (w.length % 10) / 10 + (arr.length ? i / arr.length : 0) * 0.3)),
    }))
  }
  const clusters = useMemo(() => {
    return [
      { header: "Treatment Modalities", keywords: practitioner.modality ?? [] },
      { header: "Procedures Offered", keywords: reviewAnalysis!.procedures_offered?.categories ?? [] },
      { header: "Patient Experience", keywords: reviewAnalysis!.procedures_offered?.patient_experience ?? [] },
      { header: "Injectables", keywords: reviewAnalysis!.products?.injectables ?? [] },
      { header: "Skin Treatments", keywords: reviewAnalysis!.products?.skin_treatments ?? [] },
      { header: "Product Experience", keywords: reviewAnalysis!.products?.product_experience ?? [] },
      { header: "Treatment Outcomes", keywords: reviewAnalysis!.treatment_outcomes ?? [] },
      { header: "Clinic Environment", keywords: reviewAnalysis!.clinic_environment ?? [] },
      { header: "Patient Loyalty", keywords: reviewAnalysis!.reviewer_demographics?.loyalty_repeat_visits ?? [] },
      { header: "Recommendations", keywords: reviewAnalysis!.referrals_recommendations ?? [] },
      { header: "Professional Attributes", keywords: practitionerData.attributes ?? [] },
      { header: "Interpersonal Skills", keywords: practitionerData.interpersonal_skills ?? [] },
      { header: "Trust Signals", keywords: practitionerData.trust_signals ?? [] },
    ].filter((c) => (c.keywords?.length ?? 0) > 0)
  }, [reviewAnalysis, practitionerData])

  const cloudWords = useMemo(() => clusters.flatMap((c) => toCloud(c.keywords, c.header)), [clusters])


  return (
    <div className="space-y-6">
      {/* Tag Galaxy */}
      <Card>
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
      </Card>
     
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
