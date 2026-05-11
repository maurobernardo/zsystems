import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import { Analytics }     from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { LanguageProvider } from '@/contexts/LanguageContext'
import GoogleAnalytics      from '@/components/GoogleAnalytics'

/* ─── Fonts ──────────────────────────────────────────────────────────────── */
const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

/* ─── Constants ──────────────────────────────────────────────────────────── */
const SITE_URL   = 'https://zsystems.online'
const SITE_NAME  = 'Z-Systems'
const SITE_TITLE = 'Z-Systems | Desenvolvimento de Software e Soluções Digitais'
const SITE_DESC  = 'A Z-Systems é uma empresa de tecnologia em Moçambique especializada no desenvolvimento de websites, sistemas, plataformas digitais e soluções tecnológicas modernas para negócios, organizações e clientes em geral.'
const SITE_LOGO  = `${SITE_URL}/images/logo11.png`
const OG_IMAGE   = `${SITE_URL}/og-image.png`

/* ─── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s | ${SITE_NAME}` },
  description: SITE_DESC,
  keywords: [
    'Z-Systems', 'empresa tecnologia Moçambique', 'desenvolvimento web Beira',
    'software empresarial Moçambique', 'Next.js Moçambique', 'sistemas web Beira',
    'UX UI design Moçambique', 'infraestrutura redes Beira', 'Jakarta EE Moçambique',
    'API integrations Mozambique', 'tech company Mozambique',
    'web development Mozambique', 'digital transformation Beira',
  ],
  authors: [{ name: 'Z-Systems', url: SITE_URL }],
  creator: 'Z-Systems', publisher: 'Z-Systems', category: 'Technology',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website', locale: 'pt_MZ', alternateLocale: 'en_US',
    url: SITE_URL, siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESC,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Z-Systems — Empresa de Tecnologia em Beira', type: 'image/png' }],
  },
  twitter: { card: 'summary_large_image', title: SITE_TITLE, description: SITE_DESC, images: [OG_IMAGE] },
  icons: {
    icon: [{ url: '/images/logo11.png', type: 'image/png' }, { url: '/favicon.ico', sizes: '48x48' }],
    apple: [{ url: '/images/logo11.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/logo11.png',
  },
  manifest: '/manifest.json',
  alternates: { canonical: SITE_URL, languages: { 'pt-MZ': SITE_URL, 'en-US': `${SITE_URL}/en` } },
  verification: { google: 'YOUR_GOOGLE_SITE_VERIFICATION_CODE' },
}

/* ─── JSON-LD ────────────────────────────────────────────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME, url: SITE_URL,
      logo: { '@type': 'ImageObject', url: SITE_LOGO, width: 512, height: 512 },
      description: SITE_DESC, foundingDate: '2026',
      foundingLocation: {
        '@type': 'Place', name: 'Beira, Moçambique',
        address: { '@type': 'PostalAddress', addressLocality: 'Beira', addressRegion: 'Sofala', addressCountry: 'MZ', streetAddress: 'Ponta-Gea' },
      },
      contactPoint: [{ '@type': 'ContactPoint', telephone: '+258-87-010-7006', contactType: 'customer service', availableLanguage: ['Portuguese', 'English'] }],
      sameAs: ['https://www.facebook.com/share/1891R3wjg9/', 'https://www.instagram.com/zsystems9', 'https://www.linkedin.com/company/z-systemss/', 'https://www.tiktok.com/@zsystems9'],
    },
    {
      '@type': 'WebSite', '@id': `${SITE_URL}/#website`,
      url: SITE_URL, name: SITE_NAME, description: SITE_DESC,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: ['pt-MZ', 'en-US'],
    },
    {
      '@type': 'LocalBusiness', '@id': `${SITE_URL}/#localbusiness`,
      name: SITE_NAME, image: OG_IMAGE, url: SITE_URL,
      telephone: '+258870107006', priceRange: '$$',
      address: { '@type': 'PostalAddress', streetAddress: 'Ponta-Gea', addressLocality: 'Beira', addressRegion: 'Sofala', addressCountry: 'MZ' },
      geo: { '@type': 'GeoCoordinates', latitude: -19.8436, longitude: 34.8389 },
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' }],
    },
  ],
}

/* ─── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${syne.variable} ${dmSans.variable}`}>
      <head>
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="beforeInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#020408" />
        <meta name="msapplication-TileColor" content="#020408" />
        <meta name="geo.region" content="MZ-S" />
        <meta name="geo.placename" content="Beira, Moçambique" />
        <meta name="geo.position" content="-19.8436;34.8389" />
        <meta name="ICBM" content="-19.8436, 34.8389" />
      </head>
      <body className={dmSans.className}>
        <LanguageProvider>{children}</LanguageProvider>

        {/* Vercel Analytics — sem cookies, compatível com RGPD */}
        <Analytics />

        {/* Vercel Speed Insights — Core Web Vitals */}
        <SpeedInsights />

        {/* Google Analytics 4 — adiciona NEXT_PUBLIC_GA_ID nas env vars */}
        <GoogleAnalytics />
      </body>
    </html>
  )
}