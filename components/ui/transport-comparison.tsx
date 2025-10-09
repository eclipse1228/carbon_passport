'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Train, Car, Bus, Plane, Leaf, TrendingDown } from 'lucide-react'
import { CO2Emissions } from '@/types/passport'
import { formatCO2, getEmissionColor } from '@/lib/utils/co2-calculator'

interface TransportComparisonProps {
  emissions: CO2Emissions
  distance: number
  className?: string
}

export function TransportComparison({ emissions, distance, className = '' }: TransportComparisonProps) {
  const transportModes = [
    {
      name: '기차',
      englishName: 'Train',
      icon: Train,
      co2: emissions.train,
      color: '#10B981', // Green
      isEcoFriendly: true,
      iconEmoji: '🚂'
    },
    {
      name: '버스',
      englishName: 'Bus', 
      icon: Bus,
      co2: emissions.bus,
      color: '#F59E0B', // Amber
      isEcoFriendly: false,
      iconEmoji: '🚌'
    },
    {
      name: '자동차',
      englishName: 'Car',
      icon: Car,
      co2: emissions.car,
      color: '#EF4444', // Red
      isEcoFriendly: false,
      iconEmoji: '🚗'
    },
    {
      name: '비행기',
      englishName: 'Airplane',
      icon: Plane,
      co2: emissions.airplane,
      color: '#991B1B', // Dark Red
      isEcoFriendly: false,
      iconEmoji: '✈️'
    }
  ]

  const savingsVsCar = ((emissions.car - emissions.train) / emissions.car * 100).toFixed(1)
  const savingsVsBus = ((emissions.bus - emissions.train) / emissions.bus * 100).toFixed(1)
  const savingsVsPlane = ((emissions.airplane - emissions.train) / emissions.airplane * 100).toFixed(1)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          교통수단별 탄소 배출량 비교
        </h3>
        <p className="text-slate-600">
          {distance}km 여행 시 교통수단별 CO₂ 배출량을 비교해보세요
        </p>
      </div>

      {/* Transport Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {transportModes.map((transport) => (
          <Card 
            key={transport.name}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              transport.isEcoFriendly 
                ? 'ring-2 ring-green-500 bg-gradient-to-br from-green-50 to-green-100' 
                : 'hover:shadow-md'
            }`}
          >
            {transport.isEcoFriendly && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-600 text-white text-xs">
                  친환경
                </Badge>
              </div>
            )}
            
            <CardContent className="p-4 text-center space-y-3">
              {/* Transport Icon */}
              <div className="flex justify-center">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${transport.color}20` }}
                >
                  <span>{transport.iconEmoji}</span>
                </div>
              </div>
              
              {/* Transport Name */}
              <div>
                <h4 className="font-semibold text-slate-900">{transport.name}</h4>
                <p className="text-xs text-slate-500">{transport.englishName}</p>
              </div>
              
              {/* CO2 Emissions */}
              <div className="space-y-1">
                <div 
                  className="text-lg font-bold"
                  style={{ color: transport.color }}
                >
                  {formatCO2(transport.co2)}
                </div>
                <div className="text-xs text-slate-500">CO₂ 배출량</div>
              </div>

              {/* Comparison vs Train */}
              {!transport.isEcoFriendly && (
                <div className="text-xs">
                  <div className="flex items-center justify-center gap-1 text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    <span>기차 대비 +{((transport.co2 - emissions.train) / emissions.train * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Eco-Friendly Message */}
      <Card className="bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                <Train className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold text-green-800 mb-2">
                🌱 기차가 가장 친환경적인 선택입니다!
              </h4>
              <p className="text-green-700 text-sm">
                같은 거리를 이동할 때 기차는 다른 교통수단보다 훨씬 적은 CO₂를 배출합니다.
              </p>
            </div>

            {/* Savings Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-lg font-bold text-green-700">{savingsVsCar}%</div>
                <div className="text-xs text-green-600">자동차 대비 절약</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-lg font-bold text-green-700">{savingsVsBus}%</div>
                <div className="text-xs text-green-600">버스 대비 절약</div>
              </div>
              <div className="bg-white/70 rounded-lg p-3">
                <div className="text-lg font-bold text-green-700">{savingsVsPlane}%</div>
                <div className="text-xs text-green-600">비행기 대비 절약</div>
              </div>
            </div>

            {/* Total Savings */}
            <div className="mt-4 p-3 bg-white/80 rounded-lg">
              <div className="text-sm text-green-700">
                <strong>총 절약량:</strong> {formatCO2(emissions.saved)} CO₂
              </div>
              <div className="text-xs text-green-600 mt-1">
                이는 나무 {Math.ceil(emissions.saved / 22)}그루가 1년간 흡수하는 CO₂ 양과 같습니다
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}