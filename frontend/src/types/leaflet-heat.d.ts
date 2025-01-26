declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  export interface HeatLayer extends L.Layer {
    setLatLngs(latlngs: L.LatLngExpression[]): void;
    addLatLng(latlng: L.LatLngExpression): void;
    setOptions(options: HeatLayerOptions): void;
  }

  function heatLayer(
    latlngs: L.LatLngExpression[],
    options?: HeatLayerOptions
  ): HeatLayer;

  namespace heatLayer {}

  export = heatLayer;
}
