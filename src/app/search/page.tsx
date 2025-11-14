import SearchPage from "@/components/searchClient"
import { searchPractitioners } from "@/app/actions/search"
export default async function Page() {
  const initialFilters = {
    query: "",
    category: "All Categories",
    location: "",
    services: [],
    rating: 0,
    type: "Practitioner"
  }
  
  const result = await searchPractitioners(initialFilters, 1, "default")
  return (
    <SearchPage 
      initialData={result.data}
      initialTotalCount={result.totalCount}
      initialTotalPages={result.totalPages}
    />
  )
}
