'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import RestaurantForm from '@/components/admin/RestaurantForm/RestaurantForm'
import styles from './edit.module.css'

export default function EditRestaurantPage() {
  const params = useParams()
  const restaurantId = params.id as string
  const [restaurant, setRestaurant] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)

        if (!response.ok) {
          throw new Error('Restaurant not found')
        }

        const data = await response.json()

        // Transform DB format to form format
        setRestaurant({
          id: data.id,
          name: data.name,
          cuisineTypes: data.cuisine_types,
          location: data.location,
          address: data.address,
          photos: data.photos || [],
          review: data.review,
          latitude: data.latitude,
          longitude: data.longitude,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load restaurant')
      } finally {
        setIsLoading(false)
      }
    }

    if (restaurantId) {
      fetchRestaurant()
    }
  }, [restaurantId])

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading restaurant...</div>
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <strong>Error:</strong> {error || 'Restaurant not found'}
        </div>
        <a href="/admin" className={styles.backLink}>
          ← Back to Dashboard
        </a>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Edit Restaurant</h1>
      <RestaurantForm
        restaurantId={restaurantId}
        initialData={restaurant}
        isEdit={true}
      />
    </div>
  )
}
