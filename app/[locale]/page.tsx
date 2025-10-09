import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HeroSection } from '@/components/ui/hero-section'
import { FaqSection } from '@/components/ui/faq-section'
import { TreePine, Users, Target, Award, TrendingUp, Leaf, Train } from 'lucide-react'

type Props = {
  params: { locale: string }
}

export default async function HomePage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale })
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2dafdd] via-white to-white">
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* ESG Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('home.esg.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('home.esg.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 탄소 절감량 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
              <CardHeader className="pb-4">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                  <Leaf className="h-8 w-8 text-[#2dafdd]" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                  {t('home.esg.co2Reduction.title')}
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium text-base">
                  {t('home.esg.co2Reduction.subtitle')}
                </CardDescription>
                <p className="text-sm text-slate-500 mt-2">
                  {t('home.esg.co2Reduction.description')}
                </p>
              </CardContent>
            </Card>
            
            {/* 이용객 수 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
              <CardHeader className="pb-4">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                  <Users className="h-8 w-8 text-[#2dafdd]" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                  {t('home.esg.passengers.title')}
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium text-base">
                  {t('home.esg.passengers.subtitle')}
                </CardDescription>
                <p className="text-sm text-slate-500 mt-2">
                  {t('home.esg.passengers.description')}
                </p>
              </CardContent>
            </Card>
            
            {/* 운행거리 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
              <CardHeader className="pb-4">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                  <Train className="h-8 w-8 text-[#2dafdd]" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                  3,417km
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium text-base">
                  {t('home.esg.distance.subtitle')}
                </CardDescription>
                <p className="text-sm text-slate-500 mt-2">
                  {t('home.esg.distance.description')}
                </p>
              </CardContent>
            </Card>
            
            {/* ESG 등급 */}
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#2dafdd]/5">
              <CardHeader className="pb-4">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit mx-auto">
                  <Award className="h-8 w-8 text-[#2dafdd]" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-4xl font-bold text-[#2dafdd] mb-2">
                  A+
                </CardTitle>
                <CardDescription className="text-slate-600 font-medium text-base">
                  {t('home.esg.esgGrade.subtitle')}
                </CardDescription>
                <p className="text-sm text-slate-500 mt-2">
                  {t('home.esg.esgGrade.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ESG 가치 섹션 */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              {t('home.values.title')}
            </h2>
            <p className="text-xl text-slate-600">
              {t('home.values.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Environmental */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <TreePine className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-2xl text-slate-900">
                  {t('home.values.environmental.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.environmental.renewableEnergy')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">34.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.environmental.ecoVehicles')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">78.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.environmental.energyEfficiency')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">15.3%</span>
                </div>
                <p className="text-sm text-slate-500 pt-2">
                  {t('home.values.environmental.description')}
                </p>
              </CardContent>
            </Card>
            
            {/* Social */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <Users className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-2xl text-slate-900">
                  {t('home.values.social.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.social.welfareRecipients')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">
                    125만명
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.social.economicContribution')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">
                    8.2조원
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.social.safetyImprovement')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">99.8%</span>
                </div>
                <p className="text-sm text-slate-500 pt-2">
                  {t('home.values.social.description')}
                </p>
              </CardContent>
            </Card>
            
            {/* Governance */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="pb-6">
                <div className="p-4 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full w-fit">
                  <Target className="h-8 w-8 text-[#2dafdd]" />
                </div>
                <CardTitle className="text-2xl text-slate-900">
                  {t('home.values.governance.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.governance.transparencyIndex')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">
                    95.7점
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.governance.digitalInnovation')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">
                    88.3점
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">
                    {t('home.values.governance.ethicalManagement')}
                  </span>
                  <span className="font-bold text-[#2dafdd]">99.1%</span>
                </div>
                <p className="text-sm text-slate-500 pt-2">
                  {t('home.values.governance.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection locale={locale} />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2dafdd] to-[#2dafdd]/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t('home.cta.description')}
          </p>
          <Link href={`/${locale}/passport/create`}>
            <Button 
              size="lg" 
              className="bg-white text-[#2dafdd] hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              {t('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}