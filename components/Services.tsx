'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Services() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visibleCards, setVisibleCards] = useState<number[]>([])

  const services = [
    {
      key: 'software',
      gradient: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      key: 'web',
      gradient: 'from-purple-500 to-pink-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      key: 'mobile',
      gradient: 'from-green-500 to-emerald-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'institutional',
      gradient: 'from-orange-500 to-red-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      key: 'portfolio',
      gradient: 'from-indigo-500 to-blue-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      key: 'networks',
      gradient: 'from-cyan-500 to-blue-500',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleCards((prev) => [...prev, index])
          }
        })
      },
      { threshold: 0.1 }
    )

    const cards = document.querySelectorAll('[data-service-card]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up animate-scale-in">
          <p className="text-secondary-light text-sm font-semibold uppercase tracking-wide mb-4 animate-fade-in">
            {t('services.tagline')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('services.title')}
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-service-card
              data-index={index}
              className={`
                group relative bg-primary-dark rounded-2xl p-6 shadow-2xl
                card-hover overflow-hidden border border-secondary/20
                ${visibleCards.includes(index) ? 'fade-in-up animate-scale-in' : 'opacity-0'}
                hover:animate-glow
              `}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.1)'
              }}
            >
              {/* Subtle blue glow on hover */}
              <div className="absolute inset-0 border border-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}></div>
              
              {/* Icon with blue gradient - top left */}
              <div className="relative mb-6 z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
                  {service.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-secondary-light transition-colors duration-300 relative z-10">
                {t(`services.items.${service.key}.title`)}
              </h3>
              <p className="text-secondary-light leading-relaxed relative z-10 text-sm">
                {t(`services.items.${service.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 fade-in-up" style={{ animationDelay: '0.8s' }}>
          <a href="#contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4">
            <span>{t('services.cta')}</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
