'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─── Canvas 2D — floating particles ────────────────────────────────────── */
function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const palette = ['#63C8FF', '#A78BFA', '#F472B6', '#4ade80']
    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      r: 1 + Math.random() * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }))

    let t = 0
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      t += .008
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width, H = canvas.height

      /* connections */
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,200,255,${(1 - d / 100) * .12})`
            ctx.lineWidth = .5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        n.x += n.vx + Math.sin(t + n.y * .02) * .1
        n.y += n.vy + Math.cos(t + n.x * .02) * .1
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4)
        g.addColorStop(0, n.color + 'cc')
        g.addColorStop(1, n.color + '00')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })
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
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}
    />
  )
}

/* ─── Glitch number ──────────────────────────────────────────────────────── */
function GlitchNumber() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 180)
    }, 2800)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="n404-glitch-wrap">
      <span className="n404-num" data-text="404">404</span>
      {glitch && (
        <>
          <span className="n404-num n404-glitch-r" aria-hidden>404</span>
          <span className="n404-num n404-glitch-b" aria-hidden>404</span>
        </>
      )}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function NotFound() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes n404FadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes n404Grad     { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes n404Pulse    { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes n404OrbMove  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-16px)} }
        @keyframes n404Float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes n404Ring     { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(1.8);opacity:0} }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .n404-root {
          min-height: 100vh; width: 100vw; overflow: hidden;
          background: #020408;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative; padding: 24px;
        }

        /* grid bg */
        .n404-grid {
          position: fixed; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
        }

        /* orbs */
        .n404-orb {
          position: fixed; border-radius: 50%; filter: blur(80px);
          pointer-events: none;
          animation: n404OrbMove 14s ease-in-out infinite;
        }

        /* card */
        .n404-card {
          position: relative; z-index: 10;
          max-width: 540px; width: 100%;
          text-align: center;
          padding: 56px 40px 48px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px rgba(99,200,255,.05), 0 40px 80px rgba(0,0,0,.6);
          animation: n404FadeUp .9s cubic-bezier(.22,1,.36,1) both;
        }

        /* top shimmer */
        .n404-top-line {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,200,255,.6), transparent);
          border-radius: 1px;
        }
        .n404-corner {
          position: absolute; width: 20px; height: 20px;
          border-width: 1.5px; border-style: solid; pointer-events: none;
        }
        .n404-c-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-color:rgba(99,200,255,.5); border-radius:4px 0 0 0; }
        .n404-c-tr { top:14px; right:14px; border-left:none; border-bottom:none; border-color:rgba(167,139,250,.5); border-radius:0 4px 0 0; }
        .n404-c-bl { bottom:14px; left:14px; border-right:none; border-top:none; border-color:rgba(167,139,250,.5); border-radius:0 0 0 4px; }
        .n404-c-br { bottom:14px; right:14px; border-left:none; border-top:none; border-color:rgba(99,200,255,.5); border-radius:0 0 4px 0; }

        /* icon */
        .n404-icon-wrap {
          position: relative; width: 80px; height: 80px;
          margin: 0 auto 32px;
          animation: n404Float 4s ease-in-out infinite;
        }
        .n404-icon-ring {
          position: absolute; inset: -8px; border-radius: 50%;
          border: 1.5px solid rgba(99,200,255,.35);
          animation: n404Ring 2.5s ease-out infinite;
        }
        .n404-icon-ring2 {
          position: absolute; inset: -16px; border-radius: 50%;
          border: 1px solid rgba(167,139,250,.25);
          animation: n404Ring 2.5s ease-out .7s infinite;
        }
        .n404-icon-circle {
          width: 80px; height: 80px; border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #63C8FF, #A78BFA, #F472B6);
          background-size: 200% 200%;
          animation: n404Grad 4s linear infinite;
          box-shadow: 0 0 30px rgba(99,200,255,.3), 0 0 60px rgba(167,139,250,.15);
          position: relative; z-index: 1;
        }

        /* 404 glitch */
        .n404-glitch-wrap {
          position: relative; display: inline-block;
          margin-bottom: 12px;
          animation: n404FadeUp .8s cubic-bezier(.22,1,.36,1) .1s both;
        }
        .n404-num {
          font-family: 'Syne', sans-serif;
          font-size: clamp(80px, 18vw, 120px);
          font-weight: 800; line-height: 1;
          background: linear-gradient(135deg, #63C8FF 0%, #A78BFA 50%, #F472B6 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: n404Grad 6s linear infinite;
          letter-spacing: -.04em;
          display: block;
        }
        .n404-glitch-r {
          position: absolute; top: 0; left: 0;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(135deg, #F472B6, #63C8FF);
          -webkit-background-clip: text; background-clip: text;
          clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
          transform: translateX(3px);
          opacity: .7;
        }
        .n404-glitch-b {
          position: absolute; top: 0; left: 0;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(135deg, #A78BFA, #F472B6);
          -webkit-background-clip: text; background-clip: text;
          clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
          transform: translateX(-3px);
          opacity: .6;
        }

        /* text */
        .n404-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(18px, 4vw, 26px); font-weight: 800;
          color: #fff; margin-bottom: 12px;
          animation: n404FadeUp .8s cubic-bezier(.22,1,.36,1) .2s both;
        }
        .n404-desc {
          font-size: 14px; font-weight: 300;
          color: rgba(255,255,255,.5); line-height: 1.7;
          margin-bottom: 36px;
          animation: n404FadeUp .8s cubic-bezier(.22,1,.36,1) .3s both;
        }

        /* buttons */
        .n404-btns {
          display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;
          animation: n404FadeUp .8s cubic-bezier(.22,1,.36,1) .4s both;
        }
        .n404-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 24px; border-radius: 100px;
          font-size: 14px; font-weight: 600; letter-spacing: .02em;
          color: #020408; text-decoration: none;
          background: linear-gradient(135deg, #63C8FF, #A78BFA, #F472B6);
          background-size: 200% 200%;
          animation: n404Grad 4s linear infinite;
          box-shadow: 0 0 20px rgba(99,200,255,.25);
          transition: transform .2s, box-shadow .2s;
        }
        .n404-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 40px rgba(99,200,255,.45);
        }
        .n404-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px; border-radius: 100px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,.75); text-decoration: none;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          backdrop-filter: blur(8px);
          transition: all .2s;
        }
        .n404-btn-secondary:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(99,200,255,.35);
          color: #fff; transform: translateY(-2px);
        }

        /* quick links */
        .n404-links {
          display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;
          margin-top: 28px;
          animation: n404FadeUp .8s cubic-bezier(.22,1,.36,1) .5s both;
        }
        .n404-link {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 500;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          color: rgba(255,255,255,.45);
          text-decoration: none;
          transition: all .2s;
        }
        .n404-link:hover {
          border-color: rgba(99,200,255,.3);
          color: rgba(99,200,255,.9);
          background: rgba(99,200,255,.05);
        }

        /* dot pulse */
        .n404-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #63C8FF; box-shadow: 0 0 6px #63C8FF;
          display: inline-block;
          animation: n404Pulse 2s ease-in-out infinite;
        }

        @media (max-width: 480px) {
          .n404-card { padding: 40px 24px 36px; }
          .n404-btns { flex-direction: column; align-items: center; }
          .n404-btn-primary, .n404-btn-secondary { width: 220px; justify-content: center; }
        }
      `}</style>

      {/* Background */}
      <BgCanvas />
      <div className="n404-grid" aria-hidden />
      <div className="n404-orb" aria-hidden style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: 'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay: '0s' }} />
      <div className="n404-orb" aria-hidden style={{ width: 320, height: 320, bottom: '-8%', left: '-4%', background: 'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay: '6s' }} />

      <div className="n404-root">
        <div className="n404-card">
          {/* Decorative */}
          <div className="n404-top-line" />
          <div className="n404-corner n404-c-tl" />
          <div className="n404-corner n404-c-tr" />
          <div className="n404-corner n404-c-bl" />
          <div className="n404-corner n404-c-br" />

          {/* Icon */}
          <div className="n404-icon-wrap">
            <div className="n404-icon-ring" />
            <div className="n404-icon-ring2" />
            <div className="n404-icon-circle">
              <svg width="34" height="34" fill="none" stroke="#020408" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* 404 with glitch */}
          <GlitchNumber />

          <h1 className="n404-title">Página não encontrada</h1>
          <p className="n404-desc">
            A página que procuras não existe ou foi movida.<br />
            Vamos levá-te de volta ao sítio certo.
          </p>

          {/* Main CTAs */}
          <div className="n404-btns">
            <Link href="/" className="n404-btn-primary">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Voltar ao Início
            </Link>
            <Link href="/#contact" className="n404-btn-secondary">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar-nos
            </Link>
          </div>

          {/* Quick nav links */}
          <div className="n404-links">
            {[
              { href: '/#services',     label: 'Serviços' },
              { href: '/#projects',     label: 'Projectos' },
              { href: '/#team',         label: 'Equipa' },
              { href: '/#about',        label: 'Sobre Nós' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="n404-link">
                <span className="n404-dot" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}