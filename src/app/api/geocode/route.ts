import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/supabase/auth'

export async function POST(request: Request) {
  try {
    await requireAuth()

    const { address } = await request.json()

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      )
    }

    // Call Nominatim from server side
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
      {
        headers: {
          'User-Agent': 'AsianFoodTours/1.0'
        }
      }
    )

    const data = await response.json()

    if (data && data.length > 0) {
      return NextResponse.json({
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon)
      })
    }

    return NextResponse.json(
      { error: 'Address not found' },
      { status: 404 }
    )
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
