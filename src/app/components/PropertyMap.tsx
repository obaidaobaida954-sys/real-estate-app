import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { useAppContext } from "../context/AppContext";

interface PropertyMapProps {
  lat: number;
  lng: number;
  title: string;
}

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d2d44" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0a0a1a" }],
  },
];

type AdvancedMarkerType = {
  setMap?: (map: null) => void;
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      importLibrary?: (
        name: "maps" | "marker",
      ) => Promise<Record<string, unknown>>;
    };
  };
};

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const { theme, t } = useAppContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["maps", "marker"],
    });
    let marker: AdvancedMarkerType | null = null;

    loader
      .load()
      .then(async () => {
        if (!mapRef.current) return;

        const google = (window as unknown as GoogleMapsWindow).google;
        if (!google?.maps?.importLibrary) return;

        const mapsLibrary = (await google.maps.importLibrary("maps")) as {
          Map: new (
            element: HTMLElement,
            options: {
              center: { lat: number; lng: number };
              zoom: number;
              mapId: string;
              disableDefaultUI: boolean;
              zoomControl: boolean;
              styles?: unknown;
            },
          ) => unknown;
        };
        const markerLibrary = (await google.maps.importLibrary("marker")) as {
          AdvancedMarkerElement: new (options: {
            map: unknown;
            position: { lat: number; lng: number };
            title: string;
          }) => AdvancedMarkerType;
        };

        const map = new mapsLibrary.Map(mapRef.current, {
          center: { lat, lng },
          zoom: 15,
          mapId: "aqari_map",
          disableDefaultUI: true,
          zoomControl: true,
          styles: theme === "dark" ? darkMapStyles : undefined,
        });

        marker = new markerLibrary.AdvancedMarkerElement({
          map,
          position: { lat, lng },
          title,
        });
      })
      .catch(() => {
        /* ignore map load errors */
      });

    return () => {
      if (marker?.setMap) {
        marker.setMap(null);
      }
    };
  }, [apiKey, lat, lng, theme, title]);

  if (!apiKey) {
    return (
      <div className="h-48 w-full rounded-2xl bg-surface-2 border border-border-subtle flex flex-col items-center justify-center gap-2 text-text-muted">
        <MapPin className="w-8 h-8 text-text-muted" />
        <p className="text-text-muted text-sm">{t("map_unavailable")}</p>
      </div>
    );
  }

  return (
    <div ref={mapRef} className="h-48 w-full rounded-2xl overflow-hidden" />
  );
}
