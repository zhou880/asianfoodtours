'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './dashboard.module.css'

interface Restaurant {
  id: string
  name: string
  location: string
  cuisine_types: string[]
}

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch('/api/restaurants')
      const data = await response.json()

      if (response.ok) {
        setRestaurants(data || [])
        setError(null)
      } else {
        console.error('Failed to fetch restaurants:', data.error)
        setRestaurants([])
        setError(data.error || 'Failed to fetch restaurants')
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      setRestaurants([])
      setError('Failed to connect to database')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/restaurants/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchRestaurants()
      } else {
        alert('Failed to delete restaurant')
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error)
      alert('Failed to delete restaurant')
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Restaurant Management</h1>
        <a href="/admin/restaurants/new" className={styles.addButton}>
          + Add Restaurant
        </a>
      </div>

      {error && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '0.375rem',
          border: '1px solid #fecaca'
        }}>
          <strong>Database Error:</strong> {error}
          <br />
          <small>
            Please make sure you've created the database table in Supabase.
            See the setup instructions in the console or check the plan file.
          </small>
        </div>
      )}

      {restaurants.length === 0 && !error ? (
        <div className={styles.empty}>
          <p>No restaurants found. Add your first restaurant!</p>
        </div>
      ) : !error ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Cuisines</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant.id}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{restaurant.cuisine_types.join(', ')}</td>
                  <td>
                    <div className={styles.actions}>
                      <a
                        href={`/admin/restaurants/${restaurant.id}/edit`}
                        className={styles.editButton}
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(restaurant.id, restaurant.name)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
