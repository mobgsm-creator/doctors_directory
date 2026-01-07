export interface SearchOptions {
  query?: string
  fields?: string[]
  exact?: boolean
  filters?: Record<string, any>
}

export function searchItems<T extends Record<string, any>>(
  items: T[],
  options: SearchOptions
): T[] {
  const { query, filters, exact = false } = options

  let filtered = items

  // Apply filters
  if (filters) {
    filtered = filtered.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        const itemValue = item[key]

        // Handle array filters
        if (Array.isArray(value)) {
          return Array.isArray(itemValue) && value.some(v => itemValue.includes(v))
        }

        // Handle string filters (partial match)
        if (typeof value === 'string' && typeof itemValue === 'string') {
          if (exact) {
            return itemValue.toLowerCase() === value.toLowerCase()
          }
          return itemValue.toLowerCase().includes(value.toLowerCase())
        }

        // Handle boolean/number filters (exact match)
        return itemValue === value
      })
    )
  }

  // Apply query search
  if (query) {
    const queryLower = query.toLowerCase()
    filtered = filtered.filter(item =>
      Object.values(item).some(value => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(queryLower)
      })
    )
  }

  return filtered
}
