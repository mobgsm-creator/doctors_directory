# SEO Collection Pages Implementation Plan

## Overview
This plan outlines the strategy for creating 18 SEO collection pages (a-r) following the pattern established in `src/app/clinics/[cityslug]/services/[serviceslug]/page.tsx`. Each page type will follow a consistent structure with variations in filtering logic and route parameters.

---

## 1. Data Loading Strategy

### 1.1 Create Shared Data Loader (`src/app/actions/seo-loader.ts`)

Extend the existing `loadData()` pattern from `search.ts` to create a reusable data loader for SEO pages:

**Key Functions:**
- `loadSEOData()` - Loads and merges Clinic, Practitioner, and Product data
- `getClinicsByCity(citySlug)` - Returns clinics for a specific city
- `getPractitionersByCity(citySlug)` - Returns practitioners for a specific city
- `getTreatments()` - Returns all available treatments
- `getProductsByCategory(category)` - Returns products by category
- `getProductsByDistributor(distributor)` - Returns products by distributor
- `getAccreditedClinics(accreditationType, citySlug)` - Returns accredited clinics
- `getPractitionersByCredential(credential, citySlug)` - Returns practitioners by credential

**Data Merging Pattern:**
Follow the practitioner-clinic merging logic from `search.ts:39-52`:
```typescript
const clinicIndex = new Map(clinics.map(c => [c.slug, c]))
const practitioners = practitionersData.map(p => {
  const clinic = clinicIndex.get(JSON.parse(p.Associated_Clinics!)[0])
  if (!clinic) return null
  return { ...clinic, ...practitionerFields }
}).filter(Boolean)
```

---

## 2. Folder Structure

```
src/app/
├── accredited/
│   ├── [accreditation]/             # isJCCP, isCQC, isHIW, isHIS, isRQIA
│   │   └── clinics/
│   │       └── [cityslug]/
│   │           └── page.tsx         # a) Accredited Clinic in city
│   └── practitioners/
│       └── [cityslug]/
│           └── page.tsx             # m) Accredited Practitioner Treatment
├── clinics/
│   ├── [cityslug]/
│   │   ├── page.tsx                 # c) Clinic in City
│   │   ├── services/
│   │   │   └── [serviceslug]/
│   │   │       └── page.tsx        # b) Treatment in City (existing)
│   │   └── practitioners/
│   │       └── [credential]/
│   │           └── page.tsx        # n) Clinic × Credentialed Practitioner
│   ├── treatments/
│   │   └── [treatmentslug]/
│   │       └── [cityslug]/
│   │           └── page.tsx        # e) Clinics with Treatment in city
│   └── accredited/
│       └── [accreditation]/
│           └── [cityslug]/
│               └── page.tsx        # l) Accredited Clinic in city [p & c JCCP]
├── practitioners/
│   ├── [cityslug]/
│   │   ├── page.tsx                 # d) Practitioner in city
│   │   └── credentials/
│   │       └── [credential]/
│   │           └── page.tsx        # g) Practitioner by Educational Credential in city
│   ├── treatments/
│   │   └── [treatmentslug]/
│   │       └── [cityslug]/
│   │           └── page.tsx        # f) Practitioner with Treatment in city
│   └── accredited/
│       └── [cityslug]/
│           └── page.tsx            # m) Accredited Practitioner Treatment
├── products/
│   ├── category/
│   │   └── [categoryslug]/
│   │       └── page.tsx             # i) Brand Products by Category
│   ├── distributor/
│   │   └── [distributorslug]/
│   │       └── page.tsx             # j) Brand Products by Distributor
│   └── treatments/
│       └── [treatmentslug]/
│           └── page.tsx             # k) Product x Treatment
├── treatments/
│   ├── [treatmentslug]/
│   │   ├── cities/
│   │   │   └── [cityslug]/
│   │   │       └── page.tsx        # h) Treatment × Accredited x city
│   └── page.tsx                     # o) Treatments (list all)
├── clinics/                          # p) Clinics (list all - may already exist)
│   └── page.tsx
├── practitioners/                    # q) Practitioners (list all)
│   └── page.tsx
└── products/                         # r) Products (list all)
    └── page.tsx
```

---

## 3. Page Type Implementation Details

