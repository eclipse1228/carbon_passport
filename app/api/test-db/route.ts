import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection by fetching stations count
    const { count, error } = await supabase
      .from('stations')
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: 'Failed to connect to database'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stations_count: count || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Failed to initialize Supabase client'
      },
      { status: 500 }
    )
  }
}