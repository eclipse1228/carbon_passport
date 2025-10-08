'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FadeInUp, StaggeredCards } from '@/components/ui/staggered-text'
import { ChevronDown, Leaf, Train, TrendingUp, Users, Award, Shield } from 'lucide-react'

interface QAItem {
  id: string
  question: string
  answer: string
  category: 'environmental' | 'social' | 'governance'
}

interface ESGQASectionProps {
  qaItems: QAItem[]
}

export function ESGQASection({ qaItems }: ESGQASectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: '전체', icon: Award, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'environmental', label: 'Environmental', icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'social', label: 'Social', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { id: 'governance', label: 'Governance', icon: Shield, color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ]

  const filteredItems = activeCategory === 'all' 
    ? qaItems 
    : qaItems.filter(item => item.category === activeCategory)

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto">
        <FadeInUp delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">
              자주 묻는 질문
            </h2>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto">
              eCarbon × KORAIL ESG 프로그램에 대한 궁금한 점들을 확인해보세요
            </p>
          </div>
        </FadeInUp>

        {/* Category Filter */}
        <FadeInUp delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-300 hover:scale-105 ${
                    activeCategory === category.id
                      ? `${category.bgColor} border-current ${category.color} shadow-md`
                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{category.label}</span>
                </button>
              )
            })}
          </div>
        </FadeInUp>

        {/* Q&A Items */}
        <StaggeredCards delay={0.6} staggerDelay={0.1} className="space-y-4">
          <Accordion type="single" collapsible className="space-y-4">
            {filteredItems.map((item, index) => (
              <AccordionItem 
                key={item.id} 
                value={item.id}
                className="bg-white/95 backdrop-blur border border-blue-200/50 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                  <div className="flex items-start space-x-4 w-full">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      item.category === 'environmental' ? 'bg-green-100' :
                      item.category === 'social' ? 'bg-purple-100' :
                      'bg-orange-100'
                    }`}>
                      {item.category === 'environmental' && <Leaf className="w-4 h-4 text-green-600" />}
                      {item.category === 'social' && <Users className="w-4 h-4 text-purple-600" />}
                      {item.category === 'governance' && <Shield className="w-4 h-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">
                        {item.question}
                      </h3>
                    </div>
                    <ChevronDown className="w-5 h-5 text-blue-600 transition-transform group-data-[state=open]:rotate-180" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="ml-12">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </StaggeredCards>

        {filteredItems.length === 0 && (
          <FadeInUp delay={0.8}>
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                선택한 카테고리에 해당하는 질문이 없습니다.
              </p>
            </div>
          </FadeInUp>
        )}
      </div>
    </section>
  )
}