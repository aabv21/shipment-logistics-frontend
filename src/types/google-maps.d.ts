export {};

declare global {
  interface Window {
    initMap: () => void;
    google: {
      maps: {
        places: unknown;
        Geocoder: new () => google.maps.Geocoder;
        GeocoderStatus: {
          OK: "OK";
        };
      };
    };
  }
}
