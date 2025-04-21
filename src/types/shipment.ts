export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  placeId?: string;
}

export type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface Shipment {
  id: string;
  tracking_number: string;
  user_id: string;
  product_type: string;
  recipient_name: string;
  recipient_phone: string;
  origin_formatted_address: string;
  origin_place_id?: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_formatted_address: string;
  destination_place_id?: string;
  destination_latitude: number;
  destination_longitude: number;
  weight: string;
  length: string;
  width: string;
  height: string;
  additional_details?: string;
  start_date_time: string;
  delivery_date_time: string;
  window_delivery_time?: string;
  status: ShipmentStatus;
  created_at: string;
  updated_at: string;
  carrier_id?: string;
  route_id?: string;
}
