import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle } from "lucide-react"
import type { Clinic } from "@/lib/types"

interface ServicesSectionProps {
  clinic: Clinic
}

export function ServicesSection({ clinic }: ServicesSectionProps) {
  const reviewAnalysis = clinic.reviewAnalysis

  return (
    <div className="space-y-6">


      {/* Services from Review Analysis */}
      {reviewAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Procedures Offered */}
          {reviewAnalysis.procedures_offered?.categories?.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Popular Procedures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {reviewAnalysis.procedures_offered?.categories?.map((procedure, index) => (
                    <Badge key={index} variant="secondary">
                      {procedure}
                    </Badge>
                  ))}
                </div>
                {reviewAnalysis.procedures_offered.patient_experience.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-2">Patient Experience</h5>
                    <div className="flex flex-wrap gap-1">
                      {reviewAnalysis.procedures_offered.patient_experience.map((experience, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {experience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Products */}
          { reviewAnalysis.products?.skin_treatments && (reviewAnalysis.products?.injectables?.length > 0 || reviewAnalysis.products?.skin_treatments?.length > 0) && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Products & Treatments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewAnalysis.products?.injectables?.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-2">Injectables</h5>
                    <div className="flex flex-wrap gap-1">
                      {reviewAnalysis.products?.injectables?.map((injectable, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {injectable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {reviewAnalysis.products?.skin_treatments?.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-2">Skin Treatments</h5>
                    <div className="flex flex-wrap gap-1">
                      {reviewAnalysis.products?.skin_treatments?.map((treatment, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {treatment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {reviewAnalysis.products?.product_experience?.length > 0 && (
                  <div>
                    <h5 className="font-medium text-sm text-foreground mb-2">Product Experience</h5>
                    <div className="flex flex-wrap gap-1">
                      {reviewAnalysis.products?.product_experience.map((experience, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {experience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
