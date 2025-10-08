'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

export interface ESGResponse {
  questionId: number
  response: string
}

interface ESGQuestionsProps {
  onComplete: (responses: ESGResponse[]) => void
  className?: string
}

const questions = [
  {
    id: 1,
    key: 'environmentalImportance',
    options: ['very_high', 'high', 'medium', 'low', 'very_low']
  },
  {
    id: 2,
    key: 'travelFrequency',
    options: ['daily', 'weekly', 'monthly', 'rarely', 'never']
  },
  {
    id: 3,
    key: 'ecoProductPurchase',
    options: ['very_high', 'high', 'medium', 'low', 'very_low']
  },
  {
    id: 4,
    key: 'recyclingPractice',
    options: ['very_high', 'high', 'medium', 'low', 'very_low']
  },
  {
    id: 5,
    key: 'energyConservation',
    options: ['very_high', 'high', 'medium', 'low', 'very_low']
  },
  {
    id: 6,
    key: 'policySupport',
    options: ['very_high', 'high', 'medium', 'low', 'very_low']
  }
]

export function ESGQuestions({ onComplete, className }: ESGQuestionsProps) {
  const t = useTranslations()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isCompleted, setIsCompleted] = useState(false)

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleOptionSelect = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQ.id]: value
    }))
  }

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      // Convert responses to required format
      const esgResponses: ESGResponse[] = Object.entries(responses).map(([questionId, response]) => ({
        questionId: parseInt(questionId),
        response
      }))
      
      setIsCompleted(true)
      onComplete(esgResponses)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const canProceed = responses[currentQ.id] !== undefined

  if (isCompleted) {
    return (
      <Card className={`${className} text-center`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
            <h2 className="text-2xl font-bold text-green-600">{t('survey.completed')}</h2>
            <p className="text-gray-600">Thank you for completing the ESG survey!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`${className} space-y-6`}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {t(`survey.question${currentQ.id}`)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={responses[currentQ.id] || ''}
            onValueChange={handleOptionSelect}
            className="space-y-3"
          >
            {currentQ.options.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={option} id={`${currentQ.id}-${option}`} />
                <Label 
                  htmlFor={`${currentQ.id}-${option}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {t(`survey.options.${option}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentQuestion === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{t('survey.previous')}</span>
        </Button>

        <Button
          onClick={goToNext}
          disabled={!canProceed}
          className="flex items-center space-x-2"
        >
          <span>
            {currentQuestion === questions.length - 1 ? t('survey.complete') : t('survey.next')}
          </span>
          {currentQuestion < questions.length - 1 && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Question Overview */}
      <div className="grid grid-cols-6 gap-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`h-3 rounded-full transition-colors ${
              index < currentQuestion 
                ? 'bg-green-500' 
                : index === currentQuestion 
                  ? responses[questions[index].id] 
                    ? 'bg-blue-500' 
                    : 'bg-blue-200'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  )
}