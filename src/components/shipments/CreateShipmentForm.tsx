// Dependencies
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { shipmentsService } from "@/services/shipments";
import { PRODUCT_TYPES } from "@/constants";

// Utils
import { getLocalISOString } from "@/lib/utils";
import {
  createShipmentSchema,
  type CreateShipmentFormData,
} from "../../schemas/create-shipment-schema";

export function CreateShipmentForm() {
  const navigate = useNavigate();
  const form = useForm<CreateShipmentFormData>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      weight: "",
      length: "",
      width: "",
      height: "",
      product_type: "",
      recipient_name: "",
      recipient_phone: "",
      origin_formatted_address: "",
      origin_place_id: "",
      destination_formatted_address: "",
      destination_place_id: "",
      start_date_time: getLocalISOString(new Date(Date.now() + 60 * 60 * 1000)),
      delivery_date_time: "",
      window_delivery_time: "",
      additional_details: "",
    },
  });

  const onSubmit = async (data: CreateShipmentFormData) => {
    try {
      const geocoder = new window.google.maps.Geocoder();

      // Geocode origin address
      const originResult = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { placeId: data.origin_place_id },
          (results, status) => {
            if (status === "OK" && results?.[0]?.geometry?.location) {
              resolve(results[0]);
            } else {
              reject(new Error("Failed to geocode origin address"));
            }
          }
        );
      });

      // Geocode destination address
      const destResult = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { placeId: data.destination_place_id },
          (results, status) => {
            if (status === "OK" && results?.[0]?.geometry?.location) {
              resolve(results[0]);
            } else {
              reject(new Error("Failed to geocode destination address"));
            }
          }
        );
      });

      const originLocation = (originResult as google.maps.GeocoderResult)
        .geometry.location;
      const destLocation = (destResult as google.maps.GeocoderResult).geometry
        .location;

      // Transform form data to match API expectations
      const shipmentData = {
        product_type: data.product_type,
        recipient_name: data.recipient_name,
        recipient_phone: data.recipient_phone,
        origin_formatted_address: data.origin_formatted_address,
        origin_place_id: data.origin_place_id,
        destination_formatted_address: data.destination_formatted_address,
        destination_place_id: data.destination_place_id,
        weight: data.weight,
        length: data.length,
        width: data.width,
        height: data.height,
        additional_details: data.additional_details,
        start_date_time: data.start_date_time,
        delivery_date_time: data.delivery_date_time,
        origin_latitude: originLocation.lat(),
        origin_longitude: originLocation.lng(),
        destination_latitude: destLocation.lat(),
        destination_longitude: destLocation.lng(),
      };

      // Call the API to create the shipment
      await shipmentsService.create(shipmentData);

      toast.success("Shipment created successfully");
      form.reset();
      navigate("/shipments");
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Failed to create shipment. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="origin_formatted_address"
                render={() => (
                  <FormItem>
                    <FormLabel>Dirección de origen</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        instanceId="origin"
                        onAddressSelect={(place) => {
                          if (place) {
                            form.setValue(
                              "origin_formatted_address",
                              place.formattedAddress
                            );
                            form.setValue("origin_place_id", place.place_id);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <FormField
                control={form.control}
                name="destination_formatted_address"
                render={() => (
                  <FormItem>
                    <FormLabel>Dirección de destino</FormLabel>
                    <FormControl>
                      <AddressAutocomplete
                        instanceId="destination"
                        onAddressSelect={(place) => {
                          if (place) {
                            form.setValue(
                              "destination_formatted_address",
                              place.formattedAddress
                            );
                            form.setValue(
                              "destination_place_id",
                              place.place_id
                            );
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
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
                  <FormLabel>Tiempo de entrega</FormLabel>
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
