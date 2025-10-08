'use client'

// 이 컴포넌트는 더 이상 사용하지 않습니다. 
// SimpleRouteMap과 ClientOnlyRouteMap을 사용하세요.
// SSR 호환성을 위해 빈 컴포넌트로 대체합니다.

import { type Route } from './RouteSelector'

interface RouteMapProps {
  routes: Route[]
  locale: string
  className?: string
}

export default function RouteMap({ routes, locale, className }: RouteMapProps) {
  return (
    <div className={`${className} h-64 md:h-96 bg-gray-100 rounded-lg flex items-center justify-center border`}>
      <div className="text-center text-gray-500">
        <p>지도가 로드 중입니다...</p>
        <p className="text-sm">ClientOnlyRouteMap을 사용하세요.</p>
      </div>
    </div>
  )
}
