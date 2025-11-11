import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion } from "@/components/ui/accordion"
import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import type { Clinic } from "@/lib/types"
import { useMemo } from "react"
interface ServicesSectionProps {
  clinic: Clinic
}

export function ServicesSection({ clinic }: ServicesSectionProps) {
  const reviewAnalysis = clinic.reviewAnalysis
  const practitionerData = reviewAnalysis!.practitioners[0]
  
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
          ...((reviewAnalysis?.procedures_offered.categories) ?? []),
          ])))
      },
      { header: "Clinic Environment", keywords: capitalizeFirstLetter(reviewAnalysis!.clinic_environment) ?? [] },
      { header: "Recommendations", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(reviewAnalysis?.referrals_recommendations ?? []), 
        
      ])))},
      { header: "Interpersonal Skills", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(reviewAnalysis?.professionalism_safety ?? []),
        
      ]))) },
      { header: "Negative Keywords", keywords: capitalizeFirstLetter(Array.from(new Set([
        ...(reviewAnalysis?.negative_keywords ?? []),
        
      ]))) },
       
      
    ].filter((c) => (c.keywords?.length ?? 0) > 0)
  }, [reviewAnalysis, practitionerData])

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
