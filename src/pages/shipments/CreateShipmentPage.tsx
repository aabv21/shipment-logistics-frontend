import { CreateShipmentForm } from "@/components/shipments/CreateShipmentForm";

export function CreateShipmentPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Crear Nuevo Envío</h1>
        <div className="bg-card p-6 rounded-lg shadow">
          <CreateShipmentForm />
        </div>
      </div>
    </div>
  );
}
