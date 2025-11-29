import fs from "fs";
import path from 'path';
import {cleanRouteSlug, parseLabels, safeParse, consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
import { Clinic, Practitioner } from "@/lib/types";



function transformClinic(raw: any): Clinic {
 
  return {
    slug: cleanRouteSlug(raw.slug),
    image: raw.image,
    url: raw.links,
    rating: parseFloat(raw.rating),
    reviewCount: parseInt(raw.review_count),
    category: raw.category,
    gmapsAddress: parse_addresses(raw.gmaps_address),
    //gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: safeParse(raw.gmaps_reviews),
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
  };
}
function transformPractitioner(raw: any): Practitioner {
 
  return {
    slug: cleanRouteSlug(raw.slug),
    image: raw.image,
    url: raw.links,
    rating: parseFloat(raw.rating),
    reviewCount: parseInt(raw.review_count),
    category: raw.category,
    gmapsAddress: parse_addresses(raw.gmaps_address),
    //gmapsLink: raw.gmaps_link,
    gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: safeParse(raw.gmaps_reviews),
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

  };
}

async function loadFromFileSystem() {
  console.log("📂 API: Reading from file system...");
  
  const filePath = path.join(process.cwd(), 'public', 'derms.json');
  console.log(filePath)
  const fileContents = fs.readFileSync(filePath, 'utf-8');
  const practitioners = JSON.parse(fileContents);
  console.log(practitioners.length)

  const filePath_1 = path.join(process.cwd(), 'public', 'clinics.json');
  const fileContents_1 = fs.readFileSync(filePath_1, 'utf-8');
  const clinics = JSON.parse(fileContents_1);
  console.log("Loaded")
  const clinicsData = clinics.map(transformClinic);
  console.log("Transformed Clinics")
  const practitionersData = practitioners.map(transformPractitioner);
  console.log("Transformed Practitioners")

  return {clinicsData,practitionersData };
}
const { clinicsData,practitionersData  } = await loadFromFileSystem();

fs.writeFileSync(
  "public/derms_processed.json",
  JSON.stringify(practitionersData)
);
fs.writeFileSync(
  "public/clinics_processed.json",
  JSON.stringify(clinicsData)
);

console.log("Generated derms_processed.json");
