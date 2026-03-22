'use client'

import { useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Social data ────────────────────────────────────────────────────────── */
const SOCIALS = [
  {
    label: 'Facebook', hue: 220,
    href: 'https://www.facebook.com/share/1891R3wjg9/?mibextid=wwXIfr',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    label: 'Instagram', hue: 330,
    href: 'https://www.instagram.com/zsystems9?igsh=ZTB3ZGp5dzlncXYy',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'LinkedIn', hue: 210,
    href: 'https://www.linkedin.com/company/z-systemss/',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'TikTok', hue: 180,
    href: 'https://www.tiktok.com/@zsystems9?_r=1&_t=ZS-94h5nvPPifF',
    path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z',
  },
]

const NAV_IDS = ['home', 'about', 'team', 'services', 'projects', 'contact'] as const

/* ─── Social button ─────────────────────────────────────────────────────── */
function SocialBtn({ s }: { s: typeof SOCIALS[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
      className="ft-social"
      style={{
        borderColor: `hsla(${s.hue},70%,60%,${hov ? 0.5 : 0.14})`,
        background: hov ? `hsla(${s.hue},70%,50%,0.15)` : 'rgba(255,255,255,0.04)',
        color: hov ? `hsla(${s.hue},90%,72%,1)` : 'rgba(255,255,255,0.4)',
        boxShadow: hov ? `0 0 16px hsla(${s.hue},80%,55%,0.25)` : 'none',
        transform: hov ? 'translateY(-3px) scale(1.1)' : 'scale(1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d={s.path} />
      </svg>
    </a>
  )
}

/* ─── Nav link ───────────────────────────────────────────────────────────── */
function NavLink({ href, label }: { href: string; label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <li>
      <Link
        href={href}
        className="ft-nav-link"
        style={{ color: hov ? '#fff' : 'rgba(255,255,255,0.42)' }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        <span style={{
          display: 'inline-block', fontSize: 11,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateX(0)' : 'translateX(-6px)',
          color: '#63C8FF',
          transition: 'all .2s',
        }}>→</span>
        {label}
      </Link>
    </li>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Footer() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const ispt = language === 'pt'
  const year = new Date().getFullYear()

  const contactItems = [
    {
      hue: 145,
      value: 'Ponta-Gea, Beira, Moçambique',
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      hue: 195, href: 'tel:+258870107006', value: '+258 87 010 7006',
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    },
    {
      hue: 265, hrefPrefix: 'mailto:', valueKey: 'header.email',
      icon: <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        @keyframes ftGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes ftPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes ftShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes ftOrbMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px)} }
        @keyframes ftFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

        .ft-root {
          position:relative; overflow:hidden;
          background:#020408;
          border-top:1px solid rgba(99,200,255,0.07);
          font-family:'DM Sans',sans-serif;
        }
        .ft-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.022) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 90% 100% at 50% 100%, black 0%, transparent 70%);
          -webkit-mask-image:radial-gradient(ellipse 90% 100% at 50% 100%, black 0%, transparent 70%);
        }
        .ft-orb {
          position:absolute; border-radius:50%; filter:blur(80px);
          pointer-events:none; animation:ftOrbMove 14s ease-in-out infinite;
        }
        .ft-top-shine {
          position:absolute; top:0; left:5%; right:5%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(99,200,255,0.5),rgba(167,139,250,0.45),rgba(244,114,182,0.35),transparent);
          background-size:200% 100%;
          animation:ftShimmer 5s linear infinite;
        }

        .ft-inner { max-width:1200px; margin:0 auto; padding:60px 24px 0; }

        .ft-maingrid {
          display:grid;
          grid-template-columns:1.35fr 1fr 1fr;
          gap:48px; margin-bottom:52px;
        }
        @media(max-width:860px){ .ft-maingrid { grid-template-columns:1fr 1fr; } }
        @media(max-width:540px){ .ft-maingrid { grid-template-columns:1fr; gap:32px; } }

        /* brand */
        .ft-logo-link { display:flex; align-items:center; gap:11px; text-decoration:none; margin-bottom:16px; width:fit-content; }
        .ft-logo-box {
          width:42px; height:42px; position:relative; overflow:hidden;
          border-radius:11px;
          background:rgba(99,200,255,0.06);
          border:1px solid rgba(99,200,255,0.18);
          flex-shrink:0;
          transition:transform .3s, box-shadow .3s;
        }
        .ft-logo-box:hover { transform:scale(1.08) rotate(3deg); box-shadow:0 0 18px rgba(99,200,255,0.3); }
        .ft-wordmark {
          font-family:'Syne',sans-serif; font-size:17px; font-weight:800;
          letter-spacing:-.02em;
          background:linear-gradient(135deg,#fff 40%,rgba(99,200,255,0.8) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .ft-status {
          display:inline-flex; align-items:center; gap:7px;
          padding:4px 12px; border-radius:100px; margin-bottom:16px;
          border:1px solid rgba(74,222,128,0.25);
          background:rgba(74,222,128,0.06);
          font-size:11px; font-weight:600; letter-spacing:.1em;
          text-transform:uppercase; color:rgba(134,239,172,0.9);
        }
        .ft-status-dot {
          width:6px; height:6px; border-radius:50%;
          background:#4ade80; box-shadow:0 0 6px #4ade80;
          animation:ftPulse 2s ease-in-out infinite;
        }
        .ft-desc { font-size:13px; color:rgba(255,255,255,.4); line-height:1.75; margin-bottom:20px; font-weight:300; }
        .ft-socials { display:flex; gap:9px; flex-wrap:wrap; }
        .ft-social {
          width:38px; height:38px; border-radius:11px;
          display:flex; align-items:center; justify-content:center;
          border-width:1px; border-style:solid; text-decoration:none;
          transition:all .25s cubic-bezier(.22,1,.36,1);
        }

        /* col header */
        .ft-col-title {
          font-family:'Syne',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; color:#63C8FF;
          margin-bottom:18px;
          display:flex; align-items:center; gap:8px;
        }
        .ft-title-line { height:1px; width:18px; background:linear-gradient(90deg,#63C8FF,transparent); border-radius:1px; }

        /* nav */
        .ft-nav-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:9px; }
        .ft-nav-link { display:inline-flex; align-items:center; gap:7px; font-size:13px; text-decoration:none; transition:color .2s; }

        /* contact */
        .ft-contact-list { display:flex; flex-direction:column; gap:10px; }
        .ft-ci {
          display:flex; align-items:flex-start; gap:10px;
          text-decoration:none; transition:transform .2s;
        }
        .ft-ci:hover { transform:translateX(3px); }
        .ft-ci-icon {
          width:30px; height:30px; border-radius:9px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:transform .25s;
        }
        .ft-ci:hover .ft-ci-icon { transform:scale(1.12); }
        .ft-ci-val { font-size:12px; color:rgba(255,255,255,.5); line-height:1.5; padding-top:5px; transition:color .2s; }
        .ft-ci:hover .ft-ci-val { color:#fff; }

        /* ── Interactive map ── */
        .ft-map-wrap {
          display:block; position:relative;
          margin-top:16px; border-radius:14px; overflow:hidden;
          border:1px solid rgba(99,200,255,.15);
          height:130px;
          transition:border-color .3s, box-shadow .3s;
          text-decoration:none;
        }
        .ft-map-wrap:hover {
          border-color:rgba(99,200,255,.4);
          box-shadow:0 0 20px rgba(99,200,255,.12);
        }
        .ft-map-iframe {
          width:100%; height:100%; border:0;
          filter:invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.85);
          pointer-events:none;
          display:block;
        }
        .ft-map-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(2,4,8,.75) 0%, transparent 50%);
          display:flex; align-items:flex-end; padding:10px 12px;
        }
        .ft-map-pin {
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 10px; border-radius:100px;
          background:rgba(2,4,8,.8); backdrop-filter:blur(8px);
          border:1px solid rgba(99,200,255,.25);
          font-size:11px; font-weight:500; color:#63C8FF;
          white-space:nowrap;
        }

        /* divider */
        .ft-div {
          height:1px; max-width:1200px; margin:0 auto;
          background:linear-gradient(90deg,transparent,rgba(99,200,255,0.2),rgba(167,139,250,0.15),transparent);
          background-size:200% 100%;
          animation:ftShimmer 6s linear infinite;
        }

        /* bottom */
        .ft-bottom {
          max-width:1200px; margin:0 auto;
          padding:18px 24px 26px;
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:10px;
        }
        .ft-copy { font-size:12px; color:rgba(255,255,255,.32); }
        .ft-copy strong { color:#63C8FF; font-weight:600; }
        .ft-legal { display:flex; gap:18px; }
        .ft-ll {
          font-size:12px; color:rgba(255,255,255,.28); text-decoration:none;
          position:relative; transition:color .2s;
        }
        .ft-ll::after {
          content:''; position:absolute; bottom:-1px; left:0; right:0;
          height:1px; background:#63C8FF;
          transform:scaleX(0); transition:transform .2s; transform-origin:left;
        }
        .ft-ll:hover { color:rgba(255,255,255,.65); }
        .ft-ll:hover::after { transform:scaleX(1); }
        .ft-top-btn {
          width:34px; height:34px; border-radius:10px;
          background:rgba(99,200,255,.07); border:1px solid rgba(99,200,255,.2);
          display:flex; align-items:center; justify-content:center;
          color:#63C8FF; text-decoration:none;
          transition:all .25s; animation:ftFloat 3s ease-in-out infinite;
        }
        .ft-top-btn:hover {
          background:rgba(99,200,255,.14); border-color:rgba(99,200,255,.4);
          box-shadow:0 0 14px rgba(99,200,255,.22); transform:translateY(-3px);
        }
      `}</style>

      <footer className="ft-root">
        <div className="ft-top-shine" aria-hidden />
        <div className="ft-grid-bg" aria-hidden />
        <div className="ft-orb" aria-hidden style={{ width:380, height:380, top:'-18%', right:'-4%', background:'radial-gradient(circle,rgba(99,200,255,.06) 0%,transparent 65%)' }} />
        <div className="ft-orb" aria-hidden style={{ width:280, height:280, bottom:'0', left:'-3%', background:'radial-gradient(circle,rgba(167,139,250,.05) 0%,transparent 65%)', animationDelay:'6s' }} />

        <div className="ft-inner">
          <div className="ft-maingrid">

            {/* Brand */}
            <div>
              <Link href="/#home" className="ft-logo-link">
                <div className="ft-logo-box">
                  <Logo fill sizes="42px" className="object-contain scale-[1.55]" />
                </div>
                <span className="ft-wordmark">Z-Systems</span>
              </Link>

              <div className="ft-status">
                <span className="ft-status-dot" />
                {ispt ? 'Disponível para projectos' : 'Available for projects'}
              </div>

              <p className="ft-desc">{t('footer.description')}</p>

              <div className="ft-socials">
                {SOCIALS.map((s) => <SocialBtn key={s.label} s={s} />)}
              </div>
            </div>

            {/* Nav */}
            <div>
              <div className="ft-col-title">
                <div className="ft-title-line" />
                {t('footer.quickLinks')}
              </div>
              <ul className="ft-nav-list">
                {NAV_IDS.map((id) => (
                  <NavLink key={id} href={`/#${id}`} label={t(`header.${id}`)} />
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="ft-col-title">
                <div className="ft-title-line" />
                {t('footer.contact')}
              </div>
              <div className="ft-contact-list">
                {contactItems.map((item, i) => {
                  const val = item.valueKey ? t(item.valueKey) : (item.value ?? '')
                  const href = item.href ?? (item.hrefPrefix ? `${item.hrefPrefix}${val}` : undefined)
                  const Tag = href ? 'a' : 'div'
                  return (
                    <Tag
                      key={i}
                      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="ft-ci"
                    >
                      <div className="ft-ci-icon" style={{
                        background: `hsla(${item.hue},80%,50%,0.1)`,
                        border: `1px solid hsla(${item.hue},70%,60%,0.2)`,
                        color: `hsla(${item.hue},85%,70%,1)`,
                      }}>
                        {item.icon}
                      </div>
                      <span className="ft-ci-val">{val}</span>
                    </Tag>
                  )
                })}
              </div>

              {/* ── Interactive Map ── */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=Ponta+Gea,+Beira,+Mo%C3%A7ambique"
                target="_blank"
                rel="noopener noreferrer"
                className="ft-map-wrap"
                aria-label={ispt ? 'Ver no Google Maps' : 'View on Google Maps'}
              >
                {/* OpenStreetMap embed — no API key needed */}
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=34.82%2C-19.86%2C34.86%2C-19.82&layer=mapnik&marker=-19.8436%2C34.8389"
                  className="ft-map-iframe"
                  loading="lazy"
                  title="Z-Systems location"
                  aria-hidden="true"
                />
                {/* Overlay with label */}
                <div className="ft-map-overlay">
                  <div className="ft-map-pin">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{ispt ? 'Ponta-Gea, Beira · Ver no Maps →' : 'Ponta-Gea, Beira · Open in Maps →'}</span>
                  </div>
                </div>
              </a>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div style={{ padding: '0 24px' }}>
          <div className="ft-div" />
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copy">
            © {year} <strong>Z-Systems</strong>. {t('footer.rights')}
          </p>
          <div className="ft-legal">
            <a href="#" className="ft-ll">{t('footer.privacy')}</a>
            <a href="#" className="ft-ll">{t('footer.terms')}</a>
          </div>
          <a href="#home" className="ft-top-btn" aria-label={ispt ? 'Topo' : 'Back to top'}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </a>
        </div>
      </footer>
    </>
  )
}