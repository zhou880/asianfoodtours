import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyDatabase() {
  console.log('Verifying Supabase connection...\n')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  // Test 1: Check if restaurants table exists
  console.log('Test 1: Checking if restaurants table exists...')
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Table does not exist or cannot be accessed:', error.message)
      console.log('\nPlease create the restaurants table in Supabase SQL Editor with this schema:')
      console.log(`
CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine_types TEXT[] NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  photos TEXT[] NOT NULL,
  review TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_restaurants_location ON restaurants(location);
CREATE INDEX idx_restaurants_cuisine_types ON restaurants USING GIN(cuisine_types);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON restaurants FOR SELECT TO anon USING (true);
CREATE POLICY "Admin full access" ON restaurants FOR ALL TO authenticated USING (true);
      `)
      return false
    } else {
      console.log('✓ Table exists!\n')
    }
  } catch (error) {
    console.error('❌ Error checking table:', error)
    return false
  }

  // Test 2: Check if we can read from the table
  console.log('Test 2: Checking read access...')
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')

    if (error) {
      console.error('❌ Cannot read from table:', error.message)
      return false
    } else {
      console.log(`✓ Read access works! Found ${data.length} restaurants\n`)
      if (data.length > 0) {
        console.log('Sample restaurant:', data[0].name)
      }
    }
  } catch (error) {
    console.error('❌ Error reading table:', error)
    return false
  }

  console.log('\n✅ Database verification complete!')
  return true
}

verifyDatabase()
  .then((success) => {
    process.exit(success ? 0 : 1)
  })
  .catch((error) => {
    console.error('Verification failed:', error)
    process.exit(1)
  })
