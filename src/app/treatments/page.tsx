import { SearchForm } from "@/components/treatment-search-client";
import { TreatmentFiltersClient } from "@/components/treatment-filters-client";
import { TreatmentGrid } from "@/components/treatment-grid";
import { searchTreatments } from "./actions";
import { TreatmentMap } from "@/lib/data";

 
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
  const currentPage = Number.parseInt(searchParams.page || '1', 10);

  const allTreatments = Object.keys(TreatmentMap).map((name) => ({
    name,
    image: TreatmentMap[name].split("?w")[0] || "/placeholder.svg",
    slug: `/treatments/${name}`,
  }));

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

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    return queryString ? `/treatments?${queryString}` : '/treatments';
  };

  return (
    <main className="bg-[var(--primary-bg-color)]">
      <div className="mx-auto max-w-7xl md:px-4 py-4 md:py-12 flex flex-col justify-center w-full md:gap-10 ">
        <SearchForm searchAction={searchTreatments} />
        
        <div className="flex md:flex-row flex-col items-start justify-start gap-6">
          <TreatmentFiltersClient />
          
          <div className="flex-1">
            <TreatmentGrid 
              treatments={filteredTreatments}
              searchQuery={searchQuery}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={ITEMS_PER_PAGE}
              getPageUrl={getPageUrl}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 