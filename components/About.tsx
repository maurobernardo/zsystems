'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
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
    <section
      ref={sectionRef}
      id="about"
      className="bg-gradient-to-b from-primary via-primary-dark to-primary section-padding relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="scroll-reveal animate-slide-in-blur grid md:grid-cols-2 gap-10 items-start">
            {/* Image card */}
            <div className="relative">
              <div className="rounded-[34px] border border-white/15 bg-primary-dark/40 backdrop-blur-md shadow-2xl overflow-hidden">
                <div className="relative h-[320px] sm:h-[380px] md:h-[520px]">
                  <Image
                    src="/images/about4.png"
                    alt={language === 'pt' ? 'Tecnologia e transformação digital' : 'Technology and digital transformation'}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/55 via-primary/10 to-transparent" />
                </div>
              </div>

              <div className="absolute -bottom-5 left-7">
                <div className="inline-flex items-center rounded-full bg-secondary text-white text-[11px] font-bold px-4 py-2 shadow-lg tracking-widest">
                  <span>{language === 'pt' ? 'DESDE 2026' : 'SINCE 2026'}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="pt-4 md:pt-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="h-[2px] w-10 bg-secondary" />
                <span className="text-[11px] font-bold tracking-[0.35em] text-secondary-light uppercase">
                  {language === 'pt' ? 'Sobre Nós' : 'About Us'}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-white via-secondary-light to-white bg-clip-text text-transparent animate-gradient">
                  {language === 'pt' ? 'Quem Somos e o Que Fazemos' : 'Who We Are and What We Do'}
                </span>
              </h2>

              <p className="mt-4 text-gray-200 text-base md:text-lg leading-relaxed max-w-xl">
                {t('about.description')}
              </p>

              <ul className="mt-6 space-y-3 text-gray-200 text-sm md:text-base max-w-xl">
                {[
                  language === 'pt'
                    ? 'Parceiro estratégico para o desenvolvimento tecnológico e digital das empresas.'
                    : 'Strategic partner for technological and digital development.',
                  language === 'pt'
                    ? 'Soluções completas: consultoria, design e desenvolvimento de software.'
                    : 'Complete solutions: consulting, design and software development.',
                  language === 'pt'
                    ? 'Foco em resultados: sistemas rápidos, seguros e fáceis de usar.'
                    : 'Results-focused: fast, secure and easy-to-use systems.',
                ].map((txt) => (
                  <li key={txt} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full border border-secondary/40 bg-secondary/15 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3.5 h-3.5 text-secondary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{txt}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#services"
                className="btn-primary mt-7 px-6 py-3"
              >
                <span>{language === 'pt' ? 'Saber mais' : 'Learn more'}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
