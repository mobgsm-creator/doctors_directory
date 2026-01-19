import { z } from "zod"
import { clinicSchema } from "./clinic.schema"
// Practitioner schema is identical to clinic schema just add   practitioner_image_link: z.string().optional(),
  
export const practitionerSchema = clinicSchema.extend({
  practitioner_roles: z.string().optional(),
  practitioner_qualifications: z.string().optional(),
  practitioner_awards: z.string().optional(),
  practitioner_media: z.string().optional(),
  practitioner_experience: z.string().optional(),
  practitioner_name: z.string().optional(),
  practitioner_title: z.string().optional(),
  practitioner_specialty: z.string().optional(),
  practitioner_education: z.string().optional(),
})
export type PractitionerInput = z.infer<typeof practitionerSchema>
