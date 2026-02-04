import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Clinic, Practitioner } from "./types"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function consolidate(input: string): string[] {

  const arr = input
    .replaceAll('[', "")
    .replaceAll(']', "")   // remove [ and ]
    .replaceAll("'", "").replaceAll('"', "")    
    .replaceAll("\\n", ",")  
    .replaceAll(", ", ",")    // remove all single quotes
    .split(",'")
    .map(x => x.trim())
  let result = arr[0].split(",")
  return result
}

export function parse_numbers(input: string): number {
  const arr = input
  .replaceAll('[', "")
  .replaceAll(']', "")   // remove [ and ]
  .replaceAll("'", "")       // remove all single quotes
  .split(",'")
  .map(x => x.trim());

 
  return Number.parseFloat(arr[0]);
}

export function parse_text(input: string): string {
  const arr = input
  .replaceAll('[', "")
  .replaceAll(']', "")   // remove [ and ]
  .replaceAll("'", "")       // remove all single quotes
  .split(",")
  .map(x => x.trim());
  return arr[0];
}

export function parse_addresses(input: string): string {
  let result = ""
  try {

    const arr = input
  .replaceAll('[', "")
  .replaceAll(']', "")   // remove [ and ]
  .replaceAll("'", '"')       // remove all single quotes
  .split('", "')
  .map(x => x.trim());
  result = arr[0].replaceAll('"', '');
  } catch (e) {
    result = input
  }

  return result
}
export function decodeUnicodeEscapes(str: string) {
  return str.replaceAll(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
    String.fromCodePoint(Number.parseInt(code, 16))
  );
}

export function cleanRouteSlug(slug: string) {
  try {
  return slug.toLowerCase()
  .replaceAll(/&|\+/g, 'and')          // & + → 'and'
  .replaceAll(/[\/\\]+/g, '-')         // / \ → -
    .replaceAll(' ', "-")                // á í ü ñ → a i u n etc           // spaces → -
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
      .replaceAll(/\bTrue\b/g, "true")
      .replaceAll(/\bFalse\b/g, "false")
      .replaceAll(/\b,']/g, "]")
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

    if (msg.includes("Unterminated string in JSON") ) {
    
      // 🔧 handle truncated array case here
      if (typeof v === "string" && v.trim().startsWith("[") ) {

        const last = v.lastIndexOf("}")
        console.log(v)

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
export const parseList = (val: any) => {
    if (!val) return [];
    try {
      if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
        return JSON.parse(val.replaceAll("'", '"'));
      }
      if (Array.isArray(val)) return val;
      return [val];
    } catch {
      return [val];
    }
  };
export const fixPythonArrayString = (str: string|undefined) => {
    if (!str) return null;

    try {
      // 1. remove broken outer quotes
      let fixed = str
        .trim()
        .replaceAll(/^"\[|\]"$/g, (m) => (m === '"[' ? "[" : "]"));

      // 2. convert single-quoted Python list → JSON list
      fixed = fixed.replaceAll(/'([^']*)'/g, '"$1"');

      return JSON.parse(fixed);
    } catch {
      return null;
    }
  };

export const flattenObject = (obj: any, parentKey = "", result: any = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

export function fixMojibake(str: string) {
  return new TextDecoder("utf-8").decode(
    Uint8Array.from(str, c => c.charCodeAt(0))
  );
}
