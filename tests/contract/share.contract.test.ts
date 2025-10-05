import { describe, it, expect } from '@jest/globals'

// Contract tests for Share API
// These tests define the expected sharing behavior

describe('Share API Contract Tests', () => {
  const baseUrl = 'http://localhost:3000/api'
  const SHARE_DURATION_DAYS = 30
  
  describe('POST /api/share', () => {
    it('should generate a share link for a passport', async () => {
      const shareRequest = {
        passport_id: 'test-passport-id',
      }
      
      const response = await fetch(`${baseUrl}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shareRequest),
      })
      
      expect(response.status).toBe(201)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('share_hash')
      expect(data).toHaveProperty('share_url')
      expect(data).toHaveProperty('expires_at')
      expect(data).toHaveProperty('passport_id', shareRequest.passport_id)
      
      // Share hash should be 32 characters
      expect(data.share_hash).toHaveLength(32)
      
      // Share URL should contain the hash
      expect(data.share_url).toContain(data.share_hash)
      expect(data.share_url).toContain('/share/')
      
      // Expiration should be 30 days from now
      const expirationDate = new Date(data.expires_at)
      const expectedExpiration = new Date()
      expectedExpiration.setDate(expectedExpiration.getDate() + SHARE_DURATION_DAYS)
      
      // Allow 1 minute tolerance for test execution time
      const timeDiff = Math.abs(expirationDate.getTime() - expectedExpiration.getTime())
      expect(timeDiff).toBeLessThan(60000) // Less than 1 minute difference
    })
    
    it('should not regenerate share link if one already exists', async () => {
      const passportId = 'passport-with-existing-share'
      
      // First request
      const response1 = await fetch(`${baseUrl}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passport_id: passportId }),
      })
      
      // Second request (should return existing)
      const response2 = await fetch(`${baseUrl}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passport_id: passportId }),
      })
      
      expect(response2.status).toBe(200) // 200 instead of 201 for existing
      const data = await response2.json()
      
      expect(data).toHaveProperty('message', 'Share link already exists')
      expect(data).toHaveProperty('share_hash')
      expect(data).toHaveProperty('share_url')
      expect(data).toHaveProperty('expires_at')
    })
    
    it('should return 404 for non-existent passport', async () => {
      const response = await fetch(`${baseUrl}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passport_id: 'non-existent-id' }),
      })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error', 'Passport not found')
    })
    
    it('should require passport_id in request', async () => {
      const response = await fetch(`${baseUrl}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('passport_id is required')
    })
  })
  
  describe('GET /api/share/:hash/validate', () => {
    it('should validate an active share link', async () => {
      const validHash = 'valid32charactersharehashabcdefg'
      
      const response = await fetch(`${baseUrl}/share/${validHash}/validate`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      // Contract expectations
      expect(data).toHaveProperty('valid', true)
      expect(data).toHaveProperty('passport_id')
      expect(data).toHaveProperty('expires_at')
      expect(data).toHaveProperty('days_remaining')
      
      // Days remaining should be positive
      expect(data.days_remaining).toBeGreaterThan(0)
      expect(data.days_remaining).toBeLessThanOrEqual(SHARE_DURATION_DAYS)
    })
    
    it('should invalidate expired share link', async () => {
      const expiredHash = 'expired32charactersharehashabcde'
      
      const response = await fetch(`${baseUrl}/share/${expiredHash}/validate`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('valid', false)
      expect(data).toHaveProperty('reason', 'Share link has expired')
      expect(data).toHaveProperty('expired_at')
    })
    
    it('should invalidate non-existent share hash', async () => {
      const invalidHash = 'nonexistent32charactersharehasab'
      
      const response = await fetch(`${baseUrl}/share/${invalidHash}/validate`)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('valid', false)
      expect(data).toHaveProperty('reason', 'Share link not found')
    })
    
    it('should validate hash format', async () => {
      const shortHash = 'tooshort'
      
      const response = await fetch(`${baseUrl}/share/${shortHash}/validate`)
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Invalid share hash format')
    })
  })
  
  describe('DELETE /api/share/:hash', () => {
    it('should revoke a share link', async () => {
      const hashToRevoke = 'active32charactersharehashabcdef'
      
      const response = await fetch(`${baseUrl}/share/${hashToRevoke}`, {
        method: 'DELETE',
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('message', 'Share link revoked successfully')
      expect(data).toHaveProperty('passport_id')
    })
    
    it('should return 404 for non-existent share hash', async () => {
      const nonExistentHash = 'doesnotexist32charactersharehas1'
      
      const response = await fetch(`${baseUrl}/share/${nonExistentHash}`, {
        method: 'DELETE',
      })
      
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error).toHaveProperty('error', 'Share link not found')
    })
  })
  
  describe('PUT /api/share/:hash/extend', () => {
    it('should extend share link expiration', async () => {
      const hashToExtend = 'active32charactersharehashabcdef'
      const extensionDays = 15
      
      const response = await fetch(`${baseUrl}/share/${hashToExtend}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: extensionDays }),
      })
      
      expect(response.status).toBe(200)
      const data = await response.json()
      
      expect(data).toHaveProperty('share_hash', hashToExtend)
      expect(data).toHaveProperty('old_expires_at')
      expect(data).toHaveProperty('new_expires_at')
      expect(data).toHaveProperty('total_days_remaining')
      
      // New expiration should be later than old
      const oldDate = new Date(data.old_expires_at)
      const newDate = new Date(data.new_expires_at)
      expect(newDate.getTime()).toBeGreaterThan(oldDate.getTime())
    })
    
    it('should limit maximum extension to 90 days total', async () => {
      const hashToExtend = 'active32charactersharehashabcdef'
      const extensionDays = 100 // Try to extend by 100 days
      
      const response = await fetch(`${baseUrl}/share/${hashToExtend}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: extensionDays }),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Maximum share duration is 90 days')
    })
    
    it('should not extend expired links', async () => {
      const expiredHash = 'expired32charactersharehashabcde'
      
      const response = await fetch(`${baseUrl}/share/${expiredHash}/extend`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 15 }),
      })
      
      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error).toHaveProperty('error')
      expect(error.error).toContain('Cannot extend expired share link')
    })
  })
  
  describe('Share Link Security', () => {
    it('should use unpredictable hash generation', async () => {
      // Create multiple share links
      const hashes = new Set()
      const requests = 5
      
      for (let i = 0; i < requests; i++) {
        const response = await fetch(`${baseUrl}/share`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ passport_id: `test-passport-${i}` }),
        })
        
        if (response.ok) {
          const data = await response.json()
          hashes.add(data.share_hash)
        }
      }
      
      // All hashes should be unique
      expect(hashes.size).toBe(requests)
      
      // Hashes should not have predictable patterns
      const hashArray = Array.from(hashes)
      for (let i = 0; i < hashArray.length - 1; i++) {
        // Check that consecutive hashes are sufficiently different
        const differences = Array.from(hashArray[i]).filter(
          (char, index) => char !== hashArray[i + 1][index]
        ).length
        
        // At least 20 characters should be different
        expect(differences).toBeGreaterThan(20)
      }
    })
  })
})