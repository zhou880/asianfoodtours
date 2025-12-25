'use client'

import RestaurantForm from '@/components/admin/RestaurantForm/RestaurantForm'
import styles from './new.module.css'

export default function NewRestaurantPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Add New Restaurant</h1>
      <RestaurantForm />
    </div>
  )
}
