import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import {consolidate, parse_text, parse_addresses, parse_numbers} from "@/lib/utils"
import { Clinic } from "@/lib/types";

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
  };
}
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'clinics.json');
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContents);
    const clinics = data.slice(0,data.length).map(transformClinic);
    // ---- Derive unique sets ----
    const categories : string[] = Array.from(
      new Set([
        ...clinics.map((c: Clinic) => c.category).filter(Boolean),
        
      ])
    );

    let modalities : string[] = Array.from(
      new Set([
          ...clinics.flatMap((c: Clinic) => 
              Array.isArray(c.reviewAnalysis?.procedures_offered?.categories)
                ? c.reviewAnalysis.procedures_offered.categories
                : []) 
        
        ])
    );
    modalities =[...new Set(modalities)]
    .map(item =>
      item
        .split(" ")                                   // split into words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
        .join(" ")                                    // join back into a phrase
    );
    const locations: string[] = Array.from(
      new Set(
         
          clinics.map((p: Clinic) => {
            const parts = p.gmapsAddress?.split(",");
            return parts?.[parts.length - 2].trim().split(" ")[0]
          }).filter(Boolean)
        )
    );
    const responseData = [clinics,categories,modalities,locations];
    
 

   
    

    return NextResponse.json(responseData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read devices.json' }, { status: 500 });
  }
}
