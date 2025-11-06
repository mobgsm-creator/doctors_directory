import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Clinic, Practitioner } from "@/lib/types";

// -----------------------------
// Types
// -----------------------------

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
          console.log("Cached")
          return;} // cached

        set({ loading: true, error: undefined });

        try {
          console.log("trying")
          const [
            [clinics, clinicCategories, clinicModalities, clinicLocations],
            [practitioners, practitionerCategories, practitionerModalities, professions, practitionerLocations]
          ] = await Promise.all([
            fetch("/api/getClinicData").then(res => res.json()),
            fetch("/api/getPractitionerData").then(res => res.json()),
          ]);

          // Merge + dedupe arrays
          const categories = Array.from(new Set([...clinicCategories, ...practitionerCategories]));
          const modalities = Array.from(new Set([...clinicModalities, ...practitionerModalities]));
          const locations = Array.from(new Set([...clinicLocations, ...practitionerLocations]));


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
