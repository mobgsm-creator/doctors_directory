import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TreatmentFilters() {
  return (
    <div className="w-64">
      <h3 className="font-semibold text-xl text-black mb-6">Filters</h3>

      {/* Concern Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Concern:
        </label>
        <Select>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue className="text-black" placeholder="All"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="acne">Acne</SelectItem>
            <SelectItem value="wrinkles">Anti-Aging</SelectItem>
            <SelectItem value="pigmentation">Pigmentation</SelectItem>
            <SelectItem value="hair-loss">Hair Loss</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Treatment Type Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Type:
        </label>
        <Select>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="surgical">Surgical</SelectItem>
            <SelectItem value="non-surgical">Non-Surgical</SelectItem>
            <SelectItem value="laser">Laser</SelectItem>
            <SelectItem value="injectable">Injectable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Treatment Area Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Treatment Area:
        </label>
        <Select>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="face">Face</SelectItem>
            <SelectItem value="body">Body</SelectItem>
            <SelectItem value="hair">Hair</SelectItem>
            <SelectItem value="skin">Skin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Practitioner Type Filter */}
      <div className="mb-6">
        <label className="block text-base font-medium text-black mb-2">
          Practitioner Type:
        </label>
        <Select>
          <SelectTrigger className="w-full h-12 px-4 py-3 bg-white border border-gray-300 rounded-md">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="dermatologist">Dermatologist</SelectItem>
            <SelectItem value="plastic-surgeon">
              Plastic Surgeon
            </SelectItem>
            <SelectItem value="aesthetic-practitioner">
              Aesthetic Practitioner
            </SelectItem>
            <SelectItem value="nurse">Nurse Practitioner</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}