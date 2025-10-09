'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import type { SurveyData } from '@/types/passport'

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => void
  onSkip: () => void
  onBack: () => void
  isSubmitting: boolean
}

export function SurveyForm({ onSubmit, onSkip, onBack, isSubmitting }: SurveyFormProps) {
  const t = useTranslations()
  const [surveyData, setSurveyData] = useState<SurveyData>({
    travelPurpose: '',
    travelFrequency: '',
    environmentalImportance: 3,
    wouldRecommend: '',
    improvementSuggestions: '',
    additionalComments: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(surveyData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{t('survey.title')}</h2>
        <p className="text-sm text-muted-foreground">{t('survey.subtitle')}</p>

        {/* Travel Purpose */}
        <div className="space-y-3">
          <Label>{t('survey.questions.travelPurpose.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span></Label>
          <RadioGroup
            value={surveyData.travelPurpose}
            onValueChange={(value) =>
              setSurveyData({ ...surveyData, travelPurpose: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="leisure" id="leisure" />
              <Label htmlFor="leisure">{t('survey.questions.travelPurpose.options.leisure')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="business" id="business" />
              <Label htmlFor="business">{t('survey.questions.travelPurpose.options.business')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="visiting" id="visiting" />
              <Label htmlFor="visiting">{t('survey.questions.travelPurpose.options.visiting')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">{t('survey.questions.travelPurpose.options.other')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Travel Frequency */}
        <div className="space-y-3">
          <Label>{t('survey.questions.travelFrequency.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span></Label>
          <RadioGroup
            value={surveyData.travelFrequency}
            onValueChange={(value) =>
              setSurveyData({ ...surveyData, travelFrequency: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">{t('survey.questions.travelFrequency.options.daily')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">{t('survey.questions.travelFrequency.options.weekly')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">{t('survey.questions.travelFrequency.options.monthly')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yearly" id="yearly" />
              <Label htmlFor="yearly">{t('survey.questions.travelFrequency.options.yearly')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rarely" id="rarely" />
              <Label htmlFor="rarely">{t('survey.questions.travelFrequency.options.rarely')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Environmental Importance */}
        <div className="space-y-3">
          <Label>
            {t('survey.questions.environmentalImportance.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span>
          </Label>
          <p className="text-sm text-muted-foreground">
            {t('survey.questions.environmentalImportance.description')}
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm">1</span>
            <Slider
              value={[surveyData.environmentalImportance || 3]}
              onValueChange={(value) =>
                setSurveyData({ ...surveyData, environmentalImportance: value[0] })
              }
              min={1}
              max={5}
              step={1}
              className="flex-1"
            />
            <span className="text-sm">5</span>
          </div>
          <div className="text-center text-lg font-semibold">
            {surveyData.environmentalImportance}
          </div>
        </div>

        {/* Would Recommend */}
        <div className="space-y-3">
          <Label>{t('survey.questions.wouldRecommend.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span></Label>
          <RadioGroup
            value={surveyData.wouldRecommend}
            onValueChange={(value) =>
              setSurveyData({ ...surveyData, wouldRecommend: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">{t('survey.questions.wouldRecommend.options.yes')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">{t('survey.questions.wouldRecommend.options.no')}</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Improvement Suggestions */}
        <div className="space-y-2">
          <Label htmlFor="improvements">
            {t('survey.questions.improvementSuggestions.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span>
          </Label>
          <Textarea
            id="improvements"
            value={surveyData.improvementSuggestions}
            onChange={(e) =>
              setSurveyData({ ...surveyData, improvementSuggestions: e.target.value })
            }
            placeholder={t('survey.questions.improvementSuggestions.placeholder')}
            rows={3}
          />
        </div>

        {/* Additional Comments */}
        <div className="space-y-2">
          <Label htmlFor="comments">
            {t('survey.questions.additionalComments.label')} <span className="text-sm text-muted-foreground">({t('survey.optional')})</span>
          </Label>
          <Textarea
            id="comments"
            value={surveyData.additionalComments}
            onChange={(e) =>
              setSurveyData({ ...surveyData, additionalComments: e.target.value })
            }
            placeholder={t('survey.questions.additionalComments.placeholder')}
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1"
        >
          {t('buttons.previous')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onSkip}
          disabled={isSubmitting}
          className="flex-1"
        >
          {t('survey.skip')}
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? t('messages.saving') : t('survey.submit')}
        </Button>
      </div>
    </form>
  )
}