'use client'

import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'
import SectionTitlePill from '@/components/SectionTitlePill'

type ServiceArea = {
  key: string
  icon: React.ReactNode
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm text-gray-200">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary/80 flex-shrink-0" />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Services() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  const areas: ServiceArea[] = [
    {
      key: 'webDev',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21l9-9-9-9-9 9 9 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V9l3-3 3 3v12" />
        </svg>
      ),
    },
    {
      key: 'systemsDev',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
        </svg>
      ),
    },
    {
      key: 'mobile',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'uiux',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
    {
      key: 'infra',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7v10M17 7v10" />
        </svg>
      ),
    },
  ]

  return (
    <section id="services" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-14">
          <SectionTitlePill>{t('services.tagline')}</SectionTitlePill>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
              {t('services.title')}
            </span>
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto">{t('services.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {areas.map((area, index) => (
            <div
              key={area.key}
              className="group relative rounded-3xl p-7 md:p-8 border border-secondary/20 bg-primary-dark/60 backdrop-blur-md shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-secondary/25 hover:border-secondary/50 overflow-hidden"
              style={{ boxShadow: '0 4px 25px rgba(59, 130, 246, 0.14)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/45 via-secondary/25 to-secondary/10 flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
                  style={{ boxShadow: '0 4px 22px rgba(59, 130, 246, 0.45)' }}
                >
                  {area.icon}
                </div>

                <h3 className="mt-5 text-xl md:text-2xl font-bold text-white group-hover:text-secondary-light transition-colors duration-300">
                  {t(`services.areas.${area.key}.title`)}
                </h3>

                <BulletList items={t(`services.areas.${area.key}.items`) as string[]} />
              </div>

              <div
                className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-secondary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
