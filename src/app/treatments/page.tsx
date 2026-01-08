import { SearchForm } from "@/components/treatment-search-client";
import { TreatmentFiltersClient } from "@/components/treatment-filters-client";
import { TreatmentGrid } from "@/components/treatment-grid";
import { searchTreatments } from "./actions";

const TreatmentMap: Record<string, string> = {
  "Acne": "/directory/treatments/acne.webp",
  "Alopecia": "/directory/treatments/alopecia.webp",
  "Anti Wrinkle Treatment": "/directory/treatments/anti wrinkle treatment.webp",
  "Aqualyx": "/directory/treatments/aqualyx.webp",
  "Aviclear": "/directory/treatments/aviclear.webp",
  "B12 Injection": "/directory/treatments/b12.webp",
  "Birthmarks": "/directory/treatments/birthmarks.webp",
  "Botox": "/directory/treatments/botox.webp",
  "Breast Augmentation": "/directory/treatments/breast-augmentation.webp",
  "Cheek Enhancement": "/directory/treatments/cheek-enhancement.webp",
  "Chemical Peel": "/directory/treatments/chemical-peel.webp",
  "Chin Enhancement": "/directory/treatments/chin-enhancement.webp",
  "Aesthetic Skin Consultation": "/directory/treatments/consultation.webp",
  "Contact Dermatitis": "/directory/treatments/contact-dermatitis.webp",
  "CoolSculpting": "/directory/treatments/coolsculpting.webp",
  "Cysts Treatment": "/directory/treatments/cyst-treatment.webp",
  "Dermapen Treatment": "/directory/treatments/dermapen.webp",
  "Dermatitis Treatment": "/directory/treatments/dermatitis-treatment.webp",
  "Dermatology Treatments": "/directory/treatments/dermatology-treatments.webp",
  "Eczema Treatment": "/directory/treatments/exzema-treatment.webp",
  "Eyebrows and Lashes": "/directory/treatments/eyebrow-lashes.webp",
  "Facial Treatments": "/directory/treatments/facial-treatments.webp",
  "Hair Treatments": "/directory/treatments/hair.webp",
  "HIFU": "/directory/treatments/hifu.webp",
  "Hives Treatment": "/directory/treatments/hives.webp",
  "Hyperhidrosis": "/directory/treatments/Hyperhidrosis.webp",
  "Inflammatory Skin Conditions": "/directory/treatments/inflammatory skin conditions.webp",
  "IPL Treatment": "/directory/treatments/ipl-treatments.webp",
  "Keloid Removal": "/directory/treatments/keloid removal.webp",
  "Tattoo Removal": "/directory/treatments/laser-tattoo-removal.webp",
  "Laser Treatments": "/directory/treatments/laser-treatments.webp",
  "Fillers": "/directory/treatments/lip-filler-6485474_640.webp",
  "Liposuction": "/directory/treatments/liposuction illustration.webp",
  "Lips": "/directory/treatments/lips.webp",
  "Lymphatic Drainage": "/directory/treatments/lymphatic-drainage.webp",
  "Marionettes": "/directory/treatments/marionettes.webp",
  "Massage": "/directory/treatments/massage.webp",
  "Melanoma Treatment": "/directory/treatments/melanoma-treatments.webp",
  "Melasma Treatment": "/directory/treatments/melasma.webp",
  "Microneedling": "/directory/treatments/micro-needling.webp",
  "Microblading": "/directory/treatments/microblading.webp",
  "Microneedling with Radiofrequency": "/directory/treatments/microneedling with radiofrequency.webp",
  "Moles": "/directory/treatments/moles.webp",
  "Nails": "/directory/treatments/nail-polish-2112358_640.webp",
  "Obagi": "/directory/treatments/obagi.webp",
  "Patch Testing": "/directory/treatments/patch-testing.webp",
  "Photodynamic Therapy (PDT)": "/directory/treatments/photodynamic therapy.webp",
  "Pigmentation Treatment": "/directory/treatments/pigmentation-treatments.webp",
  "Polynucleotide Treatment": "/directory/treatments/polynucleotide-treatment.webp",
  "Profhilo": "/directory/treatments/profhilo.webp",
  "Platelet Rich Plasma": "/directory/treatments/prp.webp",
  "Psoriasis": "/directory/treatments/psoriasis.webp",
  "Rash Treatment": "/directory/treatments/rash-treatment.webp",
  "Rosacea Treatment": "/directory/treatments/rosacea.webp",
  "Scarring": "/directory/treatments/scarring.webp",
  "Seborrheic Keratosis Treatment": "/directory/treatments/seborrheic keratosis.webp",
  "Seborrhoeic Dermatitis": "/directory/treatments/seborrhoeic dermatitis.webp",
  "Rhinoplasty": "/directory/treatments/side-view-doctor-checking-patient-before-rhinoplasty.webp",
  "Skin Texture and Tightening": "/directory/treatments/skin texture and tightening.webp",
  "Skin Booster": "/directory/treatments/skin-booster.webp",
  "Skin Cancer": "/directory/treatments/skin-cancer.webp",
  "Skin Lesions": "/directory/treatments/skin-lesions.webp",
  "Skin Tags": "/directory/treatments/skin-tags.webp",
  "Tear Trough Treatment": "/directory/treatments/tear-through-treatments.webp",
  "Threading": "/directory/treatments/threading.webp",
  "Varicose Vein Procedure": "/directory/treatments/varicose-vein.webp",
  "Verruca Treatment": "/directory/treatments/verruca treatment.webp",
  "Vitamin Therapy": "/directory/treatments/vitamin-therapy.webp",
  "Vulval Dermatology": "/directory/treatments/vulval-dermatology.webp",
  "Weight Loss": "/directory/treatments/weight-loss.webp"
};

export default function HomePage({ 
  searchParams 
}: { 
  searchParams: { 
    query?: string;
    page?: string;
    concern?: string;
    treatmentType?: string;
    treatmentArea?: string;
    priceRange?: string;
    sort?: string;
  } 
}) {
  const ITEMS_PER_PAGE = 12;
  const currentPage = parseInt(searchParams.page || '1', 10);

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