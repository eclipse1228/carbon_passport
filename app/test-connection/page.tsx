'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestConnectionPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Test 1: Fetch stations
        const { data: stations, error: stationsError } = await supabase
          .from('stations')
          .select('*')
          .limit(5)
        
        if (stationsError) throw stationsError
        
        // Test 2: Check storage bucket
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
        
        setData({
          stations: stations,
          stationsCount: stations?.length || 0,
          buckets: buckets?.map(b => b.name) || [],
          timestamp: new Date().toISOString()
        })
        setStatus('success')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        setStatus('error')
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
      
      {status === 'loading' && (
        <div className="text-blue-600">Testing connection...</div>
      )}
      
      {status === 'success' && data && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Connection successful!
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Test Results:</h2>
            <ul className="space-y-2">
              <li>✓ Fetched {data.stationsCount} stations</li>
              <li>✓ Storage buckets: {data.buckets.join(', ') || 'None'}</li>
              <li>✓ Timestamp: {data.timestamp}</li>
            </ul>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold mb-2">Sample Stations:</h2>
            <ul className="space-y-1">
              {data.stations?.map((station: any) => (
                <li key={station.code}>
                  {station.code}: {station.name_ko} / {station.name_en}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {status === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          ❌ Error: {error}
        </div>
      )}
    </div>
  )
}