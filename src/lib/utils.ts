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

export function safeParse(str: string) {
  try {
    
    return JSON.parse(str);
  } catch (e) {
    console.error("Parsing failed:", e);
    return null;
  }
}
