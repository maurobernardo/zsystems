'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Social {
  href: string
  label: string
  fill?: boolean
  path: string
  hoverColor?: string
}

interface Member {
  key: string
  image: string
  badge: string
  roleIcon: JSX.Element
  socials: Social[]
  accentHue: number
}

/* ─── Role Icons ─────────────────────────────────────────────────────────── */
const ICON_CEO = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const ICON_MARKETING = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
)
const ICON_DESIGN = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
)
const ICON_DEV = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

/* ─── Social icon paths ──────────────────────────────────────────────────── */
const PATH_LINKEDIN = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
const PATH_GITHUB = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
const PATH_INSTAGRAM = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
const PATH_YOUTUBE = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
const PATH_PORTFOLIO = 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'

/* ─── Member data ────────────────────────────────────────────────────────── */
const MEMBERS: Member[] = [
  {
    key: 'ceo',
    image: '/images/Ceo.PNG',
    badge: 'CEO',
    roleIcon: ICON_CEO,
    accentHue: 195,
    socials: [
      { href: 'https://github.com/maurobernardo', label: 'GitHub', fill: true, path: PATH_GITHUB },
      { href: 'https://www.linkedin.com/in/mauro-bernardo-zibane-5619b427a/', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://mauro-zibanee.vercel.app/#projetos', label: 'Portfolio', fill: false, path: PATH_PORTFOLIO },
    ],
  },
  {
    key: 'marketing',
    image: '/images/Daniel.PNG',
    badge: 'MARKETING',
    roleIcon: ICON_MARKETING,
    accentHue: 265,
    socials: [
      { href: 'https://www.linkedin.com/in/daniel-francisco-vilanculo-3751a0353/', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://www.youtube.com/@OlharCotidiano', label: 'YouTube', fill: true, path: PATH_YOUTUBE, hoverColor: '#ef4444' },
    ],
  },
  {
    key: 'designer',
    image: '/images/Vandro.jpeg',
    badge: 'UX/UI',
    roleIcon: ICON_DESIGN,
    accentHue: 330,
    socials: [
      { href: '#', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: '#', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
    ],
  },
  {
    key: 'developer1',
    image: '/images/Frank.jpeg',
    badge: 'DEV',
    roleIcon: ICON_DEV,
    accentHue: 145,
    socials: [
      { href: 'https://www.linkedin.com/in/frank-walter-simbine-94833a339', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://www.instagram.com/frank_walter_9', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
    ],
  },
  {
    key: 'developer2',
    image: '/images/Helton.jpeg',
    badge: 'DEV',
    roleIcon: ICON_DEV,
    accentHue: 45,
    socials: [
      { href: 'https://www.instagram.com/heltoncjr', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
    ],
  },
]

/* ─── Member Card ────────────────────────────────────────────────────────── */
function MemberCard({ member, delay, t }: { member: Member; delay: number; t: (k: string) => string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: dy * -6, y: dx * 6 })
  }

  const handleMouseLeave = () => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      className="tm-card"
      style={{
        animationDelay: `${delay}ms`,
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 8 : 0}px)`,
        transition: hovered ? 'transform .1s ease-out' : 'transform .5s cubic-bezier(.22,1,.36,1)',
        '--accent-hue': member.accentHue,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow border */}
      <div className="tm-card-glow" style={{
        opacity: hovered ? 1 : 0,
        background: `radial-gradient(circle at 50% 0%, hsla(${member.accentHue},90%,65%,0.35) 0%, transparent 70%)`,
      }} />

      {/* Photo area */}
      <div className="tm-photo-wrap">
        <Image
          src={member.image}
          alt={t(`team.${member.key}.name`)}
          fill
          className="tm-photo"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          priority
          quality={90}
        />

        {/* Gradient overlay */}
        <div className="tm-photo-overlay" style={{ opacity: hovered ? 1 : 0 }} />

        {/* Corner accents */}
        <div className="tm-corner tm-tl" style={{ borderColor: `hsla(${member.accentHue},90%,65%,0.8)` }} />
        <div className="tm-corner tm-tr" style={{ borderColor: `hsla(${member.accentHue},90%,65%,0.8)` }} />
        <div className="tm-corner tm-bl" style={{ borderColor: `hsla(${member.accentHue},90%,65%,0.8)` }} />
        <div className="tm-corner tm-br" style={{ borderColor: `hsla(${member.accentHue},90%,65%,0.8)` }} />

        {/* Badge */}
        <div className="tm-badge" style={{
          background: `linear-gradient(135deg, hsla(${member.accentHue},90%,60%,1), hsla(${member.accentHue + 40},80%,65%,1))`,
          boxShadow: `0 4px 16px hsla(${member.accentHue},80%,55%,0.4)`,
        }}>
          {member.badge}
        </div>

        {/* Role icon pill — top left */}
        <div className="tm-role-icon" style={{
          background: `rgba(2,4,8,0.7)`,
          border: `1px solid hsla(${member.accentHue},80%,60%,0.3)`,
          color: `hsla(${member.accentHue},90%,70%,1)`,
        }}>
          {member.roleIcon}
        </div>

        {/* Social links */}
        <div className="tm-socials" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(10px)' }}>
          {member.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="tm-social-btn"
              style={{ '--hover-bg': s.hoverColor ?? 'rgba(99,200,255,0.9)' } as React.CSSProperties}
            >
              <svg width="16" height="16" fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth={s.fill ? undefined : 2} strokeLinecap={s.fill ? undefined : 'round'} strokeLinejoin={s.fill ? undefined : 'round'} viewBox="0 0 24 24">
                <path d={s.path} />
              </svg>
            </a>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="tm-content">
        {/* Shimmer line */}
        <div className="tm-shimmer" style={{
          background: `linear-gradient(90deg, transparent, hsla(${member.accentHue},80%,65%,0.5), transparent)`,
        }} />

        <h3 className="tm-name">{t(`team.${member.key}.name`)}</h3>
        <p className="tm-role" style={{ color: `hsla(${member.accentHue},80%,72%,1)` }}>
          {t(`team.${member.key}.role`)}
        </p>
        <p className="tm-bio">{t(`team.${member.key}.bio`)}</p>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Team() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const ispt = language === 'pt'

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0.08 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes tmFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tmGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes tmPulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes tmShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes tmFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes tmOrbMove { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.15) translate(20px,-15px)} }
        @keyframes tmSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes tmReveal  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        /* ── Section ── */
        .tm-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .tm-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,200,255,.03) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .tm-orb {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:tmOrbMove 10s ease-in-out infinite;
        }

        /* ── Header ── */
        .tm-header {
          text-align:center; max-width:680px; margin:0 auto 64px;
          opacity:0;
        }
        .tm-header.visible { animation:tmReveal .9s cubic-bezier(.22,1,.36,1) forwards; }

        .tm-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06);
          backdrop-filter:blur(10px);
        }
        .tm-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:tmPulse 2s ease-in-out infinite;
        }
        .tm-pill-text {
          font-size:11px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }
        .tm-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:tmGrad 8s linear infinite;
        }
        .tm-subtitle {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
        }

        /* ── Grid layouts ── */
        .tm-grid-3 {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:24px; max-width:1100px;
          margin:0 auto 24px;
        }
        .tm-grid-2 {
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:24px;
        }

        /* ── Card ── */
        .tm-card {
          position:relative;
          border-radius:24px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          overflow:hidden;
          cursor:default;
          transform-style:preserve-3d;
          opacity:0;
        }
        .tm-card.visible { animation:tmReveal .8s cubic-bezier(.22,1,.36,1) forwards; }

        .tm-card-glow {
          position:absolute; inset:-1px; border-radius:24px;
          pointer-events:none; z-index:0;
          transition:opacity .4s;
        }

        /* ── Photo ── */
        .tm-photo-wrap {
          position:relative; height:260px; overflow:hidden;
        }
        .tm-photo {
          object-fit:cover; object-position:top center;
          transition:transform .6s cubic-bezier(.22,1,.36,1) !important;
        }
        .tm-photo-overlay {
          position:absolute; inset:0; z-index:2;
          background:linear-gradient(to top, rgba(2,4,8,.85) 0%, rgba(2,4,8,.1) 55%, transparent 100%);
          transition:opacity .4s;
        }

        /* corner accents */
        .tm-corner {
          position:absolute; width:18px; height:18px;
          pointer-events:none; z-index:4;
          border-width:1.5px; border-style:solid;
        }
        .tm-tl { top:12px; left:12px; border-right:none; border-bottom:none; border-radius:4px 0 0 0; }
        .tm-tr { top:12px; right:12px; border-left:none; border-bottom:none; border-radius:0 4px 0 0; }
        .tm-bl { bottom:12px; left:12px; border-right:none; border-top:none; border-radius:0 0 0 4px; }
        .tm-br { bottom:12px; right:12px; border-left:none; border-top:none; border-radius:0 0 4px 0; }

        /* badge */
        .tm-badge {
          position:absolute; top:14px; right:14px; z-index:5;
          font-size:10px; font-weight:700; letter-spacing:.12em;
          color:#020408; padding:4px 12px; border-radius:100px;
        }

        /* role icon */
        .tm-role-icon {
          position:absolute; top:14px; left:14px; z-index:5;
          width:36px; height:36px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(8px);
        }

        /* socials */
        .tm-socials {
          position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
          z-index:5; display:flex; gap:8px;
          transition:opacity .3s, transform .3s;
        }
        .tm-social-btn {
          width:36px; height:36px; border-radius:50%;
          background:rgba(255,255,255,.9);
          color:#020408;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, transform .2s, color .2s;
          flex-shrink:0;
        }
        .tm-social-btn:hover {
          background:var(--hover-bg, rgba(99,200,255,0.9));
          color:#fff;
          transform:scale(1.12);
        }

        /* ── Content ── */
        .tm-content { padding:20px 20px 24px; position:relative; z-index:1; }

        .tm-shimmer {
          height:1px; width:100%; border-radius:1px;
          background-size:200% 100%;
          animation:tmShimmer 3s linear infinite;
          margin-bottom:16px;
        }
        .tm-name {
          font-family:'Syne',sans-serif;
          font-size:18px; font-weight:700; color:#fff;
          margin-bottom:4px; line-height:1.2;
        }
        .tm-role {
          font-size:12px; font-weight:500; letter-spacing:.06em;
          margin-bottom:8px; text-transform:uppercase;
        }
        .tm-bio {
          font-size:13px; color:rgba(255,255,255,.5);
          line-height:1.6;
        }



        /* ── Responsive ── */
        @media(max-width:900px) {
          .tm-grid-3, .tm-grid-2 { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:600px) {
          .tm-root { padding:64px 0 80px; }
          .tm-grid-3, .tm-grid-2 { grid-template-columns:1fr; }
          .tm-photo-wrap { height:220px; }
        }
      `}</style>

      <section ref={sectionRef} id="team" className="tm-root">
        {/* Grid bg */}
        <div className="tm-grid-bg" aria-hidden />

        {/* Orbs */}
        <div className="tm-orb" aria-hidden style={{ width:500, height:500, top:'-15%', left:'-8%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="tm-orb" aria-hidden style={{ width:400, height:400, bottom:'-10%', right:'-5%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'4s' }} />
        <div className="tm-orb" aria-hidden style={{ width:300, height:300, top:'50%', right:'30%', background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay:'7s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`tm-header${visible ? ' visible' : ''}`}>
            <div className="tm-pill">
              <span className="tm-pill-dot" />
              <span className="tm-pill-text">{t('team.tagline')}</span>
            </div>
            <h2 className="tm-h2">{t('team.title')}</h2>
            <p className="tm-subtitle">{t('team.subtitle')}</p>
          </div>

          {/* Row 1 — 3 cards */}
          <div className="tm-grid-3">
            {MEMBERS.slice(0, 3).map((m, i) => (
              <MemberCard
                key={m.key}
                member={m}
                delay={i * 120}
                t={t}
              />
            ))}
          </div>

          {/* Row 2 — 2 member cards centradas */}
          <div className="tm-grid-2" style={{ maxWidth: 748, margin: '0 auto' }}>
            {MEMBERS.slice(3).map((m, i) => (
              <MemberCard
                key={m.key}
                member={m}
                delay={(i + 3) * 120}
                t={t}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Trigger visibility once in view */}
      {visible && (
        <style>{`
          .tm-card { animation: tmReveal .8s cubic-bezier(.22,1,.36,1) forwards !important; }
        `}</style>
      )}
    </>
  )
}