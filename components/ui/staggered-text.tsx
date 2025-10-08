'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StaggeredTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
}

export function StaggeredText({ text, className, delay = 0, staggerDelay = 0.05 }: StaggeredTextProps) {
  const letters = text.split('')

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + index * staggerDelay,
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.span>
  )
}

interface FadeInUpProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function FadeInUp({ children, delay = 0, className }: FadeInUpProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  )
}

interface StaggeredCardsProps {
  children: ReactNode
  delay?: number
  staggerDelay?: number
  className?: string
}

export function StaggeredCards({ children, delay = 0, staggerDelay = 0.1, className }: StaggeredCardsProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: delay + index * staggerDelay,
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay,
            duration: 0.5,
            ease: "easeOut"
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  )
}