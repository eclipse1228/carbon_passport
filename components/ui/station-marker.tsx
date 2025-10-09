'use client'

import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import { DivIcon } from 'leaflet'
import { Train, MapPin } from 'lucide-react'

interface StationMarkerProps {
  position: [number, number] // [lat, lng]
  stationName: string
  stationCode: string
  sequenceNumber?: number
  type: 'start' | 'end' | 'waypoint'
  onClick?: () => void
  children?: React.ReactNode
}

export function StationMarker({
  position,
  stationName,
  stationCode,
  sequenceNumber,
  type,
  onClick,
  children
}: StationMarkerProps) {
  
  // Create custom marker icon based on type
  const createMarkerIcon = () => {
    const colors = {
      start: '#10B981', // Green
      end: '#EF4444',   // Red  
      waypoint: '#3B82F6' // Blue
    }
    
    const color = colors[type]
    const displayNumber = sequenceNumber || 1
    
    // Create HTML for the marker
    const markerHtml = `
      <div class="relative flex items-center justify-center">
        <!-- Outer ring -->
        <div class="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg" 
             style="background-color: ${color}"></div>
        
        <!-- Inner content -->
        <div class="relative z-10 flex items-center justify-center w-6 h-6 rounded-full text-white text-xs font-bold"
             style="background-color: ${color}">
          ${displayNumber}
        </div>
        
        <!-- Station type indicator -->
        <div class="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm"
             style="background-color: ${color}">
          <div class="flex items-center justify-center w-full h-full">
            ${type === 'start' ? '🚂' : type === 'end' ? '🏁' : '📍'}
          </div>
        </div>
      </div>
    `
    
    return new DivIcon({
      html: markerHtml,
      className: 'custom-station-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    })
  }

  const icon = createMarkerIcon()

  return (
    <Marker 
      position={position}
      icon={icon}
      eventHandlers={{
        click: onClick || (() => {})
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <Train className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900">{stationName}</h3>
          </div>
          
          <div className="space-y-1 text-sm text-slate-600">
            <div>
              <span className="font-medium">역 코드:</span> {stationCode}
            </div>
            
            {sequenceNumber && (
              <div>
                <span className="font-medium">순서:</span> {sequenceNumber}번째
              </div>
            )}
            
            <div>
              <span className="font-medium">유형:</span>{' '}
              {type === 'start' && '출발지'}
              {type === 'end' && '도착지'}
              {type === 'waypoint' && '경유지'}
            </div>
            
            <div className="text-xs text-slate-500 mt-2">
              좌표: {position[0].toFixed(4)}, {position[1].toFixed(4)}
            </div>
          </div>
          
          {children && (
            <div className="mt-3 pt-2 border-t border-slate-200">
              {children}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

// Station cluster marker for multiple nearby stations
interface StationClusterMarkerProps {
  position: [number, number]
  stationCount: number
  stations: Array<{
    name: string
    code: string
  }>
  onClick?: () => void
}

export function StationClusterMarker({
  position,
  stationCount,
  stations,
  onClick
}: StationClusterMarkerProps) {
  
  const createClusterIcon = () => {
    const markerHtml = `
      <div class="relative flex items-center justify-center">
        <!-- Cluster circle -->
        <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 border-2 border-white shadow-lg">
          <span class="text-white text-sm font-bold">${stationCount}</span>
        </div>
        
        <!-- Cluster indicator -->
        <div class="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border border-white flex items-center justify-center">
          <span class="text-white text-xs">📍</span>
        </div>
      </div>
    `
    
    return new DivIcon({
      html: markerHtml,
      className: 'custom-cluster-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    })
  }

  return (
    <Marker 
      position={position}
      icon={createClusterIcon()}
      eventHandlers={{
        click: onClick || (() => {})
      }}
    >
      <Popup>
        <div className="p-2 min-w-[250px]">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-slate-900">
              이 지역의 역들 ({stationCount}개)
            </h3>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {stations.map((station, index) => (
              <div 
                key={station.code}
                className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm"
              >
                <span className="font-medium">{station.name}</span>
                <span className="text-slate-500 text-xs">{station.code}</span>
              </div>
            ))}
          </div>
          
          <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-200">
            클릭하여 개별 역 선택
          </div>
        </div>
      </Popup>
    </Marker>
  )
}