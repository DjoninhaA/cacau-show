import { z } from "zod";
import { CRITERIA } from "./criteria.js";

const KNOWN_IDS = new Set(CRITERIA.map((c) => c.id));

// API payload for creating/updating a reseller. Phone is digits only.
export const resellerInputSchema = z.object({
  companyName: z.string().trim().min(2),
  contactName: z.string().trim().min(2),
  phone: z.string().regex(/^\d{10,11}$/),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  checkedCriteria: z
    .array(z.string())
    .refine((ids) => ids.every((id) => KNOWN_IDS.has(id)), "unknown criterion")
    .transform((ids) => [...new Set(ids)]),
});

export type ResellerInput = z.infer<typeof resellerInputSchema>;
