import fs from "fs";
import path from 'path';
import {cleanRouteSlug, parseLabels, safeParse, consolidate, parse_text, parse_addresses, parse_numbers} from "../utils"
import { Clinic, Practitioner,Product, City, Accreditation } from "../types";
import { decodeUnicodeEscapes, fixMojibake } from "../utils";
function parseCorruptedJson(raw:string) {
  if (!raw) return null;

  try {
    let str = String(raw);

    // 1. Remove invalid \xNN escapes that break JSON
    str = str.replaceAll(/\\x[0-9A-Fa-f]{2}/g, "");

    // 2. Fix double-encoded Euro symbol:  Ã¢Â¬ → €
    // (handles multiple variants)
    str = str.replaceAll(/Ã¢Â¬/g, "€")
             .replaceAll(/Ã¢Â/g, "€")
             .replaceAll(/Ã¢/g, "€")
             .replaceAll(/Â¬/g, "€");

    // 3. Parse corrected JSON
    return JSON.parse(str);

  } catch (err) {
    console.error("parseCorruptedJson error:", err, raw);
    return null;
  }
}

function transformProduct(raw: any): Product {
  return {
    slug: cleanRouteSlug(raw.slug),

    // Core identifiers
    product_name: raw.product_name,
    product_category: raw.product_category,
    product_subcategory: raw.product_subcategory,
    brand: raw.brand,
    manufacturer: raw.manufacturer,
    distributor: raw.distributor,
    sku: raw.sku,


    // Media
    image_url: raw.image_url.replaceAll('[', "").replaceAll(']', ""),//eslint-disable-line
    product_document_pdf_from_manufacturer: raw.product_document_pdf_from_manufacturer,

    // Descriptions
    description: raw.description,
    key_benefits: raw.key_benefits,
    indications: raw.indications,
    composition: raw.composition,
    formulation: raw.formulation,
    packaging: raw.packaging,
    usage_instructions: raw.usage_instructions,
    treatment_duration: raw.treatment_duration,
    onset_of_effect: raw.onset_of_effect,

    // Safety
    contraindications: raw.contraindications,
    adverse_effects: raw.adverse_effects,
    storage_conditions: raw.storage_conditions,

    // Compliance
    mhra_approved: raw.mhra_approved,
    ce_marked: raw.ce_marked,
    mhra_link: raw.mhra_link,
    certifications_and_compliance: safeParse(raw.certifications_and_compliance),

    // Brand/Seller Info
    brand_about: raw.brand_about,
    seller_about: raw.seller_about,

    // Pricing (JSON)
    all_prices: parseCorruptedJson(raw.all_prices),
    distributor_cleaned: raw.distributor_cleaned,
    category: raw.Category,
  };
}
function transformAccreditation(raw: any): Accreditation {
  return {
    slug: cleanRouteSlug(raw.Accreditation),

    image: raw.GoogleImage,


    overview: safeParse(raw.overview),
    governing_body: safeParse(raw.governing_body),
    eligibility_criteria: safeParse(raw.eligibility_criteria),
    judging_criteria: safeParse(raw.judging_criteria),
    categories: safeParse(raw.categories),
    accreditation_requirements: safeParse(raw.accreditation_requirements),
    verification_process: safeParse(raw.verification_process),
    renewal_and_compliance: safeParse(raw.renewal_and_compliance),
    benefits: safeParse(raw.benefits),
    patient_safety_impact: safeParse(raw.patient_safety_impact),
    comparison_with_other_bodies: safeParse(raw.comparison_with_other_bodies),
    industry_recognition: safeParse(raw.industry_recognition),
    government_regulation_status: safeParse(raw.government_regulation_status),
    faqs: safeParse(raw.faqs),
  };
}
function transformClinic_2(raw: any): Clinic {
 
  return {
    slug: raw.slug,
    image: raw.image,
    url: raw.links,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    category: raw.category,
    gmapsAddress: raw.gmapsAddress,
    //gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmapsPhone,
    gmapsReviews: safeParse(JSON.stringify(raw.gmapsReviews)),
    reviewAnalysis: raw["Review Analysis"],
    weighted_analysis: raw["weighted_analysis"],
    City: raw.City,
    x_twitter: raw.x_twitter,
    facebook: raw.facebook,
    instagram: raw.instagram,
    twitter: raw.twitter,
    youtube: raw.youtube,
    Linkedin: raw.Linkedin,
    website: raw.website,
    email: raw.email,
    isSaveFace: raw.isSaveFace,
    isDoctor: raw.isDoctor,
    isJCCP: raw.isJCCP,
    isCQC: raw.isCQC,
    isHIW: raw.isHIW,
    isHIS: raw.isHIS,
    isRQIA: raw.isRQIA,
    about_section: raw.about_section,
    accreditations: raw.accreditations,
    awards: raw.awards,
    affiliations: raw.affiliations,
    hours: raw.hours,
    Practitioners: raw.Practitioners,
    Insurace: raw.insurace,
    Payments: raw.Payments, 
    Fees: raw.Fees,
    Treatments: safeParse(raw.Treatments),
  };
}
function transformCity(raw: any): City {
  return {
    City: raw.City,
    Unique_Specializations: safeParse(raw.Unique_Specializations),

    city_overview_population_estimate: raw.city_overview_population_estimate,
    city_overview_lifestyle_characteristics: raw.city_overview_lifestyle_characteristics,
    city_overview_medical_infrastructure_presence: raw.city_overview_medical_infrastructure_presence,

    market_size_indicators_number_of_clinics: raw.market_size_indicators_number_of_clinics,
    market_size_indicators_review_volume_total: raw.market_size_indicators_review_volume_total,
    market_size_indicators_average_rating_citywide: raw.market_size_indicators_average_rating_citywide,
    market_size_indicators_estimated_private_aesthetic_market_strength: raw.market_size_indicators_estimated_private_aesthetic_market_strength,

    competitor_landscape_nhs_presence: raw.competitor_landscape_nhs_presence,

    regulatory_environment_primary_regulator: raw.regulatory_environment_primary_regulator,
    regulatory_environment_prescribing_requirements: raw.regulatory_environment_prescribing_requirements,
    regulatory_environment_inspection_framework: raw.regulatory_environment_inspection_framework,

    insurance_and_financing_private_insurance_usage: raw.insurance_and_financing_private_insurance_usage,
    insurance_and_financing_cosmetic_finance_availability: raw.insurance_and_financing_cosmetic_finance_availability,

    seasonality_and_local_trends_peak_booking_periods: safeParse(raw.seasonality_and_local_trends_peak_booking_periods),

    social_media_trends_content_trends: safeParse(raw.social_media_trends_content_trends),

    referral_networks_teaching_hospital_links: raw.referral_networks_teaching_hospital_links,

    accessibility_factors_public_transport_proximity: raw.accessibility_factors_public_transport_proximity,
    accessibility_factors_parking_availability: raw.accessibility_factors_parking_availability,
    accessibility_factors_city_centre_vs_suburban_distribution: raw.accessibility_factors_city_centre_vs_suburban_distribution,

    medical_tourism_potential_tourism_volume_indicator: raw.medical_tourism_potential_tourism_volume_indicator,
    medical_tourism_potential_hotel_density_near_clinics: raw.medical_tourism_potential_hotel_density_near_clinics,
    medical_tourism_potential_airport_proximity: raw.medical_tourism_potential_airport_proximity,
    medical_tourism_potential_medical_tourism_viability: raw.medical_tourism_potential_medical_tourism_viability,

    beauty_spend_indicators_market_maturity_level: raw.beauty_spend_indicators_market_maturity_level,
  };  

}
function transformClinic(raw: any): Clinic {
 
  return {
    slug: decodeUnicodeEscapes(fixMojibake(cleanRouteSlug(raw.slug))),
    image: raw.image,
    url: raw.url,
    rating: parseFloat(raw.rating),
    reviewCount: parseInt(raw.review_count),
    category: raw.category,
    gmapsAddress: parse_addresses(raw.gmapsAddress),
    //gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmaps_phone.replaceAll("Phone: ", "").trim(),
    //gmapsReviews: safeParse(raw.gmaps_reviews),
    reviewAnalysis: safeParse(raw["Review Analysis"]),
    weighted_analysis: safeParse(raw["weighted_analysis"]),
    City: raw.City,
    x_twitter: raw.x_twitter,
    facebook: raw.facebook,
    instagram: raw.instagram,
    twitter: raw.twitter,
    youtube: raw.youtube,
    Linkedin: raw.Linkedin,
    website: raw.website,
    email: raw.email,
    isSaveFace: raw.isSaveFace,
    isDoctor: raw.isDoctor,
    isJCCP: parseLabels(raw.isJCCP),
    isCQC: parseLabels(raw.isCQC),
    isHIW: parseLabels(raw.isHIW),
    isHIS: parseLabels(raw.isHIS),
    isRQIA: parseLabels(raw.isRQIA),
    about_section: raw.about_section,
    accreditations: raw.accreditations,
    awards: raw.awards,
    affiliations: raw.affiliations,
    hours: safeParse(raw.hours),
    Practitioners: safeParse(raw.Practitioners),
    Insurace: safeParse(raw.Insurace),
    Payments: safeParse(raw.Payments),
    Fees: safeParse(raw.Fees),
    Treatments: safeParse(raw.Treatments_normalized),
  };
}
function transformPractitioner(raw: any): Practitioner {
 
  return {
    // slug: cleanRouteSlug(raw.slug),
    // image: raw.image,
    // url: raw.links,
    // rating: parseFloat(raw.rating),
    // reviewCount: parseInt(raw.review_count),
    // category: raw.category,
    // gmapsAddress: parse_addresses(raw.gmaps_address),
    // //gmapsLink: raw.gmaps_link,
    // gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    // gmapsReviews: safeParse(raw.gmaps_reviews),
    // reviewAnalysis: safeParse(raw["Review Analysis"]),
    // weighted_analysis: safeParse(raw["weighted_analysis"]),
    // City: raw.City,
    // x_twitter: raw.x_twitter,
    // facebook: raw.facebook,
    // instagram: raw.instagram,
    // twitter: raw.twitter,
    // youtube: raw.youtube,
    // Linkedin: raw.Linkedin,
    // website: raw.website,
    // email: raw.email,
    // isSaveFace: raw.isSaveFace,
    // isDoctor: raw.isDoctor,
    // isJCCP: parseLabels(raw.isJCCP),
    // isCQC: parseLabels(raw.isCQC),
    // isHIW: parseLabels(raw.isHIW),
    // isHIS: parseLabels(raw.isHIS),
    // isRQIA: parseLabels(raw.isRQIA),
    // about_section: raw.about_section,
    // accreditations: raw.accreditations,
    // awards: raw.awards,
    // affiliations: raw.affiliations,
    // hours: safeParse(raw.hours),
    // Practitioners: safeParse(raw.Practitioners),
    // Insurace: safeParse(raw.Insurace),
    // Payments: safeParse(raw.Payments), 
    // Fees: safeParse(raw.Fees),
    practitioner_image_link: raw.practitioner_image_link,
    practitioner_qualifications: raw.Qualifications_And_Professional_Affiliations,
    practitioner_roles: raw.Roles_And_Positions,
    practitioner_awards: raw.Awards_And_Recognition,
    practitioner_media: raw.Media_And_News_Features,  
    practitioner_experience: raw.Experience_And_Practice_Profile,
    practitioner_name: cleanRouteSlug(raw.practitioner_name),
    practitioner_title: raw.Title	,
    practitioner_specialty:raw.Specialty,	
    practitioner_education:raw.Education,	
    Treatments: safeParse(raw.Treatments_normalized),
    Title: raw.Title,
    Associated_Clinics:raw.Associated_Clinics

  };
}

