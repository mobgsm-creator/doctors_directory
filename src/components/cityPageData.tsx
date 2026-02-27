import { City, Practitioner } from "@/lib/types";
import { decodeUnicodeEscapes, fixMojibake } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
function createBullets(text:string){
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
          <li className="text-sm leading-relaxed" key={key} > {clened_item.trim().charAt(0).toUpperCase() + clened_item.trim().slice(1)}</li>)})}
  </ul></div>
      )
    }
  }
type CityPageDataProps = {
    citySlug: string,cityData: City, cityClinics: Practitioner[], uniqueTreatments: string[]
}
export function CityPageData({citySlug, cityData, uniqueTreatments}: CityPageDataProps) {
    return (
        <>
        <div className='bg-white rounded p-4'>
        <section className="mb-8">
        <h1 className="text-sm md:text-2xl md:font-semibold mb-1 md:mb-2">About {citySlug}</h1>
        <section className="space-y-6 text-muted-foreground">
  {/* Overview Section */}
  <div>


    <div className="mt-2 space-y-2">
      <p>
        <strong><h2>Population:</h2></strong>
      </p>
      <ul className="list-disc list-inside" data-testid="population-bullets">
        {createBullets(cityData.city_overview_population_estimate)}
      </ul>

      <p>
        <strong><h2>Lifestyle Characteristics:</h2></strong>
      </p>
      <ul className="list-disc list-inside" data-testid="lifestyle-characteristics-bullets">
        {createBullets(cityData.city_overview_lifestyle_characteristics)}
      </ul>

      <p>
        <strong><h2>Medical Infrastructure:</h2></strong>
      </p>
      <ul className="list-disc list-inside" data-testid="medical-infrastructure-bullets">
        {createBullets(cityData.city_overview_medical_infrastructure_presence)}
      </ul>
    </div>
  </div>

  
</section>
      </section>

      {/* Market Size & Competitive Landscape */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Market Size
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p data-testid="number-of-clinics">
            <strong><h2>Number of Clinics:</h2></strong>{" "}
            {cityData.market_size_indicators_number_of_clinics}
          </p>
          <p data-testid="total-reviews">
            <strong><h2>Total Reviews:</h2></strong>{" "}
            {cityData.market_size_indicators_review_volume_total}
          </p>
          <p data-testid="average-rating">
            <strong><h2>Average Citywide Rating:</h2></strong>{" "}
            {cityData.market_size_indicators_average_rating_citywide}
          </p>
         
          <div className="mt-2 space-y-2" data-testid="market-maturity-level">

  
        {createBullets(cityData.beauty_spend_indicators_market_maturity_level)}
     

      
    </div>
        </div>
        
        <div>


    
  </div>
      </section>

      {/* Specializations */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Treatments
        </h1>
        <div className="flex flex-wrap gap-1">
          {uniqueTreatments &&
            uniqueTreatments.map(
              (modality, index) => 
                { 
                  const treatments = modality?.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
                  
                  return (
                  
                <Link data-testid="treatment-link" key={modality} href={`/treatments/${treatments}`}>
                  <Badge variant="outline" className="text-md bg-gray-100 border-0">
                    {treatments}
                  </Badge>
                </Link> )}
              
            )}
        </div>
      </section>

      {/* Regulatory Environment */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Regulatory & Compliance Environment
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p data-testid="primary-regulator">
            <strong><h2>Primary Regulator:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_primary_regulator)}
          </p>
          <p data-testid="prescribing-requirements">
            <strong><h2>Prescribing Requirements:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_prescribing_requirements)}
          </p>
          <p data-testid="inspection-framework">
            <strong><h2>Inspection Framework:</h2></strong>{" "}
            {createBullets(cityData.regulatory_environment_inspection_framework)}
          </p>
        </div>
      </section>

      {/* Insurance & Financing */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Insurance & Financing
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p data-testid="insurance-coverage">
            <strong><h2>Private Insurance Usage:</h2></strong>{" "}
            {createBullets(cityData.insurance_and_financing_private_insurance_usage)}
          </p>
          <p data-testid="cosmetic-finance-availability">
            <strong><h2>Cosmetic Finance Availability:</h2></strong>{" "}
            {createBullets(cityData.insurance_and_financing_cosmetic_finance_availability)}
          </p>
        </div>
      </section>

      {/* Seasonality & Trends */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Seasonality & Local Trends
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p>
            <strong><h2>Peak Booking Periods:</h2></strong>{" "}
            {cityData.seasonality_and_local_trends_peak_booking_periods.map((period:string)=><span key={period} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded" data-testid="peak-booking-periods">{period}</span>)}
          </p>
          <p >
            <strong><h2>Social Media Trends:</h2></strong>{" "}
            {cityData.social_media_trends_content_trends.map((period:string)=><span key={period} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded" data-testid="social-media-trends">{period}</span>)}
          </p>
        </div>
      </section>

      {/* Referral Networks */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Referral Networks & Teaching Hospital Links
        </h1>
        <p className='text-muted-foreground' data-testid="referral-networks-teaching-hospital-links">{createBullets(cityData.referral_networks_teaching_hospital_links)}</p>
      </section>

      {/* Accessibility */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Accessibility & Location Factors
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p data-testid="public-transport-proximity">
            <strong><h2>Public Transport Proximity:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_public_transport_proximity)}
          </p>
          <p data-testid="parking-availability">
            <strong><h2>Parking Availability:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_parking_availability)}
          </p>
          <p data-testid="city-centre-vs-suburban-distribution">
            <strong><h2>City Centre vs Suburban Distribution:</h2></strong>{" "}
            {createBullets(cityData.accessibility_factors_city_centre_vs_suburban_distribution)}
          </p>
        </div>
      </section>

      {/* Medical Tourism */}
      <section className="mb-8">
        <h1 className="text-lg md:text-xl font-semibold mb-3">
          Medical Tourism Potential
        </h1>

        <div className="space-y-3 text-muted-foreground">
          <p data-testid="tourism-volume-indicator">
            <strong><h2>Tourism Volume Indicator:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_tourism_volume_indicator)}
          </p>
          <p data-testid="hotel-density-near-clinics">
            <strong><h2>Hotel Density Near Clinics:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_hotel_density_near_clinics)}
          </p>
          <p data-testid="airport-proximity">
            <strong><h2>Airport Proximity:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_airport_proximity)}
          </p>
          <p data-testid="medical-tourism-viability">
            <strong><h2>Overall Medical Tourism Viability:</h2></strong>{" "}
            {createBullets(cityData.medical_tourism_potential_medical_tourism_viability)}
          </p>
        </div>
      </section></div>
        </>
    )
}