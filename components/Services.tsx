'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Service areas data ─────────────────────────────────────────────────── */
const AREAS = [
  {
    key: 'webDev',
    hue: 195,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    key: 'systemsDev',
    hue: 265,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 3h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
      </svg>
    ),
  },
  {
    key: 'mobile',
    hue: 330,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'uiux',
    hue: 145,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    key: 'infra',
    hue: 45,
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 12H3a9 9 0 1018 0h-2M12 3v9m0 0l-3-3m3 3l3-3" />
      </svg>
    ),
  },
]

/* ─── Service Card ───────────────────────────────────────────────────────── */
function ServiceCard({
  area,
  items,
  title,
  delay,
  visible,
}: {
  area: (typeof AREAS)[0]
  items: string[]
  title: string
  delay: number
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -5,
      y: ((e.clientX - cx) / (rect.width / 2)) * 5,
    })
  }

  return (
    <div
      ref={cardRef}
      className="svc-card"
      style={{
        animationDelay: `${delay}ms`,
        opacity: visible ? undefined : 0,
        animation: visible ? `svcReveal .8s cubic-bezier(.22,1,.36,1) ${delay}ms forwards` : 'none',
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
        transition: hovered ? 'transform .12s ease-out' : 'transform .55s cubic-bezier(.22,1,.36,1)',
        '--hue': area.hue,
      } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Mouse-tracked spotlight */}
      <div
        className="svc-spotlight"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsla(${area.hue},90%,65%,0.12) 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Top glow border */}
      <div
        className="svc-top-glow"
        style={{
          background: `linear-gradient(90deg, transparent, hsla(${area.hue},90%,65%,0.6), transparent)`,
          opacity: hovered ? 1 : 0.25,
        }}
      />

      {/* Corner accents */}
      <div className="svc-corner svc-tl" style={{ borderColor: `hsla(${area.hue},80%,65%,${hovered ? 0.8 : 0.3})` }} />
      <div className="svc-corner svc-br" style={{ borderColor: `hsla(${area.hue},80%,65%,${hovered ? 0.8 : 0.3})` }} />

      {/* Icon */}
      <div
        className="svc-icon-wrap"
        style={{
          background: `rgba(2,4,8,0.6)`,
          border: `1px solid hsla(${area.hue},80%,60%,${hovered ? 0.5 : 0.2})`,
          color: `hsla(${area.hue},90%,72%,1)`,
          boxShadow: hovered ? `0 0 20px hsla(${area.hue},80%,60%,0.3), inset 0 0 12px hsla(${area.hue},80%,60%,0.08)` : 'none',
          transform: hovered ? 'scale(1.08) rotate(-3deg)' : 'scale(1) rotate(0deg)',
        }}
      >
        {area.icon}
        {/* Icon glow ring */}
        <div
          className="svc-icon-ring"
          style={{
            borderColor: `hsla(${area.hue},80%,65%,0.3)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>

      {/* Number badge */}
      <div
        className="svc-num"
        style={{ color: `hsla(${area.hue},80%,65%,${hovered ? 0.6 : 0.2})` }}
      >
        {String(AREAS.indexOf(area) + 1).padStart(2, '0')}
      </div>

      {/* Title */}
      <h3
        className="svc-title"
        style={{ color: hovered ? `hsla(${area.hue},90%,85%,1)` : '#fff' }}
      >
        {title}
      </h3>

      {/* Shimmer divider */}
      <div
        className="svc-divider"
        style={{
          background: `linear-gradient(90deg, transparent, hsla(${area.hue},80%,65%,0.5), transparent)`,
          backgroundSize: '200% 100%',
          opacity: hovered ? 1 : 0.4,
        }}
      />

      {/* Bullet list */}
      <ul className="svc-list">
        {items.map((item, i) => (
          <li key={i} className="svc-item">
            <span
              className="svc-bullet"
              style={{
                background: `hsla(${area.hue},80%,65%,1)`,
                boxShadow: `0 0 6px hsla(${area.hue},80%,65%,0.6)`,
              }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {/* Bottom ambient */}
      <div
        className="svc-bottom-glow"
        style={{
          background: `radial-gradient(circle, hsla(${area.hue},80%,55%,0.15) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Services() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

        @keyframes svcReveal  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes svcGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes svcPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes svcShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes svcOrbMove { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.2) translate(15px,-12px)} }
        @keyframes svcFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        /* ── Section ── */
        .svc-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .svc-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .svc-orb {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:svcOrbMove 12s ease-in-out infinite;
        }

        /* ── Header ── */
        .svc-header {
          text-align:center; max-width:680px;
          margin:0 auto 64px;
          opacity:0;
        }
        .svc-header.visible { animation:svcReveal .9s cubic-bezier(.22,1,.36,1) forwards; }

        .svc-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06);
          backdrop-filter:blur(10px);
        }
        .svc-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:svcPulse 2s ease-in-out infinite;
        }
        .svc-pill-text {
          font-size:11px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }
        .svc-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:svcGrad 8s linear infinite;
        }
        .svc-subtitle {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
        }

        /* ── Grid ── */
        .svc-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px;
          max-width:1100px;
          margin:0 auto;
        }

        /* ── Card ── */
        .svc-card {
          position:relative;
          border-radius:22px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          padding:28px 24px 32px;
          overflow:hidden;
          transform-style:preserve-3d;
          cursor:default;
        }

        .svc-spotlight {
          position:absolute; inset:0; border-radius:22px;
          pointer-events:none; z-index:0;
          transition:opacity .3s;
        }

        .svc-top-glow {
          position:absolute; top:0; left:10%; right:10%;
          height:1px; border-radius:1px;
          transition:opacity .4s;
        }

        /* corners */
        .svc-corner {
          position:absolute; width:16px; height:16px;
          border-width:1.5px; border-style:solid;
          pointer-events:none; z-index:2;
          transition:border-color .4s;
        }
        .svc-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-radius:4px 0 0 0; }
        .svc-br { bottom:14px; right:14px; border-left:none; border-top:none; border-radius:0 0 4px 0; }

        /* icon */
        .svc-icon-wrap {
          position:relative;
          width:52px; height:52px; border-radius:14px;
          display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(8px);
          transition:transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .35s;
          z-index:1; margin-bottom:20px;
        }
        .svc-icon-ring {
          position:absolute; inset:-6px; border-radius:20px;
          border:1px solid transparent;
          transition:opacity .3s;
          pointer-events:none;
        }

        /* number */
        .svc-num {
          position:absolute; top:22px; right:22px;
          font-family:'Syne',sans-serif;
          font-size:13px; font-weight:700; letter-spacing:.05em;
          transition:color .4s;
          z-index:1;
        }

        /* title */
        .svc-title {
          font-family:'Syne',sans-serif;
          font-size:18px; font-weight:700;
          line-height:1.25; margin-bottom:14px;
          transition:color .3s;
          position:relative; z-index:1;
        }

        /* divider */
        .svc-divider {
          height:1px; width:100%;
          margin-bottom:16px;
          animation:svcShimmer 4s linear infinite;
          border-radius:1px;
          transition:opacity .4s;
          position:relative; z-index:1;
        }

        /* list */
        .svc-list {
          list-style:none; padding:0; margin:0;
          display:flex; flex-direction:column; gap:9px;
          position:relative; z-index:1;
        }
        .svc-item {
          display:flex; align-items:flex-start; gap:10px;
          font-size:13px; color:rgba(255,255,255,.55);
          line-height:1.55;
        }
        .svc-bullet {
          width:5px; height:5px; border-radius:50%;
          flex-shrink:0; margin-top:6px;
          transition:box-shadow .3s;
        }

        /* bottom glow */
        .svc-bottom-glow {
          position:absolute; bottom:-30px; right:-30px;
          width:140px; height:140px; border-radius:50%;
          pointer-events:none;
          transition:opacity .4s;
        }

        /* ── 5-card layout: 3 + 2 centred ── */
        .svc-row1 { grid-template-columns:repeat(3,1fr); }
        .svc-row2 {
          grid-template-columns:repeat(2,1fr);
          max-width:728px !important;
          margin-top:20px;
        }

        @media(max-width:900px) {
          .svc-grid { grid-template-columns:repeat(2,1fr); }
          .svc-row2 { grid-template-columns:repeat(2,1fr); max-width:100% !important; }
        }
        @media(max-width:580px) {
          .svc-root { padding:64px 0 80px; }
          .svc-grid, .svc-row2 { grid-template-columns:1fr !important; max-width:100% !important; }
        }
      `}</style>

      <section ref={sectionRef} id="services" className="svc-root">
        {/* Grid bg */}
        <div className="svc-grid-bg" aria-hidden />

        {/* Orbs */}
        <div className="svc-orb" aria-hidden style={{ width:500, height:500, top:'-15%', right:'-8%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="svc-orb" aria-hidden style={{ width:400, height:400, bottom:'-10%', left:'-5%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'5s' }} />
        <div className="svc-orb" aria-hidden style={{ width:260, height:260, top:'40%', left:'42%', background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay:'9s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`svc-header${visible ? ' visible' : ''}`}>
            <div className="svc-pill">
              <span className="svc-pill-dot" />
              <span className="svc-pill-text">{t('services.tagline')}</span>
            </div>
            <h2 className="svc-h2">{t('services.title')}</h2>
            <p className="svc-subtitle">{t('services.subtitle')}</p>
          </div>

          {/* Row 1 — 3 cards */}
          <div className="svc-grid svc-row1">
            {AREAS.slice(0, 3).map((area, i) => (
              <ServiceCard
                key={area.key}
                area={area}
                title={t(`services.areas.${area.key}.title`)}
                items={t(`services.areas.${area.key}.items`) as unknown as string[]}
                delay={i * 110}
                visible={visible}
              />
            ))}
          </div>

          {/* Row 2 — 2 cards centred */}
          <div className="svc-grid svc-row2" style={{ margin: '20px auto 0' }}>
            {AREAS.slice(3).map((area, i) => (
              <ServiceCard
                key={area.key}
                area={area}
                title={t(`services.areas.${area.key}.title`)}
                items={t(`services.areas.${area.key}.items`) as unknown as string[]}
                delay={(i + 3) * 110}
                visible={visible}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}