### 3.1 Accreditation Pages (a, h, l, m)

**Data Fields Used:**
- `isJCCP: [boolean, string] | null`
- `isCQC: [boolean, string] | null`
- `isHIW: [boolean, string] | null`
- `isHIS: [boolean, string] | null`
- `isRQIA: [boolean, string] | null`

**Filtering Logic:**
```typescript
const filteredClinics = clinics.filter(clinic =>
  clinic.City?.toLowerCase() === cityslug.toLowerCase() &&
  clinic[accreditation]?.[0] === true
)
```

**Pages:**
- **a) Accredited (JCCP, CQC) Clinic in city** → `/accredited/[accreditation]/clinics/[cityslug]/page.tsx`
- **h) Treatment × Accredited x city** → `/treatments/[treatmentslug]/cities/[cityslug]/page.tsx` + accreditation filter
- **l) Accredited Clinic in city [p & c JCCP]** → `/clinics/accredited/[accreditation]/[cityslug]/page.tsx`
- **m) Accredited Practitioner Treatment** → `/practitioners/accredited/[cityslug]/page.tsx`

---

### 3.2 Treatment Pages (b, e, f, h, o)

**Data Fields Used:**
- `Treatments: string[]` (from Clinic and Practitioner)
- `modalities` array from `@/lib/data`

**Filtering Logic:**
```typescript
const serviceMatch = categories.some((cat: string) =>
  cat.replaceAll(" ", "").toLowerCase() === serviceslug.replaceAll("%20", "").toLowerCase()
)
```

**Pages:**
- **b) Treatment in City** → `/clinics/[cityslug]/services/[serviceslug]/page.tsx` (existing)
- **e) Clinics with Treatment in city** → `/clinics/treatments/[treatmentslug]/[cityslug]/page.tsx`
- **f) Practitioner with Treatment in city** → `/practitioners/treatments/[treatmentslug]/[cityslug]/page.tsx`
- **h) Treatment × Accredited x city** → `/treatments/[treatmentslug]/cities/[cityslug]/page.tsx` + accreditation filter
- **o) Treatments** → `/treatments/page.tsx` (list all treatments)

---

### 3.3 City Pages (c, d)

**Data Fields Used:**
- `City: string`

**Filtering Logic:**
```typescript
const cityMatch = clinic.City?.toLowerCase() === cityslug.toLowerCase()
```

**Pages:**
- **c) Clinic in City** → `/clinics/[cityslug]/page.tsx`
- **d) Practitioner in city** → `/practitioners/[cityslug]/page.tsx`

---

### 3.4 Credential Pages (g, n)

**Data Fields Used:**
- `practitioner_qualifications?: string`
- `practitioner_education?: string`

**Filtering Logic:**
```typescript
const credentialMatch = practitioner.practitioner_qualifications?.toLowerCase().includes(credential.toLowerCase())
```

**Pages:**
- **g) Practitioner by Educational Credential in city** → `/practitioners/[cityslug]/credentials/[credential]/page.tsx`
- **n) Clinic × Credentialed Practitioner** → `/clinics/[cityslug]/practitioners/[credential]/page.tsx`

---

### 3.5 Product Pages (i, j, k, r)

**Data Fields Used:**
- `category: string`
- `brand: string | null`
- `distributor_cleaned: string`
- `product_name: string`

**Filtering Logic:**
```typescript
const categoryMatch = product.category.toLowerCase() === categoryslug.toLowerCase()
const distributorMatch = product.distributor_cleaned.toLowerCase() === distributorslug.toLowerCase()
const treatmentMatch = product.key_benefits?.some(benefit =>
  benefit.toLowerCase().includes(treatmentslug.toLowerCase())
)
```

**Pages:**
- **i) Brand Products by Category** → `/products/category/[categoryslug]/page.tsx`
- **j) Brand Products by Distributor** → `/products/distributor/[distributorslug]/page.tsx`
- **k) Product x Treatment** → `/products/treatments/[treatmentslug]/page.tsx`
- **r) Products** → `/products/page.tsx` (list all products)

---

### 3.6 List Pages (o, p, q, r)

These are overview pages listing all entities:
- **o) Treatments** → `/treatments/page.tsx`
- **p) Clinics** → `/clinics/page.tsx`
- **q) Practitioners** → `/practitioners/page.tsx`
- **r) Products** → `/products/page.tsx`

