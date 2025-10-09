import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// Can be imported from a shared config
const locales = ['ko', 'en', 'ja', 'zh-CN', 'zh-TW']

export default getRequestConfig(async ({ locale }) => {
  console.log('Received locale:', locale)
  
  // Use default locale if undefined
  const validLocale = locale || 'ko'
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(validLocale as any)) {
    console.log('Invalid locale, using default:', validLocale)
    // notFound()
  }

  return {
    locale: validLocale,
    messages: (await import(`./locales/${validLocale}/common.json`)).default
  }
})