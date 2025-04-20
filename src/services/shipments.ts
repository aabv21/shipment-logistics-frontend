import { Shipment } from "../types/shipment";
import { api } from "@/lib/axios";

export const shipmentsService = {
  async create(shipmentData: Omit<Shipment, "id" | "status" | "createdAt">) {
    const response = await api.post<Shipment>("/shipments", shipmentData);
    return response.data;
  },
};
