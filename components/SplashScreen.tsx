'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function SplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  /* Canvas animation */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const palette = ['#63C8FF', '#A78BFA', '#F472B6', '#4ade80']
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .4,
      r: 1 + Math.random() * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }))

    let t = 0
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      t += .01
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width, H = canvas.height

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,200,255,${(1 - d / 120) * .15})`
            ctx.lineWidth = .5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        n.x += n.vx + Math.sin(t + n.y * .02) * .12
        n.y += n.vy + Math.cos(t + n.x * .02) * .12
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
        g.addColorStop(0, n.color + 'bb')
        g.addColorStop(1, n.color + '00')
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* Timing: show 1.8s then fade out */
  useEffect(() => {
    const hide = setTimeout(() => setPhase('fading'), 1800)
    const gone = setTimeout(() => setPhase('gone'), 2400)
    return () => { clearTimeout(hide); clearTimeout(gone) }
  }, [])

  if (phase === 'gone') return null

  return (
    <>
      <style>{`
        @keyframes spLogoPop  { 0%{opacity:0;transform:scale(.7)} 60%{transform:scale(1.06)} 100%{opacity:1;transform:scale(1)} }
        @keyframes spBarGrow  { from{width:0} to{width:100%} }
        @keyframes spGrad     { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes spDot      { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes spRingOut  { 0%{transform:scale(.7);opacity:.9} 100%{transform:scale(2);opacity:0} }

        .sp-root {
          position: fixed; inset: 0; z-index: 9999;
          background: #020408;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          transition: opacity .55s cubic-bezier(.22,1,.36,1);
          opacity: ${phase === 'fading' ? 0 : 1};
          pointer-events: ${phase === 'fading' ? 'none' : 'all'};
        }

        .sp-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
        }

        .sp-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%);
        }

        .sp-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; gap: 0;
        }

        /* Logo icon */
        .sp-logo-wrap {
          position: relative; margin-bottom: 28px;
          animation: spLogoPop .7s cubic-bezier(.22,1,.36,1) .1s both;
        }
        .sp-ring {
          position: absolute; inset: -10px; border-radius: 50%;
          border: 1.5px solid rgba(99,200,255,.3);
          animation: spRingOut 2s ease-out .6s infinite;
        }
        .sp-ring2 {
          position: absolute; inset: -20px; border-radius: 50%;
          border: 1px solid rgba(167,139,250,.2);
          animation: spRingOut 2s ease-out 1.1s infinite;
        }
        .sp-logo-circle {
          width: 88px; height: 88px; border-radius: 24px;
          background: rgba(2,4,8,0.6);
          border: 1px solid rgba(99,200,255,0.2);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 40px rgba(99,200,255,.25), 0 0 80px rgba(167,139,250,.15);
          position: relative; z-index: 1;
          overflow: hidden;
          backdrop-filter: blur(12px);
        }

        /* Company name */
        .sp-name {
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 800; letter-spacing: -.03em;
          background: linear-gradient(135deg, #fff 40%, rgba(99,200,255,.7) 100%);
          background-size: 200%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: spLogoPop .7s cubic-bezier(.22,1,.36,1) .25s both;
          margin-bottom: 6px;
        }
        .sp-tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 500; letter-spacing: .2em;
          text-transform: uppercase; color: rgba(99,200,255,.7);
          animation: spLogoPop .7s cubic-bezier(.22,1,.36,1) .35s both;
          margin-bottom: 40px;
        }

        /* Loading bar */
        .sp-bar-wrap {
          width: 200px; height: 2px;
          background: rgba(255,255,255,.07); border-radius: 2px;
          overflow: hidden; margin-bottom: 20px;
          animation: spLogoPop .5s ease .5s both;
        }
        .sp-bar {
          height: 100%;
          background: linear-gradient(90deg, #63C8FF, #A78BFA, #F472B6);
          border-radius: 2px;
          animation: spBarGrow 1.4s cubic-bezier(.4,0,.2,1) .6s both;
        }

        /* Loading dots */
        .sp-dots {
          display: flex; gap: 6px;
          animation: spLogoPop .5s ease .7s both;
        }
        .sp-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: rgba(99,200,255,.5);
          animation: spDot 1s ease-in-out infinite;
        }
        .sp-dot:nth-child(2) { animation-delay: .15s; }
        .sp-dot:nth-child(3) { animation-delay: .30s; }
      `}</style>

      <div className="sp-root">
        <canvas ref={canvasRef} className="sp-canvas" />
        <div className="sp-grid" aria-hidden />

        <div className="sp-content">
          {/* Logo */}
          <div className="sp-logo-wrap">
            <div className="sp-ring" />
            <div className="sp-ring2" />
            <div className="sp-logo-circle">
              <Image
                src="/images/logo10.png"
                alt="Z-Systems Logo"
                width={64}
                height={64}
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Name */}
          <div className="sp-name">Z-Systems</div>
          <div className="sp-tagline">Empresa de Tecnologia · Beira</div>

          {/* Bar */}
          <div className="sp-bar-wrap">
            <div className="sp-bar" />
          </div>

          {/* Dots */}
          <div className="sp-dots">
            <div className="sp-dot" />
            <div className="sp-dot" />
            <div className="sp-dot" />
          </div>
        </div>
      </div>
    </>
  )
}