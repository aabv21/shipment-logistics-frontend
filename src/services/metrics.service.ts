import { api } from "@/lib/axios";

export interface ShipmentMetrics {
  carrierPerformance: {
    carrierId: string;
    carrierName: string;
    avgDeliveryTime: number;
    completedShipments: number;
    onTimeDeliveries: number;
  }[];
  timelineMetrics: {
    date: string;
    pending: number;
    inTransit: number;
    completed: number;
  }[];
  topCarriers: {
    carrierId: string;
    carrierName: string;
    totalShipments: number;
    successRate: number;
  }[];
}

export const metricsService = {
  async getMetrics() {
    const response = await api.get<ShipmentMetrics>("/metrics");
    return response.data;
  },
};
