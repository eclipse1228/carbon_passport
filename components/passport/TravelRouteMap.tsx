'use client'

import { useEffect, useState } from 'react'

interface TravelRoute {
  from: string
  to: string
  fromCoord: [number, number]
  toCoord: [number, number]
  co2Saved: number
}

interface TravelRouteMapProps {
  routes: TravelRoute[]
  className?: string
}

export default function TravelRouteMap({ routes, className }: TravelRouteMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [mapComponents, setMapComponents] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // 클라이언트에서만 Leaflet 라이브러리를 동적으로 로드
    const loadMap = async () => {
      try {
        const L = (await import('leaflet')).default
        
        // Leaflet CSS 동적 로드
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        setMapComponents({ L })
      } catch (error) {
        console.error('Failed to load map:', error)
      }
    }

    loadMap()
  }, [])

  useEffect(() => {
    if (!isClient || !mapComponents || !routes.length) return

    const { L } = mapComponents
    
    // 기존 지도 인스턴스 제거
    const mapContainer = document.getElementById('travel-route-map')
    if (mapContainer) {
      mapContainer.innerHTML = ''
    }

    // 모든 좌표 수집하여 중심점과 줌 레벨 계산
    const allCoords: [number, number][] = []
    routes.forEach(route => {
      allCoords.push(route.fromCoord, route.toCoord)
    })

    if (allCoords.length === 0) return

    // 지도 초기화 - 회색 디자인
    const map = L.map('travel-route-map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true
    })

    // 회색 타일 레이어 (CartoDB Light - 깔끔한 회색)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CartoDB',
      maxZoom: 19,
      opacity: 0.8
    }).addTo(map)

    // 모든 좌표에 맞게 지도 뷰 설정
    const group = new L.FeatureGroup()
    
    // 각 경로별로 마커와 선 추가
    routes.forEach((route, index) => {
      // 시작점 마커 (녹색)
      const startMarker = L.circleMarker(route.fromCoord, {
        radius: 8,
        fillColor: '#10B981',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).bindPopup(`<b>${route.from}</b><br/>출발지`)

      // 종료점 마커 (빨간색)
      const endMarker = L.circleMarker(route.toCoord, {
        radius: 8,
        fillColor: '#EF4444',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).bindPopup(`<b>${route.to}</b><br/>도착지<br/>CO₂ 절약: ${route.co2Saved}kg`)

      // 경로선 (파란색)
      const routeLine = L.polyline([route.fromCoord, route.toCoord], {
        color: '#3B82F6',
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 10'
      }).bindPopup(`${route.from} → ${route.to}<br/>CO₂ 절약: ${route.co2Saved}kg`)

      group.addLayer(startMarker)
      group.addLayer(endMarker)
      group.addLayer(routeLine)
    })

    group.addTo(map)
    
    // 모든 마커가 보이도록 지도 뷰 조정
    if (allCoords.length > 0) {
      map.fitBounds(group.getBounds(), { padding: [20, 20] })
    }

    // 컴포넌트 언마운트 시 지도 정리
    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [isClient, mapComponents, routes])

  // 서버 사이드에서는 로딩 상태만 표시
  if (!isClient) {
    return (
      <div className={`${className} h-full bg-gray-100 rounded-lg flex items-center justify-center border`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div id="travel-route-map" className="h-full w-full rounded-lg"></div>
    </div>
  )
}