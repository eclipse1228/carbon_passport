/**
 * Route calculation utilities integrating distance and CO2 calculations
 * Combines station data, distance calculation, and CO2 emissions
 */

import { STATIONS, getStationByCode, getStationByName } from '@/lib/constants/stations'
import { calculateHaversineDistance } from '@/lib/utils/distance-calculator'
import { calculateCO2Emissions, CO2Emissions } from '@/lib/utils/co2-calculator'
import { MapRoute, RouteInput } from '@/types/passport'

export interface RouteData {
  id: string
  startStation: string
  endStation: string
  startCoordinates: [number, number] // [lng, lat]
  endCoordinates: [number, number] // [lng, lat]
  distance: number
  co2Emissions: CO2Emissions
  sequenceOrder: number
}

export interface RouteCalculationResult {
  success: boolean
  routes: RouteData[]
  totalDistance: number
  totalCO2Emissions: CO2Emissions
  mapRoutes: MapRoute[]
  errors?: string[]
}

/**
 * Calculate distance between two stations using their coordinates
 * @param startStationCode Starting station code
 * @param endStationCode Ending station code
 * @returns Distance in kilometers, or null if stations not found
 */
export function calculateStationDistance(
  startStationCode: string,
  endStationCode: string
): number | null {
  const startStation = getStationByCode(startStationCode)
  const endStation = getStationByCode(endStationCode)
  
  if (!startStation || !endStation) {
    return null
  }
  
  return calculateHaversineDistance(
    startStation.latitude,
    startStation.longitude,
    endStation.latitude,
    endStation.longitude
  )
}

/**
 * Calculate CO2 emissions for a route
 * @param distance Distance in kilometers
 * @returns CO2 emissions for all transport modes
 */
export function calculateRouteCO2(distance: number): CO2Emissions {
  return calculateCO2Emissions(distance)
}

/**
 * Process multiple routes and calculate comprehensive data
 * @param routeInputs Array of route inputs from form
 * @returns Complete route calculation results
 */
export function processRoutes(routeInputs: RouteInput[]): RouteCalculationResult {
  const routes: RouteData[] = []
  const mapRoutes: MapRoute[] = []
  const errors: string[] = []
  let totalDistance = 0
  
  // Process each route
  routeInputs.forEach((route, index) => {
    const startStation = getStationByName(route.startStation)
    const endStation = getStationByName(route.endStation)
    
    if (!startStation || !endStation) {
      const error = `Invalid station names: ${route.startStation} -> ${route.endStation}`
      console.warn(error)
      errors.push(error)
      return
    }
    
    // Calculate distance using coordinates directly
    const distance = calculateHaversineDistance(
      startStation.latitude,
      startStation.longitude,
      endStation.latitude,
      endStation.longitude
    )
    
    // Calculate CO2 emissions
    const co2Emissions = calculateRouteCO2(distance)
    
    // Create route data
    const routeData: RouteData = {
      id: `route-${index}`,
      startStation: startStation.code,
      endStation: endStation.code,
      startCoordinates: [startStation.longitude, startStation.latitude],
      endCoordinates: [endStation.longitude, endStation.latitude],
      distance,
      co2Emissions,
      sequenceOrder: index
    }
    
    routes.push(routeData)
    totalDistance += distance
    
    // Create map route data
    const mapRoute: MapRoute = {
      from: {
        name: startStation.name_ko,
        coordinates: [startStation.longitude, startStation.latitude]
      },
      to: {
        name: endStation.name_ko,
        coordinates: [endStation.longitude, endStation.latitude]
      },
      distance,
      co2Saved: co2Emissions.saved
    }
    
    mapRoutes.push(mapRoute)
  })
  
  // Calculate total CO2 emissions
  const totalCO2Emissions = calculateRouteCO2(totalDistance)
  
  return {
    success: routes.length > 0,
    routes,
    totalDistance,
    totalCO2Emissions,
    mapRoutes,
    errors: errors.length > 0 ? errors : undefined
  }
}

/**
 * Get station information by code with error handling
 * @param stationCode Station code
 * @returns Station data or null if not found
 */
