import L from 'leaflet';
import { ReactNode } from 'react';

export interface MapMarker {
  position: L.LatLngExpression;
  icon?: L.Icon;
  popup?: ReactNode;
}

export interface MapProps {
  center?: L.LatLngExpression;
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  width?: string;
  showPopup?: boolean;
  className?: string;
}
