/**
 * Passport data transformation utilities
 * Handles data conversion between form data, database records, and display formats
 */

import { calculateCO2Emissions, calculateTotalCO2 } from './co2-calculator'
import { getCityDistance } from './distance-calculator'

// Type definitions for passport data
export interface PassportFormData {
  name: string
  country: string
  photo?: File
  frequency: string
  routes: Array<{
    from: string
    to: string
    distance?: number
  }>
  purpose: string
  esgInterest: boolean
}

export interface PassportRoute {
  id?: string
  passport_id?: string
  start_station: string
  end_station: string
  distance: number
  co2_train: number
  co2_car: number
  co2_bus: number
  co2_airplane: number
  co2_saved: number
  sequence_order: number
}

export interface PassportRecord {
  id: string
  traveler_name: string
  country: string
  photo_url?: string
  travel_date: string
  share_hash: string
  expires_at?: string
  created_at: string
  metadata: Record<string, any>
  routes: PassportRoute[]
}

export interface PassportDisplayData {
  id: string
  name: string
  nameEn?: string
  country: string
  countryCode: string
  issueDate: string
  photoUrl?: string
  totalCO2Saved: number
  totalCO2Train: number
  tripCount: number
  totalDistance: number
  treeEquivalent: number
  routes: Array<{
    from: string
    to: string
    distance: number
    co2Saved: number
    co2Train: number
  }>
  environmentalImpact: {
    level: 'low' | 'medium' | 'high' | 'excellent'
    description: string
    badge: string
  }
  shareUrl: string
}

/**
 * Transform form data to database record format
 */
export function transformFormToRecord(
  formData: PassportFormData,
  shareHash: string
): Omit<PassportRecord, 'id' | 'created_at'> {
  const processedRoutes = formData.routes.map((route, index) => {
    const distance = route.distance || getCityDistance(route.from, route.to)
    const co2Calc = calculateCO2Emissions(distance)
    
    return {
      start_station: route.from,
      end_station: route.to,
      distance,
      co2_train: co2Calc.train,
      co2_car: co2Calc.car,
      co2_bus: co2Calc.bus,
      co2_airplane: co2Calc.airplane,
      co2_saved: co2Calc.saved,
      sequence_order: index
    }
  })

  return {
    traveler_name: formData.name,
    country: formData.country,
    photo_url: undefined, // Photo upload would be handled separately
    travel_date: new Date().toISOString().split('T')[0],
    share_hash: shareHash,
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
    metadata: {
      frequency: formData.frequency,
      purpose: formData.purpose,
      esgInterest: formData.esgInterest,
      created_via: 'web_form'
    },
    routes: processedRoutes
  }
}

/**
 * Transform database record to display format
 */
export function transformRecordToDisplay(record: PassportRecord): PassportDisplayData {
  const totalDistance = record.routes.reduce((sum, route) => sum + route.distance, 0)
  const totalCO2Saved = record.routes.reduce((sum, route) => sum + route.co2_saved, 0)
  const totalCO2Train = record.routes.reduce((sum, route) => sum + route.co2_train, 0)
  const treeEquivalent = Math.round((totalCO2Saved / 22) * 10) / 10 // 22kg CO2 per tree per year

  const environmentalImpact = getEnvironmentalImpact(totalCO2Saved)
  
  return {
    id: record.id,
    name: record.traveler_name,
    nameEn: generateEnglishName(record.traveler_name),
    country: getCountryName(record.country),
    countryCode: record.country,
    issueDate: formatDate(record.travel_date),
    photoUrl: record.photo_url,
    totalCO2Saved: Math.round(totalCO2Saved * 100) / 100,
    totalCO2Train: Math.round(totalCO2Train * 100) / 100,
    tripCount: record.routes.length,
    totalDistance,
    treeEquivalent,
    routes: record.routes.map(route => ({
      from: route.start_station,
      to: route.end_station,
      distance: route.distance,
      co2Saved: route.co2_saved,
      co2Train: route.co2_train
    })),
    environmentalImpact,
    shareUrl: `/passport/view/${record.share_hash}`
  }
}

/**
 * Generate a unique share hash for passport
 */
export function generateShareHash(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substr(2, 5)
  return `${timestamp}${random}`
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\./g, '.').replace(/\s/g, '')
}

/**
 * Get country name from country code
 */
export function getCountryName(countryCode: string): string {
  const countryNames: Record<string, string> = {
    'KR': '대한민국',
    'US': '미국',
    'JP': '일본',
    'CN': '중국'
  }
  return countryNames[countryCode] || countryCode
}

/**
 * Generate English name (simplified transliteration)
 */
