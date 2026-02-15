import fs from "fs";
import path from 'path';
import {cleanRouteSlug, parseLabels, safeParse, consolidate, parse_text, parse_addresses, parse_numbers} from "../utils"
import { Clinic, Practitioner,Product } from "../types";
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
    image_url: parse_text(raw.image_url),
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
    Fees: raw.Fees,
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
  
  const filePath = "C:\\Users\\agney\\Desktop\\Aesthetic Products\\scripts\\scripts\\derms.json";
  console.log(filePath)
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const practitioners = JSON.parse(fileContents);
  console.log(practitioners.length)

  const filePath_1 = "C:\\Users\\agney\\Desktop\\Aesthetic Products\\scripts\\scripts\\clinics.json"
  const fileContents_1 = fs.readFileSync(filePath_1, 'utf-8');
  const clinics = JSON.parse(fileContents_1);
  console.log("Loaded")
  const clinicsData = clinics.map(transformClinic);
  console.log("Transformed Clinics")
  const practitionersData = practitioners.map(transformPractitioner);
  console.log("Transformed Practitioners")
  console.log(practitioners.length)
  // const filePath_p = path.join(process.cwd(), 'public', 'products.json');
  // const fileContents_p = fs.readFileSync(filePath_p, 'utf-8');
  // const practitioners_p = JSON.parse(fileContents_p);
  // console.log(practitioners_p.length)
  // const productsData = practitioners_p.map(transformProduct);

  // console.log("Transformed Products", productsData.length)

  return { practitionersData, clinicsData}
}
const {practitionersData, clinicsData} = await loadFromFileSystem();

// fs.writeFileSync(
//   "derms_processed_new_5403.json",
//   JSON.stringify( practitionersData )
// );
fs.writeFileSync(
  "clinics_processed_new_data.json",
  JSON.stringify(clinicsData)
);
// fs.writeFileSync(
//   "derms_processed_new.json",
//   JSON.stringify(practitionerData)
// );

console.log("Generated derms_processed.json");
