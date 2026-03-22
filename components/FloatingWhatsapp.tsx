'use client'

import { useState } from 'react'

const HREF = 'https://wa.me/258870107006'

const WA_ICON = (
  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

export default function FloatingWhatsapp() {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <style>{`
        @keyframes waFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes waRingOut { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(1.85);opacity:0} }
        @keyframes waSlideIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
        @keyframes waBounceIn{ from{opacity:0;transform:scale(.6) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }

        .wa-root {
          position:fixed; bottom:24px; right:20px; z-index:60;
          display:flex; align-items:center; gap:0;
          animation:waBounceIn .5s cubic-bezier(.22,1,.36,1) 1.2s both;
        }

        /* tooltip */
        .wa-tooltip {
          display:flex; flex-direction:column;
          background:rgba(2,4,8,0.88);
          border:1px solid rgba(255,255,255,0.1);
          backdrop-filter:blur(16px);
          border-radius:14px; padding:10px 14px;
          margin-right:10px;
          box-shadow:0 8px 32px rgba(0,0,0,0.5);
          animation:waSlideIn .25s cubic-bezier(.22,1,.36,1) forwards;
          white-space:nowrap;
        }
        .wa-tooltip-title {
          font-size:13px; font-weight:600; color:#fff;
          margin-bottom:2px; font-family:'DM Sans',sans-serif;
        }
        .wa-tooltip-sub {
          font-size:11px; color:rgba(255,255,255,0.4);
          font-family:'DM Sans',sans-serif;
        }
        .wa-tooltip::after {
          content:'';
          position:absolute; right:-6px; top:50%;
          transform:translateY(-50%);
          border:6px solid transparent;
          border-left-color:rgba(255,255,255,0.1);
        }

        /* button */
        .wa-btn {
          position:relative;
          width:56px; height:56px; border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          text-decoration:none; color:#fff; flex-shrink:0;
          background:linear-gradient(135deg,#25D366,#128C7E);
          box-shadow:0 8px 28px rgba(37,211,102,0.45);
          transition:transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s;
          animation:waFloat 3.5s ease-in-out 2s infinite;
        }
        .wa-btn:hover {
          transform:scale(1.1) translateY(-2px) !important;
          box-shadow:0 12px 40px rgba(37,211,102,0.65);
          animation:none;
        }

        /* pulse rings */
        .wa-ring {
          position:absolute; inset:-4px; border-radius:50%;
          border:2px solid rgba(37,211,102,0.55);
          animation:waRingOut 2.2s ease-out infinite;
          pointer-events:none;
        }
        .wa-ring:nth-child(2) { animation-delay:.7s; }

        /* corner accents on button */
        .wa-corner {
          position:absolute; width:10px; height:10px;
          border-width:1.5px; border-style:solid;
          border-color:rgba(255,255,255,0.5);
          pointer-events:none;
          opacity:0; transition:opacity .3s;
        }
        .wa-btn:hover .wa-corner { opacity:1; }
        .wa-corner-tl { top:4px; left:4px; border-right:none; border-bottom:none; border-radius:3px 0 0 0; }
        .wa-corner-br { bottom:4px; right:4px; border-left:none; border-top:none; border-radius:0 0 3px 0; }

        /* notification dot */
        .wa-dot {
          position:absolute; top:2px; right:2px;
          width:12px; height:12px; border-radius:50%;
          background:#fff; border:2px solid #25D366;
          display:flex; align-items:center; justify-content:center;
        }
        .wa-dot-inner {
          width:6px; height:6px; border-radius:50%;
          background:#25D366;
          animation:waRingOut 1.5s ease-out infinite;
        }
      `}</style>

      <div className="wa-root">
        {/* Tooltip — only on hover, desktop */}
        {hovered && (
          <div className="wa-tooltip" style={{ position: 'relative' }}>
            <span className="wa-tooltip-title">Fale connosco</span>
            <span className="wa-tooltip-sub">Resposta rápida · WhatsApp</span>
          </div>
        )}

        {/* Button */}
        <a
          href={HREF}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="wa-btn"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Pulse rings */}
          <div className="wa-ring" />
          <div className="wa-ring" />

          {/* Corner accents */}
          <div className="wa-corner wa-corner-tl" />
          <div className="wa-corner wa-corner-br" />

          {/* Notification dot */}
          <div className="wa-dot">
            <div className="wa-dot-inner" />
          </div>

          {/* Icon */}
          {WA_ICON}
        </a>
      </div>
    </>
  )
}