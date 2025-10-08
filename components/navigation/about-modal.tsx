'use client'

import { useTranslations } from 'next-intl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StaggeredText, FadeInUp, StaggeredCards } from '@/components/ui/staggered-text'
import { Building2, Target, Lightbulb } from 'lucide-react'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const t = useTranslations()

  const sections = [
    {
      icon: Building2,
      title: t('about.background.title'),
      content: t('about.background.content'),
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: Target,
      title: t('about.meaning.title'),
      content: t('about.meaning.content'),
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Lightbulb,
      title: t('about.vision.title'),
      content: t('about.vision.content'),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            <StaggeredText 
              text={t('about.title')}
              className="text-3xl font-bold text-blue-900"
              staggerDelay={0.05}
            />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Subtitle */}
          <FadeInUp delay={0.3}>
            <p className="text-xl text-blue-700 text-center">
              {t('about.subtitle')}
            </p>
          </FadeInUp>

          {/* Main Content Cards */}
          <StaggeredCards 
            delay={0.5} 
            staggerDelay={0.2}
            className="grid gap-6"
          >
            {sections.map((section, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-full flex items-center justify-center`}>
                      <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                    </div>
                    <CardTitle className="text-xl text-blue-900">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-gray-700">
                    {section.content}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </StaggeredCards>

          {/* Partnership Highlight */}
          <FadeInUp delay={1.0}>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 text-center border border-blue-200/50">
              <StaggeredText 
                text="eCarbon × KORAIL"
                className="text-2xl font-bold text-blue-900 mb-4 block"
                staggerDelay={0.1}
              />
              <p className="text-blue-700 text-lg">
                지속가능한 교통의 미래를 함께 만들어가는 혁신적 파트너십
              </p>
              <div className="mt-4 text-blue-600 font-medium">
                💚 친환경 • 🚄 혁신 • 🌍 지속가능성
              </div>
            </div>
          </FadeInUp>
        </div>
      </DialogContent>
    </Dialog>
  )
}