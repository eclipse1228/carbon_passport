import { describe, it, expect } from '@jest/globals'

// Contract tests for Stations API
// These tests define the expected station data behavior

describe('Stations API Contract Tests', () => {
  const baseUrl = 'http://localhost:3000/api'
  const supportedLocales = ['ko', 'en', 'ja', 'zh']
  
  describe('GET /api/stations', () => {
    it('should return all active stations with default locale (ko)', async () => {
      const response = await fetch(`${baseUrl}/stations`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('success', true)
      expect(data).toHaveProperty('count')
      expect(data).toHaveProperty('stations')
      expect(Array.isArray(data.stations)).toBe(true)
      expect(data.count).toBeGreaterThan(0)
      
      // Validate station structure
      if (data.stations.length > 0) {
        const station = data.stations[0]
        expect(station).toHaveProperty('code')
        expect(station).toHaveProperty('name_ko')
        expect(station).toHaveProperty('name_en')
        expect(station).toHaveProperty('name_ja')
        expect(station).toHaveProperty('name_zh')
        expect(station).toHaveProperty('latitude')
        expect(station).toHaveProperty('longitude')
        expect(station).toHaveProperty('is_active', true)
        expect(station).toHaveProperty('created_at')
      }
    })
    
    supportedLocales.forEach((locale) => {
      it(`should return stations sorted by name for locale: ${locale}`, async () => {
        const response = await fetch(`${baseUrl}/stations?locale=${locale}`)
        
        expect(response.status).toBe(200)
        const data = await response.json()
        
        expect(data.success).toBe(true)
        expect(data.stations).toBeDefined()
        
        // Check if stations are sorted by the locale-specific name
        const nameField = `name_${locale}` as keyof typeof data.stations[0]
        for (let i = 1; i < data.stations.length; i++) {
          const prevName = data.stations[i - 1][nameField]
          const currentName = data.stations[i][nameField]
          
          if (prevName && currentName) {
            // Allow for null values in some locale fields
            expect(prevName.localeCompare(currentName)).toBeLessThanOrEqual(0)
          }
        }
      })
    })
    
    it('should handle invalid locale gracefully', async () => {
      const response = await fetch(`${baseUrl}/stations?locale=invalid`)
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Invalid locale')
    })
    
    it('should filter by search query', async () => {
      const response = await fetch(`${baseUrl}/stations?search=서울`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.success).toBe(true)
      expect(data.stations).toBeDefined()
      
      // All returned stations should contain the search term
      data.stations.forEach((station: any) => {
        const hasMatch = 
          station.name_ko?.includes('서울') ||
          station.name_en?.toLowerCase().includes('seoul') ||
          station.name_ja?.includes('ソウル') ||
          station.name_zh?.includes('首尔')
        
        expect(hasMatch).toBe(true)
      })
    })
  })
  
  describe('GET /api/stations/:code', () => {
    it('should return a specific station by code', async () => {
      const stationCode = 'SEOUL'
      
      const response = await fetch(`${baseUrl}/stations/${stationCode}`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('code', stationCode)
      expect(data).toHaveProperty('name_ko', '서울역')
      expect(data).toHaveProperty('name_en', 'Seoul Station')
      expect(data).toHaveProperty('name_ja', 'ソウル駅')
      expect(data).toHaveProperty('name_zh', '首尔站')
      expect(data).toHaveProperty('latitude')
      expect(data).toHaveProperty('longitude')
      expect(data).toHaveProperty('is_active', true)
      
      // Validate coordinate ranges
      expect(typeof data.latitude).toBe('number')
      expect(typeof data.longitude).toBe('number')
      expect(data.latitude).toBeGreaterThanOrEqual(33) // South Korea latitude range
      expect(data.latitude).toBeLessThanOrEqual(39)
      expect(data.longitude).toBeGreaterThanOrEqual(124) // South Korea longitude range
      expect(data.longitude).toBeLessThanOrEqual(132)
    })
    
    it('should return 404 for non-existent station code', async () => {
      const response = await fetch(`${baseUrl}/stations/INVALID`)
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error', 'Station not found')
    })
    
    it('should handle lowercase station codes', async () => {
      const response = await fetch(`${baseUrl}/stations/seoul`)
      
      // Should either convert to uppercase and find it, or return appropriate error
      expect([200, 404]).toContain(response.status)
      
      if (response.status === 200) {
        const data = await response.json()
        expect(data.code).toBe('SEOUL')
      }
    })
  })
  
  describe('GET /api/stations/distance', () => {
    it('should calculate distance between two stations', async () => {
      const params = new URLSearchParams({
        from: 'SEOUL',
        to: 'BUSAN',
      })
      
      const response = await fetch(`${baseUrl}/stations/distance?${params}`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('from_station')
      expect(data).toHaveProperty('to_station')
      expect(data).toHaveProperty('distance_km')
      expect(data).toHaveProperty('co2_emissions')
      
      // Validate from station
      expect(data.from_station).toHaveProperty('code', 'SEOUL')
      expect(data.from_station).toHaveProperty('name_ko')
      expect(data.from_station).toHaveProperty('coordinates')
      
      // Validate to station
      expect(data.to_station).toHaveProperty('code', 'BUSAN')
      expect(data.to_station).toHaveProperty('name_ko')
      expect(data.to_station).toHaveProperty('coordinates')
      
      // Validate distance (Seoul to Busan is approximately 325km)
      expect(data.distance_km).toBeGreaterThan(300)
      expect(data.distance_km).toBeLessThan(400)
      
      // Validate CO2 emissions
      expect(data.co2_emissions).toHaveProperty('train')
      expect(data.co2_emissions).toHaveProperty('car')
      expect(data.co2_emissions).toHaveProperty('bus')
      expect(data.co2_emissions).toHaveProperty('airplane')
      expect(data.co2_emissions).toHaveProperty('saved')
      
      // Train should have lowest emissions
      expect(data.co2_emissions.train).toBeLessThan(data.co2_emissions.car)
      expect(data.co2_emissions.train).toBeLessThan(data.co2_emissions.bus)
      expect(data.co2_emissions.train).toBeLessThan(data.co2_emissions.airplane)
      
      // Saved should be positive (difference between car and train)
      expect(data.co2_emissions.saved).toBeGreaterThan(0)
    })
    
    it('should return error for same station', async () => {
      const params = new URLSearchParams({
        from: 'SEOUL',
        to: 'SEOUL',
      })
      
      const response = await fetch(`${baseUrl}/stations/distance?${params}`)
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('same station')
    })
    
    it('should validate both station codes exist', async () => {
      const params = new URLSearchParams({
        from: 'SEOUL',
        to: 'INVALID',
      })
      
      const response = await fetch(`${baseUrl}/stations/distance?${params}`)
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Station not found')
    })
    
    it('should require both from and to parameters', async () => {
      const response = await fetch(`${baseUrl}/stations/distance?from=SEOUL`)
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('from and to parameters are required')
    })
  })
  
  describe('GET /api/stations/nearby', () => {
    it('should find nearby stations by coordinates', async () => {
      const params = new URLSearchParams({
        lat: '37.5547', // Seoul coordinates
        lng: '126.9707',
        radius: '50', // 50km radius
      })
      
      const response = await fetch(`${baseUrl}/stations/nearby?${params}`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('center')
      expect(data).toHaveProperty('radius_km', 50)
      expect(data).toHaveProperty('stations')
      expect(Array.isArray(data.stations)).toBe(true)
      
      // Should include Seoul and nearby stations
      const stationCodes = data.stations.map((s: any) => s.code)
      expect(stationCodes).toContain('SEOUL')
      expect(stationCodes).toContain('YONGSAN')
      
      // Each station should have distance from center
      data.stations.forEach((station: any) => {
        expect(station).toHaveProperty('distance_km')
        expect(station.distance_km).toBeLessThanOrEqual(50)
      })
      
      // Stations should be sorted by distance
      for (let i = 1; i < data.stations.length; i++) {
        expect(data.stations[i].distance_km).toBeGreaterThanOrEqual(
          data.stations[i - 1].distance_km
        )
      }
    })
    
    it('should validate coordinate ranges', async () => {
      const params = new URLSearchParams({
        lat: '200', // Invalid latitude
        lng: '126.9707',
      })
      
      const response = await fetch(`${baseUrl}/stations/nearby?${params}`)
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Invalid coordinates')
    })
    
    it('should use default radius if not provided', async () => {
      const params = new URLSearchParams({
        lat: '37.5547',
        lng: '126.9707',
      })
      
      const response = await fetch(`${baseUrl}/stations/nearby?${params}`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('radius_km', 10) // Default 10km
    })
  })
  
  describe('Station Data Integrity', () => {
    it('should have valid coordinates for all stations', async () => {
      const response = await fetch(`${baseUrl}/stations`)
      const data = await response.json()
      
      data.stations.forEach((station: any) => {
        // Korean peninsula coordinate ranges
        expect(station.latitude).toBeGreaterThanOrEqual(33)
        expect(station.latitude).toBeLessThanOrEqual(43)
        expect(station.longitude).toBeGreaterThanOrEqual(124)
        expect(station.longitude).toBeLessThanOrEqual(132)
      })
    })
    
    it('should have unique station codes', async () => {
      const response = await fetch(`${baseUrl}/stations`)
      const data = await response.json()
      
      const codes = data.stations.map((s: any) => s.code)
      const uniqueCodes = new Set(codes)
      
      expect(uniqueCodes.size).toBe(codes.length)
    })
    
    it('should have names in at least Korean and English', async () => {
      const response = await fetch(`${baseUrl}/stations`)
      const data = await response.json()
      
      data.stations.forEach((station: any) => {
        expect(station.name_ko).toBeTruthy()
        expect(station.name_en).toBeTruthy()
        expect(typeof station.name_ko).toBe('string')
        expect(typeof station.name_en).toBe('string')
      })
    })
  })
})