'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

const SCROLL_THRESHOLD = 60
const SECTION_IDS = ['home', 'about', 'team', 'services', 'projects', 'contact'] as const

type SectionId = (typeof SECTION_IDS)[number]

const NAV_ICONS: Record<SectionId, JSX.Element> = {
  home: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  about: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  team: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  services: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  projects: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  contact: (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const { language, setLanguage } = useLanguage()
  const t = (key: string) => getTranslation(language, key)

  /* ── Scroll progress + isScrolled ────────────────────────────────── */
  useEffect(() => {
    const computeProgress = () => {
      const last = document.getElementById(SECTION_IDS[SECTION_IDS.length - 1])
      const maxScroll = last
        ? Math.max(1, last.offsetTop + last.offsetHeight - window.innerHeight)
        : Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(Math.min(1, Math.max(0, window.scrollY / maxScroll)))
    }
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
      computeProgress()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', computeProgress)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeProgress)
    }
  }, [])

  /* ── Active section ───────────────────────────────────────────────── */
  useEffect(() => {
    const detect = () => {
      const offset = 80
      let current: SectionId = 'home'
      let closest = Infinity
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top - offset)
        if (rect.bottom > offset && rect.top < window.innerHeight && dist < closest) {
          closest = dist
          current = id
        }
      })
      setActiveSection(current)
    }
    detect()
    window.addEventListener('scroll', detect, { passive: true })
    window.addEventListener('resize', detect)
    return () => {
      window.removeEventListener('scroll', detect)
      window.removeEventListener('resize', detect)
    }
  }, [])

  const forceSolid = isMenuOpen
  const isTransparent = !isScrolled && !forceSolid

  return (
    <>
      {/* ── Injected styles ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&display=swap');

        @keyframes hdrFadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hdrGrad {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes hdrPulse {
          0%,100% { opacity: .5; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.15); }
        }
        @keyframes mobileSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hdr-root {
          animation: hdrFadeDown 0.6s cubic-bezier(.22,1,.36,1) both;
        }

        /* pill nav link */
        .hdr-link {
          position: relative;
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 12px; border-radius: 100px;
          font-size: 13px; font-weight: 500; letter-spacing: .01em;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color .2s, background .2s;
          white-space: nowrap;
        }
        .hdr-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.07);
        }
        .hdr-link.active {
          color: #fff;
          background: rgba(99,200,255,0.12);
        }
        /* active dot */
        .hdr-link.active::after {
          content: '';
          position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
          width: 4px; height: 4px; border-radius: 50%;
          background: #63C8FF;
          box-shadow: 0 0 6px #63C8FF;
          animation: hdrPulse 2s ease-in-out infinite;
        }

        /* CTA button */
        .hdr-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 8px 18px; border-radius: 100px;
          font-size: 13px; font-weight: 500; letter-spacing: .02em;
          color: #020408; text-decoration: none;
          background: linear-gradient(135deg, #63C8FF, #A78BFA, #F472B6);
          background-size: 200% 200%;
          animation: hdrGrad 4s linear infinite;
          box-shadow: 0 0 20px rgba(99,200,255,.25);
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .hdr-cta:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 0 36px rgba(99,200,255,.45);
        }

        /* Lang buttons */
        .hdr-lang {
          padding: 4px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 500; letter-spacing: .05em;
          background: transparent; border: none; cursor: pointer;
          color: rgba(255,255,255,.5);
          transition: color .2s, background .2s;
        }
        .hdr-lang:hover { color: #fff; background: rgba(255,255,255,.06); }
        .hdr-lang.active {
          color: #fff;
          background: linear-gradient(135deg, #63C8FF, #A78BFA);
          background-size: 200% 200%;
          animation: hdrGrad 4s linear infinite;
        }

        /* mobile menu */
        .hdr-mobile-menu {
          animation: mobileSlide .25s cubic-bezier(.22,1,.36,1) both;
        }

        .hdr-mobile-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,.75);
          text-decoration: none;
          transition: color .2s, background .2s;
        }
        .hdr-mobile-link:hover, .hdr-mobile-link.active {
          color: #fff;
          background: rgba(99,200,255,.1);
        }

        /* hamburger lines */
        .hdr-ham span {
          display: block; width: 22px; height: 1.5px;
          background: rgba(255,255,255,.85);
          border-radius: 2px;
          transition: transform .3s, opacity .3s;
          transform-origin: center;
        }
        .hdr-ham.open span:nth-child(1) { transform: translateY(5px) rotate(45deg); }
        .hdr-ham.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hdr-ham.open span:nth-child(3) { transform: translateY(-5px) rotate(-45deg); }

        /* Responsive — hamburger APENAS em mobile */
        @media (min-width: 768px) {
          .hdr-ham { display: none !important; }
        }
        @media (max-width: 767px) {
          .hdr-nav-pills { display: none !important; }
          .hdr-right-desktop { display: none !important; }
        }
      `}</style>

      {/* ── Nav bar ─────────────────────────────────────────────────── */}
      <nav
        className="hdr-root sticky top-0 left-0 right-0 z-50"
        style={{
          /* glass when scrolled, fully transparent on top */
          background: isTransparent
            ? 'transparent'
            : 'rgba(2, 4, 8, 0.72)',
          backdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: isTransparent ? 'none' : 'blur(20px) saturate(160%)',
          borderBottom: isTransparent
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid rgba(99,200,255,0.1)',
          boxShadow: isTransparent ? 'none' : '0 0 40px rgba(0,0,0,0.5)',
          transition: 'background .4s, backdrop-filter .4s, border-color .4s, box-shadow .4s',
        }}
      >
        {/* Scroll progress bar */}
        <div
          aria-hidden
          style={{
            position: 'absolute', top: 0, left: 0, height: 2,
            width: `${Math.round(scrollProgress * 1000) / 10}%`,
            background: 'linear-gradient(90deg, #63C8FF, #A78BFA, #F472B6)',
            backgroundSize: '200% 200%',
            animation: 'hdrGrad 4s linear infinite',
            borderRadius: '0 2px 2px 0',
            transition: 'width .15s ease-out',
            zIndex: 2,
          }}
        />

        {/* Subtle ambient glow when scrolled */}
        {isScrolled && (
          <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
            <div style={{
              position: 'absolute', top: -40, right: '20%',
              width: 200, height: 80,
              background: 'radial-gradient(ellipse, rgba(99,200,255,0.07) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />
            <div style={{
              position: 'absolute', top: -40, left: '30%',
              width: 160, height: 60,
              background: 'radial-gradient(ellipse, rgba(167,139,250,0.06) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }} />
          </div>
        )}

        {/* ── Inner ─────────────────────────────────────────────────── */}
        <div
          className="container-custom"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>

            {/* Logo */}
            <Link href="/" aria-label="Z-Systems Home" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{
                width: 40, height: 40, position: 'relative', overflow: 'hidden',
                borderRadius: 10,
                border: '1px solid rgba(99,200,255,0.2)',
                background: 'rgba(99,200,255,0.06)',
                backdropFilter: 'blur(8px)',
                transition: 'transform .3s, box-shadow .3s',
                flexShrink: 0,
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08) rotate(3deg)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 20px rgba(99,200,255,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = ''
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = ''
                }}
              >
                <Logo fill priority sizes="40px" className="object-contain scale-[1.55]" />
              </div>
              {/* Company wordmark */}
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #fff 40%, rgba(99,200,255,0.8) 100%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Z-Systems
              </span>
            </Link>

            {/* ── Desktop nav pills ──────────────────────────────── */}
            <div
              className="hidden md:flex hdr-nav-pills"
              style={{
                alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 100,
                padding: '4px 6px',
                backdropFilter: 'blur(12px)',
                margin: '0 auto',
              }}
            >
              {SECTION_IDS.map((id) => (
                <Link
                  key={id}
                  href={`/#${id}`}
                  className={`hdr-link${activeSection === id ? ' active' : ''}`}
                >
                  {NAV_ICONS[id]}
                  {t(`header.${id}`)}
                </Link>
              ))}
            </div>

            {/* ── Right side: lang + CTA ─────────────────────────── */}
            <div className="hidden md:flex hdr-right-desktop" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {/* Language pill */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 2,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 100, padding: '3px 4px',
                backdropFilter: 'blur(12px)',
              }}>
                {(['en', 'pt'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`hdr-lang${language === lang ? ' active' : ''}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <Link href="/#contact" className="hdr-cta">
                <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('header.callUs')}
              </Link>
            </div>

            {/* ── Hamburger — APENAS mobile (md:hidden garante ocultação em ≥768px) ── */}
            <button
              className={`hdr-ham${isMenuOpen ? ' open' : ''}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              style={{
                flexDirection: 'column', gap: 4,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '8px 10px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                /* Mobile-first: visible por defeito, escondido em ≥768px via media query */
                display: 'flex',
              }}
            >
              <span /><span /><span />
            </button>
          </div>

          {/* ── Mobile menu ───────────────────────────────────────── */}
          {isMenuOpen && (
            <div
              className="hdr-mobile-menu md:hidden"
              style={{
                paddingBottom: 16, marginBottom: 4,
                borderTop: '1px solid rgba(255,255,255,0.07)',
                paddingTop: 12,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {SECTION_IDS.map((id) => (
                  <Link
                    key={id}
                    href={`/#${id}`}
                    className={`hdr-mobile-link${activeSection === id ? ' active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {NAV_ICONS[id]}
                    {t(`header.${id}`)}
                    {activeSection === id && (
                      <span style={{
                        marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                        background: '#63C8FF', boxShadow: '0 0 6px #63C8FF', flexShrink: 0,
                      }} />
                    )}
                  </Link>
                ))}

                {/* Mobile lang + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 100, padding: '3px 4px',
                  }}>
                    {(['en', 'pt'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`hdr-lang${language === lang ? ' active' : ''}`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <Link href="/#contact" className="hdr-cta" onClick={() => setIsMenuOpen(false)}>
                    {t('header.callUs')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}