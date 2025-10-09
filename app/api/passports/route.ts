import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { uploadPassportPhoto, createPassport, createRoutes } from '@/lib/supabase/queries'
import { calculateCO2Emissions } from '@/lib/utils/co2-calculator'
import { getTrainDistance } from '@/lib/utils/distance-calculator'

interface RouteInput {
  departure: string
  destination: string
}

interface PassportFormData {
  name: string
  date: string
  routes: RouteInput[]
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const name = formData.get('name') as string
    const date = formData.get('date') as string
    const routesJson = formData.get('routes') as string
    const photoFile = formData.get('photo') as File

    if (!name || !date || !routesJson) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const routes: RouteInput[] = JSON.parse(routesJson)

    if (!routes || routes.length === 0) {
      return NextResponse.json(
        { error: 'At least one route is required' },
        { status: 400 }
      )
    }

    // Validate photo
    if (!photoFile || photoFile.size === 0) {
      return NextResponse.json(
        { error: 'Photo is required' },
        { status: 400 }
      )
    }

    // Upload photo first to generate a unique temporary ID
    let photoUrl: string | null = null
    let tempPassportId: string | null = null
    
    try {
      // Generate a temporary ID for photo upload
      tempPassportId = crypto.randomUUID()
      console.log(`Uploading photo with temporary ID: ${tempPassportId}...`)
      photoUrl = await uploadPassportPhoto(photoFile, tempPassportId)
      console.log(`Photo uploaded successfully: ${photoUrl}`)
    } catch (error) {
      console.error('Photo upload error:', error)
      
      // Return specific error for photo upload issues
      const errorMessage = error instanceof Error ? error.message : 'Unknown photo upload error'
      
      // If photo upload fails due to validation, return error immediately
      if (errorMessage.includes('파일 크기') || errorMessage.includes('지원되지 않는 파일 형식')) {
        return NextResponse.json(
          { error: errorMessage },
          { status: 400 }
        )
      }
      
      // For other photo upload errors, continue without photo
      console.log('Continuing passport creation without photo due to upload error')
    }

    // Create passport record with photo URL included
    const passportData = {
      traveler_name: name,
      country: 'KR' as const,
      travel_date: date,
      photo_url: photoUrl, // Include photo URL directly
      share_hash: crypto.randomUUID().slice(0, 10), // Generate unique share hash
      metadata: {
        created_via: 'web_form',
        version: '1.0'
      }
    }

    // Save to database with photo URL included
    console.log('Creating passport with photo_url:', photoUrl)
    const passport = await createPassport(passportData)
    const passportId = (passport as any).id
    console.log(`Passport created successfully with ID: ${passportId}`)

    // Calculate route data
    const routeData = routes.map((route, index) => {
      const distance = getTrainDistance(route.departure, route.destination) || 100 // fallback distance
      const co2Data = calculateCO2Emissions(distance)
      
      return {
        passport_id: passportId,
        start_station: route.departure,
        end_station: route.destination,
        distance,
        co2_train: co2Data.train,
        co2_car: co2Data.car,
        co2_bus: co2Data.bus,
        co2_airplane: co2Data.airplane,
        co2_saved: co2Data.saved,
        sequence_order: index + 1
      }
    })

    // Calculate totals
    const totalDistance = routeData.reduce((sum, route) => sum + route.distance, 0)
    const totalCO2Saved = routeData.reduce((sum, route) => sum + route.co2_saved, 0)

    // Create routes
    await createRoutes(routeData)

    return NextResponse.json({
      success: true,
      passport: {
        id: passportId,
        name: (passport as any).traveler_name,
        shareHash: (passport as any).share_hash,
        photoUrl: photoUrl,
        totalCO2Saved: totalCO2Saved,
        totalDistance: totalDistance,
        routeCount: routes.length
      }
    })

  } catch (error) {
    console.error('Passport creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create passport' },
      { status: 500 }
    )
  }
}