import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function testSchema() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Testing if photos column exists...\n')

  const { data, error } = await supabase
    .from('restaurants')
    .insert([{
      id: 'test-restaurant',
      name: 'Test Restaurant',
      cuisine_types: ['Vietnamese'],
      location: 'San Francisco',
      address: '123 Test St',
      photos: ['https://example.com/photo.jpg'],
      review: 'Test review',
      latitude: 37.7749,
      longitude: -122.4194
    }])
    .select()

  if (error) {
    console.error('❌ Schema test failed:', error.message)
    console.log('\n⚠️  Please run the SQL schema in Supabase SQL Editor.')
    console.log('The schema file is at: database-schema.sql\n')
    return false
  } else {
    console.log('✅ Schema is correct! Photos column exists.')

    // Clean up test data
    await supabase.from('restaurants').delete().eq('id', 'test-restaurant')
    console.log('✅ Test data cleaned up.\n')
    return true
  }
}

testSchema()
  .then((success) => process.exit(success ? 0 : 1))
  .catch((error) => {
    console.error('Test failed:', error)
    process.exit(1)
  })