async function loadFromFileSystem() {
  console.log("📂 API: Reading from file system...");
  
  // const filePath = "C:\\Users\\agney\\Desktop\\Aesthetic Products\\scripts\\scripts\\derms.json";
  // console.log(filePath)
  // const fileContents = fs.readFileSync(filePath, 'utf-8');
  // const practitioners = JSON.parse(fileContents);
  // console.log(practitioners.length)

  // const filePath_1 = "C:\\Users\\agney\\Desktop\\Aesthetic Products\\scripts\\scripts\\clinics.json"
  // const fileContents_1 = fs.readFileSync(filePath_1, 'utf-8');
  // const clinics = JSON.parse(fileContents_1);
  // console.log("Loaded")
  // const clinicsData = clinics.map(transformClinic);
  // console.log("Transformed Clinics")
  // const practitionersData = practitioners.map(transformPractitioner);
  // console.log("Transformed Practitioners")
  // console.log(practitioners.length)

  const filePath_city = "C:\\Users\\agney\\Documents\\Files\\Projects\\doctor-directory\\public\\accreditations.json"

  const fileContents_city = fs.readFileSync(filePath_city, 'utf-8');
  const cityData = JSON.parse(fileContents_city);
  console.log("Loaded")
  const productsData = cityData.map(transformAccreditation);
  console.log("Transformed City Data")

  // const filePath_p = path.join(process.cwd(), 'public', 'products.json');
  // const fileContents_p = fs.readFileSync(filePath_p, 'utf-8');
  // const practitioners_p = JSON.parse(fileContents_p);
  // console.log(practitioners_p.length)
  // const productsData = practitioners_p.map(transformProduct);

  // console.log("Transformed Products", productsData.length)

  return { productsData}
}
const { productsData} = await loadFromFileSystem();

// fs.writeFileSync(
//   "derms_processed_new_5403.json",
//   JSON.stringify( practitionersData )
// );
// fs.writeFileSync(
//   "clinics_processed_new_data.json",
//   JSON.stringify(clinicsData)
// );
// fs.writeFileSync(
//   "derms_processed_new.json",
//   JSON.stringify(practitionerData)
// );
fs.writeFileSync(
  "accreditations_processed_new.json",
  JSON.stringify(productsData)
);
console.log("Generated derms_processed.json");
