import { useState, useEffect } from 'react';
import { Restaurant } from '@/types/restaurant';
import { geocodeAddress, delay } from '@/lib/geocoding';

/**
 * Custom hook to geocode restaurant addresses and cache results
 *
 * Why it's needed:
 * 1. User convenience - No manual coordinate lookup when adding restaurants
 * 2. Data simplicity - JSON only needs human-readable addresses
 * 3. Caching - Avoids repeated API calls for same addresses
 * 4. Graceful degradation - Falls back to default if geocoding fails
 *
 * How it works:
 * - For each restaurant without coordinates:
 *   1. Check localStorage cache first
 *   2. If not cached, call Nominatim API with address
 *   3. Cache the result in localStorage
 *   4. Update restaurant with coordinates
 *
 * @param restaurants - Array of restaurants (some may not have coordinates)
 * @returns Array of restaurants enriched with coordinates
 */
export function useGeocodedRestaurants(restaurants: Restaurant[]): {
  geocodedRestaurants: Restaurant[];
  isGeocoding: boolean;
} {
  const [geocodedRestaurants, setGeocodedRestaurants] = useState<Restaurant[]>(restaurants);
  const [isGeocoding, setIsGeocoding] = useState(false);

  useEffect(() => {
    const geocodeRestaurants = async () => {
      // Find restaurants that need geocoding
      const needsGeocoding = restaurants.filter(r => !r.coordinates);

      if (needsGeocoding.length === 0) {
        setGeocodedRestaurants(restaurants);
        return;
      }

      setIsGeocoding(true);

      // Geocode each restaurant (with rate limiting)
      const geocoded = [...restaurants];

      for (let i = 0; i < geocoded.length; i++) {
        if (!geocoded[i].coordinates) {
          // Geocode this restaurant
          const coordinates = await geocodeAddress(geocoded[i].address);
          geocoded[i] = { ...geocoded[i], coordinates };

          // Update state incrementally so UI updates as we go
          setGeocodedRestaurants([...geocoded]);

          // Rate limit: wait 1 second between requests (Nominatim requirement)
          if (i < needsGeocoding.length - 1) {
            await delay(1000);
          }
        }
      }

      setIsGeocoding(false);
    };

    geocodeRestaurants();
  }, [restaurants]);

  return { geocodedRestaurants, isGeocoding };
}
