import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Clinic, Practitioner } from "./types"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function consolidate(input: string): string[] {

  const arr = input
    .replace(/\[|\]/g, "")   // remove [ and ]
    .replace(/'/g, "").replace(/"/g, "")    
    .replace(/\\n/g, ",")  
    .replace(/, /g, ",")    // remove all single quotes
    .split(",'")
    .map(x => x.trim())
  let result = arr[0].split(",")
  return result
}

export function parse_numbers(input: string): number {
  const arr = input
  .replace(/\[|\]/g, "")   // remove [ and ]
  .replace(/'/g, "")       // remove all single quotes
  .split(",'")
  .map(x => x.trim());

 
  return parseFloat(arr[0]);
}

export function parse_text(input: string): string {
  const arr = input
  .replace(/\[|\]/g, "")   // remove [ and ]
  .replace(/'/g, "")       // remove all single quotes
  .split(",")
  .map(x => x.trim());
  return arr[0];
}

export function parse_addresses(input: string): string {

  const arr = input
  .replace(/\[|\]/g, "")   // remove [ and ]
  .replace(/'/g, '"')       // remove all single quotes
  .split('", "')
  .map(x => x.trim());

  return arr[0].replace('"', '');
}

export function cleanRouteSlug(slug: string) {
  try {
  return slug.toLowerCase()
  .replace(/&|\+/g, 'and')          // & + → 'and'
  .replace(/[\/\\]+/g, '-')         // / \ → -
  //.normalize('NFKD')                // á í ü ñ → a i u n etc           // spaces → -
          // trim starting/ending dashes
  }
  catch (e) {

    return slug
  }
}
export function parseLabels(label: string): [boolean, string] | null {
  try {
    const jsonReady = label
      .trim()
      // normalize Python-style booleans
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\b,']/g, "]")
      // normalize single quotes to double quotes
  
      // handle empty string edge case: [False, ""] or [False, ]


    const parsed = JSON.parse(jsonReady);
    return parsed;
  } catch (err) {
    console.log(label)
    return null;
  }
}



export function safeParse(v: any) {
  try {
    return JSON.parse(v.replaceAll(/[\u0000-\u001F]/g, ""));
  } catch (err) {
    const msg = String(err) 
 // ✅ convert error to text so includes() works

    if (msg.includes("Unterminated string in JSON") ||
        msg.includes("Unterminated string in JSON")) {
    
      // 🔧 handle truncated array case here
      if (typeof v === "string" && v.trim().startsWith("[") ) {

        const last = v.lastIndexOf("}")

        if (last !== -1) {
          let fixed = v.slice(0, last + 1).replace(/\s*,\s*$/, "") + "]"
          try {
            return JSON.parse(fixed) // ✅ retry parsing fixed JSON
          } catch {
            return null // still broken? give up safely
          }
        }
      }
    }
    else {
      console.log("Value:",v,"Message: ",msg)
    }

    
    return null
  }
}
