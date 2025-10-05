import { getRequestConfig } from 'next-intl/server'

export const locales = ['ko', 'en', 'ja', 'zh'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ko'

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  }
})