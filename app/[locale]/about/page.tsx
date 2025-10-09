import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { InstagramIcon, YouTubeIcon, LinkedInIcon } from '@/components/ui/social-icons'
import { getTranslations } from 'next-intl/server'
import { 
  Building2, 
  Target, 
  BarChart3, 
  FileCheck2, 
  Sprout, 
  Award,
  ExternalLink,
  Users,
  Lightbulb
} from 'lucide-react'

type Props = {
  params: { locale: string }
}

export default async function AboutPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale })
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2dafdd] via-white to-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2dafdd]/40 via-[#2dafdd]/15 to-white"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#2dafdd]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2dafdd]/15 rounded-full blur-2xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm font-medium bg-white/90 border-[#2dafdd]/20 text-[#2dafdd]">
              {t('about.hero.badge')}
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 text-[#1565C0]">
              {t('about.hero.title')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('about.hero.subtitle')}<br />
              <span className="text-[#2dafdd] font-semibold">{t('about.hero.description')}</span>
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-6 mb-12">
              <Link 
                href="https://instagram.com/ecarbon" 
                target="_blank"
                className="group p-3 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <InstagramIcon 
                  className="text-pink-600 group-hover:text-pink-700 transition-colors" 
                  width={24} 
                  height={24} 
                />
              </Link>
              <Link 
                href="https://youtube.com/@ecarbon" 
                target="_blank"
                className="group p-3 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <YouTubeIcon 
                  className="text-red-600 group-hover:text-red-700 transition-colors" 
                  width={24} 
                  height={24} 
                />
              </Link>
              <Link 
                href="https://linkedin.com/company/ecarbon" 
                target="_blank"
                className="group p-3 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              >
                <LinkedInIcon 
                  className="text-blue-600 group-hover:text-blue-700 transition-colors" 
                  width={24} 
                  height={24} 
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">{t('about.company.title')}</h2>
              <p className="text-xl text-slate-600">{t('about.company.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {/* Mission */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
                <CardHeader className="pb-6">
                  <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                    <Target className="h-8 w-8 text-[#2dafdd]" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{t('about.company.mission.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {t('about.company.mission.description')}
                  </p>
                </CardContent>
              </Card>
              
              {/* Vision */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
                <CardHeader className="pb-6">
                  <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                    <Lightbulb className="h-8 w-8 text-[#2dafdd]" />
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{t('about.company.vision.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {t('about.company.vision.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">우리의 서비스</h2>
            <p className="text-xl text-slate-600">ESG 진단부터 탄소 배출량 측정까지</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Website Carbon Assessment */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <BarChart3 className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-xl text-slate-900">웹사이트 탄소 배출량 진단</CardTitle>
                <CardDescription>웹사이트의 환경 영향을 측정하고 개선 방안을 제시</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    실시간 탄소 배출량 측정
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    성능 최적화 가이드 제공
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    환경 친화적 웹 개발 컨설팅
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ESG Assessment */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <FileCheck2 className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-xl text-slate-900">기업 ESG 간편 진단</CardTitle>
                <CardDescription>체계적인 ESG 평가로 기업의 지속가능성 수준 파악</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    환경, 사회, 지배구조 종합 평가
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    개선 항목 우선순위 제시
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    업계 벤치마킹 분석
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* ESG Reports */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <Award className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-xl text-slate-900">ESG 보고서 발급</CardTitle>
                <CardDescription>전문적이고 신뢰할 수 있는 ESG 성과 보고서 제공</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    국제 표준 기준 준수
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    투명하고 정확한 데이터 분석
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#2dafdd] rounded-full"></div>
                    이해관계자 대상 커뮤니케이션 지원
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">eCarbon at a Glance</h2>
              <p className="text-xl text-slate-600">1년차 스타트업의 여정과 성과</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
                <CardHeader className="pb-4">
                  <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                    <Building2 className="h-8 w-8 text-[#2dafdd]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                    1년차
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium text-base">
                    스타트업 설립
                  </CardDescription>
                  <p className="text-sm text-slate-500 mt-2">
                    혁신적인 ESG 솔루션으로 시장에 진입
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
                <CardHeader className="pb-4">
                  <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                    <Sprout className="h-8 w-8 text-[#2dafdd]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                    SaaS
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium text-base">
                    클라우드 플랫폼
                  </CardDescription>
                  <p className="text-sm text-slate-500 mt-2">
                    확장 가능한 ESG 진단 서비스
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
                <CardHeader className="pb-4">
                  <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                    <Users className="h-8 w-8 text-[#2dafdd]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                    ESG
                  </CardTitle>
                  <CardDescription className="text-slate-600 font-medium text-base">
                    전문 분야
                  </CardDescription>
                  <p className="text-sm text-slate-500 mt-2">
                    환경, 사회, 지배구조 통합 솔루션
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2dafdd] to-[#2dafdd]/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            함께 지속가능한 미래를 만들어가요
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            eCarbon과 함께 ESG 경영을 시작하고,<br />
            환경을 생각하는 비즈니스를 실현해보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-white text-[#2dafdd] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              ESG 진단 시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 border-white text-white hover:bg-white/10 bg-transparent backdrop-blur-sm px-8 py-4 text-lg font-semibold"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              더 자세히 알아보기
            </Button>
          </div>
          
          {/* Social Media Footer */}
          <div className="text-center">
            <p className="text-white/80 mb-4">Follow us on social media</p>
            <div className="flex justify-center gap-4">
              <Link 
                href="https://instagram.com/ecarbon" 
                target="_blank"
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <InstagramIcon 
                  className="text-white group-hover:text-pink-200 transition-colors" 
                  width={20} 
                  height={20} 
                />
              </Link>
              <Link 
                href="https://youtube.com/@ecarbon" 
                target="_blank"
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <YouTubeIcon 
                  className="text-white group-hover:text-red-200 transition-colors" 
                  width={20} 
                  height={20} 
                />
              </Link>
              <Link 
                href="https://linkedin.com/company/ecarbon" 
                target="_blank"
                className="group p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300"
              >
                <LinkedInIcon 
                  className="text-white group-hover:text-blue-200 transition-colors" 
                  width={20} 
                  height={20} 
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}