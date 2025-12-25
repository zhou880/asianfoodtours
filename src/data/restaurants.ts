import { Location, Cuisine, RestaurantData } from '@/types/restaurant';

export const restaurantData: RestaurantData = {
  restaurants: [
    {
      id: "golden-pho-sf",
      name: "Golden Pho House",
      cuisineTypes: [Cuisine.VIETNAMESE],
      location: Location.SAN_FRANCISCO,
      address: "1234 Geary Blvd, San Francisco, CA 94109",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Authentic Vietnamese pho with rich broth and fresh herbs. The grilled pork banh mi is also exceptional. A San Francisco staple for Vietnamese cuisine."
    },
    {
      id: "burma-love-sf",
      name: "Burma Love",
      cuisineTypes: [Cuisine.BURMESE],
      location: Location.SAN_FRANCISCO,
      address: "211 Valencia St, San Francisco, CA 94103",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Incredible Burmese tea leaf salad and coconut rice. The fermented tea leaves create a unique, addictive flavor. Don't miss the samusa soup!"
    },
    {
      id: "taj-india-bayarea",
      name: "Taj India Cuisine",
      cuisineTypes: [Cuisine.INDIAN],
      location: Location.BAY_AREA,
      address: "2390 El Camino Real, Palo Alto, CA 94306",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Outstanding Indian cuisine with perfectly spiced curries and fluffy naan bread. The butter chicken and garlic naan are phenomenal. Great vegetarian options too."
    },
    {
      id: "han-bbq-bayarea",
      name: "Han Il Kwan",
      cuisineTypes: [Cuisine.KOREAN],
      location: Location.BAY_AREA,
      address: "1802 W El Camino Real, Mountain View, CA 94040",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Premium Korean BBQ with high-quality meats and excellent banchan. The marinated galbi is tender and flavorful. Service is attentive and the atmosphere is lively."
    },
    {
      id: "ramen-king-ny",
      name: "Ramen King",
      cuisineTypes: [Cuisine.JAPANESE],
      location: Location.NEW_YORK,
      address: "128 East 7th Street, New York, NY 10009",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Rich tonkotsu ramen with perfectly cooked noodles and melt-in-your-mouth chashu pork. The broth is creamy and deeply flavorful. Get the spicy miso version!"
    },
    {
      id: "thai-street-ny",
      name: "Bangkok Street Food",
      cuisineTypes: [Cuisine.THAI],
      location: Location.NEW_YORK,
      address: "456 2nd Avenue, New York, NY 10010",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Authentic Thai street food in the heart of NYC. The pad thai has the perfect balance of sweet, sour, and savory. The green curry is aromatic and packed with flavor."
    },
    {
      id: "peking-house-ny",
      name: "Peking House",
      cuisineTypes: [Cuisine.CHINESE],
      location: Location.NEW_YORK,
      address: "890 Broadway, New York, NY 10003",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Traditional Chinese cuisine with excellent Peking duck and hand-pulled noodles. The soup dumplings are delicate and flavorful. A New York Chinatown institution."
    },
    {
      id: "taiwan-cafe-chicago",
      name: "Taiwan Café & Boba",
      cuisineTypes: [Cuisine.TAIWANESE],
      location: Location.CHICAGO,
      address: "2345 N Clark St, Chicago, IL 60614",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Delicious Taiwanese comfort food with amazing beef noodle soup and scallion pancakes. The boba tea is perfectly sweet with chewy tapioca pearls. Cozy atmosphere."
    },
    {
      id: "hot-pot-palace-chicago",
      name: "Hot Pot Palace",
      cuisineTypes: [Cuisine.CHINESE],
      location: Location.CHICAGO,
      address: "789 W Argyle St, Chicago, IL 60640",
      photos: ["/placeholder-restaurant.jpg"],
      review: "All-you-can-eat hot pot with a huge selection of meats, vegetables, and broths. The spicy Szechuan broth is incredibly flavorful. Perfect for groups and cold Chicago nights!"
    },
    {
      id: "saigon-kitchen-chicago",
      name: "Saigon Kitchen",
      cuisineTypes: [Cuisine.VIETNAMESE],
      location: Location.CHICAGO,
      address: "4012 N Broadway, Chicago, IL 60613",
      photos: ["/placeholder-restaurant.jpg"],
      review: "Family-run Vietnamese restaurant with authentic pho and banh mi. The spring rolls are fresh and the peanut sauce is addictive. Great prices and generous portions."
    }
  ]
};
