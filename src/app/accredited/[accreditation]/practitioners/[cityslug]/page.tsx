import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Clinic, Practitioner } from "@/lib/types"
import fs from "fs"
import path from "path"
import clinicsJson from "@/../public/clinics_processed_new.json";
import { accreditations } from "@/lib/data"

function mapAccreditationToField(accreditation: string): keyof Practitioner {
  const mapping: Record<string, keyof Practitioner> = {
    cqc: 'isCQC',
    jccp: 'isJCCP',
    hiw: 'isHIW',
    his: 'isHIS',
    rqia: 'isRQIA',
    saveface: 'isSaveFace',
  }
  const field = mapping[accreditation.toLowerCase()]
  if (!field) throw new Error(`Invalid accreditation: ${accreditation}`)
  return field
}

function getAccreditationName(accreditation: string): string {
  const mapping: Record<string, string> = {
    cqc: 'Care Quality Commission (CQC)',
    jccp: 'Joint Council for Cosmetic Practitioners (JCCP)',
    hiw: 'Health Inspectorate Wales (HIW)',
    his: 'Healthcare Improvement Scotland (HIS)',
    rqia: 'Regulation and Quality Improvement Authority (RQIA)',
    saveface: 'Save Face',
  }
  return mapping[accreditation.toLowerCase()] || accreditation
}

interface AccreditedPractitionersPageProps {
  params: {
    accreditation: string
    cityslug: string
  }
}

export default async function AccreditedPractitionersPage({ params }: Readonly<AccreditedPractitionersPageProps>) {
  const clinicsData = clinicsJson as unknown as Clinic[];
  const clinics = clinicsData.filter(c => c.slug !== undefined)
  const clinicIndex = new Map(
    clinics.map(c => [c.slug!, c])
  )

  const practitionerFilePath = path.join(process.cwd(), "public", "derms_processed_new_5403.json")
  const practitionerFileContents = fs.readFileSync(practitionerFilePath, "utf-8")
  const practitioners: Practitioner[] = JSON.parse(practitionerFileContents)

  const { accreditation, cityslug } = params
  const accreditationField = mapAccreditationToField(accreditation)

  const enrichedPractitioners = practitioners
    .map(p => {
      const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0])
      if (!clinic) return null
      return { ...clinic, ...p }
    })
    .filter(Boolean)

  const filteredPractitioners = enrichedPractitioners.filter(practitioner => {
    if (!practitioner) return false
    const cityMatch = practitioner.City?.toLowerCase() === cityslug.toLowerCase()
    const accreditationValue = practitioner[accreditationField]
    const accreditationMatch = Array.isArray(accreditationValue) && accreditationValue[0] === true
    return cityMatch && accreditationMatch
  })

  if (!filteredPractitioners.length) {
    notFound()
  }

  const accreditationName = getAccreditationName(accreditation)

  return (
    <main className="bg-[var(--primary-bg-color)]">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-7 md:py-12 bg-white md:bg-[var(--primary-bg-color)]">
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
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/practitioners">Practitioners</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/accredited/${accreditation}`}>
                    Accredited {accreditationName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{cityslug}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="flex flex-col pt-2 w-full pb-4 px-4 md:px-0">
          <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">
            Accredited {accreditationName} Practitioners in {cityslug}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 animate-fade-in">
          {filteredPractitioners.map((practitioner, index) => {
            if (!practitioner) return null
            return (
            <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
              <Card className="gap-0 relative px-4 md:px-0 shadow-none group transition-all duration-300 border-b border-t-0 border-[#C4C4C4] md:border-t-[1px] rounded-27 md:border md:border-[var(--alto)] cursor-pointer">
                <CardHeader className="pb-4 px-2">
                  <div className="flex items-start gap-4">
                    <div className="text-center flex-1 min-w-0 items-center flex flex-col">
                      <div className="flex w-full flex-row items-start border-b border-[#C4C4C4] md:border-0 md:flex-col md:items-center">
                        <div className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] flex items-center justify-center overflow-hidden rounded-full bg-gray-300 md:mb-3 mr-0">
                          <img
                            src={practitioner.image.split("?w")[0] || "/placeholder.svg"}
                            alt="Profile"
                            width={240}
                            height={240}
                            className="object-cover rounded-full w-60 h-60"
                          />
                        </div>
                        <div className="flex items-start md:items-center flex-col pl-4 md:pl-0 w-[calc(100%-80px)] md:w-full">
                          <h3 className="mb-2 md:mb-4 flex text-left md:text-center md:align-items-center md:justify-center font-semibold text-md md:text-lg transition-colors text-balance">
                            {practitioner.practitioner_name!
                              .split("-")
                              .map((word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </h3>

                          <div className="flex justify-center flex-wrap items-center gap-2">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-300 text-xs">
                              {practitioner.practitioner_title}
                            </span>
                          </div>

                          <p className="pt-2 mb-2 text-pretty">Specialties</p>
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 pt-3 items-center text-sm">
                        <div className="flex items-center gap-1">
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
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-pretty">{practitioner.gmapsAddress}</span>
                  </div>

                  <Link
                    href={`/profile/${practitioner.practitioner_name}`}
                    className="mt-4 mb-0 flex border rounded-lg font-weight px-4 py-2 bg-black align-items-center justify-center text-white hover:bg-white hover:text-black"
                  >
                    View Profile
                  </Link>

                  <div>
                    <div className="flex flex-wrap gap-1 pt-4">
                      {practitioner.Treatments && practitioner.Treatments.slice(0, 3).map((modality, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs text-wrap"
                        >
                          {modality
                            .replaceAll('"', "")
                            .split("-")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </Badge>
                      ))}
                      {practitioner.Treatments && practitioner.Treatments.length! > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +
                          {practitioner.Treatments.length! - 3}{" "}
                          more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )
          }).filter(Boolean)}
        </div>
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: AccreditedPractitionersPageProps) {
  const { accreditation, cityslug } = params
  const accreditationName = getAccreditationName(accreditation)

  return {
    title: `Accredited ${accreditationName} Practitioners in ${cityslug}`,
    description: `Find ${accreditationName} accredited practitioners in ${cityslug}. Compare ratings, reviews, and book appointments with verified healthcare providers.`,
    openGraph: {
      title: `Accredited ${accreditationName} Practitioners in ${cityslug}`,
      description: `Find ${accreditationName} accredited practitioners in ${cityslug}. Compare ratings and reviews.`,
    }
  }
}
