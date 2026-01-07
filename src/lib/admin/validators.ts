import { clinicSchema } from '@/lib/schemas/clinic.schema'
import { practitionerSchema } from '@/lib/schemas/practitioner.schema'
import { productSchema } from '@/lib/schemas/product.schema'
import { treatmentSchema } from '@/lib/schemas/treatment.schema'

export function validateClinic(data: any) {
  return clinicSchema.safeParse(data)
}

export function validatePractitioner(data: any) {
  return practitionerSchema.safeParse(data)
}

export function validateProduct(data: any) {
  return productSchema.safeParse(data)
}

export function validateTreatment(data: any) {
  return treatmentSchema.safeParse(data)
}
