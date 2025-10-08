'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { LoadingSpinner } from '@/components/ui/loading-states'

interface SubmissionStep {
  id: string
  label: string
  status: 'pending' | 'in_progress' | 'completed' | 'error'
}

interface SubmissionProgressProps {
  isSubmitting: boolean
  onStepUpdate?: (stepId: string, status: SubmissionStep['status']) => void
}

export function SubmissionProgress({ isSubmitting, onStepUpdate }: SubmissionProgressProps) {
  const [steps, setSteps] = useState<SubmissionStep[]>([
    { id: 'passport', label: '개인정보 저장', status: 'pending' },
    { id: 'routes', label: '경로 정보 저장', status: 'pending' },
    { id: 'survey', label: '설문 응답 저장', status: 'pending' },
    { id: 'complete', label: '여권 생성 완료', status: 'pending' }
  ])
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isSubmitting) {
      // Reset when not submitting
      setSteps(steps.map(step => ({ ...step, status: 'pending' })))
      setCurrentStepIndex(0)
      setProgress(0)
      return
    }

    // Start simulation when submitting begins
    simulateProgress()
  }, [isSubmitting])

  const simulateProgress = async () => {
    const delays = [800, 1200, 800, 500] // Different delays for each step
    
    for (let i = 0; i < steps.length; i++) {
      // Mark current step as in progress
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'in_progress' : index < i ? 'completed' : 'pending'
      })))
      setCurrentStepIndex(i)
      setProgress((i / steps.length) * 100)
      
      // Notify parent component
      onStepUpdate?.(steps[i].id, 'in_progress')
      
      // Wait for the step to "complete"
      await new Promise(resolve => setTimeout(resolve, delays[i]))
      
      // Mark step as completed
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index <= i ? 'completed' : 'pending'
      })))
      
      // Notify parent component
      onStepUpdate?.(steps[i].id, 'completed')
      
      setProgress(((i + 1) / steps.length) * 100)
    }
  }

  const getStepIcon = (step: SubmissionStep) => {
    switch (step.status) {
      case 'completed':
        return '✅'
      case 'in_progress':
        return <LoadingSpinner size="sm" />
      case 'error':
        return '❌'
      default:
        return '⏳'
    }
  }

  const getStepColor = (step: SubmissionStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600'
      case 'in_progress':
        return 'text-blue-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  if (!isSubmitting) {
    return null
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              여권을 생성하고 있습니다...
            </h3>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-blue-700 mt-2">
              {Math.round(progress)}% 완료
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step.status === 'in_progress' 
                    ? 'bg-blue-100 scale-105' 
                    : step.status === 'completed'
                    ? 'bg-green-50'
                    : 'bg-white'
                }`}
              >
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${getStepColor(step)}`}>
                    {step.label}
                  </p>
                  {step.status === 'in_progress' && (
                    <p className="text-xs text-blue-600 mt-1">
                      처리 중...
                    </p>
                  )}
                  {step.status === 'completed' && (
                    <p className="text-xs text-green-600 mt-1">
                      완료
                    </p>
                  )}
                </div>
                {step.status === 'in_progress' && (
                  <div className="flex-shrink-0">
                    <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Current Status */}
          {currentStepIndex < steps.length && (
            <div className="text-center p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                {currentStepIndex === 0 && "개인정보를 안전하게 저장하고 있습니다..."}
                {currentStepIndex === 1 && "경로 정보를 분석하고 저장하고 있습니다..."}
                {currentStepIndex === 2 && "설문 응답을 저장하고 있습니다..."}
                {currentStepIndex === 3 && "여권을 최종 생성하고 있습니다..."}
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-xs text-gray-600 text-center">
            🔒 모든 정보는 안전하게 암호화되어 저장됩니다
          </div>
        </div>
      </CardContent>
    </Card>
  )
}