import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { shipmentsService } from "@/services/shipments";
import { Shipment } from "@/types/shipment";
import { useDebounce } from "@/hooks/useDebounce";
import {
  SearchIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  MapIcon,
  PackageIcon,
  ArrowRightIcon,
  ActivityIcon,
  CalendarIcon,
  SettingsIcon,
  RouteIcon,
  CopyIcon,
  TruckIcon,
} from "lucide-react";
import { formatDate, getShipmentStatusInfo } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ShipmentsResponse {
  shipments: Shipment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const truncateAddress = (address: string, maxLength: number = 30) => {
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
};

export function ShipmentsPage() {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<ShipmentsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchShipments = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const response = await shipmentsService.list(page, 10, search);
      setShipments(response.data);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este envío?")) {
      return;
    }

    try {
      setIsLoading(true);
      await shipmentsService.delete(id);
      toast.success("Envío eliminado exitosamente");
      fetchShipments(currentPage, debouncedSearch);
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Error al eliminar el envío");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewTracking = (id: string) => {
    navigate(`/shipments/tracking/${id}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Envíos</h1>
        <Button
          onClick={() => navigate("/shipments/create")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Crear Nuevo Envío
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar envíos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4" />
                  Número de Guía
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" />
                  Origen
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ArrowRightIcon className="h-4 w-4" />
                  Destino
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4" />
                  Transportista
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <RouteIcon className="h-4 w-4" />
                  Ruta
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ActivityIcon className="h-4 w-4" />
                  Estado
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fechas
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Acciones
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Cargando envíos...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : shipments?.shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No se encontraron envíos
                </TableCell>
              </TableRow>
            ) : (
              shipments?.shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-auto p-0 font-mono"
                            onClick={() =>
                              copyToClipboard(shipment.tracking_number)
                            }
                          >
                            {shipment.tracking_number}
                            <CopyIcon className="ml-2 h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click para copiar</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <div>
                            <p>
                              {truncateAddress(
                                shipment.origin_formatted_address
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {shipment.origin_latitude},{" "}
                              {shipment.origin_longitude}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{shipment.origin_formatted_address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <div>
                            <p>
                              {truncateAddress(
                                shipment.destination_formatted_address
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {shipment.destination_latitude},{" "}
                              {shipment.destination_longitude}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{shipment.destination_formatted_address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {shipment.carrier_id ? (
                      <span className="text-sm">{shipment.carrier_id}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sin asignar
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {shipment.route_id ? (
                      <span className="text-sm">{shipment.route_id}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Sin asignar
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getShipmentStatusInfo(shipment.status).variant}
                    >
                      {getShipmentStatusInfo(shipment.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs">
                        Creado: {formatDate(shipment.created_at)}
                      </p>
                      {shipment.delivery_date_time && (
                        <p className="text-xs">
                          Entrega: {formatDate(shipment.delivery_date_time)}
                        </p>
                      )}
                      {shipment.window_delivery_time && (
                        <p className="text-xs text-muted-foreground">
                          Ventana: {formatDate(shipment.window_delivery_time)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewTracking(shipment.id)}
                        title="Ver tracking"
                      >
                        <MapIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(shipment.id)}
                        title="Eliminar envío"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {shipments && shipments.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="py-2 px-4">
            Página {currentPage} de {shipments.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === shipments.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
