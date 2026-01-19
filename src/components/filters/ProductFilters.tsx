import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ProductFilters {
  product_category: string;
  brand: string;
  distributor_cleaned: string;
  category: string;
  query?: string;
}

interface ProductFiltersProps {
  filters: ProductFilters;
  onChange: (key: string, value: string) => void;
  onClear: () => void;
}

export function ProductFilters({ filters, onChange, onClear }: Readonly<ProductFiltersProps>) {
  return (
    <>
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

       <div className="mb-6">
         <label htmlFor="products-search" className="sr-only">Search</label>
         <input
           id="products-search"
           type="text"
           value={filters.query || ""}
           onChange={(e) => onChange("query", e.target.value)}
           placeholder="Search products..."
           className="w-full px-3 py-2 text-base border rounded-md bg-white"
         />
       </div>

      <div className="mb-6">
        <label htmlFor="products-category" className="block text-base font-medium text-black mb-2">
           Product Category:
        </label>
         <Select

           value={filters.product_category}
           onValueChange={(v) => onChange("product_category", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Aesthetic & Dermatology Equipment">Aesthetic & Dermatology Equipment</SelectItem>
            <SelectItem value="Aesthetic & Medical Devices">Aesthetic & Medical Devices</SelectItem>
            <SelectItem value="Aesthetic & Skincare">Aesthetic & Skincare</SelectItem>
            <SelectItem value="Clothing & Scrubs">Clothing & Scrubs</SelectItem>
            <SelectItem value="Cosmetics">Cosmetics</SelectItem>
            <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
            <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="products-brand" className="block text-base font-medium text-black mb-2">
           Brand:
        </label>
         <Select

           value={filters.brand}
           onValueChange={(v) => onChange("brand", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="3M">3M</SelectItem>
            <SelectItem value="3M Littmann">3M Littmann</SelectItem>
            <SelectItem value="Alexandra">Alexandra</SelectItem>
            <SelectItem value="AETER">AETER</SelectItem>
            <SelectItem value="WOMAKE">WOMAKE</SelectItem>
            <SelectItem value="Xeomin">Xeomin</SelectItem>
            <SelectItem value="Zidac">Zidac</SelectItem>
          </SelectContent>
        </Select>
      </div>

       <div className="mb-6">
         <label htmlFor="products-distributor" className="block text-base font-medium text-black mb-2">
           Distributor:
        </label>
         <Select

           value={filters.distributor_cleaned}
           onValueChange={(v) => onChange("distributor_cleaned", v)}
        >
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Medisave">Medisave</SelectItem>
            <SelectItem value="Fillersdirect">Fillers Direct</SelectItem>
            <SelectItem value="Aestheticsrxpharma">Aesthetics RX Pharma</SelectItem>
            <SelectItem value="Twofaceaesthetics">Two Face Aesthetics</SelectItem>
            <SelectItem value="DDgroup">DD Group</SelectItem>
            <SelectItem value="Dermafillerltd">Derma Filler Ltd</SelectItem>
            <SelectItem value="Laserandaesthetics">Laser and Aesthetics</SelectItem>
            <SelectItem value="France-health">France Health</SelectItem>
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