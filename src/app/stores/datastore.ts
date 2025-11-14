"use client"
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
  initialized: boolean;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  clinics: [],
  practitioners: [],
  categories: [],
  modalities: [],
  professions: [],
  locations: [],
  loading: false,
  error: undefined,
  initialized: false,

  fetchData: async () => {
    const state = get();
    
    // Check if already initialized in this session
    if (state.initialized) {
      console.log("✅ DataStore: Already initialized");
      return;
    }

    if (state.loading) {
      console.log("⏳ DataStore: Already fetching...");
      return;
    }

    console.log("🔄 DataStore: Fetching data...");
    set({ loading: true, error: undefined });

    try {

      
      const response = await fetch("http://localhost:3000/api/getData", {
        next: { revalidate: 3600 * 24 * 365 } // Cache for 1 hour
      });
      const {clinics, practitioners} = await response.json();
      
     
      set({
        clinics,
        practitioners,
        loading: false,
        initialized: true,
        error: undefined,
      });

      console.log("✅ DataStore: Successfully populated");
    } catch (err: any) {
      console.error("❌ DataStore: Failed to fetch data:", err);
      set({
        loading: false,
        error: err.message || "Failed to load data",
      });
    }
  },
}));