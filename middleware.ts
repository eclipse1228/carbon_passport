import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Redirect to default locale if no locale is provided
  localePrefix: 'always',
  
  // Detect locale from browser
  localeDetection: true,
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ko|en|ja|zh)/:path*'],
}