'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Social links ───────────────────────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/share/1891R3wjg9/?mibextid=wwXIfr',
    label: 'Facebook',
    hue: 220,
    icon: (
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/zsystems9?igsh=ZTB3ZGp5dzlncXYy',
    label: 'Instagram',
    hue: 330,
    icon: (
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    href: 'https://www.linkedin.com/company/z-systemss/',
    label: 'LinkedIn',
    hue: 205,
    icon: (
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: 'https://www.tiktok.com/@zsystems9?_r=1&_t=ZS-94h5nvPPifF',
    label: 'TikTok',
    hue: 180,
    icon: (
      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
]

/* ─── Social button ──────────────────────────────────────────────────────── */
function SocialBtn({ href, label, hue, icon }: (typeof SOCIAL_LINKS)[0]) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="ss-btn"
      style={{
        background: hovered
          ? `hsla(${hue},80%,55%,0.15)`
          : 'rgba(255,255,255,0.04)',
        borderColor: hovered
          ? `hsla(${hue},80%,65%,0.6)`
          : 'rgba(255,255,255,0.1)',
        color: hovered
          ? `hsla(${hue},90%,72%,1)`
          : 'rgba(255,255,255,0.45)',
        boxShadow: hovered
          ? `0 0 16px hsla(${hue},80%,55%,0.3), inset 0 0 8px hsla(${hue},80%,55%,0.06)`
          : 'none',
        transform: hovered ? 'scale(1.18) translateX(3px)' : 'scale(1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow dot */}
      <div
        className="ss-btn-glow"
        style={{
          background: `hsla(${hue},80%,65%,0.5)`,
          opacity: hovered ? 1 : 0,
        }}
      />
      {icon}

      {/* Tooltip */}
      <div
        className="ss-tooltip"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>
    </a>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function SocialSidebar() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const followLabel = t('footer.follow')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');

        @keyframes ssPulse  { 0%,100%{opacity:.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.08)} }
        @keyframes ssSlide  { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes ssFadeIn { from{opacity:0} to{opacity:1} }

        /* ── Sidebar root ── */
        .ss-root {
          display:none;
          position:fixed; left:0; top:50%; transform:translateY(-50%);
          z-index:40; flex-direction:row; align-items:center;
          pointer-events:auto;
          animation:ssSlide .7s cubic-bezier(.22,1,.36,1) .8s both;
        }
        @media(min-width:768px){ .ss-root { display:flex; } }

        /* vertical line */
        .ss-line {
          width:1px;
          height:140px;
          background:linear-gradient(to bottom,
            transparent 0%,
            rgba(99,200,255,0.6) 30%,
            rgba(99,200,255,0.6) 70%,
            transparent 100%
          );
          animation:ssPulse 3s ease-in-out infinite;
          flex-shrink:0;
        }

        /* content col */
        .ss-col {
          display:flex; flex-direction:column;
          align-items:center; padding-left:10px;
          gap:0;
        }

        /* follow label */
        .ss-label {
          font-family:'DM Sans',sans-serif;
          font-size:9px; font-weight:600;
          letter-spacing:.25em; text-transform:uppercase;
          color:rgba(99,200,255,0.6);
          margin-bottom:12px;
          white-space:nowrap;
          writing-mode:vertical-rl;
          text-orientation:mixed;
          transform:rotate(180deg);
          user-select:none;
        }

        /* buttons */
        .ss-buttons { display:flex; flex-direction:column; gap:8px; }

        .ss-btn {
          position:relative;
          width:32px; height:32px; border-radius:10px;
          display:flex; align-items:center; justify-content:center;
          border-width:1px; border-style:solid;
          transition:all .25s cubic-bezier(.22,1,.36,1);
          text-decoration:none; flex-shrink:0;
          overflow:visible;
          backdrop-filter:blur(8px);
        }

        .ss-btn-glow {
          position:absolute; inset:0; border-radius:10px;
          pointer-events:none;
          filter:blur(6px);
          z-index:-1;
          transition:opacity .25s;
        }

        /* tooltip */
        .ss-tooltip {
          position:absolute; left:calc(100% + 10px);
          background:rgba(2,4,8,0.85);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(12px);
          padding:4px 10px; border-radius:8px;
          font-family:'DM Sans',sans-serif;
          font-size:11px; font-weight:500;
          color:rgba(255,255,255,0.85);
          white-space:nowrap;
          transition:opacity .2s, transform .2s;
          box-shadow:0 4px 16px rgba(0,0,0,0.4);
        }
        /* tooltip arrow */
        .ss-tooltip::before {
          content:'';
          position:absolute; right:100%; top:50%;
          transform:translateY(-50%);
          border:5px solid transparent;
          border-right-color:rgba(255,255,255,0.1);
        }
      `}</style>

      <div className="ss-root" aria-label="Social links sidebar">
        {/* Animated vertical line */}
        <div className="ss-line" aria-hidden />

        <div className="ss-col">
          {/* Follow label */}
          <span className="ss-label" aria-hidden>{followLabel}</span>

          {/* Social buttons */}
          <div className="ss-buttons">
            {SOCIAL_LINKS.map((social) => (
              <SocialBtn key={social.label} {...social} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}