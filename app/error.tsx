'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

function BgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    window.addEventListener('resize', () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    })

    const nodes = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      r: 1 + Math.random() * 1.5,
      color: ['#f87171', '#fb923c', '#fbbf24'][Math.floor(Math.random() * 3)],
    }))

    let t = 0
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      t += .008
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const W = canvas.width, H = canvas.height

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(248,113,113,${(1 - d / 100) * .1})`
            ctx.lineWidth = .5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        n.x += n.vx + Math.sin(t + n.y * .02) * .08
        n.y += n.vy + Math.cos(t + n.x * .02) * .08
        if (n.x < 0) n.x = W; if (n.x > W) n.x = 0
        if (n.y < 0) n.y = H; if (n.y > H) n.y = 0
        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5)
        g.addColorStop(0, n.color + 'aa'); g.addColorStop(1, n.color + '00')
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
      })
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />
}

export default function Error({ reset }: { reset?: () => void }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes e500FadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes e500Grad   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes e500Pulse  { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes e500Ring   { 0%{transform:scale(.8);opacity:.8} 100%{transform:scale(2);opacity:0} }
        @keyframes e500Float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        .e500-root {
          min-height: 100vh; width: 100vw; overflow: hidden;
          background: #020408;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative; padding: 24px;
        }
        .e500-grid {
          position: fixed; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(248,113,113,.025) 1px, transparent 1px),
            linear-gradient(90deg,rgba(248,113,113,.025) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
        }
        .e500-card {
          position: relative; z-index: 10;
          max-width: 500px; width: 100%; text-align: center;
          padding: 52px 36px 44px; border-radius: 28px;
          border: 1px solid rgba(248,113,113,.15);
          background: rgba(255,255,255,.03);
          backdrop-filter: blur(24px);
          box-shadow: 0 0 0 1px rgba(248,113,113,.06), 0 40px 80px rgba(0,0,0,.6);
          animation: e500FadeUp .9s cubic-bezier(.22,1,.36,1) both;
        }
        .e500-top-line {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(248,113,113,.6), transparent);
        }
        .e500-corner { position: absolute; width: 18px; height: 18px; border-width: 1.5px; border-style: solid; }
        .e500-c-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-color:rgba(248,113,113,.5); border-radius:4px 0 0 0; }
        .e500-c-tr { top:14px; right:14px; border-left:none; border-bottom:none; border-color:rgba(251,146,60,.5); border-radius:0 4px 0 0; }
        .e500-c-bl { bottom:14px; left:14px; border-right:none; border-top:none; border-color:rgba(251,146,60,.5); border-radius:0 0 0 4px; }
        .e500-c-br { bottom:14px; right:14px; border-left:none; border-top:none; border-color:rgba(248,113,113,.5); border-radius:0 0 4px 0; }

        .e500-icon-wrap {
          position: relative; width: 80px; height: 80px;
          margin: 0 auto 28px;
          animation: e500Float 4s ease-in-out infinite;
        }
        .e500-ring { position:absolute; inset:-8px; border-radius:50%; border:1.5px solid rgba(248,113,113,.35); animation:e500Ring 2.5s ease-out infinite; }
        .e500-ring2 { position:absolute; inset:-16px; border-radius:50%; border:1px solid rgba(251,146,60,.2); animation:e500Ring 2.5s ease-out .7s infinite; }
        .e500-icon-circle {
          width:80px; height:80px; border-radius:22px;
          background:linear-gradient(135deg,#f87171,#fb923c,#fbbf24);
          background-size:200% 200%; animation:e500Grad 4s linear infinite;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 30px rgba(248,113,113,.35);
          position:relative; z-index:1;
        }

        .e500-num {
          font-family:'Syne',sans-serif;
          font-size:clamp(72px,16vw,100px); font-weight:800; line-height:1;
          background:linear-gradient(135deg,#f87171,#fb923c,#fbbf24);
          background-size:200%; -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent; animation:e500Grad 6s linear infinite;
          letter-spacing:-.04em; margin-bottom:12px; display:block;
        }
        .e500-title {
          font-family:'Syne',sans-serif;
          font-size:clamp(16px,3vw,22px); font-weight:800; color:#fff;
          margin-bottom:10px; animation:e500FadeUp .8s .15s both;
        }
        .e500-desc {
          font-size:14px; font-weight:300; color:rgba(255,255,255,.5);
          line-height:1.7; margin-bottom:32px; animation:e500FadeUp .8s .25s both;
        }
        .e500-btns {
          display:flex; gap:10px; justify-content:center; flex-wrap:wrap;
          animation:e500FadeUp .8s .35s both;
        }
        .e500-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:10px 22px; border-radius:100px;
          font-size:13px; font-weight:600; color:#020408; cursor:pointer; border:none;
          background:linear-gradient(135deg,#f87171,#fb923c); background-size:200%;
          animation:e500Grad 4s linear infinite;
          box-shadow:0 0 16px rgba(248,113,113,.25);
          transition:transform .2s, box-shadow .2s;
        }
        .e500-btn-primary:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 0 32px rgba(248,113,113,.45); }
        .e500-btn-secondary {
          display:inline-flex; align-items:center; gap:8px;
          padding:9px 20px; border-radius:100px;
          font-size:13px; font-weight:500; color:rgba(255,255,255,.7); text-decoration:none;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1);
          backdrop-filter:blur(8px); transition:all .2s;
        }
        .e500-btn-secondary:hover { background:rgba(255,255,255,.1); border-color:rgba(248,113,113,.3); color:#fff; transform:translateY(-2px); }

        @media(max-width:480px){
          .e500-card { padding:40px 20px 36px; }
          .e500-btns { flex-direction:column; align-items:center; }
          .e500-btn-primary, .e500-btn-secondary { width:200px; justify-content:center; }
        }
      `}</style>

      <BgCanvas />
      <div className="e500-root">
        <div className="e500-grid" aria-hidden />
        <div className="e500-card">
          <div className="e500-top-line" />
          <div className="e500-corner e500-c-tl" /><div className="e500-corner e500-c-tr" />
          <div className="e500-corner e500-c-bl" /><div className="e500-corner e500-c-br" />

          <div className="e500-icon-wrap">
            <div className="e500-ring" /><div className="e500-ring2" />
            <div className="e500-icon-circle">
              <svg width="34" height="34" fill="none" stroke="#020408" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
          </div>

          <span className="e500-num">500</span>
          <h1 className="e500-title">Erro no servidor</h1>
          <p className="e500-desc">
            Algo correu mal do nosso lado.<br />
            Estamos a trabalhar para resolver. Tente novamente em breve.
          </p>

          <div className="e500-btns">
            {reset && (
              <button className="e500-btn-primary" onClick={reset}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Tentar novamente
              </button>
            )}
            <Link href="/" className="e500-btn-secondary">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Início
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}