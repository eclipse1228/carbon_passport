import { describe, it, expect } from '@jest/globals'

// Contract tests for Survey API
// These tests define the expected survey behavior

describe('Survey API Contract Tests', () => {
  const baseUrl = 'http://localhost:3000/api'
  
  // Survey questions as defined in spec
  const surveyQuestions = [
    'travel_purpose', // 여행 목적
    'travel_frequency', // 기차 여행 빈도
    'environmental_importance', // 환경 중요도
    'would_recommend', // 추천 의향
    'improvement_suggestions', // 개선 제안
    'additional_comments', // 추가 의견
  ]
  
  describe('POST /api/survey', () => {
    it('should submit a complete survey response', async () => {
      const surveyData = {
        passport_id: 'test-passport-id',
        responses: {
          travel_purpose: 'leisure',
          travel_frequency: 'monthly',
          environmental_importance: 5,
          would_recommend: true,
          improvement_suggestions: 'More eco-friendly options',
          additional_comments: 'Great service!',
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      })
      
      expect(response.status).toBe(201)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('passport_id', surveyData.passport_id)
      expect(data).toHaveProperty('responses')
      expect(data).toHaveProperty('completed', true)
      expect(data).toHaveProperty('completed_at')
      expect(data.responses).toEqual(surveyData.responses)
    })
    
    it('should accept partial survey responses', async () => {
      const partialSurvey = {
        passport_id: 'test-passport-id',
        responses: {
          travel_purpose: 'business',
          travel_frequency: 'weekly',
          // Other questions unanswered
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partialSurvey),
      })
      
      expect(response.status).toBe(201)
      const data = await response.json()
      
      expect(data).toHaveProperty('completed', false)
      expect(data).toHaveProperty('completed_at', null)
      expect(data.responses).toEqual(partialSurvey.responses)
    })
    
    it('should validate passport_id exists', async () => {
      const surveyData = {
        passport_id: 'non-existent-passport',
        responses: {
          travel_purpose: 'leisure',
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Passport not found')
    })
    
    it('should prevent duplicate survey submissions', async () => {
      const passportId = 'passport-with-survey'
      
      // First submission (should succeed in real implementation)
      const firstSurvey = {
        passport_id: passportId,
        responses: { travel_purpose: 'leisure' },
      }
      
      // Second submission (should fail)
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firstSurvey),
      })
      
      // Assuming first submission already exists
      expect(response.status).toBe(409)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Survey already exists')
    })
  })
  
  describe('GET /api/survey/:passportId', () => {
    it('should retrieve survey responses by passport ID', async () => {
      const passportId = 'test-passport-id'
      
      const response = await fetch(`${baseUrl}/survey/${passportId}`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('id')
      expect(data).toHaveProperty('passport_id', passportId)
      expect(data).toHaveProperty('responses')
      expect(data).toHaveProperty('completed')
      expect(data).toHaveProperty('completed_at')
      expect(data).toHaveProperty('created_at')
    })
    
    it('should return 404 when survey not found', async () => {
      const passportId = 'passport-without-survey'
      
      const response = await fetch(`${baseUrl}/survey/${passportId}`)
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error', 'Survey not found')
    })
  })
  
  describe('PUT /api/survey/:passportId', () => {
    it('should update existing survey responses', async () => {
      const passportId = 'test-passport-id'
      const updatedResponses = {
        responses: {
          travel_purpose: 'business',
          travel_frequency: 'daily',
          environmental_importance: 5,
          would_recommend: true,
          improvement_suggestions: 'Add more routes',
          additional_comments: 'Excellent experience',
        },
      }
      
      const response = await fetch(`${baseUrl}/survey/${passportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedResponses),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('passport_id', passportId)
      expect(data).toHaveProperty('responses')
      expect(data).toHaveProperty('completed', true)
      expect(data).toHaveProperty('completed_at')
      expect(data.responses).toEqual(updatedResponses.responses)
    })
    
    it('should mark survey as completed when all questions answered', async () => {
      const passportId = 'test-passport-id'
      const completeResponses = {
        responses: {
          travel_purpose: 'leisure',
          travel_frequency: 'monthly',
          environmental_importance: 4,
          would_recommend: true,
          improvement_suggestions: 'More amenities',
          additional_comments: 'Good service',
        },
      }
      
      const response = await fetch(`${baseUrl}/survey/${passportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeResponses),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data.completed).toBe(true)
      expect(data.completed_at).not.toBeNull()
    })
  })
  
  describe('Survey Validation Tests', () => {
    it('should validate travel_purpose values', async () => {
      const invalidSurvey = {
        passport_id: 'test-passport-id',
        responses: {
          travel_purpose: 'invalid-purpose',
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidSurvey),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toContain('Invalid travel_purpose')
    })
    
    it('should validate environmental_importance range (1-5)', async () => {
      const invalidSurvey = {
        passport_id: 'test-passport-id',
        responses: {
          environmental_importance: 10, // Should be 1-5
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidSurvey),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toContain('environmental_importance must be between 1 and 5')
    })
    
    it('should validate would_recommend as boolean', async () => {
      const invalidSurvey = {
        passport_id: 'test-passport-id',
        responses: {
          would_recommend: 'yes', // Should be boolean
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidSurvey),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toContain('would_recommend must be a boolean')
    })
    
    it('should validate text length for suggestions and comments', async () => {
      const longText = 'a'.repeat(1001) // Over 1000 chars
      const invalidSurvey = {
        passport_id: 'test-passport-id',
        responses: {
          improvement_suggestions: longText,
        },
      }
      
      const response = await fetch(`${baseUrl}/survey`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidSurvey),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toContain('Text exceeds maximum length of 1000 characters')
    })
  })
})