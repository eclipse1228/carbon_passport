'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Trash2, Plus } from 'lucide-react'
import { calculateDistance } from '@/lib/utils/distance-calculator'
import { calculateCO2Saved } from '@/lib/utils/co2-calculator'
import { STATIONS, getLocalizedStationName } from '@/lib/constants/stations'
import type { Route } from '@/types/passport'

interface RouteManagerProps {
  initialRoutes: Route[]
  onSubmit: (routes: Route[]) => void
  onBack: () => void
}

export function RouteManager({ initialRoutes, onSubmit, onBack }: RouteManagerProps) {
  const t = useTranslations()
  const [routes, setRoutes] = useState<Route[]>(initialRoutes)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Recalculate distances and CO2 for all routes
    const updatedRoutes = routes.map((route) => {
      if (route.from && route.to) {
        const fromStation = STATIONS.find((s) => s.code === route.from)
        const toStation = STATIONS.find((s) => s.code === route.to)
        
        if (fromStation && toStation) {
          const distance = calculateDistance(
            fromStation.latitude,
            fromStation.longitude,
            toStation.latitude,
            toStation.longitude
          )
          const co2Saved = calculateCO2Saved(distance, 'car', 'train')
          return { ...route, distance, co2Saved }
        }
      }
      return route
    })
    setRoutes(updatedRoutes)
  }, [routes.map(r => r ? `${r.from}-${r.to}` : 'empty').join(',')])

  const addRoute = () => {
    setRoutes([...routes, { from: '', to: '', distance: 0, co2Saved: 0 }])
  }

  const removeRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index))
  }

  const updateRoute = (index: number, field: 'from' | 'to', value: string) => {
    const newRoutes = [...routes]
    newRoutes[index] = { ...newRoutes[index], [field]: value }
    
    // Check for same station error
    if (field === 'from' && value === newRoutes[index].to && value !== '') {
      setErrors({ [`route-${index}`]: t('validation.sameStation') })
    } else if (field === 'to' && value === newRoutes[index].from && value !== '') {
      setErrors({ [`route-${index}`]: t('validation.sameStation') })
    } else {
      const newErrors = { ...errors }
      delete newErrors[`route-${index}`]
      setErrors(newErrors)
    }
    
    setRoutes(newRoutes)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (routes.filter(r => r && r.from && r.to).length === 0) {
      newErrors.general = t('validation.minRoutes')
    }
    
    routes.forEach((route, index) => {
      if (route && route.from === route.to && route.from !== '') {
        newErrors[`route-${index}`] = t('validation.sameStation')
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(routes.filter(r => r && r.from && r.to))
    }
  }

  const totalDistance = routes.reduce((sum, route) => sum + (route?.distance || 0), 0)
  const totalCO2Saved = routes.reduce((sum, route) => sum + (route?.co2Saved || 0), 0)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t('passport.routes')}</h2>
          <Button type="button" onClick={addRoute} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            {t('route.add')}
          </Button>
        </div>

        {errors.general && (
          <p className="text-sm text-destructive">{errors.general}</p>
        )}

        <div className="space-y-3">
          {routes.map((route, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>{t('route.from')}</Label>
                    <Select
                      value={route.from}
                      onValueChange={(value) => updateRoute(index, 'from', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('route.selectStation')} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATIONS.map((station) => (
                          <SelectItem key={station.code} value={station.code}>
                            {getLocalizedStationName(station.code, 'ko')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t('route.to')}</Label>
                    <Select
                      value={route.to}
                      onValueChange={(value) => updateRoute(index, 'to', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('route.selectStation')} />
                      </SelectTrigger>
                      <SelectContent>
                        {STATIONS.map((station) => (
                          <SelectItem key={station.code} value={station.code}>
                            {getLocalizedStationName(station.code, 'ko')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {errors[`route-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`route-${index}`]}</p>
                )}

                {route.from && route.to && route.from !== route.to && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('route.distance')}: {route.distance.toFixed(1)} {t('emissions.unit.km')}</span>
                    <span>{t('route.co2Saved')}: {route.co2Saved.toFixed(2)} {t('emissions.unit.kg')}</span>
                  </div>
                )}

                {routes.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoute(index)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {t('route.remove')}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {totalDistance > 0 && (
          <Card className="p-4 bg-muted">
            <div className="flex justify-between font-semibold">
              <span>{t('route.totalDistance')}: {totalDistance.toFixed(1)} {t('emissions.unit.km')}</span>
              <span>{t('route.totalCO2Saved')}: {totalCO2Saved.toFixed(2)} {t('emissions.unit.kg')}</span>
            </div>
          </Card>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          {t('buttons.previous')}
        </Button>
        <Button type="submit" className="flex-1">
          {t('buttons.next')}
        </Button>
      </div>
    </form>
  )
}