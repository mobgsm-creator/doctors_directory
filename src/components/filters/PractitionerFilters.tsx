import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PractitionerFilters {
  practitioner_specialty: string;
  practitioner_qualifications: string;
  City: string;
  rating: string;
  query?: string;
}

interface PractitionerFiltersProps {
  filters: PractitionerFilters;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function PractitionerFilters({ filters, onChange, onClear }: PractitionerFiltersProps) {
  return (
    <>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

      <div className="mb-6">
        <h3 className="sr-only">Search</h3>
        <input
          type="text"
          value={filters.query || ""}
          onChange={(e) => onChange("query", e.target.value)}
          placeholder="Search practitioners..."
          className="w-full px-3 py-2 text-base border rounded-md bg-white"
        />
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Practitioner Specialty:
        </label>
        <Select
          value={filters.practitioner_specialty}
          onValueChange={(v) => onChange("practitioner_specialty", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="acne">Acne</SelectItem>
            <SelectItem value="botox">Botox</SelectItem>
            <SelectItem value="anti wrinkle treatment">Anti Wrinkle Treatment</SelectItem>
            <SelectItem value="aesthetic skin consultation">Aesthetic Skin Consultation</SelectItem>
            <SelectItem value="alopecia">Alopecia</SelectItem>
            <SelectItem value="basal cell carcinoma">Basal Cell Carcinoma</SelectItem>
            <SelectItem value="breast augmentation">Breast Augmentation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Practitioner Qualifications:
        </label>
        <Select
          value={filters.practitioner_qualifications}
          onValueChange={(v) => onChange("practitioner_qualifications", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Consultant">Consultant</SelectItem>
            <SelectItem value="Dermatologist">Dermatologist</SelectItem>
            <SelectItem value="Cosmetic surgeon">Cosmetic surgeon</SelectItem>
            <SelectItem value="Doctor">Doctor</SelectItem>
            <SelectItem value="Beautician">Beautician</SelectItem>
            <SelectItem value="Hair replacement service">Hair replacement service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          City:
        </label>
        <Select
          value={filters.City}
          onValueChange={(v) => onChange("City", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="London">London</SelectItem>
            <SelectItem value="Manchester">Manchester</SelectItem>
            <SelectItem value="Birmingham">Birmingham</SelectItem>
            <SelectItem value="Leeds">Leeds</SelectItem>
            <SelectItem value="Glasgow">Glasgow</SelectItem>
            <SelectItem value="Edinburgh">Edinburgh</SelectItem>
            <SelectItem value="Liverpool">Liverpool</SelectItem>
            <SelectItem value="Bristol">Bristol</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Minimum Rating:
        </label>
        <Select
          value={filters.rating}
          onValueChange={(v) => onChange("rating", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="4">4+ Stars</SelectItem>
            <SelectItem value="4.5">4.5+ Stars</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        onClick={onClear}
        className="w-full"
      >
        Clear All
      </Button>
    </>
  );
}