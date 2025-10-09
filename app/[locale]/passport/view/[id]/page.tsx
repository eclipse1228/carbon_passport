'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Share2, Download, QrCode, Barcode, MapPin, Leaf, Train, Globe, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { RouteMap } from '@/components/ui/route-map'
import { MapRoute } from '@/types/passport'

const mockPassportData = {
  id: 'passport-12345',
  name: '홍길동',
  nameEn: 'Hong Gildong',
  country: '대한민국',
  countryCode: 'KR',
  issueDate: '2025.01.15',
  totalCO2Saved: 12.5,
  tripCount: 5,
  totalDistance: 342,
  treeEquivalent: 2.5,
  routes: [
    { from: '서울', to: '부산', co2Saved: 4.2, distance: 417 },
    { from: '서울', to: '대전', co2Saved: 2.1, distance: 164 },
    { from: '대전', to: '광주', co2Saved: 1.8, distance: 169 }
  ]
}

export default function PassportViewPage({ params }: { params: { locale: string, id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [passport, setPassport] = useState(mockPassportData)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '코레일 탄소 여권',
          text: `${passport.name}님이 ${passport.totalCO2Saved}kg의 CO₂를 절약했습니다!`,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('링크가 클립보드에 복사되었습니다!')
    }
  }

  const handleDownload = () => {
    console.log('Download passport as PDF')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Train className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-pulse" />
            <p className="text-gray-600">여권을 불러오는 중...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${params.locale}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>홈으로 돌아가기</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Train className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">탄소 여권</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Passport */}
          <Card className="bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl mb-8">
            <CardHeader className="text-center border-b border-blue-600/30 pb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Train className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">KORAIL</CardTitle>
                  <p className="text-blue-200 text-sm">CARBON PASSPORT</p>
                </div>
                <div className="p-2 bg-white/10 rounded-lg">
                  <Globe className="h-8 w-8" />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Passport Header */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-6xl">👤</span>
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-blue-200 text-sm">이름 / Name</label>
                    <p className="text-xl font-bold">{passport.name} / {passport.nameEn}</p>
                  </div>
                  
                  <div>
                    <label className="text-blue-200 text-sm">국가 / Country</label>
                    <p className="text-lg">{passport.country} 🇰🇷</p>
                  </div>
                  
                  <div>
                    <label className="text-blue-200 text-sm">발급일 / Issue Date</label>
                    <p className="text-lg">{passport.issueDate}</p>
                  </div>
                </div>
              </div>

              {/* CO2 Impact Summary */}
              <div className="bg-green-500/20 rounded-lg p-6 mb-8 border border-green-400/30">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Leaf className="h-8 w-8 text-green-400" />
                    <h3 className="text-2xl font-bold">총 탄소 절감량</h3>
                  </div>
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {passport.totalCO2Saved} kg CO₂
                  </div>
                  <p className="text-green-200 text-sm">
                    이는 나무 {passport.treeEquivalent}그루를 심는 것과 같은 효과입니다
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{passport.tripCount}회</div>
                    <div className="text-blue-200 text-sm">여행 횟수</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{passport.totalDistance} km</div>
                    <div className="text-blue-200 text-sm">총 거리</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{passport.treeEquivalent} 그루</div>
                    <div className="text-blue-200 text-sm">나무 심기 효과</div>
                  </div>
                </div>
              </div>

              {/* Travel History */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  여행 기록
                </h3>
                <div className="space-y-3">
                  {passport.routes.map((route, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Train className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold">{route.from} → {route.to}</p>
                            <p className="text-blue-200 text-sm">{route.distance}km</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                          -{route.co2Saved} kg CO₂
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Route Map */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  여행 경로 지도
                </h3>
                <div className="bg-white/10 rounded-lg p-4">
                  <RouteMap 
                    routes={passport.routes.map(route => {
                      // 각 도시의 실제 좌표
                      const getCoordinates = (cityName: string): [number, number] => {
                        const coords: Record<string, [number, number]> = {
                          '서울': [37.5519, 126.9918],
                          '부산': [35.1796, 129.0756],
                          '대전': [36.3504, 127.3845],
                          '광주': [35.1595, 126.8526]
                        }
                        return coords[cityName] || [37.5519, 126.9918]
                      }
                      
                      return {
                        from: { 
                          name: route.from, 
                          coordinates: getCoordinates(route.from)
                        },
                        to: { 
                          name: route.to, 
                          coordinates: getCoordinates(route.to)
                        },
                        distance: route.distance,
                        co2Saved: route.co2Saved
                      }
                    })}
                    height={400}
                    showControls={true}
                    onRouteClick={(route) => {
                      console.log('Route clicked:', route)
                    }}
                  />
                </div>
              </div>

              {/* QR Code and Barcode */}
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-800" />
                  </div>
                  <p className="text-sm text-blue-200">QR 코드</p>
                  <p className="text-xs text-blue-300 mt-1">공유 및 인증용</p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-24 bg-white rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Barcode className="h-12 w-20 text-gray-800" />
                  </div>
                  <p className="text-sm text-blue-200">바코드</p>
                  <p className="text-xs text-blue-300 mt-1">#{params.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Leaf className="h-5 w-5 mr-2" />
                  환경 기여도
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>자동차 대비 절약</span>
                    <span className="font-semibold text-green-600">-85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>비행기 대비 절약</span>
                    <span className="font-semibold text-green-600">-92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>버스 대비 절약</span>
                    <span className="font-semibold text-green-600">-45%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  여행 통계
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>평균 여행 거리</span>
                    <span className="font-semibold">{Math.round(passport.totalDistance / passport.tripCount)}km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>회당 평균 절약</span>
                    <span className="font-semibold text-green-600">{Math.round((passport.totalCO2Saved / passport.tripCount) * 10) / 10}kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>km당 절약</span>
                    <span className="font-semibold text-green-600">{Math.round((passport.totalCO2Saved / passport.totalDistance) * 1000) / 1000}kg CO₂</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">더 많은 친환경 여행을 함께해요!</h3>
              <p className="mb-6 text-blue-100">
                코레일과 함께하는 친환경 여행으로 지구를 지키는 일에 동참하세요.
              </p>
              <div className="flex justify-center space-x-4">
                <Link href={`/${params.locale}/passport/form`}>
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    새 여행 계획하기
                  </Button>
                </Link>
                <Link href={`/${params.locale}`}>
                  <Button variant="outline" className="border-white text-white hover:bg-white/10">
                    더 알아보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}