export enum Location {
  ALL_LOCATIONS = "All Locations",
  SAN_FRANCISCO = "San Francisco",
  BAY_AREA = "Bay Area",
  NEW_YORK = "New York",
  CHICAGO = "Chicago",
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
