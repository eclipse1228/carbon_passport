'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Train, Leaf, Globe, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LanguageSelector } from '@/components/ui/language-selector'

export default function Navbar() {
  const params = useParams()
  const locale = params.locale as string
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useTranslations()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Train className="h-8 w-8 text-white" />
              <Leaf className="absolute -top-1 -right-1 h-4 w-4 text-white/70" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">KORAIL</span>
              <span className="text-xs text-white/70">Carbon Passport</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white hover:text-[#2dafdd] hover:bg-white/10 bg-transparent`}>
                    <Link href="/">{t('navigation.home')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-[#2dafdd] hover:bg-white/10 bg-transparent">
                    {t('navigation.passport')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-[#2dafdd]/20 to-[#2dafdd]/30 p-6 no-underline outline-none focus:shadow-md"
                            href="/passport/cover"
                          >
                            <Train className="h-6 w-6 text-[#2dafdd]" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              {t('navigation.passport')}
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              {locale === 'en' 
                                ? 'Protect the earth through train travel. The beginning of eco-friendly travel'
                                : '기차 여행으로 지구를 지켜요. 친환경 여행의 시작'
                              }
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/passport/create"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{t('navigation.createPassport')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {locale === 'en' 
                              ? 'Create a new eco-friendly travel passport'
                              : '새로운 친환경 여행 여권 생성'
                            }
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/passport/cover"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{t('navigation.viewPassport')}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {locale === 'en' 
                              ? 'View and manage already created passports'
                              : '이미 생성된 여권 조회 및 관리'
                            }
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-[#2dafdd] hover:bg-white/10 bg-transparent">
                    {t('navigation.environment')}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/environment/co2"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-[#2dafdd]" />
                            <div className="text-sm font-medium leading-none">{t('navigation.co2Impact')}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {locale === 'en' 
                              ? 'Compare carbon emissions by transportation mode'
                              : '교통수단별 탄소 배출량 비교'
                            }
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/environment/impact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-[#2dafdd]" />
                            <div className="text-sm font-medium leading-none">{t('navigation.environmentalImpact')}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {locale === 'en' 
                              ? 'Environmental effects of eco-friendly transportation'
                              : '친환경 교통의 환경적 효과'
                            }
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-white hover:text-[#2dafdd] hover:bg-white/10 bg-transparent`}>
                    <Link href="/about">{t('navigation.about')}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button asChild size="sm" className="hidden md:inline-flex bg-[#2dafdd] hover:bg-[#2dafdd]/90 text-white border-0">
              <Link href="/passport/create">
                {t('navigation.createPassport')}
              </Link>
            </Button>
            
            {/* Language Toggle */}
            <div className="hidden md:block">
              <LanguageSelector currentLocale={locale as any} />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:text-[#2dafdd] hover:bg-white/10"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t border-white/10 md:hidden bg-white/10 backdrop-blur-md">
            <div className="space-y-1 pb-3 pt-2">
              <Link
                href="/"
                className="block px-3 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.home')}
              </Link>
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-white/70">
                  {t('navigation.passport')}
                </div>
                <Link
                  href="/passport/create"
                  className="block px-6 py-2 text-sm text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.createPassport')}
                </Link>
                <Link
                  href="/passport/cover"
                  className="block px-6 py-2 text-sm text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.viewPassport')}
                </Link>
              </div>
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-white/70">
                  {t('navigation.environment')}
                </div>
                <Link
                  href="/environment/co2"
                  className="block px-6 py-2 text-sm text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.co2Impact')}
                </Link>
                <Link
                  href="/environment/impact"
                  className="block px-6 py-2 text-sm text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.environmentalImpact')}
                </Link>
              </div>
              <Link
                href="/about"
                className="block px-3 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-[#2dafdd] rounded-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('navigation.about')}
              </Link>
              <div className="px-3 py-2 space-y-3">
                <Button asChild size="sm" className="w-full bg-[#2dafdd] hover:bg-[#2dafdd]/90 text-white border-0">
                  <Link href="/passport/create" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('navigation.createPassport')}
                  </Link>
                </Button>
                <div className="flex justify-center">
                  <LanguageSelector currentLocale={locale as any} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}