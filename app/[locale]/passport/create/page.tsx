'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePassportPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    transportation: 'train',
    date: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 탄소 발자국 계산 로직을 여기에 추가
      const carbonFootprint = calculateCarbonFootprint(formData)
      
      // 데이터베이스에 저장하는 로직을 여기에 추가
      
      router.push('/passport/success?id=temp')
    } catch (error) {
      console.error('Error creating passport:', error)
    }
  }

  const calculateCarbonFootprint = (data: any) => {
    // 임시 계산 로직
    const baseEmission = 100 // kg CO2
    const transportationMultiplier = {
      'train': 0.5,
      'bus': 0.7,
      'car': 1.0,
      'plane': 2.5
    }
    
    return baseEmission * (transportationMultiplier[data.transportation as keyof typeof transportationMultiplier] || 1.0)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            탄소 패스포트 만들기
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="departure" className="block text-sm font-medium text-gray-700 mb-2">
                출발지
              </label>
              <input
                type="text"
                id="departure"
                value={formData.departure}
                onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 서울"
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
                목적지
              </label>
              <input
                type="text"
                id="destination"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: 부산"
                required
              />
            </div>

            <div>
              <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-2">
                교통수단
              </label>
              <select
                id="transportation"
                value={formData.transportation}
                onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="train">기차</option>
                <option value="bus">버스</option>
                <option value="car">자동차</option>
                <option value="plane">비행기</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                여행 날짜
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              탄소 패스포트 생성하기
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}