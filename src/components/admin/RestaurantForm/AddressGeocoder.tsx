'use client'

import { useState } from 'react'
import styles from './AddressGeocoder.module.css'

interface AddressGeocoderProps {
  address: string
  latitude?: number
  longitude?: number
  onCoordinatesChange: (lat: number | undefined, lng: number | undefined) => void
}

export default function AddressGeocoder({
  address,
  latitude,
  longitude,
  onCoordinatesChange,
}: AddressGeocoderProps) {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Please enter an address first')
      return
    }

    setIsGeocoding(true)
    setError(null)

    try {
      const response = await fetch('/api/geocode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })

      if (!response.ok) {
        throw new Error('Failed to geocode address')
      }

      const data = await response.json()

      if (data.latitude && data.longitude) {
        onCoordinatesChange(data.latitude, data.longitude)
        setError(null)
      } else {
        setError('Could not find coordinates for this address')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to geocode address')
    } finally {
      setIsGeocoding(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Coordinates (Optional)</label>
        <button
          type="button"
          onClick={handleGeocode}
          disabled={isGeocoding || !address.trim()}
          className={styles.geocodeButton}
        >
          {isGeocoding ? 'Geocoding...' : 'Get Coordinates'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.coordinates}>
        <div className={styles.field}>
          <label htmlFor="latitude" className={styles.smallLabel}>
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            value={latitude ?? ''}
            onChange={(e) =>
              onCoordinatesChange(
                e.target.value ? parseFloat(e.target.value) : undefined,
                longitude
              )
            }
            step="0.0000001"
            className={styles.input}
            placeholder="37.7749"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="longitude" className={styles.smallLabel}>
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            value={longitude ?? ''}
            onChange={(e) =>
              onCoordinatesChange(
                latitude,
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
            step="0.0000001"
            className={styles.input}
            placeholder="-122.4194"
          />
        </div>
      </div>

      {latitude && longitude && (
        <div className={styles.success}>
          ✓ Coordinates set: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </div>
      )}
    </div>
  )
}
