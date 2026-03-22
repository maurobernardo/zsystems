'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

/* Working hours: 8:00 – 20:00 every day (Mozambique = UTC+2) */
const OPEN_HOUR  = 8
const CLOSE_HOUR = 20
const TZ_OFFSET  = 2 // UTC+2

function getStatus() {
  const now = new Date()
  // Convert to Mozambique time
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const mzTime = new Date(utc + TZ_OFFSET * 3600000)
  const hour = mzTime.getHours()

  if (hour >= OPEN_HOUR && hour < CLOSE_HOUR) {
    return 'open' as const
  }
  return 'closed' as const
}

function getNextOpenIn() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const mzTime = new Date(utc + TZ_OFFSET * 3600000)
  const hour = mzTime.getHours()
  const min  = mzTime.getMinutes()

  if (hour < OPEN_HOUR) {
    const hoursLeft = OPEN_HOUR - hour - (min > 0 ? 1 : 0)
    const minsLeft  = min > 0 ? 60 - min : 0
    if (hoursLeft === 0) return `${minsLeft}min`
    if (minsLeft  === 0) return `${hoursLeft}h`
    return `${hoursLeft}h ${minsLeft}min`
  }
  // After CLOSE_HOUR — opens tomorrow
  const hoursLeft = 24 - hour + OPEN_HOUR - (min > 0 ? 1 : 0)
  return `${hoursLeft}h`
}

export default function AvailabilityBadge() {
  const { language } = useLanguage()
  const ispt = language === 'pt'
  const [status, setStatus] = useState<'open' | 'closed'>('open')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStatus(getStatus())
    // Update every minute
    const iv = setInterval(() => setStatus(getStatus()), 60000)
    return () => clearInterval(iv)
  }, [])

  if (!mounted) return null

  const isOpen = status === 'open'

  return (
    <>
      <style>{`
        @keyframes avPulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes avSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

        .av-badge {
          display:inline-flex; align-items:center; gap:8px;
          padding:6px 14px; border-radius:100px;
          backdrop-filter:blur(12px);
          animation:avSlide .6s cubic-bezier(.22,1,.36,1) 1.4s both;
          cursor:default; user-select:none;
        }
        .av-badge.open {
          background:rgba(74,222,128,.08);
          border:1px solid rgba(74,222,128,.25);
        }
        .av-badge.closed {
          background:rgba(251,191,36,.07);
          border:1px solid rgba(251,191,36,.2);
        }
        .av-dot {
          width:7px; height:7px; border-radius:50%; flex-shrink:0;
          animation:avPulse 2s ease-in-out infinite;
        }
        .av-badge.open  .av-dot { background:#4ade80; box-shadow:0 0 8px #4ade80; }
        .av-badge.closed .av-dot { background:#fbbf24; box-shadow:0 0 8px #fbbf24; }
        .av-text { font-size:12px; font-weight:500; }
        .av-badge.open  .av-text { color:rgba(74,222,128,.9); }
        .av-badge.closed .av-text { color:rgba(251,191,36,.9); }
      `}</style>

      <div className={`av-badge ${status}`} title={isOpen ? (ispt ? 'Equipa disponível agora' : 'Team available now') : (ispt ? `Disponível em ${getNextOpenIn()}` : `Available in ${getNextOpenIn()}`)}>
        <span className="av-dot" />
        <span className="av-text">
          {isOpen
            ? (ispt ? 'Disponível agora' : 'Available now')
            : (ispt ? `Disponível em ${getNextOpenIn()}` : `Available in ${getNextOpenIn()}`)}
        </span>
      </div>
    </>
  )
}