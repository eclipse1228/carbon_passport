'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PassportSuccessContent() {
  const searchParams = useSearchParams()
  const passportId = searchParams.get('id')

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              탄소 패스포트 생성 완료!
            </h1>
            <p className="text-lg text-gray-600">
              환경을 생각하는 당신의 여행 계획이 저장되었습니다.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">패스포트 정보</h2>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">패스포트 ID:</span>
                <span className="font-medium">{passportId || 'TEMP-ID'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">생성 날짜:</span>
                <span className="font-medium">{new Date().toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">상태:</span>
                <span className="font-medium text-green-600">활성</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">🌍 환경 영향</h3>
              <p className="text-sm text-blue-700">
                예상 탄소 배출량이 계산되었습니다
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">🚗 친환경 교통</h3>
              <p className="text-sm text-green-700">
                지속가능한 교통수단을 선택했습니다
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/passport/create"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              새 패스포트 만들기
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-md transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>

          <div className="mt-8 text-sm text-gray-500">
            <p>💡 팁: 탄소 발자국을 더욱 줄이려면 대중교통이나 자전거 이용을 고려해보세요!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PassportSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>}>
      <PassportSuccessContent />
    </Suspense>
  )
}