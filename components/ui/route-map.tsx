'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { LatLngBounds } from 'leaflet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StationMarker } from './station-marker'
import { CurvedPolyline, MultiRouteCurvedPolyline } from './curved-polyline'
import { RouteData } from '@/lib/utils/route-calculator'
import { getStationByCode } from '@/lib/constants/stations'
import { formatCO2 } from '@/lib/utils/co2-calculator'
import { MapPin, Route, Maximize2, Minimize2, Info } from 'lucide-react'

interface RouteMapProps {
  routes: RouteData[]
  height?: number
  className?: string
  showControls?: boolean
  showRouteInfo?: boolean
  onRouteClick?: (route: RouteData) => void
  onStationClick?: (stationCode: string) => void
}

// Component to fit map bounds to routes
function MapBoundsController({ routes }: { routes: RouteData[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (routes.length === 0) return
    
    const bounds = new LatLngBounds([])
    let hasValidCoordinates = false
    
    routes.forEach(route => {
      // 좌표 유효성 검증
      if (route.startCoordinates && 
          Array.isArray(route.startCoordinates) && 
          route.startCoordinates.length === 2 &&
          typeof route.startCoordinates[0] === 'number' &&
          typeof route.startCoordinates[1] === 'number') {
        bounds.extend([route.startCoordinates[1], route.startCoordinates[0]])
        hasValidCoordinates = true
      }
      
      if (route.endCoordinates && 
          Array.isArray(route.endCoordinates) && 
          route.endCoordinates.length === 2 &&
          typeof route.endCoordinates[0] === 'number' &&
          typeof route.endCoordinates[1] === 'number') {
        bounds.extend([route.endCoordinates[1], route.endCoordinates[0]])
        hasValidCoordinates = true
      }
    })
    
    // 유효한 좌표가 있을 때만 bounds 적용
    if (hasValidCoordinates) {
      map.fitBounds(bounds, { padding: [20, 20] })
    } else {
      // 유효한 좌표가 없으면 한국 중심으로 설정
      map.setView([36.5, 127.5], 7)
    }
  }, [routes, map])
  
  return null
}

