import { Clinic, Practitioner } from "@/lib/types";
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
// Module-scoped cache variables
// let cachedData: [Clinic[], Practitioner[]] | null = null;
// let lastFetched = 0;
function safeParse(v: any) {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

export function transformClinic(raw: any): Clinic {
 
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
  };
}
export function transformPractitioner(raw: any): Practitioner {
 
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

export async function getCachedData(cachedData:[Clinic[], Practitioner[]] | null = null, lastFetched:number ): Promise<[[Clinic[], Practitioner[]], number]> {
  const now = Date.now();
  const cacheTTL = 1000 * 60 * 60 * 24 * 364; // 1 year

  if (now - lastFetched < cacheTTL) {
    console.log("✅ Using cached data");
    return [cachedData as [Clinic[], Practitioner[]], lastFetched];
  }

  //console.log("🆕 Fetching new data...");
  const allclinics: Clinic[] = await fetch("https://doctors-directory-five.vercel.app/api/getClinicData", {
    cache: "no-store", // bypass Next.js fetch cache
  }).then(res => res.json());

  const allpractitioners: Practitioner[] = await fetch("https://doctors-directory-five.vercel.app/api/getPractitionerData", {
    cache: "no-store",
  }).then(res => res.json());
  const clinics = allclinics.slice(0,allclinics.length).map(transformClinic);
  const practitioners = allpractitioners.slice(0,allpractitioners.length).map(transformPractitioner);

  cachedData = [clinics, practitioners];
  lastFetched = now;
  return [cachedData as [Clinic[], Practitioner[]], lastFetched];
}
