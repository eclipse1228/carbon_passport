import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Train, Leaf, BarChart3 } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

interface HeroSectionProps {
  locale: string
}

export async function HeroSection({ locale }: HeroSectionProps) {
  const t = await getTranslations({ locale })
  
  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2dafdd]/40 via-[#2dafdd]/15 to-white"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[#2dafdd]/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#2dafdd]/15 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#2dafdd]/5 to-transparent rounded-full blur-3xl"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22%232dafdd%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M20 20.5V18H0v-2h20v2.5zm0 2.5v14h-2V23H0v-2h18v2zm2 0V23h18v2H22v14h-2V23.5zM0 18V4h2v14H0zm40 2V4h-2v16h2z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <main className="relative container mx-auto px-4 pt-32 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Hero Badge */}
          <div className="animate-fade-in">
            <Badge variant="secondary" className="mb-8 px-6 py-3 text-sm font-medium bg-white/90 border-[#2dafdd]/20 text-[#2dafdd]">
              {t('home.hero.badge')}
            </Badge>
          </div>
          
          {/* Main Heading */}
          <div className="animate-fade-in animation-delay-300">
            <h1 className="text-6xl lg:text-7xl font-bold mb-8 text-white drop-shadow-lg">
              {t('home.hero.title')}
            </h1>
          </div>
          
          <div className="animate-fade-in animation-delay-600">
            <p className="text-xl lg:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero.description')}<br />
              <span className="text-[#2dafdd] font-semibold">{t('home.hero.subtitle')}</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link href={`/${locale}/passport/create`}>
              <Button 
                size="lg" 
                className="bg-[#2dafdd] hover:bg-[#2dafdd]/90 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 border-0"
              >
                <Train className="h-5 w-5 mr-2" />
                {t('home.hero.createButton')}
              </Button>
            </Link>
            <Link href={`/${locale}/passport/lookup`}>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-[#2dafdd] text-[#2dafdd] hover:bg-[#2dafdd]/10 bg-white/95 backdrop-blur-sm px-8 py-4 text-lg font-semibold shadow-lg"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                {t('home.hero.lookupButton')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}