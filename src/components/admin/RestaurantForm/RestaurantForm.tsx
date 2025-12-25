'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Cuisine, Location } from '@/types/restaurant'
import AddressGeocoder from './AddressGeocoder'
import ImageUploader from './ImageUploader'
import styles from './RestaurantForm.module.css'

interface RestaurantFormProps {
  restaurantId?: string
  initialData?: {
    id: string
    name: string
    cuisineTypes: string[]
    location: string
    address: string
    photos: string[]
    review: string
    latitude?: number
    longitude?: number
  }
  isEdit?: boolean
}

export default function RestaurantForm({ restaurantId, initialData, isEdit = false }: RestaurantFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Parse initial address if provided
  const parseAddress = (addr: string) => {
    if (!addr) return { street: '', city: '', state: '', zip: '', country: 'USA' }

    // Try to parse format: "123 Street Name, City, ST 12345, Country"
    const parts = addr.split(',').map(p => p.trim())
    if (parts.length >= 2) {
      const street = parts[0] || ''

      // Check if last part is a country (not containing digits)
      const lastPart = parts[parts.length - 1] || ''
      const hasCountry = parts.length >= 4 && !/\d/.test(lastPart)
      const country = hasCountry ? lastPart : 'USA'

      // Get the state/ZIP part (second to last if country exists, last otherwise)
      const stateZipPart = hasCountry ? parts[parts.length - 2] : lastPart
      const stateZipMatch = stateZipPart.match(/([A-Z]{2})\s+(\d{5})/)

      // City is everything between street and state/ZIP
      const cityEndIndex = hasCountry ? parts.length - 2 : parts.length - 1
      const city = parts.slice(1, cityEndIndex).join(', ')

      return {
        street,
        city,
        state: stateZipMatch ? stateZipMatch[1] : '',
        zip: stateZipMatch ? stateZipMatch[2] : '',
        country
      }
    }

    return { street: addr, city: '', state: '', zip: '', country: 'USA' }
  }

  const initialAddress = parseAddress(initialData?.address || '')

  // Form fields
  const [name, setName] = useState(initialData?.name || '')
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(initialData?.cuisineTypes || [])
  const [location, setLocation] = useState(initialData?.location || '')
  const [streetAddress, setStreetAddress] = useState(initialAddress.street)
  const [city, setCity] = useState(initialAddress.city)
  const [state, setState] = useState(initialAddress.state)
  const [zipCode, setZipCode] = useState(initialAddress.zip)
  const [country, setCountry] = useState(initialAddress.country)
  const [photos, setPhotos] = useState<string[]>(initialData?.photos || [])
  const [review, setReview] = useState(initialData?.review || '')
  const [latitude, setLatitude] = useState<number | undefined>(initialData?.latitude)
  const [longitude, setLongitude] = useState<number | undefined>(initialData?.longitude)

  // Combine address parts for geocoding and storage
  const fullAddress = `${streetAddress}${city ? ', ' + city : ''}${state ? ', ' + state : ''}${zipCode ? ' ' + zipCode : ''}${country ? ', ' + country : ''}`

  // Auto-generate ID from name
  const generateId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  const id = isEdit ? (restaurantId || '') : generateId(name)

  const handleCuisineToggle = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine))
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validation
    if (!name || !location || !streetAddress || !city || !state || !zipCode || !country || !review || selectedCuisines.length === 0) {
      setError('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }

    // Validate ZIP code format
    if (!/^\d{5}$/.test(zipCode)) {
      setError('ZIP code must be exactly 5 digits')
      setIsSubmitting(false)
      return
    }

    // Validate state code format
    if (!/^[A-Z]{2}$/.test(state)) {
      setError('State must be a valid 2-letter code (e.g., CA, NY, IL)')
      setIsSubmitting(false)
      return
    }

    try {
      const payload = {
        id,
        name,
        cuisine_types: selectedCuisines,
        location,
        address: fullAddress,
        photos,
        review,
        latitude: latitude || null,
        longitude: longitude || null,
      }

      const url = isEdit ? `/api/restaurants/${restaurantId}` : '/api/restaurants'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save restaurant')
      }

      // Success - redirect to dashboard
      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save restaurant')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && (
        <div className={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Restaurant Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
          placeholder="e.g., Golden Pho House"
          required
        />
        {name && (
          <div className={styles.hint}>ID will be: {id}</div>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Cuisine Types <span className={styles.required}>*</span>
        </label>
        <div className={styles.cuisineGrid}>
          {Object.values(Cuisine).map((cuisine) => (
            <label key={cuisine} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={selectedCuisines.includes(cuisine)}
                onChange={() => handleCuisineToggle(cuisine)}
                className={styles.checkbox}
              />
              {cuisine}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="location" className={styles.label}>
          Location <span className={styles.required}>*</span>
        </label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={styles.select}
          required
        >
          <option value="">Select a location</option>
          {Object.values(Location).map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="streetAddress" className={styles.label}>
          Street Address <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="streetAddress"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          className={styles.input}
          placeholder="e.g., 1234 Geary Blvd"
          required
        />
      </div>

      <div className={styles.addressRow}>
        <div className={styles.field} style={{ flex: 2 }}>
          <label htmlFor="city" className={styles.label}>
            City <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={styles.input}
            placeholder="e.g., San Francisco"
            required
          />
        </div>

        <div className={styles.field} style={{ flex: 1 }}>
          <label htmlFor="state" className={styles.label}>
            State <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            className={styles.input}
            placeholder="CA"
            maxLength={2}
            required
          />
        </div>

        <div className={styles.field} style={{ flex: 1 }}>
          <label htmlFor="zipCode" className={styles.label}>
            ZIP Code <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className={styles.input}
            placeholder="94109"
            maxLength={5}
            required
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="country" className={styles.label}>
          Country <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={styles.input}
          placeholder="e.g., USA"
          required
        />
      </div>

      <AddressGeocoder
        address={fullAddress}
        latitude={latitude}
        longitude={longitude}
        onCoordinatesChange={(lat, lng) => {
          setLatitude(lat)
          setLongitude(lng)
        }}
      />

      <ImageUploader
        restaurantId={id}
        photos={photos}
        onPhotosChange={setPhotos}
      />

      <div className={styles.field}>
        <label htmlFor="review" className={styles.label}>
          Review <span className={styles.required}>*</span>
        </label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className={styles.textarea}
          placeholder="Write your review of the restaurant..."
          rows={6}
          required
        />
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Restaurant' : 'Create Restaurant'}
        </button>
      </div>
    </form>
  )
}
