import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShipmentStatus } from "@/types/shipment";
import { shipmentsService } from "@/services/shipments";
import { AddressAutocomplete } from "@/components/address/AddressAutocomplete";

interface Props {
  shipmentId: string;
  onStatusAdded: () => void;
}

export function AddHistoryStatus({ shipmentId, onStatusAdded }: Props) {
  const [status, setStatus] = useState<ShipmentStatus>("PENDING");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    place_id: string;
    formatted_address: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    try {
      setLoading(true);
      console.log(shipmentId);
      await shipmentsService.addHistory(shipmentId, {
        shipment_id: shipmentId,
        status,
        notes,
        location_latitude: location.latitude.toString(),
        location_longitude: location.longitude.toString(),
        location_place_id: location.place_id,
        location_formatted_address: location.formatted_address,
      });

      setStatus("PENDING");
      setNotes("");
      setLocation(null);
      onStatusAdded();
    } catch (error) {
      console.error("Error adding history:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <Select
          value={status}
          onValueChange={(value: ShipmentStatus) => setStatus(value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pendiente</SelectItem>
            <SelectItem value="IN_TRANSIT">En Tránsito</SelectItem>
            <SelectItem value="DELIVERED">Entregado</SelectItem>
            <SelectItem value="CANCELLED">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ubicación</label>
        <AddressAutocomplete
          onAddressSelect={(address) => {
            setLocation({
              latitude: address.lat,
              longitude: address.lng,
              place_id: address.place_id,
              formatted_address: address.formattedAddress,
            });
          }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notas</label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Agregar notas sobre el estado..."
        />
      </div>

      <Button type="submit" disabled={loading || !location}>
        {loading ? "Agregando..." : "Agregar Estado"}
      </Button>
    </form>
  );
}
