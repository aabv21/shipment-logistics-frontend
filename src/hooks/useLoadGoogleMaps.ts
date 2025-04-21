import { useState, useEffect } from "react";

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<void> | null = null;
  private callbacks: Array<(error?: Error) => void> = [];

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  load(apiKey: string): Promise<void> {
    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      // Si Google Maps ya está cargado, resolvemos inmediatamente
      if (window.google?.maps) {
        resolve();
        return;
      }

      // Limpiamos scripts existentes
      const existingScripts = document.querySelectorAll(
        'script[src*="maps.googleapis.com"]'
      );
      existingScripts.forEach((s) => s.remove());

      window.initMap = () => {
        resolve();
        this.callbacks.forEach((cb) => cb());
      };

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        const error = new Error("Failed to load Google Maps");
        reject(error);
        this.callbacks.forEach((cb) => cb(error));
        script.remove();
        this.loadPromise = null;
      };

      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  onLoad(callback: (error?: Error) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback);
    };
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

    const loader = GoogleMapsLoader.getInstance();
    const removeCallback = loader.onLoad((error) => {
      if (error) {
        setLoadError(error);
      } else {
        setIsLoaded(true);
      }
    });

    loader
      .load(GOOGLE_MAPS_API_KEY)
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        setLoadError(error);
      });

    return () => {
      removeCallback();
    };
  }, []);

  return { isLoaded, loadError };
};
