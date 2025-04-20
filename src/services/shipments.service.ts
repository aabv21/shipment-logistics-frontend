import { api } from "@/lib/axios";

export interface CreateShipmentData {
  weight: string;
  length: string;
  width: string;
  height: string;
  product_type: string;
  recipient_name: string;
  recipient_phone: string;
  formatted_address: string;
  place_id: string;
  additional_details?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface Shipment extends CreateShipmentData {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export const shipmentsService = {
  create: async (data: CreateShipmentData): Promise<ApiResponse<Shipment>> => {
    const response = await api.post<ApiResponse<Shipment>>("/shipments", data);
    return response.data;
  },
};
