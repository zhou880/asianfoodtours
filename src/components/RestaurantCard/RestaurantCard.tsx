import Image from 'next/image';
import styles from './RestaurantCard.module.css';
import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: () => void;
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <div onClick={onClick} className={styles.card}>
      <div className={styles.imageContainer}>
        {restaurant.photos[0] ? (
          <Image
            src={restaurant.photos[0]}
            alt={restaurant.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className={styles.placeholder}>
            🥡
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{restaurant.name}</h3>
        <p className={styles.location}>
          <span>📍</span>
          {restaurant.location}
        </p>
        <div className={styles.tags}>
          {restaurant.cuisineTypes.map(cuisine => (
            <span key={cuisine} className={styles.tag}>
              {cuisine}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
