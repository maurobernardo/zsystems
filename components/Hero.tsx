'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Hero() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  return (
    <section id="home" className="bg-primary relative overflow-hidden min-h-[85vh] md:min-h-[90vh] flex items-start md:items-center pt-12 md:pt-24 pb-8 md:pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/Fundo.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-primary/40"></div>
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-primary/40 to-transparent"></div>
      </div>

      {/* Enhanced Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        {/* Additional floating orbs */}
        <div className="absolute top-40 right-40 w-32 h-32 bg-secondary/25 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 left-40 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Enhanced Content aligned with header logo */}
      <div className="relative z-10 w-full mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Content with better animations */}
          <div className="text-white max-w-4xl">
          <p className="text-secondary-light text-sm md:text-sm font-semibold uppercase tracking-wide mb-3 md:mb-4 animate-fade-in">
            {t('hero.tagline')}
          </p>
          <h1 className="text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <span className="inline-block bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
              {t('hero.title')}
            </span>
          </h1>
          <p className="text-gray-200 text-base md:text-lg lg:text-xl mb-6 md:mb-10 leading-relaxed max-w-2xl animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            {t('hero.description')}
          </p>
          <div className="animate-bounce-in" style={{ animationDelay: '0.6s' }}>
            <Link href="#contact" className="btn-primary text-base md:text-lg px-8 py-4 group inline-flex items-center gap-3 shadow-xl hover:shadow-2xl hover:shadow-secondary/40">
              <span className="font-semibold">{t('hero.cta')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