export function getStationInfo(stationCode: string) {
  return getStationByCode(stationCode)
}

/**
 * Validate route input
 * @param route Route input to validate
 * @returns Validation result with error message if invalid
 */
export function validateRoute(route: RouteInput): { 
  valid: boolean
  error?: string 
} {
  if (!route.from || !route.to) {
    return { valid: false, error: '출발지와 도착지를 모두 선택해주세요.' }
  }
  
  if (route.from === route.to) {
    return { valid: false, error: '출발지와 도착지가 같을 수 없습니다.' }
  }
  
  const startStation = getStationByCode(route.from)
  const endStation = getStationByCode(route.to)
  
  if (!startStation) {
    return { valid: false, error: `유효하지 않은 출발역: ${route.from}` }
  }
  
  if (!endStation) {
    return { valid: false, error: `유효하지 않은 도착역: ${route.to}` }
  }
  
  return { valid: true }
}

/**
 * Validate multiple routes
 * @param routes Array of route inputs
 * @returns Validation result for all routes
 */
export function validateRoutes(routes: RouteInput[]): {
  valid: boolean
  errors: string[]
} {
  if (routes.length === 0) {
    return { valid: false, errors: ['최소 하나의 여행 경로를 입력해주세요.'] }
  }
  
  const errors: string[] = []
  
  routes.forEach((route, index) => {
    const validation = validateRoute(route)
    if (!validation.valid && validation.error) {
      errors.push(`경로 ${index + 1}: ${validation.error}`)
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Get route statistics
 * @param routes Processed route data
 * @returns Statistical information about the routes
 */
export function getRouteStatistics(routes: RouteData[]) {
  if (routes.length === 0) {
    return {
      totalRoutes: 0,
      totalDistance: 0,
      averageDistance: 0,
      totalCO2Saved: 0,
      totalTreesEquivalent: 0,
      longestRoute: null,
      shortestRoute: null
    }
  }
  
  const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0)
  const totalCO2Saved = routes.reduce((sum, route) => sum + route.co2Emissions.saved, 0)
  const averageDistance = totalDistance / routes.length
  
  const sortedByDistance = [...routes].sort((a, b) => a.distance - b.distance)
  const shortestRoute = sortedByDistance[0]
  const longestRoute = sortedByDistance[sortedByDistance.length - 1]
  
  // Trees equivalent calculation (1 tree absorbs ~22kg CO2 per year)
  const totalTreesEquivalent = Math.ceil(totalCO2Saved / 22)
  
  return {
    totalRoutes: routes.length,
    totalDistance: Math.round(totalDistance),
    averageDistance: Math.round(averageDistance),
    totalCO2Saved: Math.round(totalCO2Saved * 100) / 100,
    totalTreesEquivalent,
    longestRoute: longestRoute ? {
      from: longestRoute.startStation,
      to: longestRoute.endStation,
      distance: longestRoute.distance
    } : null,
    shortestRoute: shortestRoute ? {
      from: shortestRoute.startStation,
      to: shortestRoute.endStation,
      distance: shortestRoute.distance
    } : null
  }
}

/**
 * Format route for display
 * @param route Route data
 * @param locale Locale for station names
 * @returns Formatted route information
 */
export function formatRouteDisplay(route: RouteData, locale: 'ko' | 'en' | 'ja' | 'zh' = 'ko') {
  const startStation = getStationByCode(route.startStation)
  const endStation = getStationByCode(route.endStation)
  
  if (!startStation || !endStation) {
    return {
      from: route.startStation,
      to: route.endStation,
      distance: route.distance,
      co2Saved: route.co2Emissions.saved
    }
  }
  
  const nameField = `name_${locale}` as keyof typeof startStation
  
  return {
    from: startStation[nameField] as string || startStation.name_ko,
    to: endStation[nameField] as string || endStation.name_ko,
    distance: route.distance,
    co2Saved: route.co2Emissions.saved,
    savingsPercentage: Math.round((route.co2Emissions.saved / route.co2Emissions.car) * 100)
  }
}