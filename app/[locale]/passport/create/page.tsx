import { getTranslations } from 'next-intl/server'
import { Train } from 'lucide-react'
import CreatePassportForm from '@/components/passport/CreatePassportForm'

type Props = {
  params: { locale: string }
}

export default async function CreatePassportPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale })

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2dafdd]/10 via-white to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl border border-[#2dafdd]/10 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#2dafdd]/10 rounded-full">
                <Train className="h-8 w-8 text-[#2dafdd]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t('passport.createPassport.title')}
            </h1>
            <p className="text-slate-600">
              {t('passport.createPassport.subtitle')}
            </p>
          </div>
          
          <CreatePassportForm locale={locale} />
        </div>
      </div>
    </div>
  )
}