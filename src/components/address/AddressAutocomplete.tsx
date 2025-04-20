import { useState } from "react";
import Autocomplete from "react-google-autocomplete";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    formattedAddress: string;
    lat: number;
    lng: number;
    place_id: string;
  }) => void;
  defaultValue?: string;
  apiKey?: string;
}

export function AddressAutocomplete({
  onAddressSelect,
  defaultValue = "",
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
}: AddressAutocompleteProps) {
  const [error, setError] = useState<string | null>(null);

  if (!apiKey) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Google Maps API key not found. Please check your environment
          variables.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Autocomplete
      apiKey={apiKey}
      style={{
        width: "100%",
        height: "40px",
        padding: "0.5rem 0.75rem",
        borderRadius: "0.375rem",
        border: "1px solid rgb(226, 232, 240)",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
      defaultValue={defaultValue}
      placeholder="Buscar dirección"
      onPlaceSelected={(place) => {
        if (
          place.formatted_address &&
          place.geometry?.location &&
          place.place_id
        ) {
          onAddressSelect({
            formattedAddress: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            place_id: place.place_id,
          });
        }
      }}
      options={{
        types: ["address"],
        componentRestrictions: { country: "co" },
      }}
      onError={() =>
        setError("Error al cargar el autocompletado de direcciones")
      }
    />
  );
}
