import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// TODO: Replace with your Mapbox access token
mapboxgl.accessToken = "YOUR_MAPBOX_ACCESS_TOKEN";

export default function GlobeMap() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [0, 20], // [lng, lat]
      zoom: 1.2,
      projection: { name: "globe" }
    });

    map.on("style.load", () => {
      map.setFog({}); // Add atmospheric fog for globe
    });

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.2)",
        margin: "0 auto"
      }}
    />
  );
} 