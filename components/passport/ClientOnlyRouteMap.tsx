'use client'

import { useEffect, useState } from 'react'
import { type Route } from './RouteSelector'

interface ClientOnlyRouteMapProps {
  routes: Route[]
  locale: string
  className?: string
}

export default function ClientOnlyRouteMap({ routes, locale, className }: ClientOnlyRouteMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [RouteMapComponent, setRouteMapComponent] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // 클라이언트에서만 SimpleRouteMap 컴포넌트를 동적으로 로드
    import('./SimpleRouteMap').then((module) => {
      setRouteMapComponent(() => module.default)
    })
  }, [])

  // 서버 사이드에서는 로딩 상태만 표시
  if (!isClient || !RouteMapComponent) {
    return (
      <div className={`${className} h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center border`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  // 클라이언트에서만 실제 지도 컴포넌트를 렌더링
  return (
    <RouteMapComponent 
      routes={routes} 
      locale={locale} 
      className={className} 
    />
  )
}