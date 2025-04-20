export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  placeId?: string;
}

export interface Shipment {
  id: string;
  status: "pending" | "in_transit" | "delivered" | "cancelled";
  pickupAddress: Address;
  deliveryAddress: Address;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description?: string;
  createdAt: string;
}
