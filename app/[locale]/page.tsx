import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Carbon Passport
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            탄소 발자국을 추적하고 친환경적인 여행을 계획하세요
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                여행 계획하기
              </h2>
              <p className="text-gray-600 mb-6">
                목적지를 입력하고 친환경적인 교통수단을 선택하여 탄소 발자국을 최소화하세요.
              </p>
              <Link 
                href="/passport/create"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                탄소 패스포트 만들기
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                환경 영향 확인
              </h2>
              <p className="text-gray-600 mb-6">
                여행으로 인한 탄소 배출량을 계산하고 환경 친화적인 대안을 찾아보세요.
              </p>
              <Link 
                href="/test-connection"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                연결 테스트
              </Link>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              지속 가능한 여행의 중요성
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="text-lg font-medium text-green-600 mb-2">🌱 환경 보호</h3>
                <p className="text-gray-600">
                  탄소 배출량을 줄여 지구 온난화 방지에 기여하세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-blue-600 mb-2">📊 투명한 데이터</h3>
                <p className="text-gray-600">
                  정확한 탄소 발자국 계산으로 의식적인 선택을 하세요.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-purple-600 mb-2">🚗 스마트한 선택</h3>
                <p className="text-gray-600">
                  대중교통과 친환경 교통수단을 활용하여 지속가능한 여행을 계획하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}