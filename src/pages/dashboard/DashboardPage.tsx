import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { PlusIcon, PackageIcon, TruckIcon, ClockIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  metricsService,
  type ShipmentMetrics,
} from "@/services/metrics.service";

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [metrics, setMetrics] = useState<ShipmentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      let data: ShipmentMetrics;

      try {
        data = await metricsService.getMetrics();
      } catch (error: unknown) {
        // Fallback to mock data if backend is not available
        console.log(
          "Using mock data while backend is not available:",
          error instanceof Error ? error.message : "Unknown error"
        );
        data = {
          carrierPerformance: [
            {
              carrierId: "1",
              carrierName: "Express Logistics",
              avgDeliveryTime: 48,
              completedShipments: 150,
              onTimeDeliveries: 140,
            },
            {
              carrierId: "2",
              carrierName: "Fast Delivery Co.",
              avgDeliveryTime: 52,
              completedShipments: 120,
              onTimeDeliveries: 100,
            },
            {
              carrierId: "3",
              carrierName: "Rapid Transport",
              avgDeliveryTime: 45,
              completedShipments: 180,
              onTimeDeliveries: 170,
            },
          ],
          timelineMetrics: [
            {
              date: "2024-03-01",
              completed: 20,
              pending: 5,
              inTransit: 10,
            },
            {
              date: "2024-03-02",
              completed: 25,
              pending: 8,
              inTransit: 12,
            },
            {
              date: "2024-03-03",
              completed: 18,
              pending: 6,
              inTransit: 15,
            },
            {
              date: "2024-03-04",
              completed: 30,
              pending: 4,
              inTransit: 8,
            },
            {
              date: "2024-03-05",
              completed: 22,
              pending: 7,
              inTransit: 11,
            },
            {
              date: "2024-03-06",
              completed: 28,
              pending: 5,
              inTransit: 9,
            },
            {
              date: "2024-03-07",
              completed: 24,
              pending: 6,
              inTransit: 13,
            },
          ],
          topCarriers: [
            {
              carrierId: "1",
              carrierName: "Express Logistics",
              totalShipments: 150,
              successRate: 93.3,
            },
            {
              carrierId: "2",
              carrierName: "Fast Delivery Co.",
              totalShipments: 120,
              successRate: 83.3,
            },
            {
              carrierId: "3",
              carrierName: "Rapid Transport",
              totalShipments: 180,
              successRate: 94.4,
            },
          ],
        };
      }

      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    completed: { label: "Completados", color: "#22c55e" },
    pending: { label: "Pendientes", color: "#f59e0b" },
    in_transit: { label: "En Tránsito", color: "#3b82f6" },
  };

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
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Envíos por Estado (Últimos 7 días)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative w-full" style={{ height: "300px" }}>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      data={metrics?.timelineMetrics}
                      width={700}
                      height={280}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => formatDate(value)}
                        fontSize={12}
                      />
                      <YAxis fontSize={12} />
                      <ChartTooltip
                        content={({ active, payload }) =>
                          active && payload && payload.length ? (
                            <ChartTooltipContent
                              active={active}
                              payload={payload}
                              formatter={(value, name) => [
                                value,
                                chartConfig[name as keyof typeof chartConfig]
                                  .label,
                              ]}
                            />
                          ) : null
                        }
                      />
                      <Bar
                        dataKey="completed"
                        fill={chartConfig.completed.color}
                        name="completed"
                      />
                      <Bar
                        dataKey="pending"
                        fill={chartConfig.pending.color}
                        name="pending"
                      />
                      <Bar
                        dataKey="in_transit"
                        fill={chartConfig.in_transit.color}
                        name="in_transit"
                      />
                      <ChartLegend
                        content={({ payload }) => (
                          <ChartLegendContent payload={payload} />
                        )}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Transportistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <TruckIcon className="h-4 w-4" />
                            Transportista
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-4 w-4" />
                            Tiempo Promedio (hrs)
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metrics?.carrierPerformance.map((carrier) => (
                        <TableRow key={carrier.carrierId}>
                          <TableCell>{carrier.carrierName}</TableCell>
                          <TableCell>{carrier.avgDeliveryTime}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Top Transportistas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transportista</TableHead>
                      <TableHead>Total Envíos</TableHead>
                      <TableHead>Tasa de Éxito</TableHead>
                      <TableHead>Entregas a Tiempo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics?.topCarriers.map((carrier) => (
                      <TableRow key={carrier.carrierId}>
                        <TableCell>{carrier.carrierName}</TableCell>
                        <TableCell>{carrier.totalShipments}</TableCell>
                        <TableCell>{carrier.successRate}%</TableCell>
                        <TableCell>
                          {metrics.carrierPerformance.find(
                            (c) => c.carrierId === carrier.carrierId
                          )?.onTimeDeliveries || 0}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
