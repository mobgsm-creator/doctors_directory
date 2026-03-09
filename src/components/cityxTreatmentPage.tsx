import { City } from "@/lib/types"
import { fixMojibake, decodeUnicodeEscapes } from "@/lib/utils"
type PageProps = {cityData: City, treatment: Record<string, any>, slug: string}

function cleanText(text: string) {
  return decodeUnicodeEscapes(fixMojibake(fixMojibake(fixMojibake(text.trim()))))
}
function createBullets(text:string){
  //console.log(text)
    const spliText = text.split(";")
    if(spliText.length <= 1) {
      return decodeUnicodeEscapes(text)
    }
    else {
      return (
        <div className='mt-2 space-y-2'>
         <ul className="list-disc list-inside pl-6 space-y-1">
          {spliText.map((item, key)=>
          {const clened_item = decodeUnicodeEscapes(fixMojibake(fixMojibake(fixMojibake(item.trim()))));
            return (
          <li className="text-sm leading-relaxed pl-6" key={key} > {clened_item.trim().charAt(0).toUpperCase() + clened_item.trim().slice(1)}</li>)})}
  </ul></div>
      )
    }
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
    const treatmentName = slug.split("%20").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
    return (
        <>
  {/* ================= HERO ================= */}
    <div className='bg-white p-4 rounded'> 
  
    <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">{treatmentName} Treatment in {cityData.City}</h2>
    <section className='text-muted-foreground gap-2 space-y-2'>
      <div>{TreatmentArray[0][1]}</div>
      <div>
      Our dataset currently has {cityData.market_size_indicators_number_of_clinics} clinic(s),
      with approximately {cityData.market_size_indicators_review_volume_total} reviews and
      an average rating of {cityData.market_size_indicators_average_rating_citywide}.
    </div>
      <div>
      <strong><h3>Medical Infrastructure:</h3></strong>
      </div>
      <ul className="list-disc list-inside">
        {createBullets(cityData.city_overview_medical_infrastructure_presence)}
      </ul>

      <div>
      <strong><h3>Local Aethetics Market:</h3></strong>
      </div>
      <ul className="list-disc list-inside">
        {createBullets(cityData.beauty_spend_indicators_market_maturity_level)}
      </ul>

       
  </section>


  {/* ================= GOALS ================= */}

  
     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Goals of {treatmentName} Treatment</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
       
    <ul className="list-disc list-inside">
      {TreatmentArray[1][1].map((goal: string, index:number) => (
        <li className="text-sm leading-relaxed pl-6" key={index}>{goal}</li>
      ))}
    </ul>
     


    
  </section>

  {/* ================= TREATMENT OPTIONS ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">{treatmentName} Treatment Options</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
      


    <h4><strong>Medical & Non-Surgical Approaches</strong></h4>
    <ul className="list-disc list-inside">
      {TreatmentArray[5][1].map(
        (item:string, index:number) => (
          <li className="text-sm leading-relaxed pl-6" key={index}>{item}</li>
        )
      )}
    </ul>

    <h4><strong>Pros of {treatmentName} Treatment</strong></h4>
    <ul className="list-disc list-inside">
      {TreatmentArray[2][1].Pros.map((pro: string, index:number) => (
        <li className="text-sm leading-relaxed pl-6" key={index}>{pro}</li>
      ))}
    </ul>

    <h4><strong>Cons of {treatmentName} Treatment</strong></h4>
    <ul className="list-disc list-inside">
      {TreatmentArray[2][1].Cons.map((con: string, index:number) => (
        <li className="text-sm leading-relaxed pl-6" key={index}>{con}</li>
      ))}
    </ul>
    {/* <div>{Object.entries(TreatmentArray[10][1]).map(([key, value]) => <p key={key}>{value as string}</div>)}</div> */}

  </section>



  {/* ================= COST ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Cost of {treatmentName} Treatment in {cityData.City}</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
    <div className='mt-2 space-y-2'>
         <ul className="list-disc list-inside">
          {Object.entries(TreatmentArray[3][1]).map(([key, value]) => {
            if(Array.isArray(value)) {
              return value.map((item:string, index:number) => (
                <li className="text-sm leading-relaxed pl-6" key={`${key}-${index}`} >{cleanText(item)}</li>
              ))
            }
            else return ( <li className="text-sm leading-relaxed pl-6" key={key} >{cleanText(value as string)}</li>)
          })}
          </ul>
      </div>

    
  </section>

  {/* ================= ACCESSIBILITY ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Accessibility</h2>
          <section className='text-muted-foreground gap-2 space-y-2'>

      <div>
      <strong><h3>Public transport:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.accessibility_factors_public_transport_proximity)}
      </ul></div>

      <div>
      <strong><h3>Parking availability:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.accessibility_factors_parking_availability)}
      </ul></div>
      
      <div>
      <strong><h3>Clinic distribution:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.accessibility_factors_city_centre_vs_suburban_distribution)}
      </ul></div>
      
      <div>
      <strong><h3>Airport proximity:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.medical_tourism_potential_airport_proximity)}
      </ul></div>
      

  </section>

  {/* ================= APPOINTMENT PREPARATION ================= */}

  
     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Preparing for Your {treatmentName} Appointment</h2>
          <section className='text-muted-foreground gap-2 space-y-2'>
    <ul className="list-disc list-inside">
      {TreatmentArray[7][1].map((item: string, index:number) => (
        <li className="text-sm leading-relaxed pl-6" key={index}>{item}</li>
      ))}
    </ul>

    <div>{TreatmentArray[11][1]}</div>
  </section>

  {/* ================= SAFETY ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Treatment Safety & Local Regulations</h2>
     <section className='text-muted-foreground gap-2 space-y-2'>
      
    <div>{Object.entries(TreatmentArray[8][1]).map(([key, value]) => <p key={key}>{value as string}</p>)}</div>
 

    <ul className="list-disc list-inside">
      {TreatmentArray[13][1].map(
        (item: string, index:number) => (
          <li className="text-sm leading-relaxed pl-6" key={index}>{item}</li>
        )
      )}
    </ul>
      <div>{TreatmentArray[14][1]}</div>
    

      <div>
      <strong><h3>Local regulatory authority:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.regulatory_environment_primary_regulator)}
      </ul></div>
    <div>
      <strong><h3>Private insurance usage locally:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.insurance_and_financing_private_insurance_usage)}
      </ul></div>
      <div>
      <strong><h3>Cosmetic finance availability:</h3></strong>
      
      <ul className="list-disc list-inside">
        {createBullets(cityData.insurance_and_financing_cosmetic_finance_availability)}
      </ul></div>
   
  </section>



  {/* ================= CANDIDATES ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Who Is a Good Candidate?</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
    <ul className="list-disc list-inside">
      {TreatmentArray[6][1].map(
        (candidate: string, index:number) => (
          <li className="text-sm leading-relaxed pl-6" key={index}>{candidate}</li>
        )
      )}
    </ul>
  </section>

  {/* ================= PRACTITIONER SELECTION ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Choosing a Clinic</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
    <ul className="list-disc list-inside">
      {TreatmentArray[15][1].map(
        (qual: string, index:number) => (
          <li className="text-sm leading-relaxed pl-6" key={index}>{qual}</li>
        )
      )}

      {TreatmentArray[4][1].map(
        (item: string, index:number) => (
          <li className="text-sm leading-relaxed pl-6" key={`look-${index}`}>{item}</li>
        )
      )}
    </ul>

    <div>
      Current average rating citywide:{" "}
      {cityData.market_size_indicators_average_rating_citywide}
    </div>
  </section>

  {/* ================= RECOVERY ================= */}


     <h2 className="text-sm md:text-2xl font-semibold mb-1 md:mb-2 mt-2">Recovery & Long-Term Results</h2>
      <section className='text-muted-foreground gap-2 space-y-2'>
        <div className='mt-2 space-y-2'>
         <ul className="list-disc list-inside">
          {Object.entries(TreatmentArray[12][1]).map(([key, value]) => {
            if(Array.isArray(value)) {
              return value.map((item:string, index:number) => (
                <li className="text-sm leading-relaxed pl-6" key={`${key}-${index}`} >{cleanText(item)}</li>
              ))
            }
            else return ( <li className="text-sm leading-relaxed pl-6" key={key} >{cleanText(value as string)}</li>)
          })}
          </ul>
      </div>
  
          <div><strong>Aftercare:</strong></div>
    <ul className="list-disc list-inside">
      {Array.isArray(TreatmentArray[9][1]) ? TreatmentArray[9][1].map((item: string, index:number) => (
        <li className="text-sm leading-relaxed pl-6" key={index}>{item}</li>
      )) : <li className="text-sm leading-relaxed pl-6">{TreatmentArray[9][1]}</li>}
    </ul>
  </section></div>
</>
    )
}