**Implementation:** Display paginated lists with filter sidebar (similar to search results page).

---

## 4. Component Architecture

### 4.1 Shared Components

Create reusable components in `src/components/seo/`:

```
src/components/seo/
├── seo-page-header.tsx          # Page title, description, breadcrumbs
├── seo-filters.tsx              # Filter sidebar component
├── seo-pagination.tsx           # Pagination controls
├── seo-card-clinic.tsx          # Clinic card (reuse from existing)
├── seo-card-practitioner.tsx    # Practitioner card (extend clinic card)
└── seo-card-product.tsx         # Product card (new)
```

### 4.2 Page Template

All SEO pages will follow this structure:
```typescript
import { notFound } from "next/navigation"
import { loadSEOData } from "@/app/actions/seo-loader"
import { SEOPageHeader, SEOFilters, SEOPagination, SEOCard } from "@/components/seo"

export default async function Page({ params }) {
  const data = await loadSEOData()
  const filteredData = data.filter(/* page-specific logic */)

  if (!filteredData.length) notFound()

  return (
    <main>
      <SEOPageHeader title="..." description="..." />
      <div className="grid">
        <SEOFilters />
        <div className="content">
          {filteredData.map(item => <SEOCard key={item.slug} data={item} />)}
          <SEOPagination />
        </div>
      </div>
    </main>
  )
}
```

---

## 5. Initial Data Operations

### 5.1 Data Preparation

**Step 1: Extract Cities**
```typescript
// Extract unique cities from clinics
const cities = [...new Set(clinics.map(c => c.City))]
// Generate slugs: "London" → "london"
```

**Step 2: Extract Treatments**
```typescript
// Merge clinic.Treatments + practitioner.Treatments + modalities
const allTreatments = [...modalities]
clinics.forEach(c => allTreatments.push(...(c.Treatments || [])))
practitioners.forEach(p => allTreatments.push(...(p.Treatments || [])))
// Deduplicate and normalize
```

**Step 3: Extract Credentials**
```typescript
// Parse practitioner_qualifications and practitioner_education
const credentials = new Set()
practitioners.forEach(p => {
  const qual = p.practitioner_qualifications?.split(/,|&|\//)
  qual?.forEach(c => credentials.add(c.trim()))
  const edu = p.practitioner_education?.split(/,|&|\//)
  edu?.forEach(c => credentials.add(c.trim()))
})
```

**Step 4: Extract Product Categories & Distributors**
```typescript
const categories = [...new Set(products.map(p => p.category))]
const distributors = [...new Set(products.map(p => p.distributor_cleaned))]
```

**Step 5: Extract Accreditations**
```typescript
const accreditationTypes = ['isJCCP', 'isCQC', 'isHIW', 'isHIS', 'isRQIA']
```

---

## 6. Static Generation Strategy

### 6.1 generateStaticParams Implementation

For dynamic routes with cityslug, serviceslug, etc., implement static params generation:

```typescript
export async function generateStaticParams() {
  const data = await loadSEOData()
  return data.cities.map(city => ({
    cityslug: city.toLowerCase().replace(/\s+/g, '-')
  }))
}
```

**Priority Levels:**
1. High priority (build at build time): Major cities (London, Manchester, Birmingham), popular treatments
2. Medium priority: Secondary cities, niche treatments
3. Low priority (ISR): Long-tail combinations

### 6.2 generateMetadata Implementation

Dynamic metadata for SEO optimization:

```typescript
export async function generateMetadata({ params }) {
  const { cityslug, serviceslug } = params
  return {
    title: `Top ${serviceslug} Providers in ${cityslug}`,
    description: `Find accredited ${serviceslug} clinics and practitioners in ${cityslug}. Compare ratings, reviews, and book appointments.`,
    openGraph: { /* ... */ }
  }
}
```

---

## 7. Implementation Order

### Phase 1: Foundation (High Priority)
1. Create `src/app/actions/seo-loader.ts` with data loading functions
2. Create shared components in `src/components/seo/`
3. Implement list pages (o, p, q, r)

