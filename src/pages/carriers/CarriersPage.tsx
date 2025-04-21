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
  SearchIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  SettingsIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { carriersService } from "@/services/carriers";

interface Carrier {
  id: string;
  user_id: string;
  is_available: boolean;
  vehicle_type: string;
  vehicle_capacity: number;
  vehicle_plate_number: string;
  created_at: string;
  updated_at: string;
}

interface CarriersResponse {
  carriers: Carrier[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function CarriersPage() {
  const navigate = useNavigate();
  const [carriers, setCarriers] = useState<CarriersResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchCarriers = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const response = await carriersService.list(page, 10, search);
      setCarriers(response.data);
    } catch (error) {
      console.error("Error fetching carriers:", error);
      toast.error("Error al cargar los transportistas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "¿Estás seguro de que deseas eliminar este transportista?"
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await carriersService.delete(id);
      toast.success("Transportista eliminado exitosamente");
      fetchCarriers(currentPage, debouncedSearch);
    } catch (error) {
      console.error("Error deleting carrier:", error);
      toast.error("Error al eliminar el transportista");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transportistas</h1>
        <Button
          onClick={() => navigate("/carriers/create")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Crear Nuevo Transportista
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar transportistas..."
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
                  <UserIcon className="h-4 w-4" />
                  ID Usuario
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4" />
                  Tipo de Vehículo
                </div>
              </TableHead>
              <TableHead>Capacidad</TableHead>
              <TableHead>Placa</TableHead>
              <TableHead>Disponibilidad</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fecha Registro
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
                <TableCell colSpan={7} className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Cargando transportistas...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : carriers?.carriers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No se encontraron transportistas
                </TableCell>
              </TableRow>
            ) : (
              carriers?.carriers.map((carrier) => (
                <TableRow key={carrier.id}>
                  <TableCell>{carrier.user_id}</TableCell>
                  <TableCell>{carrier.vehicle_type}</TableCell>
                  <TableCell>{carrier.vehicle_capacity} kg</TableCell>
                  <TableCell>{carrier.vehicle_plate_number}</TableCell>
                  <TableCell>
                    <Badge
                      variant={carrier.is_available ? "success" : "destructive"}
                    >
                      {carrier.is_available ? (
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 mr-1" />
                      )}
                      {carrier.is_available ? "Disponible" : "No Disponible"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(carrier.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(carrier.id)}
                        title="Eliminar transportista"
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

      {carriers && carriers.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="py-2 px-4">
            Página {currentPage} de {carriers.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === carriers.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
