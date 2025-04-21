import { z } from "zod";

export const addHistoryStatusSchema = z.object({
  status: z.enum(["PENDING", "IN_TRANSIT", "DELIVERED", "CANCELLED"]),
  notes: z.string().optional(),
  location_formatted_address: z.string().min(1, "La ubicación es requerida"),
  location_place_id: z.string().min(1, "La ubicación es requerida"),
  location_latitude: z.string(),
  location_longitude: z.string(),
});

export type AddHistoryStatusFormData = z.infer<typeof addHistoryStatusSchema>;
