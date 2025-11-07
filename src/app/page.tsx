import HomePage from "@/components/home-page"
// import { getCachedData } from "@/lib/cachedData"
// import { Clinic, Practitioner } from "@/lib/types";
// let cachedData: [Clinic[], Practitioner[]] | null = null;
// let lastFetched = 0;

export default async function Home() {
  //[cachedData,lastFetched] = await getCachedData(cachedData,lastFetched);
  
  
  return (
    <main className="min-h-screen">
      <HomePage />
    </main>
  )
}