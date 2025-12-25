import { useMemo } from 'react';
import { Restaurant } from '@/types/restaurant';

/**
 * Custom hook for filtering restaurants by cuisine and location (multi-select)
 *
 * Why it's needed:
 * 1. Separation of concerns - Keeps filtering logic out of UI components
 * 2. Reusability - Can use same logic for both map and grid views
 * 3. Performance - Uses useMemo to prevent unnecessary recalculations
 * 4. Type safety - Centralizes filtering logic with proper TypeScript types
 *
 * @param restaurants - Array of all restaurants
 * @param selectedCuisines - Array of selected cuisine filters (or ["All"])
 * @param selectedLocations - Array of selected location filters (or ["All Locations"])
 * @returns Filtered array of restaurants
 */
export function useFilteredRestaurants(
  restaurants: Restaurant[],
  selectedCuisines: string[],
  selectedLocations: string[]
): Restaurant[] {
  return useMemo(() => {
    return restaurants.filter(restaurant => {
      // Check if cuisine matches (or "All" is selected)
      const cuisineMatch = selectedCuisines.includes('All') ||
        restaurant.cuisineTypes.some(cuisine => selectedCuisines.includes(cuisine));

      // Check if location matches (or "All Locations" is selected)
      const locationMatch = selectedLocations.includes('All Locations') ||
        selectedLocations.includes(restaurant.location);

      // Restaurant must match BOTH filters
      return cuisineMatch && locationMatch;
    });
  }, [restaurants, selectedCuisines, selectedLocations]);
  // useMemo dependency array - only recalculates when these values change
}
