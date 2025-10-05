import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = (searchParams.get('locale') || 'ko') as 'ko' | 'en' | 'ja' | 'zh'
    
    const supabase = await createClient()
    
    const { data: stations, error } = await supabase
      .from('stations')
      .select('*')
      .eq('is_active', true)
      .order(`name_${locale}`)
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      count: stations?.length || 0,
      stations: stations || []
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}