export function generateEnglishName(koreanName: string): string {
  // This is a simplified mapping - in production, you'd use a proper transliteration library
  const nameMap: Record<string, string> = {
    '홍길동': 'Hong Gildong',
    '김철수': 'Kim Cheolsu',
    '이영희': 'Lee Younghee',
    '박민수': 'Park Minsu',
    '정수현': 'Jung Suhyun'
  }
  
  return nameMap[koreanName] || transliterateKoreanName(koreanName)
}

/**
 * Simple Korean name transliteration
 */
function transliterateKoreanName(koreanName: string): string {
  // Very basic transliteration - replace with proper library in production
  const consonants: Record<string, string> = {
    'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm',
    'ㅂ': 'b', 'ㅅ': 's', 'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch',
    'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h'
  }
  
  // This is overly simplified - just return a generic format for now
  return koreanName.split('').map(char => char).join('')
}

/**
 * Get environmental impact description
 */
export function getEnvironmentalImpact(co2Saved: number): {
  level: 'low' | 'medium' | 'high' | 'excellent'
  description: string
  badge: string
} {
  if (co2Saved >= 50) {
    return {
      level: 'excellent',
      description: '탁월한 환경 기여도! 지구를 위한 훌륭한 선택입니다.',
      badge: '🌍 환경 수호자'
    }
  } else if (co2Saved >= 20) {
    return {
      level: 'high',
      description: '높은 환경 기여도! 친환경 교통을 적극 활용하고 있습니다.',
      badge: '🌱 친환경 여행자'
    }
  } else if (co2Saved >= 5) {
    return {
      level: 'medium',
      description: '좋은 환경 기여도! 계속해서 친환경 교통을 이용해보세요.',
      badge: '♻️ 에코 실천가'
    }
  } else {
    return {
      level: 'low',
      description: '환경을 생각하는 첫 걸음! 더 많은 기차 여행을 계획해보세요.',
      badge: '🌿 환경 관심자'
    }
  }
}

/**
 * Calculate savings percentage compared to other transport modes
 */
export function calculateSavingsPercentages(routes: PassportRoute[]): {
  vs_car: number
  vs_bus: number
  vs_airplane: number
} {
  const totalTrain = routes.reduce((sum, route) => sum + route.co2_train, 0)
  const totalCar = routes.reduce((sum, route) => sum + route.co2_car, 0)
  const totalBus = routes.reduce((sum, route) => sum + route.co2_bus, 0)
  const totalAirplane = routes.reduce((sum, route) => sum + route.co2_airplane, 0)

  return {
    vs_car: totalCar > 0 ? Math.round(((totalCar - totalTrain) / totalCar) * 100) : 0,
    vs_bus: totalBus > 0 ? Math.round(((totalBus - totalTrain) / totalBus) * 100) : 0,
    vs_airplane: totalAirplane > 0 ? Math.round(((totalAirplane - totalTrain) / totalAirplane) * 100) : 0
  }
}

/**
 * Validate passport form data
 */
export function validatePassportForm(formData: PassportFormData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!formData.name || formData.name.trim().length === 0) {
    errors.push('이름을 입력해주세요.')
  }

  if (!formData.country) {
    errors.push('국가를 선택해주세요.')
  }

  if (!formData.frequency) {
    errors.push('이용 빈도를 선택해주세요.')
  }

  if (!formData.purpose) {
    errors.push('여행 목적을 선택해주세요.')
  }

  if (!formData.routes || formData.routes.length === 0) {
    errors.push('최소 하나의 여행 경로를 추가해주세요.')
  } else {
    formData.routes.forEach((route, index) => {
      if (!route.from || !route.to) {
        errors.push(`${index + 1}번째 경로의 출발지와 도착지를 모두 입력해주세요.`)
      }
      if (route.from === route.to) {
        errors.push(`${index + 1}번째 경로의 출발지와 도착지가 같습니다.`)
      }
    })
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Create mock passport data for demo purposes
 */
export function createMockPassport(): PassportDisplayData {
  return {
    id: 'mock-passport-12345',
    name: '홍길동',
    nameEn: 'Hong Gildong',
    country: '대한민국',
    countryCode: 'KR',
    issueDate: '2025.01.15',
    totalCO2Saved: 12.5,
    totalCO2Train: 8.2,
    tripCount: 5,
    totalDistance: 342,
    treeEquivalent: 2.5,
    routes: [
      { from: '서울', to: '부산', distance: 417, co2Saved: 4.2, co2Train: 2.8 },
      { from: '서울', to: '대전', distance: 164, co2Saved: 2.1, co2Train: 1.4 },
      { from: '대전', to: '광주', distance: 169, co2Saved: 1.8, co2Train: 1.2 }
    ],
    environmentalImpact: {
      level: 'medium',
      description: '좋은 환경 기여도! 계속해서 친환경 교통을 이용해보세요.',
      badge: '♻️ 에코 실천가'
    },
    shareUrl: '/passport/view/abc123def456'
  }
}