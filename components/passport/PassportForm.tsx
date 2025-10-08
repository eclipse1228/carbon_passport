'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { PassportData } from '@/types/passport'

interface PassportFormProps {
  initialData: PassportData
  onSubmit: (data: PassportData) => void
}

export function PassportForm({ initialData, onSubmit }: PassportFormProps) {
  const t = useTranslations()
  const [formData, setFormData] = useState<PassportData>(initialData)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, photo: t('validation.fileTooLarge') })
        return
      }
      setPhotoFile(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, photoUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
      setErrors({ ...errors, photo: '' })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.travelerName || formData.travelerName.trim().length < 1) {
      newErrors.travelerName = t('validation.invalidName')
    }

    if (!formData.country) {
      newErrors.country = t('validation.invalidCountry')
    }

    if (!formData.travelDate) {
      newErrors.travelDate = t('validation.invalidDate')
    }

    if (!formData.photoUrl) {
      newErrors.photo = t('passport.photoRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="travelerName">{t('passport.travelerName')}</Label>
          <Input
            id="travelerName"
            value={formData.travelerName}
            onChange={(e) =>
              setFormData({ ...formData, travelerName: e.target.value })
            }
            placeholder={t('passport.travelerName')}
            className={errors.travelerName ? 'border-destructive' : ''}
          />
          {errors.travelerName && (
            <p className="text-sm text-destructive mt-1">{errors.travelerName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="country">{t('passport.country')}</Label>
          <Select
            value={formData.country || ''}
            onValueChange={(value) =>
              setFormData({ ...formData, country: value as 'KR' | 'US' | 'JP' | 'CN' })
            }
          >
            <SelectTrigger className={errors.country ? 'border-destructive' : ''}>
              <SelectValue placeholder={t('passport.country')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="KR">{t('countries.KR')}</SelectItem>
              <SelectItem value="US">{t('countries.US')}</SelectItem>
              <SelectItem value="JP">{t('countries.JP')}</SelectItem>
              <SelectItem value="CN">{t('countries.CN')}</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-destructive mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <Label htmlFor="travelDate">{t('passport.travelDate')}</Label>
          <Input
            id="travelDate"
            type="date"
            value={formData.travelDate}
            onChange={(e) =>
              setFormData({ ...formData, travelDate: e.target.value })
            }
            className={errors.travelDate ? 'border-destructive' : ''}
          />
          {errors.travelDate && (
            <p className="text-sm text-destructive mt-1">{errors.travelDate}</p>
          )}
        </div>

        <div>
          <Label htmlFor="photo">{t('passport.photo')}</Label>
          <div className="space-y-2">
            {formData.photoUrl && (
              <div className="relative w-32 h-40 mx-auto">
                <img
                  src={formData.photoUrl}
                  alt={t('passport.photo')}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className={errors.photo ? 'border-destructive' : ''}
            />
            {errors.photo && (
              <p className="text-sm text-destructive mt-1">{errors.photo}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {t('buttons.next')}
      </Button>
    </form>
  )
}