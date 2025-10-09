'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Train, MapPin, Calendar, User, Download, Share2, ArrowLeft, Leaf } from 'lucide-react'

interface TravelRoute {
  from: string
  to: string
  date: string
  distance: number
}

interface PassportData {
  name: string
  photo: string | null
  routes: TravelRoute[]
}

type Props = {
  params: { locale: string }
}

export default function PassportViewPage({ params: { locale } }: Props) {
  const t = useTranslations()
  const router = useRouter()
  
  const [passportData, setPassportData] = useState<PassportData | null>(null)

  useEffect(() => {
    const data = localStorage.getItem('passportData')
    if (data) {
      setPassportData(JSON.parse(data))
    } else {
      router.push(`/${locale}/passport/form`)
    }
  }, [locale, router])

  if (!passportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  const totalDistance = passportData.routes.reduce((sum, route) => sum + route.distance, 0)
  const co2Saved = totalDistance * 0.18
  const carbonCredits = Math.floor(co2Saved / 10)

  const handleDownload = () => {
    // In a real app, this would generate a PDF or image
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(passportData, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `carbon-passport-${passportData.name}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t('passport.shareTitle'),
          text: t('passport.shareText', { 
            name: passportData.name, 
            co2: co2Saved.toFixed(2) 
          }),
          url: window.location.href
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${t('passport.shareText', { 
        name: passportData.name, 
        co2: co2Saved.toFixed(2) 
      })} ${window.location.href}`
      navigator.clipboard.writeText(shareText)
      alert(t('passport.linkCopied'))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/${locale}/passport/form`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold text-blue-900">{t('passport.viewTitle')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              {t('common.share')}
            </Button>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              {t('common.download')}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Passport Card */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-2 border-blue-200 shadow-lg">
              {/* Passport Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Train className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{t('passport.ecoPassport')}</h2>
                      <p className="text-blue-100">{t('passport.railwayTravel')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{carbonCredits}</div>
                    <div className="text-sm text-blue-100">{t('passport.carbonCredits')}</div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <CardContent className="p-6">
                <div className="flex items-center gap-6 mb-6">
                  <Avatar className="h-24 w-24 border-4 border-blue-200">
                    {passportData.photo ? (
                      <AvatarImage src={passportData.photo} alt={passportData.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{passportData.name}</h3>
                    <p className="text-gray-600">{t('passport.ecoTraveler')}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge className="bg-green-100 text-green-800">
                        <Leaf className="h-3 w-3 mr-1" />
                        {t('passport.verified')}
                      </Badge>
                      <Badge variant="outline">
                        {t('passport.member')} #{Math.floor(Math.random() * 10000)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Travel Routes */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Train className="h-5 w-5 text-blue-600" />
                    {t('passport.travelHistory')}
                  </h4>
                  <div className="space-y-3">
                    {passportData.routes.map((route, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {route.from} → {route.to}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {route.date}
                            </span>
                            <span>{route.distance}km</span>
                            <span className="text-green-600 font-medium">
                              -{(route.distance * 0.18).toFixed(1)}kg CO₂
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics & Actions */}
          <div className="space-y-6">
            {/* Environmental Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Leaf className="h-5 w-5" />
                  {t('passport.environmentalImpact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-700">{co2Saved.toFixed(1)}</div>
                  <div className="text-sm text-green-600">{t('passport.kgCO2Saved')}</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('passport.totalDistance')}</span>
                    <Badge variant="secondary">{totalDistance} km</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('passport.trips')}</span>
                    <Badge variant="outline">{passportData.routes.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{t('passport.carbonCredits')}</span>
                    <Badge className="bg-blue-600">{carbonCredits}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>{t('passport.achievements')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {co2Saved > 50 && (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl">🌟</div>
                      <div>
                        <div className="font-medium text-yellow-800">{t('passport.ecoWarrior')}</div>
                        <div className="text-sm text-yellow-600">{t('passport.saved50kg')}</div>
                      </div>
                    </div>
                  )}
                  
                  {passportData.routes.length >= 5 && (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl">🚄</div>
                      <div>
                        <div className="font-medium text-blue-800">{t('passport.frequentTraveler')}</div>
                        <div className="text-sm text-blue-600">{t('passport.completed5Trips')}</div>
                      </div>
                    </div>
                  )}
                  
                  {totalDistance > 1000 && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl">🌍</div>
                      <div>
                        <div className="font-medium text-green-800">{t('passport.longDistanceChampion')}</div>
                        <div className="text-sm text-green-600">{t('passport.traveled1000km')}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('passport.actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => router.push(`/${locale}/passport/form`)}
                  className="w-full"
                  variant="outline"
                >
                  {t('passport.addNewTrip')}
                </Button>
                <Button 
                  onClick={() => router.push(`/${locale}`)}
                  className="w-full"
                  variant="outline"
                >
                  {t('passport.backToHome')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}