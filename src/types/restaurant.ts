export enum Location {
  ALL_LOCATIONS = "All Locations",
  SAN_FRANCISCO = "San Francisco",
  BAY_AREA = "Bay Area",
  NEW_YORK = "New York",
  CHICAGO = "Chicago",
  NEW_JERSEY = "New Jersey"
}

export enum Cuisine {
  ALL = "All",
  CHINESE = "Chinese",
  VIETNAMESE = "Vietnamese",
  BURMESE = "Burmese",
  KOREAN = "Korean",
  JAPANESE = "Japanese",
  INDIAN = "Indian",
  TAIWANESE = "Taiwanese",
  THAI = "Thai",
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisineTypes: Cuisine[];
  location: Location;
  address: string;
  photos: string[];
  review: string;
  coordinates?: Coordinates; // Optional - auto-populated via geocoding
}

export interface RestaurantData {
  restaurants: Restaurant[];
}

// Database representation (snake_case for PostgreSQL)
export interface RestaurantDB {
  id: string;
  name: string;
  cuisine_types: string[];
  location: string;
  address: string;
  photos: string[];
  review: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

// Form data for admin create/edit
export interface RestaurantFormData {
  id: string;
  name: string;
  cuisineTypes: string[];
  location: string;
  address: string;
  photos: string[];
  review: string;
  latitude?: number;
  longitude?: number;
}
