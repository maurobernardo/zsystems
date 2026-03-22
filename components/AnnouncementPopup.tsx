'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const STORAGE_KEY = 'zs-announcement-seen-v2'

/* ─── Mini canvas — floating nodes ──────────────────────────────────────── */
function PopupCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setSize = () => {
      const pr = window.devicePixelRatio || 1
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      canvas.width = w * pr
      canvas.height = h * pr
      ctx.scale(pr, pr)
      return { w, h }
    }
    let { w, h } = setSize()
    window.addEventListener('resize', () => { const s = setSize(); w = s.w; h = s.h })

    const nodes = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 2,
      hue: [195, 265, 330, 145][i % 4],
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      t += 0.01

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99,200,255,${(1 - d / 100) * 0.15})`
            ctx.lineWidth = 0.5
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      nodes.forEach((n) => {
        n.x += n.vx + Math.sin(t + n.y * 0.03) * 0.1
        n.y += n.vy + Math.cos(t + n.x * 0.03) * 0.1
        if (n.x < 0) n.x = w; if (n.x > w) n.x = 0
        if (n.y < 0) n.y = h; if (n.y > h) n.y = 0

        const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3)
        g.addColorStop(0, `hsla(${n.hue},85%,70%,0.85)`)
        g.addColorStop(1, `hsla(${n.hue},85%,70%,0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: 24, zIndex: 0 }}
    />
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function AnnouncementPopup() {
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()
  const ispt = language === 'pt'

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (localStorage.getItem(STORAGE_KEY) === 'true') return
    const t = setTimeout(() => setVisible(true), 1600)
    return () => clearTimeout(t)
  }, [mounted])

  const handleClose = () => {
    setClosing(true)
    setTimeout(() => {
      setVisible(false)
      setClosing(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }, 350)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes apFadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes apFadeOut  { from{opacity:1} to{opacity:0} }
        @keyframes apScaleIn  { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes apScaleOut { from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(.92) translateY(12px)} }
        @keyframes apGrad     { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes apPulse    { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.25)} }
        @keyframes apFloat    { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-6px) rotate(3deg)} }
        @keyframes apSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes apRingPop  { 0%{transform:scale(.6);opacity:.8} 100%{transform:scale(1.8);opacity:0} }

        .ap-backdrop {
          position:fixed; inset:0; z-index:60;
          background:rgba(2,4,8,.75);
          backdrop-filter:blur(14px);
          display:flex; align-items:center; justify-content:center; padding:20px;
          animation:${closing ? 'apFadeOut' : 'apFadeIn'} .35s ease forwards;
        }

        .ap-card {
          position:relative; width:100%; max-width:420px;
          border-radius:24px;
          border:1px solid rgba(255,255,255,.09);
          background:rgba(10,12,20,.92);
          backdrop-filter:blur(24px);
          overflow:hidden;
          padding:36px 32px 32px;
          font-family:'DM Sans',sans-serif;
          animation:${closing ? 'apScaleOut' : 'apScaleIn'} .4s cubic-bezier(.22,1,.36,1) forwards;
          box-shadow:
            0 0 0 1px rgba(99,200,255,.08),
            0 32px 80px rgba(0,0,0,.7),
            0 0 60px rgba(99,200,255,.06);
        }

        /* top shimmer */
        .ap-top-line {
          position:absolute; top:0; left:10%; right:10%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(99,200,255,.65),transparent);
          border-radius:1px;
        }

        /* corner accents */
        .ap-corner { position:absolute; width:18px; height:18px; border-width:1.5px; border-style:solid; pointer-events:none; }
        .ap-c-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-color:rgba(99,200,255,.5); border-radius:4px 0 0 0; }
        .ap-c-tr { top:14px; right:14px; border-left:none; border-bottom:none; border-color:rgba(167,139,250,.5); border-radius:0 4px 0 0; }
        .ap-c-bl { bottom:14px; left:14px; border-right:none; border-top:none; border-color:rgba(167,139,250,.5); border-radius:0 0 0 4px; }
        .ap-c-br { bottom:14px; right:14px; border-left:none; border-top:none; border-color:rgba(99,200,255,.5); border-radius:0 0 4px 0; }

        /* close btn */
        .ap-close {
          position:absolute; top:14px; right:14px; z-index:10;
          width:32px; height:32px; border-radius:50%;
          background:rgba(255,255,255,.06);
          border:1px solid rgba(255,255,255,.1);
          color:rgba(255,255,255,.5);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .2s;
          backdrop-filter:blur(8px);
        }
        .ap-close:hover { background:rgba(255,255,255,.12); color:#fff; transform:scale(1.1) rotate(90deg); }

        /* icon */
        .ap-icon-wrap {
          position:relative; width:72px; height:72px;
          margin:0 auto 24px;
        }
        .ap-icon-circle {
          width:72px; height:72px; border-radius:20px;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:apGrad 4s linear infinite, apFloat 4s ease-in-out infinite;
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 0 30px rgba(99,200,255,.35), 0 0 60px rgba(167,139,250,.2);
          position:relative; z-index:1;
        }
        .ap-icon-ring {
          position:absolute; inset:-8px; border-radius:28px;
          border:1px solid rgba(99,200,255,.3);
          animation:apRingPop 2s ease-out infinite;
        }
        .ap-icon-ring2 {
          position:absolute; inset:-16px; border-radius:36px;
          border:1px solid rgba(167,139,250,.2);
          animation:apRingPop 2s ease-out .5s infinite;
        }

        /* badge */
        .ap-badge {
          display:inline-flex; align-items:center; gap:6px;
          padding:4px 14px; border-radius:100px; margin-bottom:14px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06);
          backdrop-filter:blur(8px);
        }
        .ap-badge-dot {
          width:5px; height:5px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:apPulse 2s ease-in-out infinite;
        }
        .ap-badge-text {
          font-size:10px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }

        /* headline */
        .ap-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(20px,5vw,26px);
          font-weight:800; line-height:1.15; letter-spacing:-.02em;
          margin-bottom:12px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.75) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:apGrad 7s linear infinite;
        }

        /* desc */
        .ap-desc {
          font-size:14px; font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
          margin-bottom:24px;
        }

        /* CTA */
        .ap-cta {
          display:inline-flex; align-items:center; gap:8px;
          padding:11px 26px; border-radius:100px;
          font-size:14px; font-weight:600; letter-spacing:.02em;
          color:#020408; cursor:pointer; border:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:apGrad 4s linear infinite;
          box-shadow:0 0 20px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
          font-family:'DM Sans',sans-serif;
        }
        .ap-cta:hover {
          transform:translateY(-2px) scale(1.03);
          box-shadow:0 0 40px rgba(99,200,255,.45);
        }
        .ap-cta-arrow { transition:transform .2s; display:inline-block; }
        .ap-cta:hover .ap-cta-arrow { transform:translateX(4px); }

        /* divider */
        .ap-divider {
          height:1px; width:100%; margin:20px 0;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);
        }

        /* feature row */
        .ap-features {
          display:flex; gap:16px; justify-content:center;
          margin-bottom:24px;
        }
        .ap-feat {
          display:flex; flex-direction:column; align-items:center; gap:6px;
          flex:1;
        }
        .ap-feat-icon {
          width:36px; height:36px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          backdrop-filter:blur(8px);
        }
        .ap-feat-label {
          font-size:10px; font-weight:500; letter-spacing:.05em;
          text-transform:uppercase; color:rgba(255,255,255,.35);
          text-align:center;
        }
      `}</style>

      <div className="ap-backdrop" onClick={handleClose}>
        <div className="ap-card" onClick={(e) => e.stopPropagation()}>

          {/* Canvas background */}
          <PopupCanvas />

          {/* Decorative */}
          <div className="ap-top-line" />
          <div className="ap-corner ap-c-tl" />
          <div className="ap-corner ap-c-tr" />
          <div className="ap-corner ap-c-bl" />
          <div className="ap-corner ap-c-br" />

          {/* Close */}
          <button className="ap-close" onClick={handleClose} aria-label="Close">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

            {/* Icon with rings */}
            <div className="ap-icon-wrap">
              <div className="ap-icon-ring" />
              <div className="ap-icon-ring2" />
              <div className="ap-icon-circle">
                <svg width="30" height="30" fill="none" stroke="#020408" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>

            {/* Badge */}
            <div className="ap-badge">
              <span className="ap-badge-dot" />
              <span className="ap-badge-text">Z-Systems · {ispt ? 'Beira, Moçambique' : 'Beira, Mozambique'}</span>
            </div>

            {/* Headline */}
            <h2 className="ap-h2">
              {ispt
                ? 'Transformando Ideias em Soluções Digitais'
                : 'Transforming Ideas into Digital Excellence'}
            </h2>

            {/* Desc */}
            <p className="ap-desc">
              {ispt
                ? 'Inovação, qualidade e excelência em cada projecto. A sua visão, a nossa expertise.'
                : 'Innovation, quality and excellence in every project. Your vision, our expertise.'}
            </p>

            {/* Feature pills */}
            <div className="ap-features">
              {[
                { hue: 195, icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>, label: ispt ? 'Dev Web' : 'Web Dev' },
                { hue: 265, icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, label: 'UX/UI' },
                { hue: 145, icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12H3a9 9 0 1018 0h-2M12 3v9m0 0l-3-3m3 3l3-3" /></svg>, label: ispt ? 'Infra' : 'Infra' },
              ].map((f) => (
                <div key={f.label} className="ap-feat">
                  <div className="ap-feat-icon" style={{
                    background: `hsla(${f.hue},80%,50%,0.1)`,
                    border: `1px solid hsla(${f.hue},70%,60%,0.25)`,
                    color: `hsla(${f.hue},85%,70%,1)`,
                  }}>
                    {f.icon}
                  </div>
                  <span className="ap-feat-label">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="ap-divider" />

            {/* CTA */}
            <button className="ap-cta" onClick={handleClose}>
              <span>{ispt ? 'Explorar o Site' : 'Explore the Site'}</span>
              <span className="ap-cta-arrow">→</span>
            </button>

          </div>
        </div>
      </div>
    </>
  )
}