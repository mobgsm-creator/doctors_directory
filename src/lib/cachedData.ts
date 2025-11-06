import { Clinic, Practitioner } from "@/lib/types";
// Module-scoped cache variables
// let cachedData: [Clinic[], Practitioner[]] | null = null;
// let lastFetched = 0;

export async function getCachedData(cachedData:[Clinic[], Practitioner[]] | null = null, lastFetched:number ): Promise<[[Clinic[], Practitioner[]], number]> {
  const now = Date.now();
  const cacheTTL = 1000 * 60 * 60 * 24 * 364; // 1 year

  if (now - lastFetched < cacheTTL) {
    console.log("✅ Using cached data");
    return [cachedData as [Clinic[], Practitioner[]], lastFetched];
  }

  //console.log("🆕 Fetching new data...");
  const [clinics]: [Clinic[]] = await fetch("http://localhost:3000/api/getClinicData", {
    cache: "no-store", // bypass Next.js fetch cache
  }).then(res => res.json());

  const [practitioners]: [Practitioner[]] = await fetch("http://localhost:3000/api/getPractitionerData", {
    cache: "no-store",
  }).then(res => res.json());

  cachedData = [clinics, practitioners];
  lastFetched = now;
  return [cachedData as [Clinic[], Practitioner[]], lastFetched];
}
