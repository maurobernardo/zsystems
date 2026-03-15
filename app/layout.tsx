import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Z-Systems | Smart, Scalable IT Solutions for Your Business',
  description: 'We help you build, manage, and grow through innovative tech services. Web systems, enterprise software, APIs, dashboards and digital platforms.',
  icons: {
    icon: '/images/logo9.png',
    apple: '/images/logo9.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Tira azul 1px no topo absoluto para tapar qualquer linha branca do browser */}
        <div
          className="fixed top-0 left-0 right-0 h-px z-[45] pointer-events-none"
          style={{ backgroundColor: '#1e3a5f' }}
          aria-hidden
        />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}

