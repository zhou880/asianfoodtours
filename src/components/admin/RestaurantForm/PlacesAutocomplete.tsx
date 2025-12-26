'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './PlacesAutocomplete.module.css'

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelect: (place: {
    name: string
    streetAddress: string
    city: string
    state: string
    zipCode: string
    country: string
    latitude: number
    longitude: number
  }) => void
  placeholder?: string
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Search for a restaurant...'
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch place suggestions from Nominatim API
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([])
      setShowDropdown(false)
      return
    }

    setIsLoading(true)

    try {
      // Use Nominatim search API with amenity=restaurant filter
      const url = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&addressdetails=1` +
        `&limit=10` +
        `&accept-language=en`

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'AsianFoodTours/1.0'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await response.json()

      // Filter for restaurants, cafes, and food-related places
      const filtered = data.filter((item: any) => {
        const type = item.type || ''
        const category = item.category || ''
        const displayName = item.display_name?.toLowerCase() || ''

        return (
          type === 'restaurant' ||
          type === 'cafe' ||
          type === 'fast_food' ||
          category === 'amenity' ||
          displayName.includes('restaurant') ||
          displayName.includes('cafe')
        )
      })

      setSuggestions(filtered.length > 0 ? filtered : data.slice(0, 10))
      setShowDropdown(true)
      setSelectedIndex(-1)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
      setShowDropdown(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [value])

  // Parse address from Nominatim result
  const parseAddress = (place: any) => {
    const address = place.address || {}

    // Extract name from display_name (first part before comma)
    const displayNameParts = place.display_name.split(',')
    const name = displayNameParts[0].trim()

    // Build street address
    const houseNumber = address.house_number || ''
    const road = address.road || address.street || ''
    const streetAddress = `${houseNumber} ${road}`.trim()

    // Get city (try various fields)
    const city = address.city ||
                 address.town ||
                 address.village ||
                 address.suburb ||
                 address.county || ''

    // Get state/province
    const state = address.state ||
                  address.province ||
                  address.region || ''

    // Get state abbreviation (for US states)
    const stateAbbr = state ? getStateAbbreviation(state) : ''

    // Get postal code
    const zipCode = address.postcode || ''

    // Get country
    const country = address.country || 'USA'

    return {
      name,
      streetAddress,
      city,
      state: stateAbbr || state,
      zipCode,
      country,
      latitude: parseFloat(place.lat) || 0,
      longitude: parseFloat(place.lon) || 0,
    }
  }

  // Convert full state name to abbreviation (US only)
  const getStateAbbreviation = (stateName: string): string => {
    const states: { [key: string]: string } = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
      'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
      'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
      'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
      'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
      'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
      'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
      'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
      'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
      'Wisconsin': 'WI', 'Wyoming': 'WY'
    }

    return states[stateName] || stateName
  }

  // Handle place selection
  const handleSelectPlace = (place: any) => {
    const parsedPlace = parseAddress(place)
    onPlaceSelect(parsedPlace)
    onChange(parsedPlace.name)
    setShowDropdown(false)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectPlace(suggestions[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
          className={styles.input}
          placeholder={placeholder}
          autoComplete="off"
        />
        {isLoading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerIcon}></div>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {suggestions.map((suggestion, index) => {
            const displayNameParts = suggestion.display_name.split(',')
            const name = displayNameParts[0]
            const address = displayNameParts.slice(1).join(',').trim()

            return (
              <button
                key={suggestion.place_id}
                type="button"
                className={`${styles.suggestion} ${index === selectedIndex ? styles.selected : ''}`}
                onClick={() => handleSelectPlace(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className={styles.suggestionName}>{name}</div>
                <div className={styles.suggestionAddress}>{address}</div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
