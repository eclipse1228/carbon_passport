'use client'

import { Button } from '@/components/ui/button'

interface ContactButtonProps {
  email: string
  className?: string
  children: React.ReactNode
}

export function ContactButton({ email, className, children }: ContactButtonProps) {
  const handleEmailClick = () => {
    window.open(`mailto:${email}`, '_blank')
  }

  return (
    <Button 
      onClick={handleEmailClick}
      className={className}
    >
      {children}
    </Button>
  )
}