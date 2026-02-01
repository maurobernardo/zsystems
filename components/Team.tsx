'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

export default function Team() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('team-section')
    if (section) observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="team" className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div id="team-section" className="container-custom relative z-10">
        {/* Enhanced Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up-fade animate-fade-in-scale' : 'opacity-0'}`}>
          <p className="text-secondary-light text-sm font-semibold uppercase tracking-wide mb-4 animate-fade-in">
            {t('team.tagline')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
            <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
            {t('team.title')}
            </span>
          </h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto animate-slide-up-fade" style={{ animationDelay: '0.4s' }}>
            {t('team.subtitle')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
          {/* Enhanced CEO Card */}
          <div className={`group relative bg-primary-dark/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/30 ${isVisible ? 'animate-slide-up-fade animate-fade-in-scale' : 'opacity-0'}`} style={{ animationDelay: '0.3s', boxShadow: '0 4px 25px rgba(59, 130, 246, 0.15)' }}>
            {/* CEO Photo */}
            <div className="relative h-64 bg-gradient-to-br from-primary to-secondary overflow-hidden">
              <Image
                src="/images/Ceo.PNG"
                alt={t('team.ceo.name')}
                fill
                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                priority
                quality={90}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-secondary to-secondary-light backdrop-blur-md rounded-full px-5 py-2 z-10 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-sm font-bold">CEO</span>
              </div>

              {/* Social links overlay on hover */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div className="flex gap-3">
                  {[
                    { 
                      icon: (
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      ),
                      href: 'https://github.com/maurobernardo',
                      label: 'GitHub',
                      useFill: true
                    },
                    { 
                      icon: (
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      ),
                      href: 'https://www.linkedin.com/in/mauro-bernardo-zibane-5619b427a/',
                      label: 'LinkedIn',
                      useFill: true
                    },
                    { 
                      icon: (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </>
                      ),
                      href: 'https://mauro-zibanee.vercel.app/#projetos',
                      label: 'Portfolio',
                      useFill: false
                    },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110 shadow-xl text-gray-800"
                      aria-label={social.label}
                    >
                      {social.useFill ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          {social.icon}
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {social.icon}
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Icon with blue gradient - top left */}
            <div className="absolute top-6 left-6 z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-xl flex items-center justify-center text-white shadow-xl" style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-8 relative -mt-4">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-secondary-light transition-colors duration-300">
                {t('team.ceo.name')}
              </h3>
              <p className="text-secondary-light font-semibold mb-4 text-lg">
                {t('team.ceo.role')}
              </p>
              <p className="text-secondary-light leading-relaxed text-sm">
                {t('team.ceo.bio')}
              </p>
            </div>
          </div>

          {/* Enhanced Marketing Leader Card */}
          <div className={`group relative bg-primary-dark/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-secondary/20 hover:border-secondary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-secondary/30 ${isVisible ? 'animate-slide-up-fade animate-fade-in-scale' : 'opacity-0'}`} style={{ animationDelay: '0.5s', boxShadow: '0 4px 25px rgba(59, 130, 246, 0.15)' }}>
            {/* Marketing Leader Photo */}
            <div className="relative h-64 bg-gradient-to-br from-primary to-secondary overflow-hidden">
              <Image
                src="/images/Daniel.PNG"
                alt={t('team.marketing.name')}
                fill
                className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                priority
                quality={90}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-br from-secondary to-secondary-light backdrop-blur-md rounded-full px-5 py-2 z-10 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-white text-sm font-bold">MARKETING</span>
              </div>

              {/* Social links overlay on hover */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div className="flex gap-3">
                  {[
                    {
                      icon: (
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      ),
                      href: 'https://www.linkedin.com/in/daniel-francisco-vilanculo-3751a0353/',
                      label: 'LinkedIn',
                      useFill: true
                    },
                    {
                      icon: (
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      ),
                      href: 'https://www.youtube.com/@OlharCotidiano',
                      label: 'YouTube',
                      useFill: true,
                      hoverColor: 'hover:bg-red-600'
                    },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center ${social.hoverColor || 'hover:bg-secondary'} hover:text-white transition-all duration-300 hover:scale-110 shadow-xl text-gray-800`}
                      aria-label={social.label}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        {social.icon}
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Icon with blue gradient - top left */}
            <div className="absolute top-6 left-6 z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-light via-secondary to-primary rounded-xl flex items-center justify-center text-white shadow-xl" style={{ boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-8 relative -mt-4">
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-secondary-light transition-colors duration-300">
                {t('team.marketing.name')}
              </h3>
              <p className="text-secondary-light font-semibold mb-4 text-lg">
                {t('team.marketing.role')}
              </p>
              <p className="text-secondary-light leading-relaxed text-sm">
                {t('team.marketing.bio')}
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Additional Info */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-slide-up-fade' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
          <p className="text-gray-200 mb-6 text-lg md:text-xl">
            {language === 'pt' 
              ? 'Estamos sempre à procura de pessoas talentosas para se juntarem à nossa equipa em crescimento.'
              : 'We\'re always looking for talented individuals to join our growing team.'}
          </p>
          <a href="#contact" className="btn-primary text-lg px-8 py-4 group shadow-xl hover:shadow-2xl hover:shadow-secondary/40 animate-bounce-in" style={{ animationDelay: '0.8s' }}>
            <span className="font-semibold">{t('team.join')}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
