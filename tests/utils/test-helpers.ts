import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Passport = Database['public']['Tables']['passports']['Row']
type Station = Database['public']['Tables']['stations']['Row']

// Test data factories
export const createTestPassport = (overrides?: Partial<Passport>): Partial<Passport> => ({
  traveler_name: 'Test User',
  country: 'KR',
  travel_date: new Date().toISOString().split('T')[0],
  ...overrides,
})

export const createTestRoute = (passportId: string, order: number = 0) => ({
  passport_id: passportId,
  start_station: 'SEOUL',
  end_station: 'BUSAN',
  sequence_order: order,
  distance: 325,
  co2_train: 6.5,
  co2_car: 65,
  co2_bus: 32.5,
  co2_airplane: 97.5,
  co2_saved: 58.5,
})

export const createTestSurvey = (passportId: string) => ({
  passport_id: passportId,
  responses: {
    travel_purpose: 'leisure',
    travel_frequency: 'monthly',
    environmental_importance: 4,
    would_recommend: true,
    improvement_suggestions: 'Test suggestion',
    additional_comments: 'Test comment',
  },
})

// API test helpers
export class ApiTestClient {
  private baseUrl: string
  
  constructor(baseUrl: string = 'http://localhost:3000/api') {
    this.baseUrl = baseUrl
  }
  
  async get(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`)
    return {
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json() : null,
    }
  }
  
  async post(path: string, body: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return {
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json() : null,
    }
  }
  
  async put(path: string, body: any) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return {
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json() : null,
    }
  }
  
  async delete(path: string) {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
    })
    return {
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json() : null,
    }
  }
  
  async uploadFile(path: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      body: formData,
    })
    return {
      status: response.status,
      data: response.ok ? await response.json() : null,
      error: !response.ok ? await response.json() : null,
    }
  }
}

// Database test helpers
export async function cleanupTestData(passportId: string) {
  const supabase = createClient()
  
  // Delete in reverse order of foreign key dependencies
  await supabase.from('survey_responses').delete().eq('passport_id', passportId)
  await supabase.from('routes').delete().eq('passport_id', passportId)
  await supabase.from('passports').delete().eq('id', passportId)
}

// Mock data
export const mockStations: Partial<Station>[] = [
  {
    code: 'SEOUL',
    name_ko: '서울역',
    name_en: 'Seoul Station',
    name_ja: 'ソウル駅',
    name_zh: '首尔站',
    latitude: 37.5547,
    longitude: 126.9707,
  },
  {
    code: 'BUSAN',
    name_ko: '부산역',
    name_en: 'Busan Station',
    name_ja: '釜山駅',
    name_zh: '釜山站',
    latitude: 35.1154,
    longitude: 129.0413,
  },
  {
    code: 'DAEGU',
    name_ko: '대구역',
    name_en: 'Daegu Station',
    name_ja: '大邱駅',
    name_zh: '大邱站',
    latitude: 35.8781,
    longitude: 128.6281,
  },
]

// Date helpers
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Validation helpers
export function isValidShareHash(hash: string): boolean {
  return /^[A-Za-z0-9]{32}$/.test(hash)
}

export function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(uuid)
}

// CO2 calculation helpers (matching the spec)
export function calculateCO2(distanceKm: number) {
  const emissionRates = {
    train: 0.02, // kg CO2 per km
    car: 0.2, // kg CO2 per km
    bus: 0.1, // kg CO2 per km
    airplane: 0.3, // kg CO2 per km
  }
  
  return {
    train: distanceKm * emissionRates.train,
    car: distanceKm * emissionRates.car,
    bus: distanceKm * emissionRates.bus,
    airplane: distanceKm * emissionRates.airplane,
    saved: distanceKm * (emissionRates.car - emissionRates.train),
  }
}

// Distance calculation using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}