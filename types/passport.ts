/**
 * TypeScript type definitions for the Carbon Passport application
 */

// Database schema types matching Supabase schema
export interface PassportTable {
  id: string
  traveler_name: string
  country: 'KR' | 'US' | 'JP' | 'CN'
  photo_url?: string
  travel_date: string
  share_hash: string
  expires_at?: string
  created_at: string
  metadata: Record<string, any>
}

export interface RouteTable {
  id: string
  passport_id: string
  start_station: string
  end_station: string
  distance: number
  co2_train: number
  co2_car: number
  co2_bus: number
  co2_airplane: number
  co2_saved: number
  sequence_order: number
  created_at: string
}

export interface StationTable {
  code: string
  name_ko: string
  name_en: string
  name_ja?: string
  name_zh?: string
  latitude: number
  longitude: number
  is_active: boolean
  created_at: string
}

export interface SurveyResponseTable {
  id: string
  passport_id: string
  responses: Record<string, any>
  completed: boolean
  completed_at?: string
  created_at: string
}

// Application domain types
export interface Passport {
  id: string
  travelerName: string
  country: CountryCode
  photoUrl?: string
  travelDate: Date
  shareHash: string
  expiresAt?: Date
  createdAt: Date
  metadata: PassportMetadata
  routes: Route[]
}

export interface Route {
  id: string
  passportId: string
  startStation: string
  endStation: string
  distance: number
  co2Emissions: CO2Emissions
  sequenceOrder: number
  createdAt: Date
}

export interface CO2Emissions {
  train: number
  car: number
  bus: number
  airplane: number
  saved: number
}

export interface Station {
  code: string
  names: {
    ko: string
    en: string
    ja?: string
    zh?: string
  }
  coordinates: {
    latitude: number
    longitude: number
  }
  isActive: boolean
}

// Form and UI types
export interface PassportFormData {
  name: string
  country: CountryCode
  photo?: File
  frequency: TravelFrequency
  routes: RouteInput[]
  purpose: TravelPurpose
  esgInterest: boolean
}

export interface RouteInput {
  from: string
  to: string
  distance?: number
}

export interface PassportMetadata {
  frequency: TravelFrequency
  purpose: TravelPurpose
  esgInterest: boolean
  createdVia: 'web_form' | 'mobile_app' | 'api'
  version: string
}

// Display and presentation types
export interface PassportDisplayData {
  id: string
  name: string
  nameEn?: string
  country: string
  countryCode: CountryCode
  issueDate: string
  photoUrl?: string
  totalCO2Saved: number
  totalCO2Train: number
  tripCount: number
  totalDistance: number
  treeEquivalent: number
  routes: RouteDisplayData[]
  environmentalImpact: EnvironmentalImpact
  savingsComparison: SavingsComparison
  shareUrl: string
  qrCodeUrl?: string
  barcodeData?: string
}

export interface RouteDisplayData {
  from: string
  to: string
  distance: number
  co2Saved: number
  co2Train: number
  savingsPercentage: number
}

export interface EnvironmentalImpact {
  level: 'low' | 'medium' | 'high' | 'excellent'
  description: string
  badge: string
  color: string
}

export interface SavingsComparison {
  vs_car: number
  vs_bus: number
  vs_airplane: number
}

// Utility and enum types
export type CountryCode = 'KR' | 'US' | 'JP' | 'CN'

export type TravelFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely'

export type TravelPurpose = 'business' | 'commute' | 'leisure' | 'family'

export type TransportMode = 'train' | 'car' | 'bus' | 'airplane'

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PassportCreateResponse {
  passport: Passport
  shareHash: string
  shareUrl: string
}

export interface PassportLookupResponse {
  passport: PassportDisplayData
  found: boolean
}

// Statistics and analytics types
export interface PassportStatistics {
  totalPassports: number
  totalCO2Saved: number
  totalDistance: number
  totalTrees: number
  averageSavingsPerPassport: number
  mostPopularRoute: {
    from: string
    to: string
    count: number
  }
  countryCounts: Record<CountryCode, number>
  frequencyDistribution: Record<TravelFrequency, number>
}

// Map and location types
export interface MapRoute {
  from: {
    name: string
    coordinates: [number, number] // [lng, lat]
  }
  to: {
    name: string
    coordinates: [number, number] // [lng, lat]
  }
  distance: number
  co2Saved: number
}

export interface MapMarker {
  id: string
  name: string
  coordinates: [number, number] // [lng, lat]
  type: 'start' | 'end' | 'waypoint'
  routeCount: number
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// Search and filter types
export interface PassportSearchParams {
  query?: string
  country?: CountryCode
  dateFrom?: string
  dateTo?: string
  minCO2Saved?: number
  maxCO2Saved?: number
  sortBy?: 'created_at' | 'co2_saved' | 'distance'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface CitySearchResult {
  name: string
  englishName: string
  coordinates: {
    latitude: number
    longitude: number
  }
  isPopular: boolean
}

// Error types
export interface PassportError {
  code: string
  message: string
  details?: Record<string, any>
}

// Configuration types
export interface AppConfig {
  database: {
    url: string
    apiKey: string
  }
  features: {
    photoUpload: boolean
    socialSharing: boolean
    mapIntegration: boolean
    analytics: boolean
  }
  limits: {
    maxRoutesPerPassport: number
    maxPhotoSizeMB: number
    passportExpiryDays: number
  }
}

// Event types for analytics
export interface AnalyticsEvent {
  type: 'passport_created' | 'passport_viewed' | 'passport_shared' | 'route_added'
  timestamp: Date
  userId?: string
  sessionId: string
  data: Record<string, any>
}

// Component prop types
export interface PassportCardProps {
  passport: PassportDisplayData
  showActions?: boolean
  compact?: boolean
  onClick?: () => void
}

export interface RouteMapProps {
  routes: MapRoute[]
  height?: number
  showControls?: boolean
  onRouteClick?: (route: MapRoute) => void
}

export interface CO2ChartProps {
  data: CO2Emissions
  transportModes?: TransportMode[]
  showComparison?: boolean
}

// Hook types
export interface UsePassportReturn {
  passport: PassportDisplayData | null
  loading: boolean
  error: PassportError | null
  refresh: () => Promise<void>
}

export interface UsePassportFormReturn {
  formData: PassportFormData
  updateField: (field: keyof PassportFormData, value: any) => void
  validateForm: () => ValidationResult
  submitForm: () => Promise<PassportCreateResponse>
  isSubmitting: boolean
  errors: ValidationError[]
}