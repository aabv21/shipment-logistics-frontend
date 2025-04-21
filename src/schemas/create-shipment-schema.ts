import * as z from "zod";

export const createShipmentSchema = z.object({
  weight: z.string().min(1, "Peso es requerido"),
  length: z.string().min(1, "Longitud es requerida"),
  width: z.string().min(1, "Ancho es requerido"),
  height: z.string().min(1, "Altura es requerida"),
  product_type: z.string().min(1, "Tipo de producto es requerido"),
  recipient_name: z.string().min(1, "Nombre del destinatario es requerido"),
  recipient_phone: z.string().min(1, "Teléfono del destinatario es requerido"),
  origin_formatted_address: z
    .string()
    .min(1, "Dirección de origen es requerida"),
  origin_place_id: z.string().min(1, "ID de lugar de origen es requerido"),
  destination_formatted_address: z
    .string()
    .min(1, "Dirección de destino es requerida"),
  destination_place_id: z
    .string()
    .min(1, "ID de lugar de destino es requerido"),
  start_date_time: z.string().min(1, "Fecha y hora de inicio es requerida"),
  delivery_date_time: z.string().min(1, "Fecha y hora de entrega es requerida"),
  window_delivery_time: z.string().optional(),
  additional_details: z.string().optional(),
});

export type CreateShipmentFormData = z.infer<typeof createShipmentSchema>;
