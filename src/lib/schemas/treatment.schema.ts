import { z } from "zod"

export const treatmentSchema = z.record(z.any())

export type TreatmentInput = z.infer<typeof treatmentSchema>
