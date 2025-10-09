'use client'

import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Locale = 'ko' | 'en' | 'ja' | 'zh-CN' | 'zh-TW'

interface LanguageSelectorProps {
  currentLocale: Locale
}

const languages = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  ja: { name: '日本語', flag: '🇯🇵' },
  'zh-CN': { name: '简体中文', flag: '🇨🇳' },
  'zh-TW': { name: '繁體中文', flag: '🇹🇼' }
}

export function LanguageSelector({ currentLocale }: LanguageSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Safe fallback for currentLocale
  const safeLocale = (currentLocale && languages[currentLocale]) ? currentLocale : 'ko'
  const currentLanguage = languages[safeLocale]

  const switchLanguage = (locale: Locale) => {
    const segments = pathname.split('/')
    segments[1] = locale
    const newPath = segments.join('/')
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/90 backdrop-blur border-white/20 hover:bg-white hover:border-white/40 text-blue-800 font-medium"
      >
        <span className="mr-2">{currentLanguage.flag}</span>
        {currentLanguage.name}
        <span className="ml-2">▼</span>
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-white/20 backdrop-blur z-50 min-w-[120px]">
          {(Object.keys(languages) as Locale[]).map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg flex items-center ${
                locale === safeLocale ? 'bg-blue-100 text-blue-900' : 'text-gray-700'
              }`}
            >
              <span className="mr-2">{languages[locale].flag}</span>
              {languages[locale].name}
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}