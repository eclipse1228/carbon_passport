'use client'

import { forwardRef } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarDays, MapPin, Leaf, Train, Car, Bus, Footprints, Plane } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { STATIONS, getLocalizedStationName } from '@/lib/constants/stations'
import { formatCO2Value, calculateCO2Emissions, type TransportMode } from '@/lib/utils/co2-calculator'
import { type PassportDisplayData, type PassportRoute } from '@/lib/utils/passport-transform'
import { Barcode } from './Barcode'
import { TransportComparison } from '@/components/ui/transport-comparison'
import { processRoutes, RouteData } from '@/lib/utils/route-calculator'
import { RouteInput } from '@/types/passport'
import dynamic from 'next/dynamic'

const ClientOnlyRouteMap = dynamic(() => import('@/components/ui/route-map').then(mod => ({ default: mod.RouteMap })), { 
  ssr: false,
  loading: () => (
    <div className="h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center border">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
    </div>
  )
})

interface PassportDocumentProps {
  data: PassportDisplayData
  locale: string
  className?: string
}

export const PassportDocument = forwardRef<HTMLDivElement, PassportDocumentProps>(
  ({ data, locale, className }, ref) => {
    const t = useTranslations()
    
    const totalDistance = data.routes.reduce((sum, route) => sum + route.distance, 0)
    const totalCO2Saved = data.routes.reduce((sum, route) => sum + route.co2Saved, 0)

    // Station names are already transformed in the data, no need to convert again
    const getStationName = (stationName: string) => stationName

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
        subway: t('transport.subway'),
        bus: t('transport.bus'),
        walk: t('transport.walk'),
        bike: t('transport.bike'),
        train: 'Train',
        car: 'Car',
        airplane: 'Airplane'
      }
      return labels[mode] || mode
    }

    return (
      <div ref={ref} className={`${className} bg-white`}>
        {/* Passport Cover */}
        <Card className="border-2 border-green-600 shadow-lg">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{t('passport.title')}</h1>
                  <p className="text-green-100">{t('passport.subtitle')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-100">KORAIL</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Photo */}
                <div className="text-center">
                  <div className="w-64 h-64 mx-auto mb-3 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {data.photoUrl ? (
                      <img
                        src={data.photoUrl}
                        alt={data.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                          <p className="text-xs">No Photo</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal Details */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t('passport.travelerName')}
                    </label>
                    <p className="text-lg font-semibold">{data.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('passport.country')}
                      </label>
                      <p className="font-medium">{data.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('passport.travelDate')}
                      </label>
                      <p className="font-medium flex items-center">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {data.issueDate}
                      </p>
                    </div>
                  </div>

                  {/* CO2 Summary */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {totalDistance.toFixed(1)} km
                        </div>
                        <div className="text-sm text-gray-600">{t('route.totalDistance')}</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCO2Value(totalCO2Saved)}
                        </div>
                        <div className="text-sm text-gray-600">{t('passport.co2Saved')}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Routes Table */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {t('passport.routes')}
                </h3>
                
                {data.routes.length > 0 ? (
                  <div className="space-y-3">
                    {data.routes.map((route, index) => {
                      const IconComponent = getTransportIcon('train')
                      return (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {index + 1}
                                </span>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{route.from}</span>
                                  <span className="text-gray-400">→</span>
                                  <span className="font-medium">{route.to}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <IconComponent className="h-3 w-3" />
                              <span>{getTransportLabel('train')}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 ml-11">
                            <div>
                              <span className="font-medium">{t('form.distance')}:</span> {route.distance} km
                            </div>
                            <div>
                              <span className="font-medium">{t('form.co2Savings')}:</span> {formatCO2Value(route.co2Saved)}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No routes added yet</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Transport Comparison */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">
                  교통수단별 CO₂ 배출량 비교
                </h3>
                <TransportComparison 
                  emissions={calculateCO2Emissions(totalDistance)}
                  distance={totalDistance}
                />
              </div>

              <Separator className="my-6" />

              {/* Route Map */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  여행 경로 지도
                </h3>
                {(() => {
                  const routeInputs: RouteInput[] = data.routes.map(route => ({
                    startStation: route.from,
                    endStation: route.to
                  }))
                  
                  const processedRoutes = processRoutes(routeInputs)
                  
                  if (processedRoutes.success && processedRoutes.routes.length > 0) {
                    return (
                      <ClientOnlyRouteMap 
                        routes={processedRoutes.routes}
                        height={300}
                        showControls={true}
                      />
                    )
                  } else {
                    return (
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                          <p className="text-gray-500">경로 데이터를 불러올 수 없습니다</p>
                        </div>
                      </div>
                    )
                  }
                })()}
              </div>

              {/* Barcode */}
              <div className="text-center">
                <Barcode passportId={data.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

PassportDocument.displayName = 'PassportDocument'