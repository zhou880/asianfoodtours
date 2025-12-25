'use client';

import { Restaurant } from '@/types/restaurant';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import styles from './RestaurantDetail.module.css';

interface RestaurantDetailProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RestaurantDetail({ restaurant, isOpen, onClose }: RestaurantDetailProps) {
  if (!isOpen || !restaurant) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Carousel */}
        <ImageCarousel images={restaurant.photos} alt={restaurant.name} />

        {/* Content */}
        <div className={styles.content}>
          {/* Close Button */}
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close"
          >
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className={styles.title}>{restaurant.name}</h2>

          {/* Cuisine Tags */}
          <div className={styles.tags}>
            {restaurant.cuisineTypes.map(cuisine => (
              <span
                key={cuisine}
                className={styles.tag}
              >
                {cuisine}
              </span>
            ))}
          </div>

          {/* Location */}
          <div className={styles.locationSection}>
            <p className={styles.locationContent}>
              <span className={styles.locationIcon}>📍</span>
              <span>
                <strong className={styles.location}>{restaurant.location}</strong>
                <br />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.addressLink}
                >
                  {restaurant.address}
                </a>
              </span>
            </p>
          </div>

          {/* Review Section */}
          <div className={styles.reviewSection}>
            <h3 className={styles.reviewTitle}>Review</h3>
            <p className={styles.reviewText}>
              {restaurant.review}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={styles.closeButtonBottom}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
