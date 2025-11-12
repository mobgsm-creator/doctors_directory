import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Clinic, Practitioner, SearchFilters } from "@/lib/types";
import { transformClinic, transformPractitioner } from "@/lib/cachedData";

// -----------------------------
// Types
// -----------------------------
interface SearchState {
  filters: SearchFilters
  setFilters: (filters: SearchFilters) => void

}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {
    type: "Clinic",
    query: "",
    category: "",
    location: "",
    rating: 0,
    services: [],
  
  },
  setFilters: (filters) => set({ filters }),
}))
interface DataStore {
  clinics: Clinic[];
  practitioners: Practitioner[];
  categories: string[];
  modalities: string[];
  professions: string[];
  locations: string[];
  loading: boolean;
  error?: string;

  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      clinics: [],
      practitioners: [],
      categories: [],
      modalities: [],
      professions: [],
      locations: [],
      loading: false,
      error: undefined,

      fetchData: async () => {
        if (get().clinics.length && get().practitioners.length){ 
          return;} // cached

        set({ loading: true, error: undefined });

        try {
          const 
            [allclinics, 
            allpractitioners
          ] = await Promise.all([
            fetch("/api/getClinicData_sb").then(res => res.json()),
            fetch("/api/getPractitionerData").then(res => res.json()),
          ]);
         
          const practitioners = allpractitioners.slice(0,allpractitioners.length).map(transformPractitioner);
          const clinics = allclinics.slice(0,allclinics.length).map(transformClinic);

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


          set({
            clinics,
            practitioners,
            categories,
            modalities,
            professions,
            locations,
            loading: false,
          });
        } catch (err: any) {
          console.log(err)
        }
      },
    }),
    {
      name: "data-store", // persist key
    }
  )
);
