/**
 * Haversine formula implementation for calculating distances between coordinates
 * Used for calculating distances between train stations
 */

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface Station {
  code: string
  latitude: number
  longitude: number
  name?: string
}

/**
 * Calculate distance between two points using Haversine formula
 * @param coord1 First coordinate point
 * @param coord2 Second coordinate point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  // Validate coordinates
  validateCoordinates(coord1)
  validateCoordinates(coord2)
  
  const R = 6371 // Earth's radius in kilometers
  
  const lat1Rad = toRadians(coord1.latitude)
  const lat2Rad = toRadians(coord2.latitude)
  const deltaLat = toRadians(coord2.latitude - coord1.latitude)
  const deltaLon = toRadians(coord2.longitude - coord1.longitude)
  
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  
  const distance = R * c
  
  // Round to nearest kilometer
  return Math.round(distance)
}

/**
 * Calculate distance between two stations
 * @param station1 First station
 * @param station2 Second station
 * @returns Distance in kilometers
 */
export function calculateStationDistance(
  station1: Station,
  station2: Station
): number {
  return calculateDistance(
    { latitude: station1.latitude, longitude: station1.longitude },
    { latitude: station2.latitude, longitude: station2.longitude }
  )
}

/**
 * Calculate total distance for a route with multiple stops
 * @param stations Array of stations in order
 * @returns Total distance in kilometers
 */
export function calculateTotalRouteDistance(stations: Station[]): number {
  if (stations.length < 2) {
    return 0
  }
  
  let totalDistance = 0
  
  for (let i = 0; i < stations.length - 1; i++) {
    totalDistance += calculateStationDistance(stations[i], stations[i + 1])
  }
  
  return totalDistance
}

/**
 * Find stations within a certain radius from a point
 * @param center Center coordinate
 * @param stations Array of stations to search
 * @param radiusKm Radius in kilometers
 * @returns Array of stations within radius, sorted by distance
 */
export function findNearbyStations(
  center: Coordinates,
  stations: Station[],
  radiusKm: number
): Array<Station & { distanceKm: number }> {
  validateCoordinates(center)
  
  if (radiusKm <= 0) {
    throw new Error('Radius must be positive')
  }
  
  const nearbyStations = stations
    .map(station => ({
      ...station,
      distanceKm: calculateDistance(center, {
        latitude: station.latitude,
        longitude: station.longitude,
      }),
    }))
    .filter(station => station.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
  
  return nearbyStations
}

/**
 * Calculate the bearing (direction) from one point to another
 * @param from Starting coordinate
 * @param to Destination coordinate
 * @returns Bearing in degrees (0-360)
 */
export function calculateBearing(from: Coordinates, to: Coordinates): number {
  const dLon = toRadians(to.longitude - from.longitude)
  const lat1 = toRadians(from.latitude)
  const lat2 = toRadians(to.latitude)
  
  const y = Math.sin(dLon) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
  
  const bearingRad = Math.atan2(y, x)
  const bearingDeg = toDegrees(bearingRad)
  
  // Normalize to 0-360 degrees
  return (bearingDeg + 360) % 360
}

/**
 * Get compass direction from bearing
 * @param bearing Bearing in degrees
 * @returns Compass direction (N, NE, E, SE, S, SW, W, NW)
 */
export function getCompassDirection(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(bearing / 45) % 8
  return directions[index]
}

/**
 * Calculate the midpoint between two coordinates
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Midpoint coordinate
 */
export function calculateMidpoint(
  coord1: Coordinates,
  coord2: Coordinates
): Coordinates {
  const lat1 = toRadians(coord1.latitude)
  const lat2 = toRadians(coord2.latitude)
  const lon1 = toRadians(coord1.longitude)
  const lon2 = toRadians(coord2.longitude)
  
  const dLon = lon2 - lon1
  
  const Bx = Math.cos(lat2) * Math.cos(dLon)
  const By = Math.cos(lat2) * Math.sin(dLon)
  
  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + Bx) * (Math.cos(lat1) + Bx) + By * By)
  )
  
  const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx)
  
  return {
    latitude: toDegrees(lat3),
    longitude: toDegrees(lon3),
  }
}

/**
 * Check if coordinates are valid for South Korea
 * @param coord Coordinate to validate
 * @returns True if coordinates are within South Korea bounds
 */
export function isInSouthKorea(coord: Coordinates): boolean {
  // Approximate bounds for South Korea
  const SK_BOUNDS = {
    minLat: 33.0, // Southernmost point (Jeju)
    maxLat: 39.0, // Northernmost point
    minLon: 124.0, // Westernmost point
    maxLon: 132.0, // Easternmost point
  }
  
  return (
    coord.latitude >= SK_BOUNDS.minLat &&
    coord.latitude <= SK_BOUNDS.maxLat &&
    coord.longitude >= SK_BOUNDS.minLon &&
    coord.longitude <= SK_BOUNDS.maxLon
  )
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Validate coordinates
 */
function validateCoordinates(coord: Coordinates): void {
  if (
    typeof coord.latitude !== 'number' ||
    typeof coord.longitude !== 'number'
  ) {
    throw new Error('Coordinates must be numbers')
  }
  
  if (coord.latitude < -90 || coord.latitude > 90) {
    throw new Error('Latitude must be between -90 and 90')
  }
  
  if (coord.longitude < -180 || coord.longitude > 180) {
    throw new Error('Longitude must be between -180 and 180')
  }
  
  if (!isFinite(coord.latitude) || !isFinite(coord.longitude)) {
    throw new Error('Coordinates must be finite numbers')
  }
}