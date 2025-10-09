'use client'

import { forwardRef } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarDays, MapPin, Leaf, Train, Car, Bus, Footprints, Plane, User, Award, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { formatCO2Value, calculateCO2Emissions, type TransportMode } from '@/lib/utils/co2-calculator'
import { type PassportDisplayData, type PassportRoute } from '@/lib/utils/passport-transform'
import { Barcode } from './Barcode'
import { RouteMap } from '@/components/ui/route-map'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ClientOnlyRouteMap = dynamic(() => import('./ClientOnlyRouteMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center border animate-pulse">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">지도를 불러오는 중...</p>
      </div>
    </div>
  )
})

interface EnhancedPassportDocumentProps {
  data: PassportDisplayData
  locale: string
  className?: string
}

export const EnhancedPassportDocument = forwardRef<HTMLDivElement, EnhancedPassportDocumentProps>(
  ({ data, locale, className }, ref) => {
    const t = useTranslations()
    
    const totalDistance = data.routes.reduce((sum, route) => sum + route.distance, 0)
    const totalCO2Saved = data.routes.reduce((sum, route) => sum + route.co2Saved, 0)

    const getTransportIcon = (mode: TransportMode) => {
      const icons = {
        subway: Train,
        bus: Bus,
        walk: Footprints,
        bike: Footprints,
        train: Train,
        car: Car,
        airplane: Plane
      }
      return icons[mode] || Train
    }

    const getTransportLabel = (mode: TransportMode) => {
      const labels = {
        subway: '지하철',
        bus: '버스',
        walk: '도보',
        bike: '자전거',
        train: '기차',
        car: '자동차',
        airplane: '비행기'
      }
      return labels[mode] || mode
    }

    const getTransportColor = (mode: TransportMode) => {
      const colors = {
        subway: 'bg-blue-500',
        bus: 'bg-orange-500',
        walk: 'bg-green-500',
        bike: 'bg-emerald-500',
        train: 'bg-blue-600',
        car: 'bg-gray-500',
        airplane: 'bg-purple-500'
      }
      return colors[mode] || 'bg-gray-500'
    }

    const getUserInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    const emissions = calculateCO2Emissions(totalDistance)
    const maxEmission = Math.max(emissions.train, emissions.bus, emissions.car, emissions.airplane)

    return (
      <div ref={ref} className={`${className} space-y-8`}>
        {/* Enhanced Header Card */}
        <Card className="border-none shadow-2xl bg-gradient-to-br from-green-600 via-green-700 to-blue-700 text-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Section */}
              <div className="text-center lg:text-left">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {data.photoUrl ? (
                      <AvatarImage src={data.photoUrl} alt={data.name} />
                    ) : (
                      <AvatarFallback className="bg-white text-green-600 text-xl font-bold">
                        {getUserInitials(data.name)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      <User className="h-3 w-3 mr-1" />
                      {data.country}
                    </Badge>
                    <div className="flex items-center text-green-100">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      {data.issueDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {totalDistance.toFixed(1)} km
                      </div>
                      <div className="text-green-100 text-sm">총 여행 거리</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {formatCO2Value(totalCO2Saved)}
                      </div>
                      <div className="text-green-100 text-sm">CO₂ 절약량</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        {data.routes.length}
                      </div>
                      <div className="text-green-100 text-sm">여행 구간</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Route Details Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-green-600" />
              여행 경로
            </CardTitle>
            <CardDescription>
              친환경 철도 여행으로 탄소 발자국을 줄여보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {data.routes.length > 0 ? (
              <div className="space-y-4">
                {data.routes.map((route, index) => {
                  const IconComponent = getTransportIcon('train')
                  return (
                    <Card key={index} className="border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-green-600 text-white rounded-full font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2 text-lg font-semibold">
                                <span>{route.from}</span>
                                <div className="flex items-center">
                                  <div className="w-8 h-px bg-gray-400"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full mx-1"></div>
                                  <div className="w-8 h-px bg-gray-400"></div>
                                </div>
                                <span>{route.to}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${getTransportColor('train')} text-white border-none`}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {getTransportLabel('train')}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium">거리:</span>
                            <span className="ml-2">{route.distance} km</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium">CO₂ 절약:</span>
                            <span className="ml-2 text-green-600 font-semibold">{formatCO2Value(route.co2Saved)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">여행 경로가 없습니다</h3>
                  <p className="text-gray-500">새로운 친환경 여행을 시작해보세요!</p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* CO2 Comparison Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingDown className="h-6 w-6 text-green-600" />
              교통수단별 CO₂ 배출량 비교
            </CardTitle>
            <CardDescription>
              친환경 교통수단 선택의 환경적 효과를 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Train - Current Choice */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Train className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800">기차 (현재 선택)</h3>
                      <Badge className="bg-blue-600 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        최적 선택
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{formatCO2Value(emissions.train)}</div>
                  </div>
                </div>
                <Progress value={(emissions.train / maxEmission) * 100} className="h-3 bg-blue-200" />
              </CardContent>
            </Card>

            {/* Bus */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Bus className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-orange-800">버스</h3>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">{formatCO2Value(emissions.bus)}</div>
                </div>
                <Progress value={(emissions.bus / maxEmission) * 100} className="h-3 bg-orange-200" />
              </CardContent>
            </Card>

            {/* Car */}
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-600 rounded-lg">
                      <Car className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-red-800">자동차</h3>
                  </div>
                  <div className="text-2xl font-bold text-red-600">{formatCO2Value(emissions.car)}</div>
                </div>
                <Progress value={(emissions.car / maxEmission) * 100} className="h-3 bg-red-200" />
              </CardContent>
            </Card>

            {/* Airplane */}
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-purple-800">비행기</h3>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{formatCO2Value(emissions.airplane)}</div>
                </div>
                <Progress value={(emissions.airplane / maxEmission) * 100} className="h-3 bg-purple-200" />
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardContent className="p-6 text-center">
                <Leaf className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">환경 보호 기여도</h3>
                <div className="text-3xl font-bold mb-2">{formatCO2Value(totalCO2Saved)}</div>
                <p className="text-green-100 mb-4">총 CO₂ 절약량</p>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="text-sm">
                    자동차 대비 <span className="font-bold text-xl">{((emissions.saved / emissions.car) * 100).toFixed(1)}%</span> 절약
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Interactive Map Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <MapPin className="h-6 w-6 text-green-600" />
              여행 경로 지도
            </CardTitle>
            <CardDescription>
              실제 여행 경로를 지도에서 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-hidden border">
              <RouteMap 
                routes={data.routes.map((route, index) => ({
                  from: { 
                    name: route.from, 
                    coordinates: [0, 0] as [number, number] 
                  },
                  to: { 
                    name: route.to, 
                    coordinates: [0, 0] as [number, number] 
                  },
                  distance: route.distance,
                  co2Saved: route.co2Saved
                }))}
                height={400}
                showControls={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Digital Passport Card */}
        <Card className="shadow-xl bg-gradient-to-br from-slate-50 to-gray-100">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">디지털 여권 인증</CardTitle>
            <CardDescription>
              QR 코드로 여권 정보를 빠르게 공유하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Barcode passportId={data.id} />
            <div className="flex justify-center gap-4">
              <Button variant="outline" size="sm">
                <Link href={`/ko/passport/${data.id}`} className="flex items-center gap-2">
                  기본 보기
                </Link>
              </Button>
              <Button size="sm">
                여권 공유하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

EnhancedPassportDocument.displayName = 'EnhancedPassportDocument'