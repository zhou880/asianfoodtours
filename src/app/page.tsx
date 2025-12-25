'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import RestaurantGrid from '@/components/RestaurantCard/RestaurantGrid';
import RestaurantDetail from '@/components/RestaurantCard/RestaurantDetail';
import { useFilteredRestaurants } from '@/hooks/useFilteredRestaurants';
import { useGeocodedRestaurants } from '@/hooks/useGeocodedRestaurants';
import { Restaurant, Cuisine, Location } from '@/types/restaurant';
import { restaurantData } from '@/data/restaurants';
import styles from './page.module.css';

const CUISINE_OPTIONS = Object.values(Cuisine);
const LOCATION_OPTIONS = Object.values(Location);

// Dynamic import of map component to avoid SSR issues
const RestaurantMap = dynamic(
  () => import('@/components/Map/RestaurantMap'),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapLoading}>
        <div className={styles.mapLoadingContent}>
          <div className={styles.mapLoadingIcon}>🗺️</div>
          <p className={styles.mapLoadingText}>Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function Home() {
  // State for filters (arrays for multi-select)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(['All']);
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['All Locations']);

  // State for selected restaurant (for detail popup)
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const isDetailOpen = selectedRestaurant !== null;

  // State for mobile filter visibility
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get restaurants from TypeScript data
  const restaurants = restaurantData.restaurants;

  // Geocode restaurants that don't have coordinates
  const { geocodedRestaurants, isGeocoding } = useGeocodedRestaurants(restaurants);

  // Filter restaurants based on selected cuisines and locations
  const filteredRestaurants = useFilteredRestaurants(
    geocodedRestaurants,
    selectedCuisines,
    selectedLocations
  );

  // Handle marker or card click
  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  // Handle detail popup close
  const handleDetailClose = () => {
    setSelectedRestaurant(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header />

      {/* Mobile Filter Toggle Button */}
      <div className={styles.mobileFilterToggle}>
        <button
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className={styles.filterButton}
        >
          <span>🔍 Filters ({filteredRestaurants.length} results)</span>
          <span>{isMobileFilterOpen ? '✕' : '▼'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        {/* Mobile Filter Overlay */}
        {isMobileFilterOpen && (
          <div
            className={styles.mobileFilterOverlay}
            onClick={() => setIsMobileFilterOpen(false)}
          />
        )}

        {/* Sidebar with filters */}
        <div
          className={`${styles.sidebarContainer} ${isMobileFilterOpen ? styles.open : ''}`}
        >
          <Sidebar
            cuisineTypes={CUISINE_OPTIONS}
            locations={LOCATION_OPTIONS}
            selectedCuisines={selectedCuisines}
            selectedLocations={selectedLocations}
            onCuisineChange={setSelectedCuisines}
            onLocationChange={setSelectedLocations}
            resultsCount={filteredRestaurants.length}
          />
        </div>

        {/* Map and Grid Container */}
        <div className={styles.mapGridContainer}>
          {/* Map Section */}
          <div className={styles.mapSection}>
            {isGeocoding && (
              <div className={styles.geocodingBanner}>
                Geocoding addresses...
              </div>
            )}
            <RestaurantMap
              restaurants={filteredRestaurants}
              onMarkerClick={handleRestaurantClick}
              selectedRestaurant={selectedRestaurant}
            />
          </div>

          {/* Restaurant Grid Section */}
          <div className={styles.gridSection}>
            <RestaurantGrid
              restaurants={filteredRestaurants}
              onCardClick={handleRestaurantClick}
            />
          </div>
        </div>
      </div>

      {/* Restaurant Detail Popup */}
      <RestaurantDetail
        restaurant={selectedRestaurant}
        isOpen={isDetailOpen}
        onClose={handleDetailClose}
      />
    </div>
  );
}
