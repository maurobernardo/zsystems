'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Animated counter hook ─────────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!start || !ref.current) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (ref.current) ref.current.textContent = String(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return ref
}

/* ─── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({
  value, suffix, label, delay, visible,
}: {
  value: number; suffix: string; label: string; delay: number; visible: boolean
}) {
  const numRef = useCounter(value, 1600, visible)
  return (
    <div
      className="abt-stat-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="abt-stat-orb" />
      <div className="abt-stat-num">
        <span ref={numRef}>0</span>{suffix}
      </div>
      <div className="abt-stat-label">{label}</div>
    </div>
  )
}

/* ─── SVG icons ─────────────────────────────────────────────────────────── */
const ICONS = {
  bolt: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  shield: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  target: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  rocket: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.84m2.699 2.7L3 3l4.2 15.8L21 21l-5.3-4.5z" />
    </svg>
  ),
  globe: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

/* ─── Feature row ────────────────────────────────────────────────────────── */
function Feature({ iconKey, text, delay }: { iconKey: keyof typeof ICONS; text: string; delay: number }) {
  return (
    <div className="abt-feature" style={{ animationDelay: `${delay}ms` }}>
      <span className="abt-feature-icon" style={{ color: '#63C8FF' }}>
        {ICONS[iconKey]}
      </span>
      <span className="abt-feature-text">{text}</span>
    </div>
  )
}

