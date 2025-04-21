import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLocalISOString(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}

export function formatAddress(address: {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}): string {
  const { street, city, state, country, postalCode } = address;
  return `${street}, ${city}, ${state} ${postalCode}, ${country}`;
}

export function getShipmentStatusInfo(status: string): {
  label: string;
  variant: "default" | "success" | "warning" | "destructive" | "info";
} {
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "default" | "success" | "warning" | "destructive" | "info";
    }
  > = {
    PENDING: { label: "Pendiente", variant: "warning" },
    IN_TRANSIT: { label: "En tránsito", variant: "info" },
    DELIVERED: { label: "Entregado", variant: "success" },
    CANCELLED: { label: "Cancelado", variant: "destructive" },
  };

  return statusMap[status] || { label: status, variant: "default" };
}
