'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Train, Loader2, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 1, label: '여행 데이터 분석', description: '입력된 경로와 이용 빈도를 분석합니다' },
  { id: 2, label: 'CO₂ 절약량 계산', description: '다른 교통수단 대비 절약된 탄소량을 계산합니다' },
  { id: 3, label: '여권 디자인 생성', description: '개인화된 탄소 여권을 생성합니다' },
  { id: 4, label: 'QR 코드 생성', description: '공유 가능한 QR 코드를 생성합니다' }
]

export default function PassportGeneratingPage({ params }: { params: { locale: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1
        } else {
          setIsComplete(true)
          setTimeout(() => {
            router.push(`/${params.locale}/passport/success`)
          }, 1500)
          return prev
        }
      })
    }, 1500)

    return () => clearInterval(timer)
  }, [router, params.locale])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
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
              <div className="text-center mb-8">
                {isComplete ? (
                  <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-400" />
                ) : (
                  <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-200 animate-spin" />
                )}
                <h2 className="text-2xl font-bold mb-2">
                  {isComplete ? '여권 생성 완료!' : '여권 생성 중...'}
                </h2>
                <p className="text-blue-200">
                  {isComplete 
                    ? '당신의 친환경 여권이 준비되었습니다!' 
                    : '잠시만 기다려주세요. 개인화된 탄소 여권을 생성하고 있습니다.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                {steps.map((step) => {
                  const isActive = currentStep === step.id - 1
                  const isCompleted = currentStep > step.id - 1 || isComplete
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-500 ${
                        isActive
                          ? 'bg-white/20 border border-white/30'
                          : isCompleted
                          ? 'bg-green-500/20 border border-green-400/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-white text-blue-900'
                          : 'bg-white/20 text-blue-200'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isActive ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          isCompleted ? 'text-green-300' : isActive ? 'text-white' : 'text-blue-300'
                        }`}>
                          {step.label}
                        </h3>
                        <p className={`text-sm ${
                          isCompleted ? 'text-green-200' : isActive ? 'text-blue-100' : 'text-blue-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between text-sm text-blue-200 mb-2">
                  <span>진행률</span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {isComplete && (
                <div className="mt-8 text-center">
                  <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                    <p className="text-green-300 font-medium">
                      🎉 탄소 여권이 성공적으로 생성되었습니다!
                    </p>
                    <p className="text-green-200 text-sm mt-1">
                      잠시 후 여권 페이지로 이동합니다...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}