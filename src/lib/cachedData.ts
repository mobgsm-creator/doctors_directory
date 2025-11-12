import { Clinic, Practitioner } from "@/lib/types";
import { cache } from 'react';


// This caches the result for the duration of a single request
export const getGlobalData = cache(async () => {
  console.log("🔄 Fetching data...");
  
  const response = await fetch("http://128.199.165.212:8765/api/getData", {
    next: { revalidate: 3600 * 24 * 365 } // Cache for 1 hour
  });
  const cachedData = await response.json();
  console.log(cachedData)
  const {allclinics, allpractitioners } = cachedData;

  

  console.log(`✅ Loaded ${allclinics.length} clinics and ${allpractitioners.length} practitioners`);

  return { allclinics, allpractitioners };
});

