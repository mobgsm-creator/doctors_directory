import { create } from "zustand";
import { Clinic, Practitioner, SearchFilters } from "@/lib/types";
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