### Phase 2: City Pages (Medium Priority)
4. Implement c) Clinic in City
5. Implement d) Practitioner in City
6. Test and refine city slug generation

### Phase 3: Treatment Pages (Medium Priority)
7. Extend existing b) Treatment in City pattern
8. Implement e) Clinics with Treatment in city
9. Implement f) Practitioner with Treatment in city

### Phase 4: Accreditation Pages (Medium Priority)
10. Implement a) Accredited Clinic in city
11. Implement m) Accredited Practitioner Treatment
12. Implement l) Accredited Clinic in city [p & c JCCP]

### Phase 5: Credential Pages (Low Priority)
13. Implement g) Practitioner by Educational Credential in city
14. Implement n) Clinic × Credentialed Practitioner

### Phase 6: Product Pages (Low Priority)
15. Implement i) Brand Products by Category
16. Implement j) Brand Products by Distributor
17. Implement k) Product x Treatment

### Phase 7: Advanced Combinations (Low Priority)
18. Implement h) Treatment × Accredited x city

---

## 8. Key Considerations

### 8.1 URL Structure Consistency
- All city slugs: lowercase, kebab-case
- All service/treatment slugs: lowercase, kebab-case
- Handle spaces and special characters consistently

### 8.2 Performance Optimization
- Use `cache()` for data loading
- Implement pagination for large result sets
- Consider ISR for frequently updated data

### 8.3 SEO Best Practices
- Implement canonical URLs
- Add structured data (JSON-LD)
- Optimize meta descriptions and titles
- Include breadcrumb navigation
- Add internal linking between related pages

### 8.4 Error Handling
- Return 404 for no results
- Add fallback UI for missing data
- Log 404s for analysis

### 8.5 Testing
- Unit tests for data loader functions
- E2E tests for page rendering
- SEO validation (meta tags, structured data)

---

## 9. Example Page Comparison

| Page Type | Route Pattern | Data Source | Filter Fields | Card Component |
|-----------|--------------|-------------|---------------|----------------|
| a) Accredited Clinic | `/accredited/[acc]/clinics/[city]` | Clinic + city | `is[ACC][0] === true` | ClinicCard |
| b) Treatment in City | `/clinics/[city]/services/[treatment]` | Clinic + city + treatment | `Treatments.includes()` | ClinicCard |
| c) Clinic in City | `/clinics/[city]` | Clinic + city | `City === city` | ClinicCard |
| d) Practitioner in City | `/practitioners/[city]` | Practitioner + city | `City === city` | PractitionerCard |
| e) Clinics with Treatment | `/clinics/treatments/[treatment]/[city]` | Clinic + city + treatment | `Treatments.includes()` | ClinicCard |
| f) Practitioner with Treatment | `/practitioners/treatments/[treatment]/[city]` | Practitioner + city + treatment | `Treatments.includes()` | PractitionerCard |
| g) Practitioner by Credential | `/practitioners/[city]/credentials/[cred]` | Practitioner + city | `qualifications.includes()` | PractitionerCard |
| h) Treatment × Accredited | `/treatments/[treatment]/cities/[city]` | Clinic + city + treatment + acc | `Treatments + is[ACC]` | ClinicCard |
| i) Products by Category | `/products/category/[cat]` | Product + category | `category === cat` | ProductCard |
| j) Products by Distributor | `/products/distributor/[dist]` | Product + distributor | `distributor === dist` | ProductCard |
| k) Product × Treatment | `/products/treatments/[treatment]` | Product + treatment | `key_benefits.includes()` | ProductCard |
| l) Accredited Clinic | `/clinics/accredited/[acc]/[city]` | Clinic + city + acc | `is[ACC][0] === true` | ClinicCard |
| m) Accredited Practitioner | `/practitioners/accredited/[city]` | Practitioner + city | `is[ACC][0] === true` | PractitionerCard |
| n) Clinic × Credentialed | `/clinics/[city]/practitioners/[cred]` | Practitioner + city | `qualifications.includes()` | PractitionerCard |
| o) Treatments | `/treatments` | All treatments | None | TreatmentList |
| p) Clinics | `/clinics` | All clinics | None | ClinicList |
| q) Practitioners | `/practitioners` | All practitioners | None | PractitionerList |
| r) Products | `/products` | All products | None | ProductList |
