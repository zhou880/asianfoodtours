'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '@/types/restaurant';
import styles from './RestaurantMap.module.css';

// Fix for default marker icons in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Larger icon for selected marker
const selectedIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [1, -44],
  shadowSize: [52, 52]
});

interface RestaurantMapProps {
  restaurants: Restaurant[];
  onMarkerClick: (restaurant: Restaurant) => void;
  selectedRestaurant: Restaurant | null;
}

// Component to update map bounds when restaurants change
function MapUpdater({ restaurants }: { restaurants: Restaurant[] }) {
  const map = useMap();

  useEffect(() => {
    if (restaurants.length > 0) {
      const bounds = restaurants
        .filter(r => r.coordinates)
        .map(r => [r.coordinates!.lat, r.coordinates!.lng] as [number, number]);

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [restaurants, map]);

  return null;
}

export default function RestaurantMap({ restaurants, onMarkerClick, selectedRestaurant }: RestaurantMapProps) {
  const defaultCenter: [number, number] = [40.7128, -73.9960]; // NYC
  const defaultZoom = 13;

  // Filter restaurants that have coordinates
  const restaurantsWithCoords = restaurants.filter(r => r.coordinates);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className={styles.mapContainer}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapUpdater restaurants={restaurantsWithCoords} />

      {restaurantsWithCoords.map(restaurant => (
        <Marker
          key={restaurant.id}
          position={[restaurant.coordinates!.lat, restaurant.coordinates!.lng]}
          icon={selectedRestaurant?.id === restaurant.id ? selectedIcon : icon}
        >
          <Popup>
            <div className={styles.popupContent}>
              <strong className={styles.popupName}>{restaurant.name}</strong>
              <br />
              <span className={styles.popupLocation}>{restaurant.location}</span>
              <br />
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.popupAddress}
              >
                {restaurant.address}
              </a>
              <div className={styles.popupTags}>
                {restaurant.cuisineTypes.slice(0, 2).map(cuisine => (
                  <span
                    key={cuisine}
                    className={styles.popupTag}
                  >
                    {cuisine}
                  </span>
                ))}
              </div>
              <button
                className={styles.popupButton}
                onClick={() => onMarkerClick(restaurant)}
              >
                Show more
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
