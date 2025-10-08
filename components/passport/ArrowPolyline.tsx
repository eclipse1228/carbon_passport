import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-polylinedecorator'

interface ArrowPolylineProps {
  positions: [number, number][]
  color: string
  weight?: number
  opacity?: number
  dashArray?: string
}

export function ArrowPolyline({ 
  positions, 
  color, 
  weight = 4, 
  opacity = 0.8, 
  dashArray = '' 
}: ArrowPolylineProps) {
  const map = useMap()

  useEffect(() => {
    if (!map || positions.length < 2) return

    // Create the polyline
    const polyline = L.polyline(positions, {
      color,
      weight,
      opacity,
      dashArray
    }).addTo(map)

    // Add arrow decorator
    const decorator = L.polylineDecorator(polyline, {
      patterns: [{
        offset: '95%',
        repeat: 0,
        symbol: L.Symbol.arrowHead({
          pixelSize: 10,
          polygon: false,
          pathOptions: {
            stroke: true,
            weight: 2,
            color: color,
            fillOpacity: 1,
            opacity: opacity
          }
        })
      }]
    }).addTo(map)

    // Cleanup function
    return () => {
      map.removeLayer(polyline)
      map.removeLayer(decorator)
    }
  }, [map, positions, color, weight, opacity, dashArray])

  return null
}