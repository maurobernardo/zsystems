'use client'

import { useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function About() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.scroll-reveal')
      elements.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Content - Centered and elegant */}
          <div className="scroll-reveal animate-slide-in-blur text-center mb-12">
            <p className="text-secondary-light text-sm font-semibold uppercase tracking-wide mb-4 animate-fade-in">
              {t('about.tagline')}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
              {t('about.title')}
              </span>
            </h2>
            <p className="text-gray-200 text-lg mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
              {t('about.description')}
            </p>

            {/* Enhanced Features List with better animations */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
              {[
                { 
                  title: t('about.features.support'),
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                { 
                  title: t('about.features.ux'),
                  icon: (
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group scroll-reveal bg-primary-dark/80 backdrop-blur-sm rounded-2xl p-8 border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/20 animate-slide-up-fade"
                  style={{ 
                    animationDelay: `${0.5 + index * 0.15}s`, 
                    boxShadow: '0 4px 25px rgba(59, 130, 246, 0.15)'
                  }}
                >
                  <div className="w-18 h-18 bg-gradient-to-br from-secondary/40 via-secondary/30 to-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl group-hover:shadow-2xl" style={{ boxShadow: '0 4px 25px rgba(59, 130, 246, 0.4)' }}>
                    {feature.icon}
                  </div>
                  <span className="text-gray-200 text-base md:text-lg group-hover:text-white transition-colors duration-300 text-center block font-medium">{feature.title}</span>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-secondary/0 via-secondary/10 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
