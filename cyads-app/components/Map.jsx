"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: '/marker-icon.png', // We'll need to add this to the public folder
  shadowUrl: '/marker-shadow.png', // We'll need to add this to the public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Cyprus cities/regions with coordinates
const cyprusLocations = [
  { name: 'Nicosia', position: [35.1856, 33.3823], ads: 120 },
  { name: 'Limassol', position: [34.6786, 33.0476], ads: 98 },
  { name: 'Larnaca', position: [34.9229, 33.6233], ads: 67 },
  { name: 'Paphos', position: [34.7720, 32.4297], ads: 54 },
  { name: 'Famagusta', position: [35.1175, 33.9400], ads: 32 },
  { name: 'Kyrenia', position: [35.3417, 33.3139], ads: 28 },
];

export default function Map() {
  useEffect(() => {
    // This is a fix for the Leaflet defaultIcon issue
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <MapContainer 
      center={[35.1264, 33.4299]} // Center of Cyprus
      zoom={9} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {cyprusLocations.map((location, index) => (
        <Marker key={index} position={location.position}>
          <Popup>
            <div>
              <h3 className="font-semibold">{location.name}</h3>
              <p>{location.ads} listings available</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 