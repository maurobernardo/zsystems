// ─────────────────────────────────────────────────────────────────────────────
// GoogleAnalytics.tsx — Z-Systems
//
// INSTALAÇÃO:
//   npm install @vercel/analytics @vercel/speed-insights
//
// USO no app/layout.tsx:
//   import { Analytics }     from '@vercel/analytics/react'
//   import { SpeedInsights } from '@vercel/speed-insights/next'
//   import GoogleAnalytics   from '@/components/GoogleAnalytics'
//   // dentro do <body>:
//   <Analytics />
//   <SpeedInsights />
//   <GoogleAnalytics />
//
// ENV VAR no Vercel Dashboard:
//   NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import Script from 'next/script'

interface Props {
  gaId?: string
}

export default function GoogleAnalytics({ gaId }: Props) {
  const id = gaId ?? process.env.NEXT_PUBLIC_GA_ID
  if (!id) return null

  return (
    <>
      {/* Load GA4 script */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      {/* Init GA4 */}
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}', {
              page_path: window.location.pathname,
              send_page_view: true,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * HELPER — track custom events anywhere in the app
 * Usage:
 *   import { trackEvent } from '@/components/GoogleAnalytics'
 *   trackEvent('contact_form_submit', { method: 'emailjs' })
 *   trackEvent('whatsapp_click')
 *   trackEvent('project_view', { project_id: 'agro' })
 * ────────────────────────────────────────────────────────────────────────── */

type EventParams = Record<string, string | number | boolean | undefined>

export function trackEvent(eventName: string, params?: EventParams) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (!w.gtag) return
  w.gtag('event', eventName, params ?? {})
}