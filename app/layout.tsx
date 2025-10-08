import './globals.css'

export const metadata = {
  title: 'Carbon Passport',
  description: '탄소 발자국을 추적하고 친환경적인 여행을 계획하세요',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
