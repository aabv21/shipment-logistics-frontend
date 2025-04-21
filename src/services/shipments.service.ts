import { api } from "@/lib/axios";

export interface CreateShipmentData {
  weight: string;
  length: string;
  width: string;
  height: string;
  product_type: string;
  recipient_name: string;
  recipient_phone: string;
  origin_formatted_address: string;
  origin_place_id: string;
  origin_latitude: number | undefined;
  origin_longitude: number | undefined;
  destination_formatted_address: string;
  destination_place_id: string;
  destination_latitude: number | undefined;
  destination_longitude: number | undefined;
  additional_details?: string | undefined;
  start_date_time: string;
  delivery_date_time: string;
  window_delivery_time?: string;
  status: string;
}

export const shipmentsService = {
  async create(shipmentData: CreateShipmentData) {
    const response = await api.post("/shipments", shipmentData);
    return response.data;
  },
};