/* ─── 3D Canvas mini (floating shapes) ──────────────────────────────────── */
function MiniCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = canvas.offsetWidth
    let H = canvas.offsetHeight
    canvas.width = W * 2; canvas.height = H * 2
    ctx.scale(2, 2)

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W * 2; canvas.height = H * 2
      ctx.scale(2, 2)
    }
    window.addEventListener('resize', resize)

    /* floating nodes */
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: 1.5 + Math.random() * 2.5,
      hue: i % 3 === 0 ? 195 : i % 3 === 1 ? 265 : 330,
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      /* connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,200,255,${(1 - d / 120) * 0.18})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      /* nodes */
      nodes.forEach((n) => {
        n.x += n.vx + Math.sin(t + n.y * 0.02) * 0.15
        n.y += n.vy + Math.cos(t + n.x * 0.02) * 0.15
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3)
        grd.addColorStop(0, `hsla(${n.hue},90%,70%,0.9)`)
        grd.addColorStop(1, `hsla(${n.hue},90%,70%,0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        borderRadius: 32,
      }}
    />
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function About() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const sectionRef = useRef<HTMLElement>(null)
  const statsVisible = useRef(false)
  const [statsTriggered, setStatsTriggered] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('abt-revealed')
            if (!statsVisible.current) {
              statsVisible.current = true
              setStatsTriggered(true)
            }
          }
        })
      },
      { threshold: 0.12 }
    )
    const el = sectionRef.current
    if (el) el.querySelectorAll('.abt-reveal').forEach((e) => observer.observe(e))
    return () => observer.disconnect()
  }, [setStatsTriggered])

  const ispt = language === 'pt'

  const features = ispt
    ? [
        { iconKey: 'bolt'   as const, text: 'Parceiro estratégico para transformação digital das empresas.' },
        { iconKey: 'shield' as const, text: 'Soluções completas: consultoria, design e desenvolvimento.' },
        { iconKey: 'target' as const, text: 'Foco em resultados: sistemas rápidos, seguros e escaláveis.' },
      ]
    : [
        { iconKey: 'bolt'   as const, text: 'Strategic partner for companies\' digital transformation.' },
        { iconKey: 'shield' as const, text: 'End-to-end solutions: consulting, design and development.' },
        { iconKey: 'target' as const, text: 'Results-driven: fast, secure and scalable systems.' },
      ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Animations ── */
        @keyframes abtFadeUp {
          from { opacity:0; transform:translateY(32px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes abtFadeLeft {
          from { opacity:0; transform:translateX(-32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes abtFadeRight {
          from { opacity:0; transform:translateX(32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes abtGrad {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
        @keyframes abtOrb {
          0%,100% { transform:scale(1) translate(0,0); opacity:.6; }
          33%      { transform:scale(1.15) translate(10px,-8px); opacity:1; }
          66%      { transform:scale(.9) translate(-6px,10px); opacity:.5; }
        }
        @keyframes abtSpin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes abtPulseRing {
          0%   { transform:scale(.8); opacity:.8; }
          100% { transform:scale(1.6); opacity:0; }
        }
        @keyframes abtFloat {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-10px); }
        }
        @keyframes abtShimmer {
          from { background-position:-200% 0; }
          to   { background-position:200% 0; }
        }

        /* ── Reveal system ── */
        .abt-reveal            { opacity:0; }
        .abt-reveal.abt-revealed { animation: abtFadeUp   .9s cubic-bezier(.22,1,.36,1) forwards; }
        .abt-reveal-left.abt-revealed  { animation: abtFadeLeft  .9s cubic-bezier(.22,1,.36,1) forwards; }
        .abt-reveal-right.abt-revealed { animation: abtFadeRight .9s cubic-bezier(.22,1,.36,1) forwards; }

        /* ── Section root ── */
        .abt-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }

        /* ── Background grid ── */
        .abt-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,200,255,.035) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
        }

        /* ── Ambient orbs ── */
        .abt-orb {
          position:absolute; border-radius:50%;
          filter:blur(72px); pointer-events:none;
          animation: abtOrb 8s ease-in-out infinite;
        }

        /* ── Section label ── */
        .abt-label {
          display:inline-flex; align-items:center; gap:10px;
          margin-bottom:20px;
        }
        .abt-label-line { height:2px; width:32px; background:#63C8FF; border-radius:2px; }
        .abt-label-text {
          font-size:11px; font-weight:700; letter-spacing:.3em;
          text-transform:uppercase; color:#63C8FF;
        }

        /* ── Headline ── */
        .abt-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:20px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.75) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:abtGrad 8s linear infinite;
        }

        /* ── Body text ── */
        .abt-body {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.55); line-height:1.75; margin-bottom:28px;
        }

        /* ── Feature items ── */
        .abt-feature {
          display:flex; align-items:flex-start; gap:14px;
          padding:14px 16px; border-radius:14px;
          border:1px solid rgba(255,255,255,.06);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(10px);
          margin-bottom:10px;
          opacity:0;
          transition:border-color .25s, background .25s, transform .25s;
        }
        .abt-reveal.abt-revealed .abt-feature {
          animation:abtFadeUp .7s cubic-bezier(.22,1,.36,1) forwards;
        }
        .abt-feature:hover {
          border-color:rgba(99,200,255,.2);
          background:rgba(99,200,255,.04);
          transform:translateX(4px);
        }
        .abt-feature-icon {
          font-size:18px; flex-shrink:0;
          width:36px; height:36px; border-radius:10px;
          background:rgba(99,200,255,.08);
          border:1px solid rgba(99,200,255,.15);
          display:flex; align-items:center; justify-content:center;
          line-height:1;
        }
        .abt-feature-text {
          font-size:14px; color:rgba(255,255,255,.75);
          line-height:1.55; padding-top:8px;
        }

        /* ── CTA button ── */
        .abt-cta {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 26px; border-radius:100px;
          font-size:14px; font-weight:500; letter-spacing:.02em;
          color:#020408; text-decoration:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:abtGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
          margin-top:28px;
        }
        .abt-cta:hover {
          transform:translateY(-2px) scale(1.02);
          box-shadow:0 0 44px rgba(99,200,255,.45);
        }
        .abt-cta-arrow { transition:transform .2s; display:inline-block; }
        .abt-cta:hover .abt-cta-arrow { transform:translateX(4px); }

        /* ── Image card ── */
        .abt-img-card {
          position:relative;
          border-radius:32px;
          border:1px solid rgba(255,255,255,.08);
          background:rgba(255,255,255,.02);
          backdrop-filter:blur(20px);
          overflow:hidden;
          transform-style:preserve-3d;
          transition:transform .5s cubic-bezier(.22,1,.36,1), box-shadow .5s;
          box-shadow:
            0 0 0 1px rgba(99,200,255,.08),
            0 24px 60px rgba(0,0,0,.6),
            0 0 80px rgba(99,200,255,.06);
        }
        .abt-img-card:hover {
          transform:perspective(900px) rotateY(-4deg) rotateX(2deg) translateY(-6px);
          box-shadow:
            0 0 0 1px rgba(99,200,255,.18),
            0 40px 80px rgba(0,0,0,.7),
            0 0 120px rgba(99,200,255,.12);
        }

        /* scan line effect */
        .abt-scanlines {
          position:absolute; inset:0; pointer-events:none; z-index:3;
          background:repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0) 0px, rgba(0,0,0,0) 3px,
            rgba(0,0,0,.04) 3px, rgba(0,0,0,.04) 4px
          );
        }
        /* corner accents */
        .abt-corner {
          position:absolute; width:22px; height:22px;
          pointer-events:none; z-index:4;
        }
        .abt-corner-tl { top:16px; left:16px; border-top:2px solid #63C8FF; border-left:2px solid #63C8FF; border-radius:4px 0 0 0; }
        .abt-corner-tr { top:16px; right:16px; border-top:2px solid #63C8FF; border-right:2px solid #63C8FF; border-radius:0 4px 0 0; }
        .abt-corner-bl { bottom:16px; left:16px; border-bottom:2px solid #63C8FF; border-left:2px solid #63C8FF; border-radius:0 0 0 4px; }
        .abt-corner-br { bottom:16px; right:16px; border-bottom:2px solid #63C8FF; border-right:2px solid #63C8FF; border-radius:0 0 4px 0; }

        /* ── Badge year ── */
        .abt-badge {
          position:absolute; bottom:-18px; left:24px; z-index:10;
          display:inline-flex; align-items:center; gap:8px;
          padding:7px 16px; border-radius:100px;
          background:linear-gradient(135deg,#63C8FF,#A78BFA);
          font-size:11px; font-weight:700; letter-spacing:.2em;
          color:#020408; text-transform:uppercase;
          box-shadow:0 4px 20px rgba(99,200,255,.35);
          animation:abtFloat 3s ease-in-out infinite;
        }
        .abt-badge-dot {
          width:6px; height:6px; border-radius:50%;
          background:#020408; opacity:.6;
        }

        /* ── Floating status chip ── */
        .abt-chip {
          position:absolute; z-index:10;
          display:flex; align-items:center; gap:10px;
          padding:10px 16px; border-radius:14px;
          background:rgba(2,4,8,.75);
          border:1px solid rgba(255,255,255,.1);
          backdrop-filter:blur(16px);
          box-shadow:0 8px 32px rgba(0,0,0,.5);
          animation:abtFloat 4s ease-in-out infinite;
        }
        .abt-chip-icon {
          width:32px; height:32px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          font-size:15px; flex-shrink:0;
        }
        .abt-chip-title { font-size:11px; color:rgba(255,255,255,.4); letter-spacing:.05em; margin-bottom:2px; }
        .abt-chip-val { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#fff; }

        /* ── Stat cards ── */
        .abt-stats-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:12px;
          margin-top:36px;
        }
        .abt-stat-card {
          position:relative; overflow:hidden;
          padding:20px 16px 16px;
          border-radius:18px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(12px);
          text-align:center;
          opacity:0;
          transition:border-color .3s, transform .3s, box-shadow .3s;
        }
        .abt-reveal.abt-revealed .abt-stat-card {
          animation:abtFadeUp .8s cubic-bezier(.22,1,.36,1) forwards;
        }
        .abt-stat-card:hover {
          border-color:rgba(99,200,255,.22);
          transform:translateY(-4px);
          box-shadow:0 16px 40px rgba(0,0,0,.4), 0 0 30px rgba(99,200,255,.08);
        }
        .abt-stat-orb {
          position:absolute; top:-20px; right:-20px;
          width:60px; height:60px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,200,255,.12) 0%,transparent 70%);
          pointer-events:none;
        }
        .abt-stat-num {
          font-family:'Syne',sans-serif;
          font-size:32px; font-weight:800; line-height:1;
          background:linear-gradient(135deg,#fff 40%,rgba(99,200,255,.7) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:6px;
        }
        .abt-stat-label {
          font-size:11px; color:rgba(255,255,255,.35);
          letter-spacing:.1em; text-transform:uppercase;
        }

        /* ── Shimmer line ── */
        .abt-shimmer {
          height:1px; width:100%;
          background:linear-gradient(90deg,transparent,rgba(99,200,255,.4),transparent);
          background-size:200% 100%;
          animation:abtShimmer 3s linear infinite;
          margin:36px 0;
          border-radius:1px;
        }

        /* ── Tech pills ── */
        .abt-pills {
          display:flex; flex-wrap:wrap; gap:8px; margin-bottom:8px;
        }
        .abt-pill {
          display:inline-flex; align-items:center; gap:6px;
          padding:5px 12px; border-radius:100px;
          font-size:12px; font-weight:500;
          color:rgba(255,255,255,.7);
          border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.04);
          backdrop-filter:blur(8px);
          transition:border-color .2s, color .2s, background .2s;
        }
        .abt-pill:hover {
          border-color:rgba(99,200,255,.35);
          color:#fff;
          background:rgba(99,200,255,.06);
        }
        .abt-pill-dot {
          width:5px; height:5px; border-radius:50%;
          background:#63C8FF;
          box-shadow:0 0 5px #63C8FF;
        }

        @media(max-width:768px){
          .abt-root { padding:64px 0 80px; }
          .abt-stats-grid { grid-template-columns:repeat(3,1fr); gap:8px; }
          .abt-stat-num { font-size:24px; }
          .abt-chip { display:none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="about"
        className="abt-root"
      >
        {/* Grid bg */}
        <div className="abt-grid-bg" aria-hidden />

        {/* Ambient orbs */}
        <div className="abt-orb" aria-hidden style={{
          width:500, height:500, top:'-10%', right:'-8%',
          background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)',
          animationDelay:'0s',
        }} />
        <div className="abt-orb" aria-hidden style={{
          width:400, height:400, bottom:'-5%', left:'-5%',
          background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)',
          animationDelay:'3s',
        }} />
        <div className="abt-orb" aria-hidden style={{
          width:300, height:300, top:'40%', left:'40%',
          background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)',
          animationDelay:'5s',
        }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}
               className="abt-grid-layout">

            {/* ── LEFT: Image ─────────────────────────────────────────── */}
            <div className="abt-reveal abt-reveal-left" style={{ position:'relative' }}>

              {/* Floating chip — top right */}
              <div className="abt-chip" style={{ top:24, right:-16, animationDelay:'0s' }}>
                <div className="abt-chip-icon" style={{ background:'rgba(99,200,255,.1)', border:'1px solid rgba(99,200,255,.2)', color:'#63C8FF' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.84m2.699 2.7L3 3l4.2 15.8L21 21l-5.3-4.5z" />
                  </svg>
                </div>
                <div>
                  <div className="abt-chip-title">INOVAÇÃO</div>
                  <div className="abt-chip-val">Contínua</div>
                </div>
              </div>

              {/* Floating chip — bottom left */}
              <div className="abt-chip" style={{ bottom:44, left:-20, animationDelay:'2s' }}>
                <div className="abt-chip-icon" style={{ background:'rgba(167,139,250,.1)', border:'1px solid rgba(167,139,250,.2)', color:'#A78BFA' }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="abt-chip-title">BASE</div>
                  <div className="abt-chip-val">Beira, Moçambique</div>
                </div>
              </div>

              {/* 3D image card */}
              <div className="abt-img-card" style={{ aspectRatio:'4/5' }}>
                {/* Mini canvas behind image */}
                <div style={{ position:'absolute', inset:0, zIndex:1 }}>
                  <MiniCanvas />
                </div>

                {/* Photo */}
                <div style={{ position:'relative', width:'100%', height:'100%', zIndex:2 }}>
                  <Image
                    src="/images/about4.png"
                    alt={ispt ? 'Tecnologia e transformação digital' : 'Technology and digital transformation'}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div style={{
                    position:'absolute', inset:0,
                    background:'linear-gradient(to top, rgba(2,4,8,.8) 0%, rgba(2,4,8,.1) 50%, transparent 100%)',
                    zIndex:1,
                  }} />
                </div>

                {/* Scanlines */}
                <div className="abt-scanlines" />

                {/* Corner accents */}
                <div className="abt-corner abt-corner-tl" />
                <div className="abt-corner abt-corner-tr" />
                <div className="abt-corner abt-corner-bl" />
                <div className="abt-corner abt-corner-br" />
              </div>

              {/* Year badge */}
              <div className="abt-badge">
                <span className="abt-badge-dot" />
                {ispt ? 'DESDE 2026' : 'SINCE 2026'}
              </div>
            </div>

            {/* ── RIGHT: Content ────────────────────────────────────────── */}
            <div className="abt-reveal abt-reveal-right" style={{ paddingTop:8 }}>

              {/* Label */}
              <div className="abt-label">
                <div className="abt-label-line" />
                <span className="abt-label-text">{ispt ? 'Sobre Nós' : 'About Us'}</span>
              </div>

              {/* Headline */}
              <h2 className="abt-h2">
                {ispt ? 'Quem Somos e o\u00a0Que Fazemos' : 'Who We Are and What We Do'}
              </h2>

              {/* Body */}
              <p className="abt-body">{t('about.description')}</p>

              {/* Tech pills */}
              <div className="abt-pills">
                {['Next.js', 'Java EE', 'Node.js', 'Cloud', 'Redes', 'Sistemas'].map((p) => (
                  <span key={p} className="abt-pill">
                    <span className="abt-pill-dot" />
                    {p}
                  </span>
                ))}
              </div>

              {/* Shimmer divider */}
              <div className="abt-shimmer" />

              {/* Features */}
              <div>
                {features.map((f, i) => (
                  <Feature key={f.text} iconKey={f.iconKey} text={f.text} delay={i * 100} />
                ))}
              </div>

              {/* CTA */}
              <a href="#services" className="abt-cta">
                <span>{ispt ? 'Ver Serviços' : 'View Services'}</span>
                <span className="abt-cta-arrow">→</span>
              </a>

              {/* Stats */}
              <div className="abt-stats-grid abt-reveal">
                {[
                  { value: 4,  suffix: '',  label: ispt ? 'Clientes'  : 'Clients' },
                  { value: 5,  suffix: '',  label: ispt ? 'Projectos' : 'Projects' },
                  { value: 1,  suffix: '',  label: ispt ? 'Ano Activo' : 'Year Active' },
                ].map((s, i) => (
                  <StatCard
                    key={s.label}
                    value={s.value}
                    suffix={s.suffix}
                    label={s.label}
                    delay={i * 120}
                    visible={statsTriggered}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:767px){
          .abt-grid-layout {
            grid-template-columns:1fr !important;
            gap:48px !important;
          }
        }
      `}</style>
    </>
  )
}