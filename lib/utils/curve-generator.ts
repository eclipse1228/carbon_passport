/**
 * Curve generation utilities for map routes
 * Creates curved paths instead of straight lines between coordinates
 */

export interface LatLng {
  lat: number
  lng: number
}

/**
 * Generate a curved path between two points using quadratic Bezier curve
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param curvature Curve intensity (0-1, where 0 is straight line, 1 is maximum curve)
 * @param segments Number of segments to divide the curve into
 * @returns Array of LatLng points forming the curved path
 */
export function generateCurvedPath(
  start: LatLng,
  end: LatLng,
  curvature: number = 0.3,
  segments: number = 20
): LatLng[] {
  const path: LatLng[] = []
  
  // Calculate the control point for the quadratic Bezier curve
  const midLat = (start.lat + end.lat) / 2
  const midLng = (start.lng + end.lng) / 2
  
  // Calculate perpendicular offset for curve direction
  const deltaLat = end.lat - start.lat
  const deltaLng = end.lng - start.lng
  const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng)
  
  // Create control point perpendicular to the line, offset by curvature
  const perpLat = -deltaLng / distance * curvature * distance
  const perpLng = deltaLat / distance * curvature * distance
  
  const controlPoint: LatLng = {
    lat: midLat + perpLat,
    lng: midLng + perpLng
  }
  
  // Generate points along the Bezier curve
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const point = getQuadraticBezierPoint(start, controlPoint, end, t)
    path.push(point)
  }
  
  return path
}

/**
 * Calculate a point on a quadratic Bezier curve
 * @param p0 Start point
 * @param p1 Control point
 * @param p2 End point
 * @param t Parameter (0-1)
 * @returns Point on the curve at parameter t
 */
function getQuadraticBezierPoint(
  p0: LatLng,
  p1: LatLng,
  p2: LatLng,
  t: number
): LatLng {
  const x = (1 - t) * (1 - t) * p0.lat + 2 * (1 - t) * t * p1.lat + t * t * p2.lat
  const y = (1 - t) * (1 - t) * p0.lng + 2 * (1 - t) * t * p1.lng + t * t * p2.lng
  
  return { lat: x, lng: y }
}

/**
 * Generate a spiral-like curved path for multiple waypoints
 * @param points Array of coordinates to connect
 * @param curvature Curve intensity for each segment
 * @param segments Number of segments per curve
 * @returns Array of LatLng points forming the complete curved path
 */
export function generateMultiPointCurvedPath(
  points: LatLng[],
  curvature: number = 0.2,
  segments: number = 15
): LatLng[] {
  if (points.length < 2) return points
  
  const completePath: LatLng[] = []
  
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]
    
    // Vary curvature slightly for each segment to create spiral effect
    const segmentCurvature = curvature + (Math.sin(i * 0.5) * 0.1)
    
    const segmentPath = generateCurvedPath(start, end, segmentCurvature, segments)
    
    // Avoid duplicate points at segment junctions
    if (i === 0) {
      completePath.push(...segmentPath)
    } else {
      completePath.push(...segmentPath.slice(1))
    }
  }
  
  return completePath
}

/**
 * Calculate the bearing (direction) between two points
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(start: LatLng, end: LatLng): number {
  const deltaLng = end.lng - start.lng
  const deltaLat = end.lat - start.lat
  
  let bearing = Math.atan2(deltaLng, deltaLat) * (180 / Math.PI)
  
  // Normalize to 0-360 degrees
  bearing = (bearing + 360) % 360
  
  return bearing
}

/**
 * Calculate arrow position and rotation for route direction indication
 * @param path Array of path points
 * @param position Position along path (0-1)
 * @returns Object with coordinates and rotation angle for arrow
 */
export function getArrowPosition(
  path: LatLng[],
  position: number = 0.7
): { coordinates: LatLng; rotation: number } {
  if (path.length < 2) {
    return {
      coordinates: path[0] || { lat: 0, lng: 0 },
      rotation: 0
    }
  }
  
  const index = Math.floor((path.length - 1) * position)
  const nextIndex = Math.min(index + 1, path.length - 1)
  
  const current = path[index]
  const next = path[nextIndex]
  
  return {
    coordinates: current,
    rotation: calculateBearing(current, next)
  }
}

/**
 * Generate smooth curved path with animation waypoints
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param options Curve generation options
 * @returns Object with path coordinates and animation waypoints
 */
export function generateAnimatedCurvedPath(
  start: LatLng,
  end: LatLng,
  options: {
    curvature?: number
    segments?: number
    animationPoints?: number
  } = {}
): {
  path: LatLng[]
  animationWaypoints: LatLng[]
  arrowPosition: { coordinates: LatLng; rotation: number }
} {
  const {
    curvature = 0.3,
    segments = 30,
    animationPoints = 10
  } = options
  
  const path = generateCurvedPath(start, end, curvature, segments)
  
  // Select evenly distributed points for animation
  const animationWaypoints: LatLng[] = []
  for (let i = 0; i < animationPoints; i++) {
    const index = Math.floor((path.length - 1) * (i / (animationPoints - 1)))
    animationWaypoints.push(path[index])
  }
  
  const arrowPosition = getArrowPosition(path, 0.7)
  
  return {
    path,
    animationWaypoints,
    arrowPosition
  }
}