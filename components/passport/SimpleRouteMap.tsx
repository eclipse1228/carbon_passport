'use client'

import { useEffect, useState, useRef } from 'react'
import { type Route } from './RouteSelector'
import { STATIONS, getLocalizedStationName } from '@/lib/constants/stations'

interface SimpleRouteMapProps {
  routes: Route[]
  locale: string
  className?: string
}

export default function SimpleRouteMap({ routes, locale, className }: SimpleRouteMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [L, setL] = useState<any>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // 서버 사이드 렌더링 시 완전히 건너뛰기
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    let mounted = true

    const loadLeaflet = async () => {
      try {
        // 브라우저 환경인지 다시 한번 확인
        if (typeof window === 'undefined') return

        // 동적으로 leaflet 라이브러리 로드
        const leaflet = await import('leaflet')
        if (!mounted) return
        
        const L = leaflet.default

        // CSS 동적 로드
        if (typeof document !== 'undefined' && !document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
        }

        // 컴포넌트가 여전히 마운트되어 있는지 확인
        if (!mounted) return

        // 기본 마커 아이콘 설정
        try {
          delete (L.Icon.Default.prototype as any)._getIconUrl
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
          })
        } catch (iconError) {
          console.warn('아이콘 설정 실패:', iconError)
        }

        if (mounted) {
          setL(L)
          setMapLoaded(true)
        }
      } catch (error) {
        console.error('Leaflet 로드 실패:', error)
      }
    }

    loadLeaflet()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !L || !mapRef.current || routes.length === 0) return

    // 기존 지도 인스턴스 제거
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
    }

    // 새 지도 생성
    const map = L.map(mapRef.current).setView([36, 127.6], 6)

    // 타일 레이어 추가
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 10,
      minZoom: 6
    }).addTo(map)

    // 경로에서 사용된 역 수집
    const usedStations = new Set<string>()
    routes.forEach(route => {
      usedStations.add(route.fromStation)
      usedStations.add(route.toStation)
    })

    const stationsToShow = STATIONS.filter(station => usedStations.has(station.code))

    // 역 마커 추가 (번호형)
    stationsToShow.forEach((station, index) => {
      const getMarkerColor = (idx: number, total: number) => {
        if (idx === 0) return '#10B981' // 출발지 - 녹색
        if (idx === total - 1) return '#EF4444' // 도착지 - 빨간색
        return '#3B82F6' // 경유지 - 파란색
      }

      const markerColor = getMarkerColor(index, stationsToShow.length)
      const markerNumber = index + 1

      const marker = L.divIcon({
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${markerColor};
            border: 3px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            color: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          ">
            ${markerNumber}
          </div>
        `,
        className: 'custom-numbered-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })

      L.marker([station.latitude, station.longitude], { icon: marker })
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
              <div style="
                width: 24px;
                height: 24px;
                background: ${markerColor};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
                margin-right: 8px;
              ">
                ${markerNumber}
              </div>
              <strong>${getLocalizedStationName(station.code, locale as any)}</strong>
            </div>
            <small style="color: #666;">${station.region}</small>
            <br />
            <small style="color: #999; font-size: 11px;">
              ${index === 0 ? '출발지' : 
                index === stationsToShow.length - 1 ? '도착지' : 
                `경유지 ${index}`}
            </small>
          </div>
        `)
    })

    // 경로 라인 추가
    routes.forEach((route) => {
      const fromStation = STATIONS.find(s => s.code === route.fromStation)
      const toStation = STATIONS.find(s => s.code === route.toStation)
      
      if (!fromStation || !toStation) return

      // 간단한 직선 경로
      const latlngs = [
        [fromStation.latitude, fromStation.longitude],
        [toStation.latitude, toStation.longitude]
      ]

      const getRouteColor = (transportMode: string) => {
        const colors = {
          train: '#3B82F6',    // Blue
          bus: '#EF4444',      // Red  
          car: '#6B7280',      // Gray
          airplane: '#8B5CF6', // Purple
        }
        return colors[transportMode as keyof typeof colors] || '#6B7280'
      }

      L.polyline(latlngs, {
        color: getRouteColor(route.transportMode),
        weight: 4,
        opacity: 0.8
      }).addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <strong>
              ${getLocalizedStationName(fromStation.code, locale as any)} → ${getLocalizedStationName(toStation.code, locale as any)}
            </strong>
            <br />
            <small>${route.transportMode} • ${route.distance} km</small>
            <br />
            <small>${route.co2Saved}g CO₂ saved</small>
          </div>
        `)
    })

    // 지도 뷰 조정
    if (stationsToShow.length > 0) {
      const bounds = L.latLngBounds(
        stationsToShow.map(station => [station.latitude, station.longitude])
      )
      map.fitBounds(bounds, { padding: [20, 20] })
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mapLoaded, L, routes, locale])

  if (!mapLoaded) {
    return (
      <div className={`${className} h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center border`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (routes.length === 0) {
    return (
      <div className={`${className} h-64 bg-gray-100 rounded-lg flex items-center justify-center border`}>
        <p className="text-gray-500">Add routes to see them on the map</p>
      </div>
    )
  }

  return (
    <div className={`${className} h-64 md:h-96 rounded-lg overflow-hidden border`}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  )
}