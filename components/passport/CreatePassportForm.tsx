'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { StationCombobox } from '@/components/ui/station-combobox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@/components/ui/input-group'
import { 
  Train, 
  User, 
  MapPin, 
  Calendar,
  Upload,
  Plus,
  X,
  Camera
} from 'lucide-react'

interface Route {
  id: string
  departure: string
  destination: string
}

interface CreatePassportFormProps {
  locale: string
}

export default function CreatePassportForm({ locale }: CreatePassportFormProps) {
  const t = useTranslations()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [routes, setRoutes] = useState<Route[]>([
    { id: '1', departure: '', destination: '' }
  ])
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0], // Today's date as default
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addRoute = () => {
    const newRoute: Route = {
      id: Date.now().toString(),
      departure: '',
      destination: ''
    }
    setRoutes([...routes, newRoute])
  }

  const removeRoute = (id: string) => {
    if (routes.length > 1) {
      setRoutes(routes.filter(route => route.id !== id))
    }
  }

  const updateRoute = (id: string, field: 'departure' | 'destination', value: string) => {
    setRoutes(routes.map(route => 
      route.id === id ? { ...route, [field]: value } : route
    ))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!photo) {
      alert(t('passport.createPassport.validation.photoRequired'))
      return
    }

    const validRoutes = routes.filter(route => route.departure && route.destination)
    if (validRoutes.length === 0) {
      alert(t('passport.createPassport.validation.routeRequired'))
      return
    }

    if (!formData.name.trim()) {
      alert(t('passport.createPassport.validation.nameRequired'))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare form data for API
      const apiFormData = new FormData()
      apiFormData.append('name', formData.name)
      apiFormData.append('date', formData.date)
      apiFormData.append('routes', JSON.stringify(validRoutes))
      apiFormData.append('photo', photo)

      // Submit to API
      const response = await fetch('/api/passports', {
        method: 'POST',
        body: apiFormData
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to create passport')
      }

      // Redirect to success page with real passport ID
      router.push(`/${locale}/passport/success?id=${result.passport.id}`)
    } catch (error) {
      console.error('Error creating passport:', error)
      
      // Show specific error message if available
      const errorMessage = error instanceof Error ? error.message : t('passport.createPassport.validation.unknownError')
      
      if (errorMessage.includes('Failed to create passport')) {
        // Try to get more specific error from response
        alert(t('passport.createPassport.validation.creationError'))
      } else {
        alert(errorMessage)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photo Upload Section */}
      <div className="space-y-3">
        <Label className="text-slate-700 font-medium text-lg">{t('passport.createPassport.profilePhoto')}</Label>
        <div className="flex flex-col items-center space-y-4">
          {photoPreview ? (
            <div className="relative">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="w-32 h-32 rounded-full object-cover border-4 border-[#2dafdd]/20"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => {
                  setPhoto(null)
                  setPhotoPreview('')
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div 
              className="w-32 h-32 rounded-full border-2 border-dashed border-[#2dafdd]/30 flex items-center justify-center cursor-pointer hover:border-[#2dafdd]/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-8 w-8 text-[#2dafdd]/50" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-[#2dafdd] text-[#2dafdd] hover:bg-[#2dafdd]/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            {photoPreview ? t('passport.createPassport.changePhoto') : t('passport.createPassport.uploadPhoto')}
          </Button>
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-700 font-medium">{t('passport.createPassport.name')}</Label>
        <InputGroup>
          <InputGroupAddon>
            <User className="h-4 w-4 text-[#2dafdd]" />
          </InputGroupAddon>
          <InputGroupInput
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={t('passport.createPassport.namePlaceholder')}
            required
          />
        </InputGroup>
      </div>

      {/* Travel Date */}
      <div className="space-y-2">
        <Label htmlFor="date" className="text-slate-700 font-medium">{t('passport.createPassport.travelDate')}</Label>
        <InputGroup>
          <InputGroupAddon>
            <Calendar className="h-4 w-4 text-[#2dafdd]" />
          </InputGroupAddon>
          <InputGroupInput
            type="date"
            id="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </InputGroup>
      </div>

      {/* Routes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-slate-700 font-medium text-lg">{t('passport.createPassport.travelRoutes')}</Label>
          <Button
            type="button"
            onClick={addRoute}
            variant="outline"
            size="sm"
            className="border-[#2dafdd] text-[#2dafdd] hover:bg-[#2dafdd]/10"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('passport.createPassport.addRoute')}
          </Button>
        </div>
        
        <div className="space-y-4">
          {routes.map((route, index) => (
            <Card key={route.id} className="border-[#2dafdd]/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {t('passport.createPassport.route')} {index + 1}
                  </CardTitle>
                  {routes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRoute(route.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">{t('passport.createPassport.departure')}</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <MapPin className="h-4 w-4 text-[#2dafdd]" />
                    </InputGroupAddon>
                    <div className="flex-1">
                      <StationCombobox
                        value={route.departure}
                        onValueChange={(value) => updateRoute(route.id, 'departure', value)}
                        placeholder={t('passport.createPassport.departurePlaceholder')}
                        locale={locale}
                      />
                    </div>
                  </InputGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-slate-600">{t('passport.createPassport.destination')}</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <MapPin className="h-4 w-4 text-green-600" />
                    </InputGroupAddon>
                    <div className="flex-1">
                      <StationCombobox
                        value={route.destination}
                        onValueChange={(value) => updateRoute(route.id, 'destination', value)}
                        placeholder={t('passport.createPassport.destinationPlaceholder')}
                        locale={locale}
                      />
                    </div>
                  </InputGroup>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2dafdd] hover:bg-[#2dafdd]/90 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        <Train className="h-5 w-5 mr-2" />
        {isSubmitting ? t('passport.createPassport.creating') : t('passport.createPassport.createButton')}
      </Button>
    </form>
  )
}