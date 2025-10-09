/**
 * Distance calculator for Korean train routes
 * Provides distances between major Korean cities and stations
 */

// Major Korean cities and their coordinates (approximate)
export const KOREAN_CITIES = {
  '서울': { lat: 37.5665, lng: 126.9780, engName: 'Seoul' },
  '부산': { lat: 35.1796, lng: 129.0756, engName: 'Busan' },
  '대구': { lat: 35.8714, lng: 128.6014, engName: 'Daegu' },
  '인천': { lat: 37.4563, lng: 126.7052, engName: 'Incheon' },
  '광주': { lat: 35.1595, lng: 126.8526, engName: 'Gwangju' },
  '대전': { lat: 36.3504, lng: 127.3845, engName: 'Daejeon' },
  '울산': { lat: 35.5384, lng: 129.3114, engName: 'Ulsan' },
  '수원': { lat: 37.2636, lng: 127.0286, engName: 'Suwon' },
  '고양': { lat: 37.6584, lng: 126.8320, engName: 'Goyang' },
  '창원': { lat: 35.2281, lng: 128.6811, engName: 'Changwon' },
  '천안': { lat: 36.8151, lng: 127.1139, engName: 'Cheonan' },
  '전주': { lat: 35.8242, lng: 127.1480, engName: 'Jeonju' },
  '춘천': { lat: 37.8813, lng: 127.7298, engName: 'Chuncheon' },
  '강릉': { lat: 37.7519, lng: 128.8761, engName: 'Gangneung' },
  '목포': { lat: 34.8118, lng: 126.3922, engName: 'Mokpo' },
  '포항': { lat: 36.0190, lng: 129.3435, engName: 'Pohang' },
  '제주': { lat: 33.4996, lng: 126.5312, engName: 'Jeju' },
  '원주': { lat: 37.3422, lng: 127.9202, engName: 'Wonju' },
  '안동': { lat: 36.5684, lng: 128.7294, engName: 'Andong' },
  '경주': { lat: 35.8562, lng: 129.2247, engName: 'Gyeongju' }
} as const

// Pre-calculated distances for major train routes (in kilometers)
export const TRAIN_ROUTE_DISTANCES = {
  // Seoul connections
  '서울-부산': 417,
  '서울-대구': 302,
  '서울-대전': 164,
  '서울-광주': 298,
  '서울-울산': 365,
  '서울-천안': 83,
  '서울-수원': 31,
  '서울-인천': 27,
  '서울-춘천': 87,
  '서울-강릉': 166,
  '서울-원주': 109,
  '서울-목포': 345,
  '서울-전주': 243,
  '서울-포항': 361,
  
  // Busan connections
  '부산-대구': 126,
  '부산-울산': 52,
  '부산-경주': 61,
  '부산-창원': 49,
  '부산-포항': 120,
  
  // Daegu connections
  '대구-대전': 142,
  '대구-울산': 94,
  '대구-안동': 91,
  '대구-포항': 89,
  
  // Daejeon connections
  '대전-광주': 169,
  '대전-천안': 81,
  '대전-전주': 85,
  
  // Other connections
  '광주-목포': 47,
  '광주-전주': 88,
  '천안-수원': 52,
  '인천-수원': 34,
  '춘천-강릉': 120,
  '원주-강릉': 87
} as const

/**
 * Get the distance between two cities
 * @param from Starting city
 * @param to Destination city
 * @returns Distance in kilometers, or null if route not found
 */
export function getTrainDistance(from: string, to: string): number | null {
  // Normalize city names (remove spaces and convert to standard form)
  const normalizedFrom = from.trim()
  const normalizedTo = to.trim()
  
  // Check direct route
  const directRoute = `${normalizedFrom}-${normalizedTo}` as keyof typeof TRAIN_ROUTE_DISTANCES
  if (TRAIN_ROUTE_DISTANCES[directRoute]) {
    return TRAIN_ROUTE_DISTANCES[directRoute]
  }
  
  // Check reverse route
  const reverseRoute = `${normalizedTo}-${normalizedFrom}` as keyof typeof TRAIN_ROUTE_DISTANCES
  if (TRAIN_ROUTE_DISTANCES[reverseRoute]) {
    return TRAIN_ROUTE_DISTANCES[reverseRoute]
  }
  
  return null
}

/**
 * Calculate distance using Haversine formula (for cities not in pre-calculated routes)
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point  
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return Math.round(distance)
}

/**
 * Get distance between two cities using pre-calculated routes or coordinates
 * @param from Starting city
 * @param to Destination city
 * @returns Distance in kilometers
 */
export function getCityDistance(from: string, to: string): number {
  // First try to get pre-calculated train route distance
  const trainDistance = getTrainDistance(from, to)
  if (trainDistance !== null) {
    return trainDistance
  }
  
  // If not found, calculate using coordinates
  const fromCity = KOREAN_CITIES[from as keyof typeof KOREAN_CITIES]
  const toCity = KOREAN_CITIES[to as keyof typeof KOREAN_CITIES]
  
  if (fromCity && toCity) {
    return calculateHaversineDistance(
      fromCity.lat, fromCity.lng,
      toCity.lat, toCity.lng
    )
  }
  
  // Default fallback distance
  return 100
}

/**
 * Get all available cities
 * @returns Array of city names
 */
export function getAvailableCities(): string[] {
  return Object.keys(KOREAN_CITIES)
}

/**
 * Get city information including English name and coordinates
 * @param cityName Korean city name
 * @returns City information or null if not found
 */
export function getCityInfo(cityName: string) {
  return KOREAN_CITIES[cityName as keyof typeof KOREAN_CITIES] || null
}

/**
 * Search for cities by partial name match
 * @param query Search query
 * @returns Array of matching city names
 */
export function searchCities(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim()
  return getAvailableCities().filter(city => 
    city.toLowerCase().includes(normalizedQuery)
  )
}

/**
 * Get popular train routes
 * @returns Array of popular route objects
 */
export function getPopularRoutes(): Array<{ from: string; to: string; distance: number }> {
  return [
    { from: '서울', to: '부산', distance: 417 },
    { from: '서울', to: '대구', distance: 302 },
    { from: '서울', to: '대전', distance: 164 },
    { from: '서울', to: '광주', distance: 298 },
    { from: '서울', to: '강릉', distance: 166 },
    { from: '부산', to: '대구', distance: 126 },
    { from: '대전', to: '광주', distance: 169 },
    { from: '서울', to: '천안', distance: 83 }
  ]
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Validate if a city name exists
 * @param cityName City name to validate
 * @returns True if city exists, false otherwise
 */
export function isValidCity(cityName: string): boolean {
  return cityName in KOREAN_CITIES
}

/**
 * Get route suggestions based on starting city
 * @param fromCity Starting city
 * @returns Array of suggested destination cities with distances
 */
export function getRouteSuggestions(fromCity: string): Array<{ city: string; distance: number }> {
  const suggestions: Array<{ city: string; distance: number }> = []
  
  for (const city of getAvailableCities()) {
    if (city !== fromCity) {
      const distance = getCityDistance(fromCity, city)
      suggestions.push({ city, distance })
    }
  }
  
  // Sort by distance and return top 8
  return suggestions
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 8)
}