'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StaggeredText } from '@/components/ui/staggered-text'
import { Menu, X } from 'lucide-react'
import { AboutModal } from './about-modal'

export function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAboutModal, setShowAboutModal] = useState(false)

  const menuItems = [
    {
      label: t('navigation.about'),
      onClick: () => setShowAboutModal(true),
      type: 'modal' as const
    },
    {
      label: 'KORAIL',
      href: 'https://www.korail.com/intro',
      external: true,
      type: 'link' as const
    },
    {
      label: t('navigation.esgKorail'),
      href: `/${locale}/esg-korail`,
      type: 'link' as const
    },
    {
      label: t('navigation.contact'),
      href: `/${locale}/contact`,
      type: 'link' as const
    }
  ]

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <StaggeredText 
                text="eCarbon × KORAIL"
                className="text-xl font-bold text-blue-900"
                staggerDelay={0.05}
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.type === 'link' ? (
                    item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href!}
                        className="text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    )
                  ) : (
                    <button
                      onClick={item.onClick}
                      className="text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-blue-700"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-blue-100">
              <div className="flex flex-col space-y-4">
                {menuItems.map((item, index) => (
                  <div key={index}>
                    {item.type === 'link' ? (
                      item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href!}
                          className="block text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          item.onClick?.()
                          setIsMenuOpen(false)
                        }}
                        className="block text-blue-700 hover:text-blue-900 transition-colors duration-200 font-medium py-2 text-left w-full"
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals */}
      <AboutModal 
        isOpen={showAboutModal} 
        onClose={() => setShowAboutModal(false)} 
      />
    </>
  )
}