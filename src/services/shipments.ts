import { Shipment, ShipmentStatus } from "@/types/shipment";
import { api } from "@/lib/axios";

interface ListResponse {
  success: boolean;
  data: {
    shipments: Shipment[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

type CreateShipmentData = Omit<
  Shipment,
  | "id"
  | "status"
  | "createdAt"
  | "created_at"
  | "updated_at"
  | "tracking_number"
  | "user_id"
>;

export const shipmentsService = {
  async create(shipmentData: CreateShipmentData) {
    const response = await api.post<Shipment>("/shipments", shipmentData);
    return response.data;
  },

  async list(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      params.append("search", search);
    }

    const response = await api.get<ListResponse>(`/shipments?${params}`);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/shipments/${id}`);
    return response.data;
  },

  async getWithHistory(id: string) {
    const response = await api.get<{
      shipment: Shipment;
      history: Array<{
        id: string;
        shipment_id: string;
        location_latitude: string;
        location_longitude: string;
        location_formatted_address: string;
        location_place_id: string;
        notes: string;
        created_at: string;
        status: string;
      }>;
    }>(`/shipments/${id}`);
    return response;
  },

  async addHistory(
    shipmentId: string,
    data: {
      shipment_id: string;
      status: ShipmentStatus;
      notes: string;
      location_latitude: string;
      location_longitude: string;
      location_place_id: string;
      location_formatted_address: string;
    }
  ) {
    const response = await api.post<{
      id: string;
      shipment_id: string;
      status: string;
      notes: string;
      location_latitude: string;
      location_longitude: string;
      location_place_id: string;
      location_formatted_address: string;
      created_at: string;
    }>(`/shipments/${shipmentId}/history`, data);
    return response.data;
  },
};
