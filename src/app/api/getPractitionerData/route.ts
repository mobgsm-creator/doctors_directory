import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
import { Practitioner } from "@/lib/types";
function safeParse(v: any) {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
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

export async function GET() {
  try {
   
    const filePath = path.join(process.cwd(), 'public', 'derms.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    const practitioners = data.slice(0,data.length).map(transformPractitioner);
    

    // ---- Derive unique sets ----
    const categories : string[] = Array.from(
      new Set([
        ...practitioners.map((c: Practitioner) => c.category).filter(Boolean),
        
      ])
    );

    let modalities : string[] = Array.from(
      new Set([
          
          ...practitioners.flatMap((p: Practitioner) =>{
            return p.modality.map(m => m.toLowerCase())}).filter(Boolean),
        ])
    );
    modalities =[...new Set(modalities)]
    .map(item =>
      item
        .split(" ")                                   // split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
        .join(" ")                                    // join back into a phrase
    );


    const professions = Array.from(
      new Set([
         
          practitioners.map((p: Practitioner) => p.profession).filter(Boolean),
        ])
    );

    const locations: string[] = Array.from(
      new Set(
         
          practitioners.map((p: Practitioner) => {
            const parts = p.gmapsAddress?.split(",");
            return parts?.[parts.length - 2].trim().split(" ")[0]
          }).filter(Boolean)
        )
    );
    const responseData = [practitioners,categories,modalities,professions,locations];
   
    

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read devices.json' }, { status: 500 });
  }
}