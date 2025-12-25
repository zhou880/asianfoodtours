import { Restaurant } from '@/types/restaurant';
import RestaurantCard from './RestaurantCard';
import styles from './RestaurantGrid.module.css';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  onCardClick: (restaurant: Restaurant) => void;
}

export default function RestaurantGrid({ restaurants, onCardClick }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No restaurants found</h3>
        <p className={styles.emptyDescription}>Try adjusting your filters to see more results</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {restaurants.map(restaurant => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          onClick={() => onCardClick(restaurant)}
        />
      ))}
    </div>
  );
}
