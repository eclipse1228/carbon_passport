'use client'

import React, { useEffect } from 'react'
import { Polyline, Marker, useMap } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import { generateCurvedPath, getArrowPosition, LatLng } from '@/lib/utils/curve-generator'

interface CurvedPolylineProps {
  start: LatLng
  end: LatLng
  color?: string
  weight?: number
  opacity?: number
  curvature?: number
  segments?: number
  showArrow?: boolean
  animated?: boolean
  onRouteClick?: () => void
  routeInfo?: {
    distance: number
    co2Saved: number
    routeName: string
  }
}

export function CurvedPolyline({
  start,
  end,
  color = '#3B82F6',
  weight = 4,
  opacity = 0.8,
  curvature = 0.3,
  segments = 30,
  showArrow = true,
  animated = false,
  onRouteClick,
  routeInfo
}: CurvedPolylineProps) {
  
  // Generate curved path coordinates
  const pathCoordinates = generateCurvedPath(start, end, curvature, segments)
  
  // Convert to Leaflet coordinate format [lat, lng]
  const leafletCoordinates: [number, number][] = pathCoordinates.map(
    point => [point.lat, point.lng]
  )
  
  // Get arrow position and rotation
  const arrowData = getArrowPosition(pathCoordinates, 0.7)
  
  // Create arrow marker icon
  const createArrowIcon = (rotation: number) => {
    const arrowHtml = `
      <div style="
        transform: rotate(${rotation}deg);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 12px solid ${color};
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      "></div>
    `
    
    return new DivIcon({
      html: arrowHtml,
      className: 'route-arrow-marker',
      iconSize: [16, 12],
      iconAnchor: [8, 6]
    })
  }

  // Animation effect for drawing the line
  useEffect(() => {
    if (animated) {
      // This could be enhanced with more sophisticated animation
      // For now, we'll use CSS animation via class names
    }
  }, [animated])

  return (
    <>
      {/* Main curved route line */}
      <Polyline
        positions={leafletCoordinates}
        color={color}
        weight={weight}
        opacity={opacity}
        smoothFactor={1}
        className={animated ? 'animated-route' : ''}
        eventHandlers={{
          click: onRouteClick || (() => {}),
          mouseover: (e) => {
            const target = e.target
            target.setStyle({
              weight: weight + 2,
              opacity: Math.min(opacity + 0.2, 1)
            })
          },
          mouseout: (e) => {
            const target = e.target
            target.setStyle({
              weight: weight,
              opacity: opacity
            })
          }
        }}
      />
      
      {/* Direction arrow */}
      {showArrow && (
        <Marker
          position={[arrowData.coordinates.lat, arrowData.coordinates.lng]}
          icon={createArrowIcon(arrowData.rotation)}
          interactive={false}
        />
      )}
    </>
  )
}

// Multi-route curved polyline for connecting multiple waypoints
interface MultiRouteCurvedPolylineProps {
  waypoints: LatLng[]
  colors?: string[]
  weight?: number
  opacity?: number
  curvature?: number
  segments?: number
  showArrows?: boolean
  animated?: boolean
  onRouteClick?: (routeIndex: number) => void
}

export function MultiRouteCurvedPolyline({
  waypoints,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
  weight = 4,
  opacity = 0.8,
  curvature = 0.2,
  segments = 20,
  showArrows = true,
  animated = false,
  onRouteClick
}: MultiRouteCurvedPolylineProps) {
  
  if (waypoints.length < 2) {
    return null
  }

  return (
    <>
      {waypoints.slice(0, -1).map((start, index) => {
        const end = waypoints[index + 1]
        const color = colors[index % colors.length]
        
        return (
          <CurvedPolyline
            key={`route-${index}`}
            start={start}
            end={end}
            color={color}
            weight={weight}
            opacity={opacity}
            curvature={curvature + (Math.sin(index * 0.3) * 0.1)} // Slight variation for spiral effect
            segments={segments}
            showArrow={showArrows}
            animated={animated}
            onRouteClick={() => onRouteClick?.(index)}
          />
        )
      })}
    </>
  )
}

// Route with distance and CO2 information overlay
interface AnnotatedCurvedPolylineProps extends CurvedPolylineProps {
  routeInfo: {
    distance: number
    co2Saved: number
    routeName: string
  }
  showInfo?: boolean
}

export function AnnotatedCurvedPolyline({
  routeInfo,
  showInfo = true,
  ...polylineProps
}: AnnotatedCurvedPolylineProps) {
  
  if (!showInfo) {
    return <CurvedPolyline {...polylineProps} routeInfo={routeInfo} />
  }

  // Calculate midpoint for info display
  const pathCoordinates = generateCurvedPath(
    polylineProps.start,
    polylineProps.end,
    polylineProps.curvature || 0.3,
    polylineProps.segments || 30
  )
  
  const midIndex = Math.floor(pathCoordinates.length / 2)
  const midPoint = pathCoordinates[midIndex]
  
  // Create info marker icon
  const createInfoIcon = () => {
    const infoHtml = `
      <div class="bg-white border-2 border-blue-500 rounded-lg px-2 py-1 shadow-lg text-xs font-medium">
        <div class="text-blue-700">${routeInfo.routeName}</div>
        <div class="text-slate-600">${routeInfo.distance}km • CO₂ ${routeInfo.co2Saved.toFixed(1)}kg 절약</div>
      </div>
    `
    
    return new DivIcon({
      html: infoHtml,
      className: 'route-info-marker',
      iconSize: [120, 40],
      iconAnchor: [60, 20]
    })
  }

  return (
    <>
      <CurvedPolyline {...polylineProps} routeInfo={routeInfo} />
      
      {/* Route information marker */}
      <Marker
        position={[midPoint.lat, midPoint.lng]}
        icon={createInfoIcon()}
        interactive={false}
      />
    </>
  )
}