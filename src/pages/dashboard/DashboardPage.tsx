import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { PlusIcon, PackageIcon } from "lucide-react";

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Hola, {user?.first_name} {user?.last_name}
        </h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido al panel de control de envíos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-card rounded-lg border shadow-sm">
          <h2 className="font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/shipments/create")}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Crear Nuevo Envío
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => navigate("/shipments")}
            >
              <PackageIcon className="mr-2 h-4 w-4" />
              Ver Todos los Envíos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
