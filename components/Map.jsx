"use client";

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map({ 
  center = [34.9823018, 33.1451285], // Cyprus center 
  zoom = 9,
  markers = [],
  height = "400px",
  width = "100%",
  showPopup = true,
  className = "",
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div style={{ height, width }} className={`bg-gray-200 ${className}`} />;
  }

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height, width }}
      className={`z-10 rounded-lg shadow-md ${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {markers.map((marker, index) => (
        <Marker 
          key={`marker-${index}`} 
          position={marker.position}
          icon={marker.icon || DefaultIcon}
        >
          {showPopup && marker.popup && (
            <Popup>
              {marker.popup}
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  );
} 