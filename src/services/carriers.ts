import { api } from "@/lib/axios";

export const carriersService = {
  list: async (page: number = 1, limit: number = 10, search?: string) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);

    return api.get(`/carriers?${params.toString()}`);
  },

  create: async (data: {
    user_id: string;
    vehicle_type: string;
    vehicle_capacity: number;
    vehicle_plate_number: string;
    is_available: boolean;
  }) => {
    return api.post("/carriers", data);
  },

  delete: async (id: string) => {
    return api.delete(`/carriers/${id}`);
  },

  update: async (
    id: string,
    data: {
      vehicle_type?: string;
      vehicle_capacity?: number;
      vehicle_plate_number?: string;
      is_available?: boolean;
    }
  ) => {
    return api.patch(`/carriers/${id}`, data);
  },
};
