import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shipmentsService } from "@/services/shipments";
import { AddressAutocomplete } from "@/components/address/AddressAutocomplete";
import {
  addHistoryStatusSchema,
  type AddHistoryStatusFormData,
} from "../../schemas/add-history-status-schema";

interface Props {
  shipmentId: string;
  onStatusAdded: () => void;
}

export function AddHistoryStatus({ shipmentId, onStatusAdded }: Props) {
  const form = useForm<AddHistoryStatusFormData>({
    resolver: zodResolver(addHistoryStatusSchema),
    defaultValues: {
      status: "PENDING",
      notes: "",
      location_formatted_address: "",
      location_place_id: "",
      location_latitude: "",
      location_longitude: "",
    },
  });

  const onSubmit = async (data: AddHistoryStatusFormData) => {
    try {
      await shipmentsService.addHistory(shipmentId, {
        shipment_id: shipmentId,
        ...data,
        notes: data.notes || "",
      });

      form.reset();
      onStatusAdded();
    } catch (error) {
      console.error("Error adding history:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        onKeyDown={handleKeyDown}
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">Pendiente</SelectItem>
                  <SelectItem value="IN_TRANSIT">En Tránsito</SelectItem>
                  <SelectItem value="DELIVERED">Entregado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location_formatted_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <AddressAutocomplete
                  onAddressSelect={(place) => {
                    if (place) {
                      form.setValue(
                        "location_formatted_address",
                        place.formattedAddress
                      );
                      form.setValue("location_place_id", place.place_id);
                      form.setValue("location_latitude", place.lat.toString());
                      form.setValue("location_longitude", place.lng.toString());
                    } else {
                      field.onChange("");
                      form.setValue("location_formatted_address", "");
                      form.setValue("location_place_id", "");
                      form.setValue("location_latitude", "");
                      form.setValue("location_longitude", "");
                      form.trigger("location_formatted_address");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Agregar notas sobre el estado..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Agregando..." : "Agregar Estado"}
        </Button>
      </form>
    </Form>
  );
}
