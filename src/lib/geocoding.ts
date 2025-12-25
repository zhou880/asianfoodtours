import { Coordinates } from '@/types/restaurant';

const CACHE_KEY_PREFIX = 'geocode_';
const NYC_DEFAULT: Coordinates = { lat: 40.7128, lng: -73.9960 };

/**
 * Geocode an address to coordinates using Nominatim (OpenStreetMap)
 * Caches results in localStorage to avoid repeated API calls
 */
export async function geocodeAddress(address: string): Promise<Coordinates> {
  // Check cache first
  const cached = getCachedCoordinates(address);
  if (cached) {
    return cached;
  }

  try {
    // Call Nominatim API
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'AsianFoodTours/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const coordinates: Coordinates = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };

      // Cache the result
      cacheCoordinates(address, coordinates);

      return coordinates;
    }

    // No results found, return NYC default
    console.warn(`No geocoding results for address: ${address}`);
    return NYC_DEFAULT;

  } catch (error) {
    console.error(`Error geocoding address: ${address}`, error);
    return NYC_DEFAULT;
  }
}

/**
 * Get cached coordinates for an address
 */
function getCachedCoordinates(address: string): Coordinates | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + address);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('Error reading from cache', error);
  }

  return null;
}

/**
 * Cache coordinates for an address
 */
function cacheCoordinates(address: string, coordinates: Coordinates): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      CACHE_KEY_PREFIX + address,
      JSON.stringify(coordinates)
    );
  } catch (error) {
    console.error('Error writing to cache', error);
  }
}

/**
 * Delay function to respect Nominatim rate limits (1 req/sec)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
