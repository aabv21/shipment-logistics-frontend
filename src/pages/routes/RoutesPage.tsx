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
import {
  SearchIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  ArrowRightIcon,
  CalendarIcon,
  SettingsIcon,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { routesService } from "@/services/routes";

interface Route {
  id: string;
  name: string;
  origin_formatted_address: string;
  origin_latitude: number;
  origin_longitude: number;
  destination_formatted_address: string;
  destination_latitude: number;
  destination_longitude: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface RoutesResponse {
  routes: Route[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const truncateAddress = (address: string, maxLength: number = 30) => {
  if (address.length <= maxLength) return address;
  return `${address.substring(0, maxLength)}...`;
};

export function RoutesPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<RoutesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const fetchRoutes = async (page: number, search?: string) => {
    try {
      setIsLoading(true);
      const response = await routesService.list(page, 10, search);
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Error al cargar las rutas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      return;
    }

    try {
      setIsLoading(true);
      await routesService.delete(id);
      toast.success("Ruta eliminada exitosamente");
      fetchRoutes(currentPage, debouncedSearch);
    } catch (error) {
      console.error("Error deleting route:", error);
      toast.error("Error al eliminar la ruta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rutas</h1>
        <Button
          onClick={() => navigate("/routes/create")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Crear Nueva Ruta
        </Button>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Buscar rutas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table key={"routes-table"}>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
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
              <TableHead>Estado</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Fecha Creación
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
                <TableCell colSpan={6} className="text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Cargando rutas...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : routes?.routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron rutas
                </TableCell>
              </TableRow>
            ) : (
              routes?.routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>{route.name}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="text-left">
                          <div>
                            <p>
                              {truncateAddress(route.origin_formatted_address)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {route.origin_latitude}, {route.origin_longitude}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{route.origin_formatted_address}</p>
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
                                route.destination_formatted_address
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {route.destination_latitude},{" "}
                              {route.destination_longitude}
                            </p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{route.destination_formatted_address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <Badge variant={route.is_active ? "success" : "secondary"}>
                      {route.is_active ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(route.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(route.id)}
                        title="Eliminar ruta"
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

      {routes && routes.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="py-2 px-4">
            Página {currentPage} de {routes.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === routes.pages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
