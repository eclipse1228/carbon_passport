'use client'

import { Card } from '@/components/ui/card'
import { Mail, Globe, MapPin } from 'lucide-react'

interface ContactMethodCardProps {
  title: string
  content: string
  bgColor: string
  iconColor: string
  type: string
  email?: string
}

export function ContactMethodCard({ title, content, bgColor, iconColor, type, email }: ContactMethodCardProps) {
  const handleClick = () => {
    if (type === 'email' && email) {
      window.open(`mailto:${email}`, '_blank')
    } else if (type === 'website') {
      window.open('https://www.ecarbon.kr', '_blank')
    }
    // 위치는 클릭 액션이 없음
  }

  const getIcon = () => {
    switch (type) {
      case 'email':
        return <Mail className={`w-8 h-8 ${iconColor}`} />
      case 'website':
        return <Globe className={`w-8 h-8 ${iconColor}`} />
      case 'location':
        return <MapPin className={`w-8 h-8 ${iconColor}`} />
      default:
        return <Mail className={`w-8 h-8 ${iconColor}`} />
    }
  }

  return (
    <Card 
      className={`text-center p-6 bg-white/95 backdrop-blur border-white/20 hover:shadow-lg transition-all duration-300 hover:scale-105 ${
        type !== 'location' ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-blue-900 mb-2">{title}</h3>
      <p className="text-blue-700 text-sm">{content}</p>
    </Card>
  )
}