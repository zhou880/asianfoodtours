import { createClient } from '@supabase/supabase-js'
import { restaurantData } from '../data/restaurants'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Use service role key if available (bypasses RLS), otherwise use anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('Using service role key for migration (bypasses RLS)\n')
} else {
  console.log('Using anon key - RLS policies will be enforced\n')
}

async function migrateData() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Starting migration of', restaurantData.restaurants.length, 'restaurants...')

  for (const restaurant of restaurantData.restaurants) {
    console.log('Migrating:', restaurant.name)

    // Geocode address if no coordinates
    let latitude = null
    let longitude = null

    if (!restaurant.coordinates) {
      console.log('  Geocoding address:', restaurant.address)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(restaurant.address)}&limit=1`,
          {
            headers: { 'User-Agent': 'AsianFoodTours/1.0' }
          }
        )
        const data = await response.json()

        if (data && data.length > 0) {
          latitude = parseFloat(data[0].lat)
          longitude = parseFloat(data[0].lon)
          console.log(`  Got coordinates: ${latitude}, ${longitude}`)
        } else {
          console.log('  Warning: Could not geocode address')
        }

        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('  Error geocoding:', error)
      }
    } else {
      latitude = restaurant.coordinates.lat
      longitude = restaurant.coordinates.lng
      console.log(`  Using existing coordinates: ${latitude}, ${longitude}`)
    }

    // Insert into Supabase
    const { error } = await supabase
      .from('restaurants')
      .insert([{
        id: restaurant.id,
        name: restaurant.name,
        cuisine_types: restaurant.cuisineTypes.map(c => c.toString()),
        location: restaurant.location.toString(),
        address: restaurant.address,
        photos: restaurant.photos,
        review: restaurant.review,
        latitude,
        longitude
      }])

    if (error) {
      console.error('  Error migrating', restaurant.name, ':', error.message)
    } else {
      console.log('  ✓ Migrated:', restaurant.name)
    }
  }

  console.log('\nMigration complete!')
}

migrateData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error)
    process.exit(1)
  })
