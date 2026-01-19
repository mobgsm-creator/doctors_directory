import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ClinicFilters {
  servicesOffered: string;
  location: string;
  rating: string;
  distance: string;
  query?: string;
}

interface ClinicFiltersProps {
  filters: ClinicFilters;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function ClinicFilters({ filters, onChange, onClear }: ClinicFiltersProps) {
  return (
    <>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

       <div className="mb-6">
         <label htmlFor="clinics-search" className="sr-only">Search</label>
         <input
           id="clinics-search"
           type="text"
           value={filters.query || ""}
           onChange={(e) => onChange("query", e.target.value)}
           placeholder="Search clinics..."
           className="w-full px-3 py-2 text-base border rounded-md bg-white"
         />
       </div>

      <div className="mb-6">
        <label htmlFor="clinics-services" className="block text-base font-medium text-black mb-2">
          Services Offered:
        </label>
         <Select
    
           value={filters.servicesOffered}
           onValueChange={(v) => onChange("servicesOffered", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="botox">Botox</SelectItem>
            <SelectItem value="fillers">Dermal Fillers</SelectItem>
            <SelectItem value="laser">Laser Treatments</SelectItem>
            <SelectItem value="skincare">Skincare</SelectItem>
            <SelectItem value="surgery">Cosmetic Surgery</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="clinics-distance" className="block text-base font-medium text-black mb-2">
           Distance:
         </label>
         <Select
 
           value={filters.distance}
           onValueChange={(v) => onChange("distance", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5km">Within 5km</SelectItem>
            <SelectItem value="10km">Within 10km</SelectItem>
            <SelectItem value="25km">Within 25km</SelectItem>
            <SelectItem value="50km">Within 50km</SelectItem>
            <SelectItem value="100km">Within 100km</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="clinics-rating" className="block text-base font-medium text-black mb-2">
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