'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function TextReveal({ children, className = '', delay = 0 }: TextRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface RevealTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function RevealText({ 
  text, 
  className = '', 
  delay = 0,
  staggerDelay = 0.05 
}: RevealTextProps) {
  const words = text.split(' ')
  
  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + (index * staggerDelay),
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

interface TypewriterTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function TypewriterText({ 
  text, 
  className = '', 
  delay = 0,
  speed = 50
}: TypewriterTextProps) {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 'auto' }}
      transition={{
        duration: text.length * speed / 1000,
        delay,
        ease: 'linear'
      }}
      className={`${className} overflow-hidden whitespace-nowrap`}
    >
      {text}
    </motion.div>
  )
}