'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

const SCROLL_THRESHOLD = 60
const SECTION_IDS = ['home', 'about', 'team', 'services', 'projects', 'contact'] as const

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<(typeof SECTION_IDS)[number]>('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const { language, setLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  useEffect(() => {
    const computeProgress = () => {
      if (typeof window === 'undefined') return
      const last = document.getElementById(SECTION_IDS[SECTION_IDS.length - 1])
      const maxScroll = last
        ? Math.max(1, last.offsetTop + last.offsetHeight - window.innerHeight)
        : Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      setScrollProgress(p)
    }

    const handleScroll = () => {
      setIsScrolled(typeof window !== 'undefined' && window.scrollY > SCROLL_THRESHOLD)
      computeProgress()
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', computeProgress)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', computeProgress)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleActiveSection = () => {
      const headerOffset = 80
      let current: (typeof SECTION_IDS)[number] = 'home'
      let smallestDistance = Number.POSITIVE_INFINITY

      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const distance = Math.abs(rect.top - headerOffset)

        if (rect.bottom > headerOffset && rect.top < window.innerHeight && distance < smallestDistance) {
          smallestDistance = distance
          current = id
        }
      })

      setActiveSection(current)
    }

    handleActiveSection()
    window.addEventListener('scroll', handleActiveSection, { passive: true })
    window.addEventListener('resize', handleActiveSection)
    return () => {
      window.removeEventListener('scroll', handleActiveSection)
      window.removeEventListener('resize', handleActiveSection)
    }
  }, [])

  /* No mobile, com menu aberto: header sempre azul para não aparecer barra branca */
  const forceSolid = isMenuOpen
  const isTransparent = !isScrolled && !forceSolid

  const navLinkClass = (id: (typeof SECTION_IDS)[number]) =>
    `text-white transition-all duration-300 font-medium flex items-center gap-2 group relative px-2 py-2 rounded-xl hover:text-secondary-light ${
      activeSection === id ? 'text-secondary-light' : ''
    }`

  const navUnderlineClass = (id: (typeof SECTION_IDS)[number]) =>
    `absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full bg-secondary transition-all duration-300 ${
      activeSection === id ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50 group-hover:opacity-80 group-hover:scale-x-100'
    }`

  return (
    <>
      {/* Main Navigation - Transparent no topo (mostra Hero atrás), azul ao fazer scroll ou quando menu mobile aberto */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-out -mt-px pt-px border-0 outline-none ${
          isScrolled || forceSolid
            ? 'bg-primary shadow-lg backdrop-blur-md'
            : 'header-transparent'
        }`}
        style={isTransparent ? { background: 'transparent', backgroundColor: 'transparent', backgroundImage: 'none', boxShadow: 'none', border: 'none', outline: 'none' } : { border: 'none', outline: 'none' }}
        data-transparent={isTransparent}
      >
        {/* Scroll progress bar (thin, grows with scroll) */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-secondary via-secondary-light to-secondary rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${Math.round(scrollProgress * 1000) / 10}%` }}
          />
        </div>

        {isScrolled && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        )}
        <div className="container-custom relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0 group" aria-label="Z-Systems Home">
              <div className="w-10 h-10 md:w-12 md:h-12 relative overflow-hidden hover:scale-110 hover:rotate-3 transition-all duration-300">
                <Logo
                  fill
                  priority
                  sizes="(min-width: 768px) 48px, 40px"
                  className="object-contain scale-[1.55]"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Aligned more to the right */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4 ml-auto mr-6 lg:mr-12">
              <Link href="/#home" className={navLinkClass('home')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('header.home')}
                <span className={navUnderlineClass('home')} />
              </Link>
              <Link href="/#about" className={navLinkClass('about')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('header.about')}
                <span className={navUnderlineClass('about')} />
              </Link>
              <Link href="/#team" className={navLinkClass('team')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('header.team')}
                <span className={navUnderlineClass('team')} />
              </Link>
              <Link href="/#services" className={navLinkClass('services')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                {t('header.services')}
                <span className={navUnderlineClass('services')} />
              </Link>
              <Link href="/#projects" className={navLinkClass('projects')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t('header.projects')}
                <span className={navUnderlineClass('projects')} />
              </Link>
              <Link href="/#contact" className={navLinkClass('contact')}>
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('header.contact')}
                <span className={navUnderlineClass('contact')} />
              </Link>
            </div>

            {/* Language Selector & CTA - More to the right */}
            <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-1">
              {/* Language Selector */}
              <div className="flex items-center gap-2 bg-primary-dark/50 backdrop-blur-md rounded-lg p-1 shadow-lg border border-secondary/20">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                    language === 'en'
                      ? 'bg-secondary text-white shadow-md scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-primary-dark'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('pt')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
                    language === 'pt'
                      ? 'bg-secondary text-white shadow-md scale-105'
                      : 'text-gray-300 hover:text-white hover:bg-primary-dark'
                  }`}
                >
                  PT
                </button>
              </div>
              <Link href="/#contact" className="btn-primary text-sm shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{t('header.callUs')}</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white hover:text-secondary-light transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu - fundo azul (primary) para continuar visível e legível */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 pt-2 -mx-4 px-4 mt-2 rounded-b-xl bg-primary border-0">
              <div className="flex flex-col gap-4">
                <Link href="/#home" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('header.home')}
                </Link>
                <Link href="/#about" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('header.about')}
                </Link>
                <Link href="/#team" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t('header.team')}
                </Link>
                <Link href="/#services" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  {t('header.services')}
                </Link>
                <Link href="/#projects" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {t('header.projects')}
                </Link>
                <Link href="/#contact" className="text-white hover:text-secondary-light transition-colors flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('header.contact')}
                </Link>
                {/* Mobile Language Selector */}
                <div className="flex items-center gap-2 bg-primary-dark/50 backdrop-blur-md rounded-lg p-1 w-fit border border-secondary/20">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'en'
                        ? 'bg-secondary text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('pt')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      language === 'pt'
                        ? 'bg-secondary text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    PT
                  </button>
                </div>
                <Link href="/#contact" className="btn-primary text-sm w-fit" onClick={() => setIsMenuOpen(false)}>
                  {t('header.callUs')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
