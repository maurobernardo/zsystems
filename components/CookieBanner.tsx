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
        @keyframes ckSlideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ckSlideDown { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(20px)} }

        .ck-root {
          position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
          z-index: 80; width: calc(100vw - 32px); max-width: 680px;
          font-family: 'DM Sans', sans-serif;
          animation: ${leaving ? 'ckSlideDown' : 'ckSlideUp'} .4s cubic-bezier(.22,1,.36,1) both;
        }

        .ck-card {
          position: relative; border-radius: 20px;
          border: 1px solid rgba(255,255,255,.09);
          background: rgba(6,8,18,.92);
          backdrop-filter: blur(20px);
          padding: 20px 22px;
          box-shadow: 0 0 0 1px rgba(99,200,255,.06), 0 20px 60px rgba(0,0,0,.7);
          display: flex; gap: 16px; align-items: flex-start;
          flex-wrap: wrap;
        }

        .ck-top-line {
          position: absolute; top: 0; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99,200,255,.5), transparent);
          border-radius: 1px;
        }

        .ck-icon {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          background: rgba(99,200,255,.08);
          border: 1px solid rgba(99,200,255,.2);
          display: flex; align-items: center; justify-content: center;
          color: #63C8FF;
        }

        .ck-text-wrap { flex: 1; min-width: 200px; }

        .ck-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; color: #fff;
          margin-bottom: 5px;
        }

        .ck-desc {
          font-size: 12px; color: rgba(255,255,255,.45); line-height: 1.6;
        }

        .ck-desc a {
          color: rgba(99,200,255,.8); text-decoration: none;
        }
        .ck-desc a:hover { color: #63C8FF; text-decoration: underline; }

        .ck-btns {
          display: flex; gap: 8px; align-items: center; flex-shrink: 0;
          flex-wrap: wrap;
        }

        .ck-btn-accept {
          padding: 8px 18px; border-radius: 100px;
          font-size: 12px; font-weight: 600; letter-spacing: .02em;
          color: #020408; border: none; cursor: pointer;
          background: linear-gradient(135deg, #63C8FF, #A78BFA);
          background-size: 200% 200%;
          box-shadow: 0 0 16px rgba(99,200,255,.25);
          transition: transform .2s, box-shadow .2s;
        }
        .ck-btn-accept:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow: 0 0 28px rgba(99,200,255,.45);
        }

        .ck-btn-essential {
          padding: 7px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,.6); cursor: pointer;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.1);
          transition: all .2s;
        }
        .ck-btn-essential:hover {
          background: rgba(255,255,255,.1);
          color: #fff; border-color: rgba(255,255,255,.2);
        }

        .ck-close {
          position: absolute; top: 12px; right: 12px;
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(255,255,255,.06); border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,.4); transition: all .2s;
        }
        .ck-close:hover { background: rgba(255,255,255,.12); color: #fff; }

        @media (max-width: 520px) {
          .ck-card { flex-direction: column; }
          .ck-btns { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      <div className="ck-root" role="dialog" aria-label="Cookie consent">
        <div className="ck-card">
          <div className="ck-top-line" aria-hidden />

          {/* Close */}
          <button className="ck-close" onClick={() => accept(false)} aria-label="Fechar">
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon */}
          <div className="ck-icon">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          {/* Text */}
          <div className="ck-text-wrap">
            <div className="ck-title">Privacidade &amp; Cookies</div>
            <div className="ck-desc">
              Usamos cookies essenciais para o funcionamento do site e cookies analíticos para melhorar a experiência.{' '}
              <Link href="/privacidade">Política de Privacidade</Link>
            </div>
          </div>

          {/* Buttons */}
          <div className="ck-btns">
            <button className="ck-btn-essential" onClick={() => accept(false)}>
              Apenas essenciais
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