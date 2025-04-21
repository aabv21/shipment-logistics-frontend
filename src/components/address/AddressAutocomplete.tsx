import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useLoadGoogleMaps } from "@/hooks/useLoadGoogleMaps";

interface AddressAutocompleteProps {
  onAddressSelect: (address: {
    formattedAddress: string;
    lat: number;
    lng: number;
    place_id: string;
  }) => void;
  defaultValue?: string;
}

export function AddressAutocomplete({
  onAddressSelect,
  defaultValue = "",
}: AddressAutocompleteProps) {
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, loadError } = useLoadGoogleMaps();
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    try {
      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["address"],
          componentRestrictions: { country: "co" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry?.location || !place.formatted_address) {
          setError("No se pudo obtener la información de la dirección");
          return;
        }

        onAddressSelect({
          formattedAddress: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place_id: place.place_id || "",
        });
        setInputValue(place.formatted_address);
      });

      autocompleteRef.current = autocomplete;
    } catch (err) {
      console.error("Error initializing Google Maps Autocomplete:", err);
      setError("Error al inicializar el autocompletado de direcciones");
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [isLoaded, onAddressSelect]);

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Error al cargar Google Maps. Por favor, intente más tarde.
        </AlertDescription>
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 h-10 px-3 py-2 text-sm border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Cargando...</span>
      </div>
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
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Buscar dirección..."
      className="w-full"
    />
  );
}
