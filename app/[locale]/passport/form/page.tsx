'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Upload, User, MapPin, Calendar, Train } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getAvailableCities, getCityDistance, getPopularRoutes } from '@/lib/utils/distance-calculator'

interface FormData {
  name: string
  country: string
  photo?: File
  frequency: string
  routes: Array<{
    from: string
    to: string
    distance: number
  }>
  purpose: string
  esgInterest: boolean
}

export default function PassportFormPage({ params }: { params: { locale: string } }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    country: 'KR',
    frequency: '',
    routes: [],
    purpose: '',
    esgInterest: false
  })

  const countries = [
    { code: 'KR', name: '대한민국', flag: '🇰🇷' },
    { code: 'US', name: '미국', flag: '🇺🇸' },
    { code: 'JP', name: '일본', flag: '🇯🇵' },
    { code: 'CN', name: '중국', flag: '🇨🇳' }
  ]

  const frequencies = [
    { value: 'daily', label: '매일 (주 5회 이상)' },
    { value: 'weekly', label: '주 1-2회' },
    { value: 'monthly', label: '월 1-2회' },
    { value: 'rarely', label: '가끔 (연 몇 회)' }
  ]

  const purposes = [
    { value: 'business', label: '업무/출장' },
    { value: 'commute', label: '통근/통학' },
    { value: 'leisure', label: '여행/관광' },
    { value: 'family', label: '가족/친지 방문' }
  ]

  const totalSteps = 5

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, photo: file })
    }
  }

  const handleSubmit = async () => {
    console.log('Form Data:', formData)
    router.push(`/${params.locale}/passport/generating`)
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.trim().length > 0
      case 2: return formData.country.length > 0
      case 3: return true
      case 4: return formData.frequency.length > 0
      case 5: return formData.purpose.length > 0
      default: return false
    }
  }

  const addRoute = () => {
    setFormData({
      ...formData,
      routes: [...formData.routes, { from: '', to: '', distance: 0 }]
    })
  }

  const removeRoute = (index: number) => {
    setFormData({
      ...formData,
      routes: formData.routes.filter((_, i) => i !== index)
    })
  }

  const updateRoute = (index: number, field: keyof typeof formData.routes[0], value: string | number) => {
    const newRoutes = [...formData.routes]
    newRoutes[index] = { ...newRoutes[index], [field]: value }
    
    // Auto-calculate distance when both cities are selected
    if (field === 'from' || field === 'to') {
      const route = newRoutes[index]
      if (route.from && route.to && route.from !== route.to) {
        route.distance = getCityDistance(route.from, route.to)
      }
    }
    
    setFormData({ ...formData, routes: newRoutes })
  }

  const availableCities = getAvailableCities()
  const popularRoutes = getPopularRoutes()

  const addPopularRoute = (popularRoute: { from: string; to: string; distance: number }) => {
    setFormData({
      ...formData,
      routes: [...formData.routes, { 
        from: popularRoute.from, 
        to: popularRoute.to, 
        distance: popularRoute.distance 
      }]
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${params.locale}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>돌아가기</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Train className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">여권 만들기</span>
            </div>
            <div className="text-sm text-gray-500">
              {step} / {totalSteps}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl">
            <CardHeader className="text-center border-b border-blue-600/30 pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Train className="h-8 w-8" />
                <div>
                  <CardTitle className="text-2xl font-bold">KORAIL</CardTitle>
                  <p className="text-blue-200 text-sm">CARBON PASSPORT</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <User className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">여권 정보 입력</h2>
                    <p className="text-blue-200">여권에 기입할 정보를 선택해주세요</p>
                  </div>
                  
                  <div className="space-y-4">
                    <Label htmlFor="name" className="text-lg font-medium">
                      이름 (Name)
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-white/10 border-blue-400/30 text-white placeholder:text-blue-200 text-lg p-4"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">국가 선택</h2>
                    <p className="text-blue-200">국가를 선택해주세요</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => setFormData({ ...formData, country: country.code })}
                        className={`p-4 rounded-lg border-2 transition-all text-center ${
                          formData.country === country.code
                            ? 'border-white bg-white/20'
                            : 'border-blue-400/30 hover:border-blue-300/50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{country.flag}</div>
                        <div className="font-medium">{country.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">사진 업로드</h2>
                    <p className="text-blue-200">프로필 사진을 업로드해주세요 (선택사항)</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="border-2 border-dashed border-blue-400/30 rounded-lg p-8 hover:border-blue-300/50 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <div className="space-y-4">
                          <User className="h-16 w-16 mx-auto text-blue-200" />
                          <div>
                            <p className="text-lg font-medium">클릭하여 사진 업로드</p>
                            <p className="text-sm text-blue-200">JPG, PNG (최대 5MB)</p>
                          </div>
                          {formData.photo && (
                            <p className="text-green-300">✓ {formData.photo.name}</p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Train className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">이용 정보</h2>
                    <p className="text-blue-200">얼마나 자주 이용하시나요?</p>
                  </div>
                  
                  <div className="space-y-6">
                    <RadioGroup
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                      className="space-y-3"
                    >
                      {frequencies.map((freq) => (
                        <div key={freq.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={freq.value} id={freq.value} className="border-white" />
                          <Label htmlFor={freq.value} className="text-lg">{freq.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="pt-6 border-t border-blue-600/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">출발지 → 도착지</h3>
                        <Button
                          type="button"
                          onClick={addRoute}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                          size="sm"
                        >
                          추가
                        </Button>
                      </div>
                      
                      {formData.routes.map((route, index) => (
                        <div key={index} className="space-y-3 mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-blue-200">경로 {index + 1}</span>
                            <Button
                              type="button"
                              onClick={() => removeRoute(index)}
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-300 hover:bg-red-300/10"
                            >
                              삭제
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-blue-200 text-sm mb-2 block">출발지</Label>
                              <Select
                                value={route.from}
                                onValueChange={(value) => updateRoute(index, 'from', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                                  <SelectValue placeholder="출발지 선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {availableCities.map((city) => (
                                    <SelectItem key={city} value={city} className="text-gray-900">
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div>
                              <Label className="text-blue-200 text-sm mb-2 block">도착지</Label>
                              <Select
                                value={route.to}
                                onValueChange={(value) => updateRoute(index, 'to', value)}
                              >
                                <SelectTrigger className="bg-white/10 border-blue-400/30 text-white">
                                  <SelectValue placeholder="도착지 선택" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {availableCities
                                    .filter(city => city !== route.from)
                                    .map((city) => (
                                    <SelectItem key={city} value={city} className="text-gray-900">
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          {route.from && route.to && route.distance && (
                            <div className="text-center p-2 bg-green-500/20 rounded border border-green-400/30">
                              <span className="text-green-300 text-sm">
                                거리: {route.distance}km
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {formData.routes.length === 0 && (
                        <div className="text-center py-6">
                          <p className="text-blue-200 text-sm mb-4">여행 경로를 추가해주세요</p>
                          
                          <div className="space-y-2">
                            <p className="text-blue-300 text-xs mb-3">인기 경로:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {popularRoutes.slice(0, 4).map((popular, idx) => (
                                <Button
                                  key={idx}
                                  type="button"
                                  onClick={() => addPopularRoute(popular)}
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-400/30 text-blue-200 hover:bg-blue-500/20 text-xs"
                                >
                                  {popular.from} → {popular.to} ({popular.distance}km)
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <h2 className="text-2xl font-bold mb-2">방문 목적</h2>
                    <p className="text-blue-200">주요 이용 목적을 선택해주세요</p>
                  </div>
                  
                  <div className="space-y-6">
                    <RadioGroup
                      value={formData.purpose}
                      onValueChange={(value) => setFormData({ ...formData, purpose: value })}
                      className="space-y-3"
                    >
                      {purposes.map((purpose) => (
                        <div key={purpose.value} className="flex items-center space-x-3">
                          <RadioGroupItem value={purpose.value} id={purpose.value} className="border-white" />
                          <Label htmlFor={purpose.value} className="text-lg">{purpose.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="pt-6 border-t border-blue-600/30">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="esg"
                          checked={formData.esgInterest}
                          onCheckedChange={(checked) => setFormData({ ...formData, esgInterest: !!checked })}
                          className="border-white"
                        />
                        <Label htmlFor="esg" className="text-lg">
                          코레일 ESG 관련 정보 수신 동의 (선택)
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t border-blue-600/30">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="border-white text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  이전
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="bg-white text-blue-900 hover:bg-gray-100"
                >
                  {step === totalSteps ? '여권 생성' : '다음'}
                  {step < totalSteps && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}