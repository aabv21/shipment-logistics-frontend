import { api } from "@/lib/axios";

export const routesService = {
  list: async (page: number = 1, limit: number = 10, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);

    return api.get(`/routes?${params.toString()}`);
  },

  create: async (data: {
    name: string;
    origin_formatted_address: string;
    origin_place_id: string;
    origin_latitude: number;
    origin_longitude: number;
    destination_formatted_address: string;
    destination_place_id: string;
    destination_latitude: number;
    destination_longitude: number;
    is_active: boolean;
  }) => {
    return api.post("/routes", data);
  },

  delete: async (id: string) => {
    return api.delete(`/routes/${id}`);
  },

  update: async (
    id: string,
    data: {
      name?: string;
      origin_formatted_address?: string;
      origin_place_id?: string;
      origin_latitude?: number;
      origin_longitude?: number;
      destination_formatted_address?: string;
      destination_place_id?: string;
      destination_latitude?: number;
      destination_longitude?: number;
      is_active?: boolean;
    }
  ) => {
    return api.patch(`/routes/${id}`, data);
  },
};
