import { City } from "@/lib/types"
import { fixMojibake, decodeUnicodeEscapes } from "@/lib/utils"
type PageProps = {cityData: City, treatment: Record<string, any>, slug: string}

function cleanText(text: string) {
  return decodeUnicodeEscapes(fixMojibake(fixMojibake(fixMojibake(text.trim()))))
}
function deepClean<T>(obj: T): T {
  if (typeof obj === "string") {
    return cleanText(obj) as T
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClean(item)) as T
  }

  if (typeof obj === "object" && obj !== null) {
    const result: any = {}
    for (const key in obj) {
      result[key] = deepClean(obj[key])
    }
    return result
  }

  return obj
}
export function CityTreatmentPage({ cityData, treatment, slug }: PageProps) {
    const TreatmentArray = Object.entries(deepClean(treatment))
    return (
        <>
  {/* ================= HERO ================= */}
    <div className='text-muted-foreground bg-white p-4 rounded'> 
  <section className="hero">
    <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">{slug} Treatment in {cityData.City}</h1>
    <p>
      Evidence-based care in a {cityData.city_overview_lifestyle_characteristics} setting.
    </p>
    <p>
      Population: {cityData.city_overview_population_estimate}
    </p>
    <p>
      Local aesthetic market: {cityData.beauty_spend_indicators_market_maturity_level}
    </p>
  </section>

  {/* ================= OVERVIEW ================= */}

  <section id="overview">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Facilities in {cityData.City}</h1>

    <p>{TreatmentArray[0][1]}</p>

    <p>
      Medical infrastructure includes:{" "}
      {cityData.city_overview_medical_infrastructure_presence}.
    </p>

    <p>
      The town currently has {cityData.market_size_indicators_number_of_clinics} clinic(s),
      with approximately {cityData.market_size_indicators_review_volume_total} reviews and
      an average rating of {cityData.market_size_indicators_average_rating_citywide}.
    </p>
  </section>

  {/* ================= GOALS ================= */}

  <section id="treatment-goals">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Goals of {slug} Treatment</h1>

    <ul className="list-disc list-inside">
      {TreatmentArray[1][1].map((goal: string, index:number) => (
        <li className="text-sm leading-relaxed" key={index}>{goal}</li>
      ))}
    </ul>

    <p>
      Regulated independent healthcare services in Wales are overseen by{" "}
      {cityData.regulatory_environment_primary_regulator}.
    </p>
  </section>

  {/* ================= TREATMENT OPTIONS ================= */}

  <section id="treatment-options">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">{slug} Treatment Options</h1>

    <p>
      Prescribing requirements:{" "}
      {cityData.regulatory_environment_prescribing_requirements}
    </p>

    <p>
      Inspection framework:{" "}
      {cityData.regulatory_environment_inspection_framework}
    </p>

    <h3><strong>Medical & Non-Surgical Approaches</strong></h3>
    <ul className="list-disc list-inside">
      {TreatmentArray[5][1].map(
        (item:string, index:number) => (
          <li className="text-sm leading-relaxed" key={index}>{item}</li>
        )
      )}
    </ul>

    <h3><strong>Pros of {slug} Treatment</strong></h3>
    <ul className="list-disc list-inside">
      {TreatmentArray[2][1].Pros.map((pro: string, index:number) => (
        <li className="text-sm leading-relaxed" key={index}>{pro}</li>
      ))}
    </ul>

    <h3><strong>Cons of {slug} Treatment</strong></h3>
    <ul className="list-disc list-inside">
      {TreatmentArray[2][1].Cons.map((con: string, index:number) => (
        <li className="text-sm leading-relaxed" key={index}>{con}</li>
      ))}
    </ul>
  </section>

  {/* ================= SEVERITY & REFERRAL ================= */}

  <section id="severity">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Mild vs Severe {slug}</h1>


    <p>{Object.entries(TreatmentArray[10][1]).map(([key, value]) => <p key={key}>{value as string}</p>)}</p>


    <p>
      Referral pathways: {cityData.referral_networks_teaching_hospital_links}
    </p>
  </section>

  {/* ================= COST ================= */}

  <section id="cost">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Cost of {slug} Treatment in {cityData.City}</h1>

    <p>{Object.entries(TreatmentArray[3][1]).map(([key, value]) => <p key={key}>{value as string}</p>)}</p>

    <ul className="list-disc list-inside">
      
      <li className="text-sm leading-relaxed">
        Private insurance usage locally:{" "}
        {cityData.insurance_and_financing_private_insurance_usage}
      </li>
      <li className="text-sm leading-relaxed">
        Cosmetic finance availability:{" "}
        {cityData.insurance_and_financing_cosmetic_finance_availability}
      </li>
    </ul>
  </section>

  {/* ================= ACCESSIBILITY ================= */}

  <section id="accessibility">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Accessibility</h1>

    <ul className="list-disc list-inside">
      <li className="text-sm leading-relaxed">
        Public transport:{" "}
        {cityData.accessibility_factors_public_transport_proximity}
      </li>
      <li className="text-sm leading-relaxed">
        Parking availability:{" "}
        {cityData.accessibility_factors_parking_availability}
      </li>
      <li className="text-sm leading-relaxed">
        Clinic distribution:{" "}
        {cityData.accessibility_factors_city_centre_vs_suburban_distribution}
      </li>
      <li className="text-sm leading-relaxed">
        Airport proximity:{" "}
        {cityData.medical_tourism_potential_airport_proximity}
      </li>
    </ul>
  </section>

  {/* ================= APPOINTMENT PREPARATION ================= */}

  <section id="preparation">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Preparing for Your {slug} Appointment</h1>

    <ul className="list-disc list-inside">
      {TreatmentArray[7][1].map((item: string, index:number) => (
        <li className="text-sm leading-relaxed" key={index}>{item}</li>
      ))}
    </ul>

    <p>{TreatmentArray[11][1]}</p>
  </section>

  {/* ================= SAFETY ================= */}

  <section id="safety">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Treatment Safety & Local Regulations</h1>

    <p>{Object.entries(TreatmentArray[8][1]).map(([key, value]) => <p key={key}>{value as string}</p>)}</p>
 

    <ul className="list-disc list-inside">
      {TreatmentArray[13][1].map(
        (item: string, index:number) => (
          <li className="text-sm leading-relaxed" key={index}>{item}</li>
        )
      )}
    </ul>
      <p>{TreatmentArray[14][1]}</p>
    


    <p>
      Local regulatory authority:{" "}
      {cityData.regulatory_environment_primary_regulator}
    </p>
  </section>



  {/* ================= CANDIDATES ================= */}

  <section id="candidates">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Who Is a Good Candidate?</h1>

    <ul className="list-disc list-inside">
      {TreatmentArray[6][1].map(
        (candidate: string, index:number) => (
          <li className="text-sm leading-relaxed" key={index}>{candidate}</li>
        )
      )}
    </ul>
  </section>

  {/* ================= PRACTITIONER SELECTION ================= */}

  <section id="choosing-clinic">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Choosing a Clinic</h1>

    <ul className="list-disc list-inside">
      {TreatmentArray[15][1].map(
        (qual: string, index:number) => (
          <li className="text-sm leading-relaxed" key={index}>{qual}</li>
        )
      )}

      {TreatmentArray[4][1].map(
        (item: string, index:number) => (
          <li className="text-sm leading-relaxed" key={`look-${index}`}>{item}</li>
        )
      )}
    </ul>

    <p>
      Current average rating citywide:{" "}
      {cityData.market_size_indicators_average_rating_citywide}
    </p>
  </section>

  {/* ================= RECOVERY ================= */}

  <section id="recovery">
     <h1 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2">Recovery & Long-Term Results</h1>

    <p>{TreatmentArray[12][1].Recover}</p>
    <p>{TreatmentArray[12][1].Side_Effects}</p>

    <ul className="list-disc list-inside">
      {TreatmentArray[9].map((item: string, index:number) => (
        <li className="text-sm leading-relaxed" key={index}>{item}</li>
      ))}
    </ul>
  </section></div>
</>
    )
}