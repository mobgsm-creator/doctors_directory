import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface TreatmentFilters {
  concern: string;
  treatmentType: string;
  treatmentArea: string;
  priceRange: string;
}

interface FilterFormProps {
  filters: TreatmentFilters;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function FilterForm({ filters, onChange, onClear }: FilterFormProps) {
  return (
    <>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Concern:
          <Select
          value={filters.concern}
          onValueChange={(v) => onChange("concern", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="acne">Acne</SelectItem>
            <SelectItem value="anti-aging">Anti-Aging</SelectItem>
            <SelectItem value="pigmentation">Pigmentation</SelectItem>
            <SelectItem value="hair-loss">Hair Loss</SelectItem>
            <SelectItem value="body-contouring">Body Contouring</SelectItem>
          </SelectContent>
        </Select>
        </label>
        
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Type:
          <Select
          value={filters.treatmentType}
          onValueChange={(v) => onChange("treatmentType", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="surgical">Surgical</SelectItem>
            <SelectItem value="non-surgical">Non-Surgical</SelectItem>
            <SelectItem value="laser">Laser</SelectItem>
            <SelectItem value="injectable">Injectable</SelectItem>
            <SelectItem value="skincare">Skincare</SelectItem>
          </SelectContent>
        </Select>
        </label>
        
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Area:
          <Select
          value={filters.treatmentArea}
          onValueChange={(v) => onChange("treatmentArea", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="face">Face</SelectItem>
            <SelectItem value="body">Body</SelectItem>
            <SelectItem value="hair">Hair</SelectItem>
            <SelectItem value="skin">Skin</SelectItem>
            <SelectItem value="lips">Lips</SelectItem>
          </SelectContent>
        </Select>
        </label>
        
      </div>

      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Price Range:
          <Select
          value={filters.priceRange}
          onValueChange={(v) => onChange("priceRange", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="under-200">Under £200</SelectItem>
            <SelectItem value="200-500">£200 - £500</SelectItem>
            <SelectItem value="500-1000">£500 - £1,000</SelectItem>
            <SelectItem value="over-1000">Over £1,000</SelectItem>
          </SelectContent>
        </Select>
        </label>
        
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