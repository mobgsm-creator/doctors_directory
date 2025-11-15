import fs from "fs";
import path from 'path';
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
import { Clinic, Practitioner } from "@/lib/types";
function parseLabels(label: string): [boolean, string] | null {
  try {
    const jsonReady = label
      .trim()
      // normalize Python-style booleans
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      // normalize single quotes to double quotes
  
      // handle empty string edge case: [False, ""] or [False, ]
    

    const parsed = JSON.parse(jsonReady);
    return parsed;
  } catch (err) {
    return null;
  }
}



function safeParse(v: any) {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

function transformClinic(raw: any): Clinic {
 
  return {
    slug: raw.slug.toLowerCase()
    .replace(/&|\+/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[()]/g, ''),
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
    hours: safeParse(raw.hours),
    Practitioners: safeParse(raw.Practitioners),
    Insurace: safeParse(raw.Insurace),
    Payments: safeParse(raw.Payments), 
    Fees: safeParse(raw.Fees),
  };
}
function transformPractitioner(raw: any): Practitioner {
 
  return {
    //id: raw["ID"].toString(),
    Name: raw.Name,
    slug: raw.Name.toLowerCase().replace(/\s+/g, "-"),
    image: !raw.Image || raw.Image === "https://www.jccp.org.uk/content/images/no-image.jpg"
  ? parse_text(raw.image)
  : raw.Image,
    profession: parse_text(raw["PROFESSION:"]).trim(),
    // regulatoryBody: raw["REGULATORY BODY:"],
    // registrationPin: raw["REGISTRATION PIN NUMBER:"],
    qualification: raw["QUALIFICATION: (To Date)"].trim(),
     modality: consolidate(raw["SPECIALTIES"]),
    // memberSince: raw["MEMBER SINCE:"],
    // otherMemberships: raw["OTHER MEMBERSHIPS:"],
    // restrictions: raw["RESTRICTIONS:"],
     url: raw.url,
     rating: parse_numbers(raw.rating),
     reviewCount: parse_numbers(raw.review_count),
     category: raw.category,
     gmapsAddress: parse_addresses(raw.gmaps_address),
     //gmapsLink: raw.gmaps_link,
    // gmapsPhone: raw.gmaps_phone.replace("Phone: ", "").trim(),
    gmapsReviews: JSON.parse(raw.gmaps_reviews),
    reviewAnalysis: safeParse(raw["Review Analysis"]),
  };
}

async function loadFromFileSystem() {
  console.log("📂 API: Reading from file system...");
  
  // const filePath = path.join(process.cwd(), 'public', 'derms.json');
  // console.log(filePath)
  // const fileContents = fs.readFileSync(filePath, 'utf-8');
  // const practitioners = JSON.parse(fileContents);

  const filePath_1 = path.join(process.cwd(), 'public', 'clinics.json');
  const fileContents_1 = fs.readFileSync(filePath_1, 'utf-8');
  const clinics = JSON.parse(fileContents_1);
  console.log("Loaded")
  const clinicsData = clinics.map(transformClinic);
  //const practitionersData = practitioners.map(transformPractitioner);
  console.log("Transformed")
  //console.log(`✅ API: Loaded ${clinics?.length} clinics and ${practitioners?.length} practitioners from file`);
  
  return {clinicsData, };
}
const { clinicsData,  } = await loadFromFileSystem();
// fs.writeFileSync(
//   "public/derms_processed.json",
//   JSON.stringify(practitionersData)
// );
fs.writeFileSync(
  "public/clinics_processed.json",
  JSON.stringify(clinicsData)
);

console.log("Generated derms_processed.json");
