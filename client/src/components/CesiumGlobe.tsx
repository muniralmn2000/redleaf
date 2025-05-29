import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// @ts-ignore: Cesium global for static assets
(window as any).CESIUM_BASE_URL = "/cesium";

export default function CesiumGlobe() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globeRef.current) return;
    let viewer: Cesium.Viewer | undefined;
    let destroyed = false;
    Cesium.createWorldTerrainAsync().then(terrainProvider => {
      if (destroyed) return;
      viewer = new Cesium.Viewer(globeRef.current!, {
        terrainProvider,
        animation: false,
        timeline: false,
        baseLayerPicker: false,
      });
    });
    return () => {
      destroyed = true;
      if (viewer) viewer.destroy();
    };
  }, []);

  return (
    <div
      ref={globeRef}
      style={{ width: "100%", height: "400px", borderRadius: "20px", overflow: "hidden" }}
    />
  );
} 