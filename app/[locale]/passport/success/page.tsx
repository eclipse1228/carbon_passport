'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  QrCode, 
  BarChart3, 
  Leaf, 
  Train, 
  Calendar,
  Loader2,
  User,
  Globe,
  Car,
  Bus,
  Plane,
  Shield,
  Home,
  Info,
  X
} from 'lucide-react'
import Link from 'next/link'
import { getStationByName } from '@/lib/constants/stations'
import { RouteData } from '@/lib/utils/route-calculator'
import { CO2Emissions } from '@/lib/utils/co2-calculator'
import dynamic from 'next/dynamic'
import QRCode from 'qrcode'
import JsBarcode from 'jsbarcode'

const ClientOnlyRouteMap = dynamic(() => import('@/components/ui/route-map').then(mod => ({ default: mod.RouteMap })), { 
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
    </div>
  )
})

interface PassportData {
  id: string
  name: string
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
    savingsPercentage: number
  }>
  environmentalImpact: {
    level: string
    description: string
    badge: string
    color: string
  }
  savingsComparison: {
    vs_car: number
    vs_bus: number
    vs_airplane: number
  }
  shareUrl: string
  shareHash: string
}

export default function PassportSuccessPage({ params }: { params: { locale: string } }) {
  const searchParams = useSearchParams()
  const passportId = searchParams.get('id')
  
  const [passportData, setPassportData] = useState<PassportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showBarcodeModal, setShowBarcodeModal] = useState(false)
  const [qrCodeData, setQRCodeData] = useState<string | null>(null)
  const [barcodeData, setBarcodeData] = useState<string | null>(null)
  const barcodeCanvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch passport data on component mount
  useEffect(() => {
    const fetchPassportData = async () => {
      if (!passportId) {
        setError('Passport ID is missing')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/passports/${passportId}`)
        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch passport data')
        }

        setPassportData(result.passport)
      } catch (error) {
        console.error('Error fetching passport:', error)
        setError(params.locale === 'en' ? 'Failed to fetch passport information.' : '여권 정보를 가져오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPassportData()
  }, [passportId])

  const handleShare = async () => {
    if (!passportData) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: params.locale === 'en' ? 'KORAIL Carbon Passport' : '코레일 탄소 여권',
          text: params.locale === 'en' 
            ? `Saved ${passportData.totalCO2Saved}kg of CO₂!`
            : `${passportData.totalCO2Saved}kg의 CO₂를 절약했습니다!`,
          url: passportData.shareUrl
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      navigator.clipboard.writeText(passportData.shareUrl)
      alert(params.locale === 'en' ? 'Link copied to clipboard!' : '링크가 클립보드에 복사되었습니다!')
    }
  }

  const handleDownload = () => {
    console.log('Download passport as PDF')
  }

  const generateQRCode = async () => {
    if (!passportData) return
    
    try {
      const url = `${window.location.origin}/${params.locale}/passport/view/${passportData.shareHash}`
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0054a6',
          light: '#FFFFFF'
        }
      })
      setQRCodeData(qrDataURL)
      setShowQRModal(true)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const generateBarcode = () => {
    if (!passportData || !barcodeCanvasRef.current) return
    
    try {
      // 여권 ID를 바코드로 생성 (CODE128 형식)
      JsBarcode(barcodeCanvasRef.current, passportData.shareHash, {
        format: "CODE128",
        width: 2,
        height: 100,
        displayValue: true,
        fontSize: 14,
        textMargin: 10,
        background: "#ffffff",
        lineColor: "#0054a6"
      })
      
      const canvas = barcodeCanvasRef.current
      const dataURL = canvas.toDataURL('image/png')
      setBarcodeData(dataURL)
      setShowBarcodeModal(true)
    } catch (error) {
      console.error('Error generating barcode:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {params.locale === 'en' ? 'Loading passport information...' : '여권 정보를 불러오는 중...'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !passportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-red-50 rounded-lg mb-4">
            <p className="text-red-600">{error || (params.locale === 'en' ? 'Passport not found.' : '여권을 찾을 수 없습니다.')}</p>
          </div>
          <Link href={`/${params.locale}/passport/create`}>
            <Button>{params.locale === 'en' ? 'Create New Passport' : '새 여권 만들기'}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white font-['Pretendard','Noto_Sans',sans-serif]">
      {/* 슬림한 헤더 */}
      <div className="bg-gradient-to-r from-[#0054a6] to-[#00afd5] text-white py-6 pt-20">
        <div className="container mx-auto px-6 text-center">
          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-white" />
          <h1 className="text-2xl font-bold mb-1">
            {params.locale === 'en' ? 'Passport Generation Complete' : '여권 생성 완료'}
          </h1>
          <p className="text-blue-100 text-sm">
            {params.locale === 'en' ? 'Your eco-friendly travel passport is ready' : '친환경 여행 여권이 준비되었습니다'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* 메인 여권 카드 */}
          <Card className="bg-white shadow-lg border border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#0054a6] to-[#00afd5] text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Train className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">KORAIL CARBON PASSPORT</CardTitle>
                    <p className="text-blue-100 text-sm">
                      {params.locale === 'en' ? 'Eco-Friendly Travel Certificate' : '친환경 여행 인증서'}
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 bg-white">
              {/* 상단: 사진 + 여행 경로 지도 */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* 왼쪽: 프로필 정보 */}
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-48 h-56 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center overflow-hidden border border-gray-200">
                      {passportData.photoUrl ? (
                        <img 
                          src={passportData.photoUrl} 
                          alt={passportData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-20 w-20 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-500 text-sm font-medium">이름 / Name</label>
                      <p className="text-xl font-bold text-gray-900">{passportData.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-gray-500 text-sm font-medium">국가 / Country</label>
                      <p className="text-lg text-gray-800 flex items-center gap-2">
                        {passportData.country} 
                        <span className="text-xl">🇰🇷</span>
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-gray-500 text-sm font-medium">발급일 / Issue Date</label>
                      <p className="text-lg text-gray-800 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-[#0054a6]" />
                        {passportData.issueDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 여행 경로 지도 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="h-5 w-5 text-[#0054a6]" />
                    <h3 className="text-lg font-bold text-gray-900">여행 경로</h3>
                  </div>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <ClientOnlyRouteMap 
                      routes={passportData.routes.map((route, index) => {
                        // 역 이름으로 실제 좌표 조회
                        const startStation = getStationByName(route.from)
                        const endStation = getStationByName(route.to)
                        
                        // 한국 중심부 좌표를 기본값으로 사용
                        const defaultCoordinates: [number, number] = [127.5, 36.5]
                        
                        // RouteData 형식으로 변환
                        const routeData: RouteData = {
                          id: `route-${index}`,
                          startStation: startStation?.code || route.from,
                          endStation: endStation?.code || route.to,
                          startCoordinates: startStation 
                            ? [startStation.longitude, startStation.latitude] as [number, number]
                            : defaultCoordinates,
                          endCoordinates: endStation 
                            ? [endStation.longitude, endStation.latitude] as [number, number]
                            : defaultCoordinates,
                          distance: route.distance,
                          co2Emissions: {
                            train: route.co2Train,
                            car: 0, // 기본값
                            bus: 0, // 기본값
                            airplane: 0, // 기본값
                            saved: route.co2Saved
                          } as CO2Emissions,
                          sequenceOrder: index
                        }
                        
                        return routeData
                      })}
                      height={250}
                      showControls={false}
                      onRouteClick={(route) => {
                        console.log('Route clicked:', route)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 총 탄소 절감량 */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {params.locale === 'en' ? 'Total CO₂ Reduction' : '총 탄소 절감량'}
                </h2>
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-2">{passportData.totalCO2Saved}kg</div>
                    <div className="text-gray-600 text-sm">총 탄소 절감량</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-3xl font-bold text-[#0054a6] mb-2">{passportData.totalDistance}km</div>
                    <div className="text-gray-600 text-sm">탑승 횟수</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-3xl font-bold text-[#00afd5] mb-2">{passportData.tripCount}회</div>
                    <div className="text-gray-600 text-sm">나무 심기</div>
                  </div>
                </div>
              </div>

              {/* 여행 기록 */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Globe className="h-5 w-5 text-[#0054a6]" />
                  </div>
                  여행 기록
                </h2>
                <div className="space-y-3">
                  {passportData.routes.map((route, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-[#0054a6] rounded-lg">
                          <Train className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{route.from} → {route.to}</div>
                          <div className="text-sm text-gray-600">{route.distance} km</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200">
                          -{route.co2Saved} kg CO₂
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {route.savingsPercentage}% 절약
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이동수단별 탄소배출량 비교 */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">이동수단 별 탄소배출량</h2>
                <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {/* 기차 - 강조된 브랜드 색상 */}
                  <div className="bg-gradient-to-br from-[#0054a6] to-[#00afd5] p-6 rounded-xl border-2 border-[#0054a6] text-center shadow-lg transform scale-105">
                    <div className="p-3 bg-white/20 rounded-full w-fit mx-auto mb-3">
                      <Train className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-sm text-white font-bold mb-1">기차 ⭐</div>
                    <div className="text-2xl font-bold text-white">{(passportData.totalCO2Train).toFixed(1)} kg</div>
                    <div className="text-xs text-blue-100 mt-1">친환경 선택!</div>
                  </div>
                  
                  {/* 자동차 - 브랜드 색상 변형 */}
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                    <div className="p-3 bg-slate-100 rounded-full w-fit mx-auto mb-3">
                      <Car className="h-8 w-8 text-slate-600" />
                    </div>
                    <div className="text-sm text-slate-600 font-medium mb-1">자동차</div>
                    <div className="text-2xl font-bold text-slate-700">{(passportData.totalDistance * 0.2).toFixed(1)} kg</div>
                  </div>
                  
                  {/* 버스 - 브랜드 색상 변형 */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200 text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <Bus className="h-8 w-8 text-[#0054a6]" />
                    </div>
                    <div className="text-sm text-[#0054a6] font-medium mb-1">버스</div>
                    <div className="text-2xl font-bold text-[#0054a6]">{(passportData.totalDistance * 0.1).toFixed(1)} kg</div>
                  </div>
                  
                  {/* 비행기 - 브랜드 색상 변형 */}
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center">
                    <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                      <Plane className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-600 font-medium mb-1">비행기</div>
                    <div className="text-2xl font-bold text-gray-700">{(passportData.totalDistance * 0.3).toFixed(1)} kg</div>
                  </div>
                </div>
              </div>

              {/* 디지털 인증 마크 */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-8 mb-6">
                  {/* GREEN CERTIFIED 마크 */}
                  <div className="relative">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center border-4 border-green-600 relative">
                      <div className="text-center">
                        <div className="text-white text-xs font-bold leading-tight">GREEN</div>
                        <div className="text-white text-xs font-bold leading-tight">CERTIFIED</div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Shield className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* 인증 정보 */}
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">친환경 여행 인증</h3>
                    <p className="text-sm text-gray-600 mb-1">이 여권은 대한민국 철도를 이용한</p>
                    <p className="text-sm text-gray-600 mb-1">친환경 여행을 나타 냅니다.</p>
                    <p className="text-xs text-gray-500">{passportData.issueDate}</p>
                  </div>
                  
                  {/* QR 코드 */}
                  <div className="text-center">
                    <button 
                      onClick={generateQRCode}
                      className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <QrCode className="h-10 w-10 text-gray-600" />
                    </button>
                    <p className="text-xs text-gray-600">QR 코드</p>
                  </div>
                  
                  {/* 바코드 */}
                  <div className="text-center">
                    <button 
                      onClick={generateBarcode}
                      className="w-20 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <BarChart3 className="h-8 w-12 text-gray-600" />
                    </button>
                    <p className="text-xs text-gray-600">바코드</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 카드 */}
          <Card className="bg-white border border-gray-100 shadow-sm mb-4">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  onClick={handleShare}
                  className="bg-gradient-to-r from-[#0054a6] to-[#00afd5] hover:from-[#003d7a] hover:to-[#008bb5] text-white h-12 font-medium"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {params.locale === 'en' ? 'Share' : '공유하기'}
                </Button>
                
                <Button 
                  onClick={handleDownload}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 h-12 font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {params.locale === 'en' ? 'Download PDF' : 'PDF 다운로드'}
                </Button>
                
                <Link href={`/${params.locale}`}>
                  <Button 
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-12 font-medium"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    {params.locale === 'en' ? 'Back to Home' : '홈으로 돌아가기'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* 코레일 정보 카드 */}
          <Card className="bg-gradient-to-r from-[#0054a6] to-[#00afd5] text-white border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">더 많은 친환경 여행을 함께해요!</h3>
              <p className="mb-6 text-blue-100">
                코레일과 함께하는 친환경 여행으로 지구를 지키는 일에 동참하세요.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  className="bg-white text-[#0054a6] hover:bg-gray-100 font-medium px-8 py-3 h-auto"
                  asChild
                >
                  <a href="https://www.letskorail.com/korail_web/main.do" target="_blank" rel="noopener noreferrer">
                    <Info className="h-4 w-4 mr-2" />
                    KORAIL의 ESG 역사가 궁금하다면?
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 숨겨진 캔버스 - 바코드 생성용 */}
      <canvas ref={barcodeCanvasRef} style={{ display: 'none' }} />

      {/* QR 코드 모달 */}
      {showQRModal && qrCodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">QR 코드</h3>
              <button 
                onClick={() => setShowQRModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 inline-block">
                <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                여권 페이지로 이동하려면 QR 코드를 스캔하세요
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `passport-qr-${passportData?.shareHash}.png`
                    link.href = qrCodeData
                    link.click()
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
                <Button 
                  onClick={() => setShowQRModal(false)}
                  className="flex-1 bg-[#0054a6] hover:bg-[#003d7a]"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 바코드 모달 */}
      {showBarcodeModal && barcodeData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">바코드</h3>
              <button 
                onClick={() => setShowBarcodeModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 inline-block">
                <img src={barcodeData} alt="Barcode" className="max-w-full h-auto" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                여권 ID: {passportData?.shareHash}
              </p>
              <div className="flex gap-3">
                <Button 
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `passport-barcode-${passportData?.shareHash}.png`
                    link.href = barcodeData
                    link.click()
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
                <Button 
                  onClick={() => setShowBarcodeModal(false)}
                  className="flex-1 bg-[#0054a6] hover:bg-[#003d7a]"
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}