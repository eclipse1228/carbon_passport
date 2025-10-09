import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  params: { locale: string }
}

export default function PassportCoverPage({ params: { locale } }: Props) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        {/* Passport Cover Design */}
        <div className="bg-gradient-to-b from-blue-600 to-green-500 p-8 rounded-lg shadow-xl text-white mb-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">KORAIL</h1>
            <p className="text-sm opacity-90">한국철도공사</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Carbon Passport</h2>
            <p className="text-sm opacity-90">탄소 여권</p>
          </div>
          
          <div className="w-16 h-16 border-2 border-white rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🚆</span>
          </div>
          
          <div className="text-sm">
            <p className="mb-1">REPUBLIC OF KOREA</p>
            <p className="opacity-75">대한민국</p>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-xs opacity-60">Passport No. ________</p>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600 mb-6">Start your sustainable journey with KORAIL</p>
          
          <div className="space-y-3">
            <Link href={`/${locale}/passport/create`}>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                여권 만들기
              </Button>
            </Link>
            
            <Link href={`/${locale}/passport/view`}>
              <Button 
                variant="outline" 
                className="w-full py-3"
                size="lg"
              >
                기존 여권 보기
              </Button>
            </Link>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm">
          탄소 절약 추적 • 여행 기록 공유 • 지구 환경 보호
        </p>
      </div>
    </div>
  )
}