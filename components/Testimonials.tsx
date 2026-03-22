'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Testimonial data ───────────────────────────────────────────────────── */
const TESTIMONIALS_PT = [
  {
    image: '/images/ceo1.png',
    name: 'Manuel de Andrade',
    role: 'CEO — BioClean Environment',
    quote: 'A Z-Systems transformou a nossa presença digital com um sistema moderno, rápido e seguro. A equipa foi proativa e manteve uma comunicação clara do início ao fim.',
    hue: 195,
    initials: 'MA',
  },
  {
    image: '/images/agro.jpeg',
    name: 'Celso Andre',
    role: 'CEO — Agro Tech Mozambique',
    quote: 'Conseguimos um website e plataformas web com design atual e excelente performance. O suporte técnico e a qualidade da entrega fizeram a diferença.',
    hue: 145,
    initials: 'CA',
  },
  {
    image: '/images/Samson1.png',
    name: 'Samson Chifamba',
    role: 'IT Manager — Anantara',
    quote: 'Trabalhar com a Z-Systems foi muito profissional. Organizaram o processo, alinharam expectativas e entregaram um produto robusto e fácil de manter.',
    hue: 265,
    initials: 'SC',
  },
  {
    image: '/images/marlon.png',
    name: 'Deyril Marlon',
    role: 'Analista Remoto — Data4Moz',
    quote: 'Criaram um portefólio com navegação fluida, tradução PT/EN e uma experiência visual premium. Recomendo a Z-Systems pela qualidade e pelo cuidado na entrega.',
    hue: 330,
    initials: 'DM',
  },
]

const TESTIMONIALS_EN = [
  {
    image: '/images/ceo1.png',
    name: 'Manuel de Andrade',
    role: 'CEO — BioClean Environment',
    quote: 'Z-Systems transformed our digital presence with a modern, fast and secure system. The team was proactive and kept clear communication from start to finish.',
    hue: 195,
    initials: 'MA',
  },
  {
    image: '/images/agro.jpeg',
    name: 'Celso Andre',
    role: 'CEO — Agro Tech Mozambique',
    quote: 'We achieved a website and web platforms with a modern design and excellent performance. Technical support and delivery quality made all the difference.',
    hue: 145,
    initials: 'CA',
  },
  {
    image: '/images/Samson1.png',
    name: 'Samson Chifamba',
    role: 'IT Manager — Anantara',
    quote: 'Working with Z-Systems was very professional. They organized the process, aligned expectations, and delivered a robust product that is easy to maintain.',
    hue: 265,
    initials: 'SC',
  },
  {
    image: '/images/marlon.png',
    name: 'Deyril Marlon',
    role: 'Remote Analyst — Data4Moz',
    quote: 'They built a portfolio with smooth navigation, PT/EN translation and a premium visual experience. I recommend Z-Systems to anyone who values quality.',
    hue: 330,
    initials: 'DM',
  },
]

