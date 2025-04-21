import { useRef, useEffect, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useParams } from "react-router-dom";
import {
  Loader2,
  MapPinIcon,
  CalendarIcon,
  ClipboardIcon,
  PlusCircle,
  PackageIcon,
} from "lucide-react";
import { shipmentsService } from "@/services/shipments";
import { Shipment } from "@/types/shipment";
import { formatDate, getShipmentStatusInfo } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLoadGoogleMaps } from "@/hooks/useLoadGoogleMaps";
import { useWebSocket } from "@/providers/WebSocketProvider";
import { AddHistoryStatus } from "@/components/shipments/AddHistoryStatus";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mapContainerStyle = {
  height: "500px",
  width: "100%",
  borderRadius: "10px",
};

const truncateAddress = (address: string, maxLength: number = 30) => {
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
};

const truncateNotes = (notes: string, maxLength: number = 30) => {
  if (!notes) return "Sin notas";
  if (notes.length <= maxLength) return notes;
  return `${notes.substring(0, maxLength)}...`;
};

interface DataCoordinates {
  lat: number;
  lng: number;
}

interface ShipmentHistory {
  id: string;
  shipment_id: string;
  location_latitude: string;
  location_longitude: string;
  location_formatted_address: string;
  location_place_id: string;
  notes: string;
  created_at: string;
  status: string;
}

export const TrackingPage = () => {
  const { user } = useAuthStore();
  const { onHistoryUpdate } = useWebSocket();
  const mapRef = useRef<google.maps.Map>(null);
  const [loading, setLoading] = useState(true);
  const [dataCoordinates, setDataCoordinates] = useState<DataCoordinates[]>([]);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [history, setHistory] = useState<ShipmentHistory[]>([]);
  const { id } = useParams();
  const { isLoaded, loadError } = useLoadGoogleMaps();
  const origin = dataCoordinates[0];
  const destination = dataCoordinates[dataCoordinates.length - 1];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchShipmentData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await shipmentsService.getWithHistory(id);
      setShipment(response.data.shipment);
      setHistory(response.data.history);

      const coordinates = response.data.history.map((event) => ({
        lat: parseFloat(event.location_latitude),
        lng: parseFloat(event.location_longitude),
      }));

      setDataCoordinates(coordinates);
    } catch (error) {
      console.error("Error fetching shipment data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentData();
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;

    onHistoryUpdate(() => {
      fetchShipmentData();
    });
  }, [user?.id]);

  useEffect(() => {
    if (!isLoaded || !origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error fetching directions", result);
        }
      }
    );
  }, [isLoaded, origin, destination]);

  const onMapLoad = (mapInstance: google.maps.Map) => {
    mapRef.current = mapInstance;
    if (dataCoordinates.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      dataCoordinates.forEach((coord) => bounds.extend(coord));
      mapInstance.fitBounds(bounds);
    }
  };

  if (loading || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">
          {!isLoaded
            ? "Cargando Google Maps..."
            : "Cargando información del envío..."}
        </span>
      </div>
    );
  }

  if (loadError) {
    return <div>Error al cargar Google Maps</div>;
  }

  if (!shipment) {
    return <div>No se encontró información del envío</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <PackageIcon className="h-8 w-8" />
            Tracking {shipment?.tracking_number}
          </h1>
          <Badge
            className="text-base"
            variant={getShipmentStatusInfo(shipment?.status || "").variant}
          >
            {getShipmentStatusInfo(shipment?.status || "").label}
          </Badge>
        </div>
        {user?.role !== "ADMIN" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar Estado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Estado</DialogTitle>
              </DialogHeader>
              <AddHistoryStatus
                shipmentId={shipment?.id || ""}
                onStatusAdded={() => {
                  setIsDialogOpen(false);
                  fetchShipmentData();
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Ubicación
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <ClipboardIcon className="h-4 w-4" />
                      Notas
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Fecha
                    </div>
                  </TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            <div>
                              <p className="text-sm">
                                {truncateAddress(
                                  event.location_formatted_address
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {event.location_latitude},{" "}
                                {event.location_longitude}
                              </p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{event.location_formatted_address}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="text-left">
                            <div className="text-sm">
                              {truncateNotes(event.notes)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{event.notes || "Sin notas"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{formatDate(event.created_at)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getShipmentStatusInfo(event.status).variant}
                      >
                        {getShipmentStatusInfo(event.status).label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {isLoaded && (
          <GoogleMap
            onLoad={onMapLoad}
            mapContainerStyle={mapContainerStyle}
            zoom={10}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
              zoomControl: true,
              fullscreenControl: true,
            }}
          >
            {dataCoordinates.map((coordinate, index) => (
              <Marker
                key={index}
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 5,
                  fillColor: "#FF0000",
                  fillOpacity: 1,
                  strokeWeight: 3,
                  strokeColor: "#FFFFFF",
                }}
                position={{ lat: coordinate.lat, lng: coordinate.lng }}
              />
            ))}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#FF0000",
                    strokeWeight: 2,
                  },
                }}
              />
            )}
          </GoogleMap>
        )}
      </div>
    </>
  );
};

export default TrackingPage;
