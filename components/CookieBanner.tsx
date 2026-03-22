'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const COOKIE_KEY = 'zs-cookie-consent-v1'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(COOKIE_KEY)) return
    const t = setTimeout(() => setVisible(true), 2600)
    return () => clearTimeout(t)
  }, [])

  const accept = (all: boolean) => {
    localStorage.setItem(COOKIE_KEY, all ? 'all' : 'essential')
    setLeaving(true)
    setTimeout(() => setVisible(false), 400)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700&family=DM+Sans:wght@400;500&display=swap');

        @keyframes ckUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ckDown { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(24px)} }
        @keyframes ckGrad { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .ck-root {
          position: fixed; bottom: 16px; left: 50%;
          transform: translateX(-50%);
          z-index: 9000;
          width: calc(100vw - 24px); max-width: 660px;
          font-family: 'DM Sans', sans-serif;
          animation: ckUp .4s cubic-bezier(.22,1,.36,1) both;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .ck-root.ck-leaving {
          animation: ckDown .4s cubic-bezier(.22,1,.36,1) both;
        }

        .ck-card {
          position: relative; border-radius: 18px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(4,6,14,.96);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 16px 16px 14px;
          box-shadow: 0 0 0 1px rgba(99,200,255,.08), 0 20px 60px rgba(0,0,0,.7);
        }

        .ck-shimmer {
          position: absolute; top: 0; left: 12%; right: 12%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,200,255,.55), transparent);
          border-radius: 1px;
        }

        .ck-close {
          position: absolute; top: 10px; right: 10px;
          width: 26px; height: 26px; border-radius: 50%;
          background: rgba(255,255,255,.07);
          border: 1px solid rgba(255,255,255,.1);
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.45); cursor: pointer;
          transition: all .2s;
        }
        .ck-close:hover { background: rgba(255,255,255,.14); color: #fff; }

        .ck-header {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px; padding-right: 28px;
        }
        .ck-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          background: rgba(99,200,255,.1); border: 1px solid rgba(99,200,255,.22);
          display: flex; align-items: center; justify-content: center;
          color: #63C8FF;
        }
        .ck-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; color: #fff;
        }

        .ck-desc {
          font-size: 12px; color: rgba(255,255,255,.45);
          line-height: 1.65; margin-bottom: 14px;
        }
        .ck-desc a { color: rgba(99,200,255,.8); text-decoration: none; }
        .ck-desc a:hover { color: #63C8FF; text-decoration: underline; }

        /* Buttons — always both on same row, never wrap */
        .ck-btns {
          display: flex; gap: 8px; align-items: center;
          justify-content: flex-end;
        }

        .ck-btn-essential {
          flex: 1; padding: 9px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 500; text-align: center;
          color: rgba(255,255,255,.7); cursor: pointer;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.12);
          transition: all .2s; white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .ck-btn-essential:hover {
          background: rgba(255,255,255,.12); color: #fff;
          border-color: rgba(255,255,255,.22);
        }

        .ck-btn-accept {
          flex: 1; padding: 9px 12px; border-radius: 100px;
          font-size: 12px; font-weight: 600; text-align: center;
          letter-spacing: .02em; color: #020408;
          border: none; cursor: pointer;
          background: linear-gradient(135deg, #63C8FF, #A78BFA);
          background-size: 200% 200%;
          animation: ckGrad 4s linear infinite;
          box-shadow: 0 0 14px rgba(99,200,255,.3);
          transition: transform .2s, box-shadow .2s;
          white-space: nowrap;
          font-family: 'DM Sans', sans-serif;
        }
        .ck-btn-accept:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 0 28px rgba(99,200,255,.5);
        }

        @media (max-width: 400px) {
          .ck-root { width: calc(100vw - 16px); bottom: 12px; }
          .ck-card { padding: 14px 12px 12px; }
          .ck-btn-essential, .ck-btn-accept { font-size: 11px; padding: 8px 8px; }
        }
      `}</style>

      <div className={`ck-root${leaving ? ' ck-leaving' : ''}`} role="dialog" aria-label="Cookie consent">
        <div className="ck-card">
          <div className="ck-shimmer" aria-hidden />

          <button className="ck-close" onClick={() => accept(false)} aria-label="Fechar">
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="ck-header">
            <div className="ck-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="ck-title">Privacidade &amp; Cookies</span>
          </div>

          <p className="ck-desc">
            Usamos cookies essenciais e analíticos para melhorar a experiência.{' '}
            <Link href="/privacidade">Política de Privacidade</Link>
          </p>

          <div className="ck-btns">
            <button className="ck-btn-essential" onClick={() => accept(false)}>
              Só essenciais
            </button>
            <button className="ck-btn-accept" onClick={() => accept(true)}>
              Aceitar todos
            </button>
          </div>
        </div>
      </div>
    </>
  )
}