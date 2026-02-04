import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {edu, spec, locations} from "@/lib/data";

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
  setIsFilterActive: (val: boolean) => void;
}

export function PractitionerFilters({ filters, onChange, onClear, setIsFilterActive }: Readonly<PractitionerFiltersProps>) {
  return (
    <>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

       <div className="mb-6">
         <label htmlFor="practitioners-search" className="sr-only">Search</label>
         <input
           id="practitioners-search"
           type="text"
           value={filters.query || ""}
           onChange={(e) => onChange("query", e.target.value)}
           placeholder="Search practitioners..."
           className="w-full px-3 py-2 text-base border rounded-md bg-white"
         />
       </div>

      <div className="mb-6">
        <label htmlFor="practitioners-specialty" className="block text-base font-medium text-black mb-2">
           Practitioner Specialty:
        </label>
         <Select

           value={filters.practitioner_specialty}
           onValueChange={(v) => onChange("practitioner_specialty", v)}
           onOpenChange={(open) => {            
              if (open) setIsFilterActive(true);
            }}

        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {spec.map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
            
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="practitioners-qualifications" className="block text-base font-medium text-black mb-2">
           Practitioner Qualifications:
        </label>
         <Select

           value={filters.practitioner_qualifications}
           onValueChange={(v) => onChange("practitioner_qualifications", v)}
           onOpenChange={(open) => {            
              if (open) setIsFilterActive(true);
            }}

        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {edu.map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="practitioners-city" className="block text-base font-medium text-black mb-2">
           City:
        </label>
         <Select
 
           value={filters.City}
           onValueChange={(v) => onChange("City", v)}
           onOpenChange={(open) => {            
              if (open) setIsFilterActive(true);
            }}

        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {locations.map((item) => (
              <SelectItem value={item}>{item}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="practitioners-rating" className="block text-base font-medium text-black mb-2">
           Minimum Rating:
        </label>
         <Select

           value={filters.rating}
           onValueChange={(v) => onChange("rating", v)}
           onOpenChange={(open) => {            
              if (open) setIsFilterActive(true);
            }}

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