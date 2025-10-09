import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateTreesEquivalent } from '@/lib/utils/co2-calculator'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const passportId = params.id

    if (!passportId) {
      return NextResponse.json(
        { error: 'Passport ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch passport with routes
    const { data: passport, error: passportError } = await supabase
      .from('passports')
      .select(`
        *,
        routes (*)
      `)
      .eq('id', passportId)
      .single()

    if (passportError) {
      console.error('Database error:', passportError)
      return NextResponse.json(
        { error: 'Passport not found' },
        { status: 404 }
      )
    }

    if (!passport) {
      return NextResponse.json(
        { error: 'Passport not found' },
        { status: 404 }
      )
    }

    // Calculate totals from routes
    const routes = (passport as any).routes || []
    const totalDistance = routes.reduce((sum: number, route: any) => sum + route.distance, 0)
    const totalCO2Saved = routes.reduce((sum: number, route: any) => sum + route.co2_saved, 0)
    const totalCO2Train = routes.reduce((sum: number, route: any) => sum + route.co2_train, 0)
    const treeEquivalent = calculateTreesEquivalent(totalCO2Saved)

    // Format routes for display
    const formattedRoutes = routes
      .sort((a: any, b: any) => a.sequence_order - b.sequence_order)
      .map((route: any) => ({
        from: route.start_station,
        to: route.end_station,
        distance: route.distance,
        co2Saved: route.co2_saved,
        co2Train: route.co2_train,
        savingsPercentage: route.co2_car > 0 ? Math.round((route.co2_saved / route.co2_car) * 100) : 0
      }))

    // Format passport data for display
    const passportDisplayData = {
      id: (passport as any).id,
      name: (passport as any).traveler_name,
      country: '대한민국',
      countryCode: (passport as any).country,
      issueDate: new Date((passport as any).travel_date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '.'),
      photoUrl: (passport as any).photo_url,
      totalCO2Saved: Math.round(totalCO2Saved * 100) / 100,
      totalCO2Train: Math.round(totalCO2Train * 100) / 100,
      tripCount: routes.length,
      totalDistance: Math.round(totalDistance),
      treeEquivalent: Math.round(treeEquivalent * 10) / 10,
      routes: formattedRoutes,
      environmentalImpact: {
        level: totalCO2Saved < 5 ? 'medium' : totalCO2Saved < 15 ? 'high' : 'excellent',
        description: totalCO2Saved < 5 
          ? '좋은 시작입니다! 더 많은 친환경 여행을 계획해보세요.' 
          : totalCO2Saved < 15 
          ? '훌륭한 친환경 여행입니다!' 
          : '탁월한 환경 보호 기여도입니다!',
        badge: totalCO2Saved < 5 ? '🌱' : totalCO2Saved < 15 ? '🌿' : '🏆',
        color: totalCO2Saved < 5 ? '#10B981' : totalCO2Saved < 15 ? '#059669' : '#047857'
      },
      savingsComparison: {
        vs_car: Math.round(((totalCO2Saved / (totalCO2Train + totalCO2Saved)) * 100) * 100) / 100,
        vs_bus: Math.round(((routes.reduce((sum: number, route: any) => sum + route.co2_bus, 0) - totalCO2Train) / routes.reduce((sum: number, route: any) => sum + route.co2_bus, 0) * 100) * 100) / 100,
        vs_airplane: Math.round(((routes.reduce((sum: number, route: any) => sum + route.co2_airplane, 0) - totalCO2Train) / routes.reduce((sum: number, route: any) => sum + route.co2_airplane, 0) * 100) * 100) / 100
      },
      shareUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/ko/passport/view/${(passport as any).share_hash}`,
      shareHash: (passport as any).share_hash
    }

    return NextResponse.json({
      success: true,
      passport: passportDisplayData
    })

  } catch (error) {
    console.error('Passport retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve passport' },
      { status: 500 }
    )
  }
}