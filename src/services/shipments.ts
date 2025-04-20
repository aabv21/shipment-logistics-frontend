import { Shipment } from "@/types/shipment";
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
};