export function RouteMap({
  routes,
  height = 400,
  className = '',
  showControls = true,
  showRouteInfo = true,
  onRouteClick,
  onStationClick
}: RouteMapProps) {
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAllRoutes, setShowAllRoutes] = useState(true)
  
  // Korea center coordinates
  const koreaCenter: [number, number] = [36.5, 127.5]
  
  // Get unique stations from routes
  const getUniqueStations = () => {
    const stationMap = new Map<string, { station: any; type: 'start' | 'end' | 'waypoint'; sequences: number[] }>()
    
    routes.forEach((route, index) => {
      const startStation = getStationByCode(route.startStation)
      const endStation = getStationByCode(route.endStation)
      
      if (startStation) {
        const existing = stationMap.get(route.startStation)
        if (existing) {
          existing.sequences.push(index + 1)
          if (existing.type === 'waypoint') existing.type = 'start'
        } else {
          stationMap.set(route.startStation, {
            station: startStation,
            type: 'start',
            sequences: [index + 1]
          })
        }
      }
      
      if (endStation) {
        const existing = stationMap.get(route.endStation)
        if (existing) {
          existing.sequences.push(index + 1)
          if (existing.type === 'waypoint') existing.type = 'end'
        } else {
          stationMap.set(route.endStation, {
            station: endStation,
            type: 'end',
            sequences: [index + 1]
          })
        }
      }
    })
    
    return Array.from(stationMap.entries()).map(([code, data]) => ({
      ...data,
      code
    }))
  }
  
  const uniqueStations = getUniqueStations()
  
  // Convert routes to waypoints for curved lines
  const getRouteWaypoints = () => {
    return routes
      .filter(route => {
        // 더 엄격한 좌표 유효성 검증
        const hasValidStart = route.startCoordinates && 
          Array.isArray(route.startCoordinates) && 
          route.startCoordinates.length === 2 &&
          typeof route.startCoordinates[0] === 'number' &&
          typeof route.startCoordinates[1] === 'number' &&
          !isNaN(route.startCoordinates[0]) &&
          !isNaN(route.startCoordinates[1])
          
        const hasValidEnd = route.endCoordinates && 
          Array.isArray(route.endCoordinates) && 
          route.endCoordinates.length === 2 &&
          typeof route.endCoordinates[0] === 'number' &&
          typeof route.endCoordinates[1] === 'number' &&
          !isNaN(route.endCoordinates[0]) &&
          !isNaN(route.endCoordinates[1])
          
        return hasValidStart && hasValidEnd
      })
      .map(route => ({
        start: { lat: route.startCoordinates[1], lng: route.startCoordinates[0] },
        end: { lat: route.endCoordinates[1], lng: route.endCoordinates[0] },
        route
      }))
  }
  
  const routeWaypoints = getRouteWaypoints()
  
  // Handle route selection
  const handleRouteClick = (route: RouteData) => {
    setSelectedRoute(route)
    onRouteClick?.(route)
  }
  
  // Handle station selection
  const handleStationClick = (stationCode: string) => {
    onStationClick?.(stationCode)
  }
  
  const mapHeight = isFullscreen ? '80vh' : `${height}px`
  
  if (routes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height: mapHeight }}>
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 text-slate-400 mx-auto" />
            <p className="text-slate-500">표시할 여행 경로가 없습니다</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 유효한 경로가 없는 경우에 대한 fallback
  if (routeWaypoints.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center" style={{ height: mapHeight }}>
          <div className="text-center space-y-2">
            <MapPin className="h-12 w-12 text-amber-400 mx-auto" />
            <p className="text-slate-500">경로 좌표 정보를 불러오는 중입니다...</p>
            <p className="text-xs text-slate-400">잠시 후 다시 시도해주세요</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Controls */}
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-blue-600">
              <Route className="h-3 w-3 mr-1" />
              {routes.length}개 경로
            </Badge>
            <Badge variant="outline" className="text-green-600">
              총 {routes.reduce((sum, r) => sum + r.distance, 0)}km
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllRoutes(!showAllRoutes)}
            >
              {showAllRoutes ? '선택된 경로만' : '모든 경로'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
      
      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: mapHeight, width: '100%' }}>
            <MapContainer
              center={koreaCenter}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              attributionControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Auto-fit bounds to routes */}
              <MapBoundsController routes={routes} />
              
              {/* Station Markers */}
              {uniqueStations.map(({ code, station, type, sequences }) => (
                <StationMarker
                  key={code}
                  position={[station.latitude, station.longitude]}
                  stationName={station.name_ko}
                  stationCode={code}
                  sequenceNumber={sequences[0]}
                  type={type}
                  onClick={() => handleStationClick(code)}
                >
                  {sequences.length > 1 && (
                    <div className="text-xs text-blue-600">
                      경로 {sequences.join(', ')}번에서 이용
                    </div>
                  )}
                </StationMarker>
              ))}
              
              {/* Route Lines */}
              {routeWaypoints.map((waypoint, index) => {
                const route = waypoint.route
                const isSelected = selectedRoute?.id === route.id
                const shouldShow = showAllRoutes || isSelected
                
                if (!shouldShow) return null
                
                return (
                  <CurvedPolyline
                    key={route.id}
                    start={waypoint.start}
                    end={waypoint.end}
                    color={isSelected ? '#EF4444' : `hsl(${index * 137.5 % 360}, 70%, 50%)`}
                    weight={isSelected ? 6 : 4}
                    opacity={isSelected ? 1 : 0.7}
                    curvature={0.3 + (index * 0.1)}
                    showArrow={true}
                    animated={isSelected}
                    onRouteClick={() => handleRouteClick(route)}
                    routeInfo={{
                      distance: route.distance,
                      co2Saved: route.co2Emissions.saved,
                      routeName: `경로 ${index + 1}`
                    }}
                  />
                )
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Route Information Panel */}
      {showRouteInfo && selectedRoute && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              선택된 경로 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">경로</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      {getStationByCode(selectedRoute.startStation)?.name_ko}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      {getStationByCode(selectedRoute.endStation)?.name_ko}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">거리 & 절약량</h4>
                <div className="space-y-1 text-sm">
                  <div>거리: <span className="font-medium">{selectedRoute.distance}km</span></div>
                  <div>CO₂ 절약: <span className="font-medium text-green-600">
                    {formatCO2(selectedRoute.co2Emissions.saved)}
                  </span></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-slate-700">환경 효과</h4>
                <div className="space-y-1 text-sm">
                  <div>기차: <span className="text-green-600 font-medium">
                    {formatCO2(selectedRoute.co2Emissions.train)}
                  </span></div>
                  <div>자동차: <span className="text-red-600 font-medium">
                    {formatCO2(selectedRoute.co2Emissions.car)}
                  </span></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}