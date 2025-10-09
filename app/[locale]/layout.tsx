import { Inter, Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import { LeafletImports } from '@/components/ui/leaflet-imports'

const inter = Inter({ subsets: ['latin'] })
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-sc'
})
const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  variable: '--font-noto-sans-tc'
})

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages({ locale })

  // 로케일에 따른 폰트 클래스 결정
  const getFontClass = () => {
    if (locale === 'zh-CN') {
      return `${inter.className} ${notoSansSC.variable}`
    } else if (locale === 'zh-TW') {
      return `${inter.className} ${notoSansTC.variable}`
    }
    return inter.className
  }

  return (
    <html lang={locale}>
      <body className={getFontClass()}>
        <NextIntlClientProvider messages={messages}>
          <LeafletImports />
          <Navbar />
          <main>
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}