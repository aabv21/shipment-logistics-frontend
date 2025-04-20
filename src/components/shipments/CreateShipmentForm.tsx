// Dependencies
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressAutocomplete } from "@/components/address/AddressAutocomplete";

// Services
import { shipmentsService } from "@/services/shipments.service";
import { PRODUCT_TYPES } from "@/constants";

// Utils
import { getLocalISOString } from "@/lib/utils";
declare global {
  interface Window {
    google: {
      maps: {
        Geocoder: new () => google.maps.Geocoder;
        GeocoderStatus: {
          OK: "OK";
        };
      };
    };
  }
}

const createShipmentSchema = z.object({
  weight: z.string(),
  length: z.string(),
  width: z.string(),
  height: z.string(),
  product_type: z.string(),
  recipient_name: z.string(),
  recipient_phone: z.string(),
  formatted_address: z.string(),
  place_id: z.string(),
  window_delivery_time: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Debe ser una fecha y hora válida",
    }),
  delivery_date_time: z.string(),
  start_date_time: z.string(),
  status: z.string(),
  additional_details: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormData = z.infer<typeof createShipmentSchema>;

export function CreateShipmentForm() {
  const form = useForm<FormData>({
    defaultValues: {
      weight: "",
      length: "",
      width: "",
      height: "",
      product_type: "",
      recipient_name: "",
      recipient_phone: "",
      formatted_address: "",
      place_id: "",
      window_delivery_time: "",
      delivery_date_time: "",
      start_date_time: getLocalISOString(new Date()),
      status: "PENDING",
      additional_details: "",
    },
    resolver: zodResolver(createShipmentSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const result = await new Promise<google.maps.GeocoderResult>(
        (resolve, reject) => {
          geocoder.geocode({ placeId: data.place_id }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
              resolve(results[0]);
            } else {
              reject(new Error("Failed to geocode address"));
            }
          });
        }
      );

      const shipmentData = {
        ...data,
        latitude: result.geometry.location.lat(),
        longitude: result.geometry.location.lng(),
      };

      await shipmentsService.create(shipmentData);
      toast.success("Shipment created successfully");
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Package Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del paquete</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input placeholder="10.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largo (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="30" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ancho (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alto (cm)</FormLabel>
                  <FormControl>
                    <Input placeholder="15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="product_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de producto</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRODUCT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Recipient Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información del destinatario</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="recipient_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Juan Pérez" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2 lg:col-span-3">
              <AddressAutocomplete
                onAddressSelect={(place) => {
                  if (place) {
                    form.setValue("formatted_address", place.formattedAddress);
                    form.setValue("place_id", place.place_id);
                  }
                }}
              />
            </div>

            <FormField
              control={form.control}
              name="start_date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora de inicio</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delivery_date_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora de entrega</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="window_delivery_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y hora máxima de entrega</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Información adicional</h3>
          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="additional_details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detalles adicionales</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Instrucciones especiales, referencias, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit">Crear envío</Button>
      </form>
    </Form>
  );
}
