'use client'

import { useEffect, useState } from 'react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollY > 300)
      setProgress(maxScroll > 0 ? Math.min(1, scrollY / maxScroll) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const R = 20          /* circle radius */
  const C = 2 * Math.PI * R  /* circumference */
  const dash = C * progress
  const gap  = C - dash

  return (
    <>
      <style>{`
        @keyframes bttFadeIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes bttFadeOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(12px)} }
        @keyframes bttGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .btt-btn {
          position: fixed; bottom: 96px; right: 20px; z-index: 50;
          width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; border: none; background: transparent;
          transition: transform .2s;
          animation: ${visible ? 'bttFadeIn' : 'bttFadeOut'} .35s cubic-bezier(.22,1,.36,1) both;
        }
        .btt-btn:hover { transform: translateY(-3px) scale(1.08); }

        /* background circle */
        .btt-bg {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(2,4,8,.85);
          border: 1px solid rgba(255,255,255,.1);
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 24px rgba(0,0,0,.5);
        }

        /* icon */
        .btt-icon {
          position: relative; z-index: 2;
          color: rgba(255,255,255,.75);
          transition: color .2s;
        }
        .btt-btn:hover .btt-icon { color: #63C8FF; }

        /* SVG progress ring */
        .btt-ring {
          position: absolute; inset: 0;
          transform: rotate(-90deg);
        }
      `}</style>

      {visible && (
        <button
          className="btt-btn"
          onClick={scrollTop}
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
        >
          <div className="btt-bg" />

          {/* Progress ring */}
          <svg className="btt-ring" width="52" height="52" viewBox="0 0 52 52">
            {/* Track */}
            <circle
              cx="26" cy="26" r={R}
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="2"
            />
            {/* Progress */}
            <circle
              cx="26" cy="26" r={R}
              fill="none"
              stroke="url(#bttGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              style={{ transition: 'stroke-dasharray .15s ease' }}
            />
            <defs>
              <linearGradient id="bttGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#63C8FF" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Arrow icon */}
          <svg className="btt-icon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  )
}