/* ─── Star rating SVG ────────────────────────────────────────────────────── */
function Stars({ hue }: { hue: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={`hsla(${hue},90%,65%,1)`}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

/* ─── Testimonial Card ───────────────────────────────────────────────────── */
function TestiCard({
  item,
  idx,
}: {
  item: (typeof TESTIMONIALS_PT)[0]
  idx: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      className="tst-card"
      style={{
        animationDelay: `${idx * 0.12}s`,
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 8 : 0}px)`,
        transition: hovered ? 'transform .1s ease-out' : 'transform .55s cubic-bezier(.22,1,.36,1)',
        '--hue': item.hue,
      } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Mouse spotlight */}
      <div className="tst-spotlight" style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsla(${item.hue},90%,65%,0.1) 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0,
      }} />

      {/* Top shimmer */}
      <div className="tst-top-line" style={{
        background: `linear-gradient(90deg, transparent, hsla(${item.hue},85%,65%,0.7), transparent)`,
        opacity: hovered ? 1 : 0.3,
      }} />

      {/* Corner accents */}
      <div className="tst-corner tst-tl" style={{ borderColor: `hsla(${item.hue},75%,65%,${hovered ? 0.8 : 0.25})` }} />
      <div className="tst-corner tst-br" style={{ borderColor: `hsla(${item.hue},75%,65%,${hovered ? 0.8 : 0.25})` }} />

      {/* Quote icon */}
      <div className="tst-quote-icon" style={{
        color: `hsla(${item.hue},80%,65%,${hovered ? 0.9 : 0.4})`,
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
      }}>
        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
      </div>

      {/* Stars */}
      <Stars hue={item.hue} />

      {/* Quote text */}
      <p className="tst-quote">{item.quote}</p>

      {/* Divider */}
      <div className="tst-divider" style={{
        background: `linear-gradient(90deg, transparent, hsla(${item.hue},75%,65%,0.4), transparent)`,
      }} />

      {/* Author */}
      <div className="tst-author">
        <div className="tst-avatar-wrap" style={{
          boxShadow: hovered ? `0 0 16px hsla(${item.hue},80%,55%,0.4)` : 'none',
          borderColor: `hsla(${item.hue},70%,60%,${hovered ? 0.6 : 0.2})`,
        }}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="tst-avatar-img"
            sizes="48px"
          />
          {/* Fallback initials */}
          <div className="tst-avatar-fallback" style={{
            background: `hsla(${item.hue},60%,30%,1)`,
            color: `hsla(${item.hue},90%,80%,1)`,
          }}>
            {item.initials}
          </div>
        </div>

        <div>
          <div className="tst-name">{item.name}</div>
          <div className="tst-role" style={{ color: `hsla(${item.hue},70%,72%,1)` }}>
            {item.role}
          </div>
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div className="tst-bottom-glow" style={{
        background: `radial-gradient(circle, hsla(${item.hue},80%,55%,0.14) 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
      }} />
    </div>
  )
}

/* ─── Infinite marquee strip ─────────────────────────────────────────────── */
function MarqueeStrip({
  items,
  reverse = false,
}: {
  items: (typeof TESTIMONIALS_PT)
  reverse?: boolean
}) {
  const doubled = [...items, ...items]

  return (
    <div className="tst-marquee-wrap">
      <div
        className="tst-marquee-track"
        style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((item, i) => (
          <TestiCard key={`${item.name}-${i}`} item={item} idx={i % items.length} />
        ))}
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Testimonials() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const ispt = language === 'pt'
  const data = ispt ? TESTIMONIALS_PT : TESTIMONIALS_EN

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

        @keyframes tstReveal  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tstGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes tstPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes tstOrbMove { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.2) translate(18px,-14px)} }
        @keyframes tstScroll  { from{transform:translateX(0)} to{transform:translateX(-50%)} }

        /* ── Section ── */
        .tst-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .tst-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.028) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.028) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .tst-orb {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:tstOrbMove 12s ease-in-out infinite;
        }

        /* ── Header ── */
        .tst-header {
          text-align:center; max-width:680px;
          margin:0 auto 60px;
          opacity:0;
        }
        .tst-header.visible { animation:tstReveal .9s cubic-bezier(.22,1,.36,1) forwards; }

        .tst-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06); backdrop-filter:blur(10px);
        }
        .tst-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:tstPulse 2s ease-in-out infinite;
        }
        .tst-pill-text {
          font-size:11px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }
        .tst-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:tstGrad 8s linear infinite;
        }
        .tst-subtitle {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
        }

        /* ── Marquee ── */
        .tst-marquee-wrap {
          overflow:hidden;
          mask-image:linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
          -webkit-mask-image:linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%);
          padding:12px 0;
        }
        .tst-marquee-track {
          display:flex; gap:20px;
          width:max-content;
          animation:tstScroll 36s linear infinite;
        }
        .tst-marquee-wrap:hover .tst-marquee-track { animation-play-state:paused; }

        /* ── Card ── */
        .tst-card {
          position:relative;
          border-radius:22px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          padding:28px 26px 26px;
          width:360px; flex-shrink:0;
          overflow:hidden;
          transform-style:preserve-3d;
          cursor:default;
        }
        @media(max-width:600px){ .tst-card { width:300px; } }

        .tst-spotlight {
          position:absolute; inset:0; border-radius:22px;
          pointer-events:none; z-index:0; transition:opacity .3s;
        }
        .tst-top-line {
          position:absolute; top:0; left:8%; right:8%;
          height:1px; border-radius:1px; transition:opacity .4s;
        }
        .tst-corner {
          position:absolute; width:16px; height:16px;
          border-width:1.5px; border-style:solid;
          pointer-events:none; z-index:2; transition:border-color .4s;
        }
        .tst-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-radius:4px 0 0 0; }
        .tst-br { bottom:14px; right:14px; border-left:none; border-top:none; border-radius:0 0 4px 0; }

        .tst-quote-icon {
          margin-bottom:12px; transition:transform .35s, color .35s;
          position:relative; z-index:1; display:inline-block;
        }
        .tst-quote {
          font-size:14px; color:rgba(255,255,255,.65);
          line-height:1.7; margin-bottom:20px;
          position:relative; z-index:1;
        }
        .tst-divider {
          height:1px; width:100%; border-radius:1px;
          margin-bottom:18px; position:relative; z-index:1;
        }
        .tst-author {
          display:flex; align-items:center; gap:14px;
          position:relative; z-index:1;
        }
        .tst-avatar-wrap {
          position:relative; width:48px; height:48px;
          border-radius:50%; flex-shrink:0;
          overflow:hidden;
          border:1.5px solid transparent;
          transition:box-shadow .4s, border-color .4s;
        }
        .tst-avatar-img { object-fit:cover; object-position:top center; }
        .tst-avatar-fallback {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-size:14px; font-weight:700;
          z-index:-1;
        }
        .tst-name {
          font-family:'Syne',sans-serif;
          font-size:15px; font-weight:700; color:#fff;
          margin-bottom:3px;
        }
        .tst-role { font-size:12px; font-weight:500; }

        .tst-bottom-glow {
          position:absolute; bottom:-30px; right:-30px;
          width:140px; height:140px; border-radius:50%;
          pointer-events:none; transition:opacity .4s;
        }

        /* ── Trust bar ── */
        .tst-trust {
          display:flex; align-items:center; justify-content:center;
          gap:36px; margin-top:56px; flex-wrap:wrap;
          opacity:0;
        }
        .tst-trust.visible { animation:tstReveal .9s cubic-bezier(.22,1,.36,1) .3s forwards; }
        .tst-trust-item {
          display:flex; flex-direction:column; align-items:center; gap:4px;
        }
        .tst-trust-num {
          font-family:'Syne',sans-serif;
          font-size:28px; font-weight:800;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.6) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          line-height:1;
        }
        .tst-trust-label {
          font-size:11px; color:rgba(255,255,255,.35);
          letter-spacing:.1em; text-transform:uppercase;
        }
        .tst-trust-sep {
          width:1px; height:36px;
          background:rgba(255,255,255,.08);
        }

        @media(max-width:600px){
          .tst-root { padding:64px 0 80px; }
          .tst-trust { gap:20px; }
          .tst-trust-sep { display:none; }
        }
      `}</style>

      <section ref={sectionRef} id="testimonials" className="tst-root">
        {/* Grid bg */}
        <div className="tst-grid-bg" aria-hidden />

        {/* Orbs */}
        <div className="tst-orb" aria-hidden style={{ width:500, height:500, top:'-10%', left:'-6%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="tst-orb" aria-hidden style={{ width:400, height:400, bottom:'-8%', right:'-4%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'5s' }} />
        <div className="tst-orb" aria-hidden style={{ width:260, height:260, top:'45%', right:'25%', background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay:'9s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`tst-header${visible ? ' visible' : ''}`}>
            <div className="tst-pill">
              <span className="tst-pill-dot" />
              <span className="tst-pill-text">{t('testimonials.tagline')}</span>
            </div>
            <h2 className="tst-h2">{t('testimonials.title')}</h2>
            <p className="tst-subtitle">{t('testimonials.subtitle')}</p>
          </div>

        </div>

        {/* Marquee — full bleed */}
        <MarqueeStrip items={data} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Trust bar */}
          <div className={`tst-trust${visible ? ' visible' : ''}`}>
            {[
              { num: '100%', label: ispt ? 'Satisfação' : 'Satisfaction' },
              { num: '4',    label: ispt ? 'Clientes'   : 'Clients' },
              { num: '5',    label: ispt ? 'Projectos'  : 'Projects' },
              { num: '2026', label: ispt ? 'Fundada em' : 'Founded' },
            ].map((item, i, arr) => (
              <>
                <div key={item.label} className="tst-trust-item">
                  <div className="tst-trust-num">{item.num}</div>
                  <div className="tst-trust-label">{item.label}</div>
                </div>
                {i < arr.length - 1 && <div key={`sep-${i}`} className="tst-trust-sep" />}
              </>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}