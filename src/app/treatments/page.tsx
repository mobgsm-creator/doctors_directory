//import { SearchBar } from "@/components/search-bar";
import { TreatmentFiltersClient } from "@/components/treatment-filters-client";
import { searchTreatments } from "./actions";
import { TreatmentMap } from "@/lib/data";
import ItemsGrid from "@/components/collectionGrid";
import { SearchBar } from "@/components/search-bar";
import { AdvancedFilterSidebar } from "@/components/filterSidebar";
import { CollectionsFilter } from "@/components/collectionsFilterWrapper";

export default function HomePage({
  searchParams 
}: Readonly<{ 
  searchParams: { 
    query?: string;
    page?: string;
    concern?: string;
    treatmentType?: string;
    treatmentArea?: string;
    priceRange?: string;
    sort?: string;
  } 
  }>) {
  const ITEMS_PER_PAGE = 80;

  const allTreatments = Object.keys(TreatmentMap).map((name) => ({
    name,
    image: TreatmentMap[name].split("?w")[0] || "/placeholder.svg",
    slug: `/treatments/${name}`,
  }));

  const theTreatments = Object.keys(TreatmentMap);

  const searchQuery = searchParams.query;
  
  let filteredTreatments = searchQuery 
    ? allTreatments.filter(treatment => 
        treatment.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allTreatments;

  if (searchParams.concern && searchParams.concern !== "all") {
    filteredTreatments = filteredTreatments.filter(treatment => {
      const name = treatment.name.toLowerCase();
      switch (searchParams.concern) {
        case "acne": return name.includes("acne");
        case "anti-aging": return name.includes("anti") || name.includes("wrinkle") || name.includes("botox");
        case "pigmentation": return name.includes("pigmentation") || name.includes("melasma");
        case "hair-loss": return name.includes("hair") || name.includes("alopecia");
        case "body-contouring": return name.includes("coolsculpting") || name.includes("liposuction") || name.includes("aqualyx");
        default: return true;
      }
    });
  }

  if (searchParams.treatmentType && searchParams.treatmentType !== "all") {
    filteredTreatments = filteredTreatments.filter(treatment => {
      const name = treatment.name.toLowerCase();
      switch (searchParams.treatmentType) {
        case "surgical": return name.includes("augmentation") || name.includes("rhinoplasty") || name.includes("liposuction");
        case "non-surgical": return name.includes("botox") || name.includes("filler") || name.includes("hifu");
        case "laser": return name.includes("laser") || name.includes("ipl");
        case "injectable": return name.includes("botox") || name.includes("filler") || name.includes("profhilo");
        case "skincare": return name.includes("peel") || name.includes("facial") || name.includes("obagi");
        default: return true;
      }
    });
  }

  if (searchParams.treatmentArea && searchParams.treatmentArea !== "all") {
    filteredTreatments = filteredTreatments.filter(treatment => {
      const name = treatment.name.toLowerCase();
      switch (searchParams.treatmentArea) {
        case "face": return name.includes("cheek") || name.includes("chin") || name.includes("lip") || name.includes("tear") || name.includes("botox");
        case "body": return name.includes("breast") || name.includes("liposuction") || name.includes("coolsculpting");
        case "hair": return name.includes("hair") || name.includes("alopecia") || name.includes("eyebrow");
        case "skin": return name.includes("acne") || name.includes("pigmentation") || name.includes("dermatology");
        case "lips": return name.includes("lip");
        default: return true;
      }
    });
  }

  const sortBy = searchParams.sort ?? "name-asc";
  if (sortBy === "name-desc") {
    filteredTreatments.sort((a, b) => b.name.localeCompare(a.name));
  } else {
    filteredTreatments.sort((a, b) => a.name.localeCompare(b.name));
  }

  const totalPages = Math.ceil(filteredTreatments.length / ITEMS_PER_PAGE);


  return (
    <main className="bg-(--primary-bg-color)">
      <SearchBar />
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12 flex flex-col sm:flex-row justify-center w-full md:gap-10 ">
        
        
        
      
          <CollectionsFilter pageType="Treatments" />
          
          <div className="flex-1 min-w-0">
          <ItemsGrid items={theTreatments} />
          </div>
         
            
      


        
      </div>
    </main>
  );
} 