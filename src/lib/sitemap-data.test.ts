import { getClinics, getEnrichedPractitioners, getPractitioners } from '@/lib/sitemap-data'

describe('getEnrichedPractitioners', () => {
  test('preserves clinic treatments when practitioner treatments are null', () => {
    const clinics = getClinics()
    const practitioners = getPractitioners()

    const candidate = practitioners.find((practitioner) => {
      if (practitioner.Treatments !== null) return false
      if (typeof practitioner.Associated_Clinics !== 'string') return false

      try {
        const parsed = JSON.parse(practitioner.Associated_Clinics)
        if (!Array.isArray(parsed) || typeof parsed[0] !== 'string') return false

        const clinic = clinics.find((entry) => entry.slug === parsed[0])
        return Array.isArray(clinic?.Treatments) && clinic.Treatments.length > 0
      } catch {
        return false
      }
    })

    expect(candidate).toBeDefined()

    const enriched = getEnrichedPractitioners().find(
      (entry) => entry.practitioner_name === candidate?.practitioner_name
    )

    expect(enriched).toBeDefined()
    expect(Array.isArray(enriched?.Treatments)).toBe(true)
    expect((enriched?.Treatments ?? []).length).toBeGreaterThan(0)
  })
})