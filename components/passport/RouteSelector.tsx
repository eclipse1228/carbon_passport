'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus, MapPin, Train, Bus, Car, Plane, Footprints } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { STATIONS, getLocalizedStationName, type StationData } from '@/lib/constants/stations'
import { calculateDistance } from '@/lib/utils/distance-calculator'
import { calculateCO2Saved, formatCO2Value, type TransportMode } from '@/lib/utils/co2-calculator'

export interface Route {
  id: string
  fromStation: string
  toStation: string
  transportMode: TransportMode
  distance: number
  co2Saved: number
}

interface RouteSelectorProps {
  routes: Route[]
  onRoutesChange: (routes: Route[]) => void
  locale: string
}

export function RouteSelector({ routes, onRoutesChange, locale }: RouteSelectorProps) {
  const t = useTranslations()
  const [newRoute, setNewRoute] = useState<Partial<Route>>({
    fromStation: '',
    toStation: '',
    transportMode: 'train' as TransportMode
  })

  const transportModes: TransportMode[] = ['train', 'subway', 'bus', 'car', 'airplane', 'walk', 'bike']

  const calculateRouteData = (fromStationId: string, toStationId: string, mode: TransportMode) => {
    const fromStation = STATIONS.find(s => s.code === fromStationId)
    const toStation = STATIONS.find(s => s.code === toStationId)
    
    if (!fromStation || !toStation) return { distance: 0, co2Saved: 0 }
    
    const distance = calculateDistance(
      fromStation.latitude,
      fromStation.longitude,
      toStation.latitude,
      toStation.longitude
    )
    
    const co2Saved = calculateCO2Saved(distance, 'car', mode)
    
    return { distance: Math.round(distance * 100) / 100, co2Saved: Math.round(co2Saved) }
  }

  const addRoute = () => {
    if (!newRoute.fromStation || !newRoute.toStation || !newRoute.transportMode) return
    if (newRoute.fromStation === newRoute.toStation) return

    const { distance, co2Saved } = calculateRouteData(
      newRoute.fromStation,
      newRoute.toStation,
      newRoute.transportMode
    )

    const route: Route = {
      id: Date.now().toString(),
      fromStation: newRoute.fromStation,
      toStation: newRoute.toStation,
      transportMode: newRoute.transportMode,
      distance,
      co2Saved
    }

    onRoutesChange([...routes, route])
    setNewRoute({ fromStation: '', toStation: '', transportMode: 'train' as TransportMode })
  }

  const removeRoute = (routeId: string) => {
    onRoutesChange(routes.filter(route => route.id !== routeId))
  }

  const getStationName = (stationId: string) => {
    return getLocalizedStationName(stationId, locale as any)
  }

  const getTransportModeLabel = (mode: TransportMode) => {
    const labels: Record<TransportMode, string> = {
      train: '기차',
      subway: '지하철',
      bus: '버스', 
      car: '자동차',
      airplane: '비행기',
      walk: '도보',
      bike: '자전거'
    }
    return labels[mode] || mode
  }

  const getTransportModeIcon = (mode: TransportMode) => {
    const icons = {
      train: Train,
      subway: Train,
      bus: Bus,
      car: Car,
      airplane: Plane,
      walk: Footprints,
      bike: Footprints
    }
    return icons[mode] || Train
  }

  const getTransportModeColor = (mode: TransportMode) => {
    const colors = {
      train: 'bg-blue-100 text-blue-800 border-blue-200',
      subway: 'bg-blue-100 text-blue-800 border-blue-200',
      bus: 'bg-red-100 text-red-800 border-red-200',
      car: 'bg-gray-100 text-gray-800 border-gray-200',
      airplane: 'bg-purple-100 text-purple-800 border-purple-200',
      walk: 'bg-green-100 text-green-800 border-green-200',
      bike: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    }
    return colors[mode] || colors.train
  }

  const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0)
  const totalCO2Saved = routes.reduce((sum, route) => sum + route.co2Saved, 0)

  return (
    <div className="space-y-6">
      {/* Add New Route */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            {t('route.add')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Station */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('route.from')}
              </label>
              <Select
                value={newRoute.fromStation}
                onValueChange={(value) => setNewRoute({ ...newRoute, fromStation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('route.selectStation')} />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((station) => (
                    <SelectItem key={station.code} value={station.code}>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {getLocalizedStationName(station.code, locale as any)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* To Station */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t('route.to')}
              </label>
              <Select
                value={newRoute.toStation}
                onValueChange={(value) => setNewRoute({ ...newRoute, toStation: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('route.selectStation')} />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((station) => (
                    <SelectItem 
                      key={station.code} 
                      value={station.code}
                      disabled={station.code === newRoute.fromStation}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {getLocalizedStationName(station.code, locale as any)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transport Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t('form.transportMode')}
            </label>
            <Select
              value={newRoute.transportMode}
              onValueChange={(value: TransportMode) => setNewRoute({ ...newRoute, transportMode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {transportModes.map((mode) => {
                  const IconComponent = getTransportModeIcon(mode)
                  return (
                    <SelectItem key={mode} value={mode}>
                      <div className="flex items-center">
                        <IconComponent className="h-4 w-4 mr-2" />
                        {getTransportModeLabel(mode)}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Distance and CO2 Preview */}
          {newRoute.fromStation && newRoute.toStation && newRoute.transportMode && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t('form.distance')}:</span> {
                    calculateRouteData(newRoute.fromStation, newRoute.toStation, newRoute.transportMode).distance
                  } km
                </div>
                <div>
                  <span className="font-medium">{t('form.co2Savings')}:</span> {
                    formatCO2Value(calculateRouteData(newRoute.fromStation, newRoute.toStation, newRoute.transportMode).co2Saved)
                  }
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={addRoute}
            disabled={!newRoute.fromStation || !newRoute.toStation || newRoute.fromStation === newRoute.toStation}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('route.add')}
          </Button>
        </CardContent>
      </Card>

      {/* Routes List */}
      {routes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t('passport.routes')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {routes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{getStationName(route.fromStation)}</span>
                    <span>→</span>
                    <span className="font-medium">{getStationName(route.toStation)}</span>
                    <Badge className={`${getTransportModeColor(route.transportMode)} border`}>
                      <div className="flex items-center">
                        {React.createElement(getTransportModeIcon(route.transportMode), { className: "h-3 w-3 mr-1" })}
                        {getTransportModeLabel(route.transportMode)}
                      </div>
                    </Badge>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>{route.distance} km</span>
                    <span>{formatCO2Value(route.co2Saved)} saved</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeRoute(route.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      {routes.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalDistance.toFixed(1)} km
                </div>
                <div className="text-sm text-gray-600">{t('route.totalDistance')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCO2Value(totalCO2Saved)}
                </div>
                <div className="text-sm text-gray-600">{t('route.totalCO2Saved')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}