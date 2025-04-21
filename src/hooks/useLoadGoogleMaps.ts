import { useState, useEffect } from "react";

declare global {
  interface Window {
    initMap: () => void;
  }
}

export const useLoadGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!GOOGLE_MAPS_API_KEY) {
      setLoadError(new Error("Google Maps API key is missing"));
      return;
    }

    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    window.initMap = () => setIsLoaded(true);

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    const handleScriptError = () => {
      script.remove();
      setLoadError(new Error("Failed to load Google Maps"));
    };

    script.addEventListener("error", handleScriptError);

    document.head.appendChild(script);

    return () => {
      window.initMap = () => {};
      if (script) {
        script.removeEventListener("error", handleScriptError);
        script.remove();
      }
    };
  }, []);

  return { isLoaded, loadError };
};
