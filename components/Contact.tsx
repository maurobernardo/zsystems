'use client'

import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Contact info item ─────────────────────────────────────────────────── */
function InfoItem({
  hue, icon, label, value, href,
}: {
  hue: number
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const [hovered, setHovered] = useState(false)
  const inner = (
    <div
      className="ct-info-item"
      style={{
        borderColor: `hsla(${hue},70%,60%,${hovered ? 0.35 : 0.12})`,
        background: hovered ? `hsla(${hue},80%,50%,0.06)` : 'rgba(255,255,255,0.03)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="ct-info-icon" style={{
        background: `hsla(${hue},80%,50%,0.1)`,
        border: `1px solid hsla(${hue},70%,60%,0.25)`,
        color: `hsla(${hue},85%,70%,1)`,
        boxShadow: hovered ? `0 0 16px hsla(${hue},80%,55%,0.25)` : 'none',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}>
        {icon}
      </div>
      <div>
        <p className="ct-info-label">{label}</p>
        <p className="ct-info-value" style={{ color: hovered ? '#fff' : 'rgba(255,255,255,0.8)' }}>
          {value}
        </p>
      </div>
      {/* shimmer line */}
      <div className="ct-info-shimmer" style={{
        background: `linear-gradient(90deg, transparent, hsla(${hue},80%,65%,0.4), transparent)`,
        opacity: hovered ? 1 : 0,
      }} />
    </div>
  )

  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>
    : inner
}

/* ─── Form input ─────────────────────────────────────────────────────────── */
function FormField({
  name, label, placeholder, type = 'text', required = false,
  value, onChange, focused, onFocus, onBlur, rows,
}: {
  name: string; label: string; placeholder: string; type?: string
  required?: boolean; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  focused: boolean; onFocus: () => void; onBlur: () => void; rows?: number
}) {
  const commonStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    borderRadius: 14, fontSize: 14, fontWeight: 400,
    background: focused ? 'rgba(2,4,8,0.8)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused ? 'rgba(99,200,255,0.55)' : 'rgba(255,255,255,0.1)'}`,
    color: '#fff', outline: 'none',
    backdropFilter: 'blur(12px)',
    boxShadow: focused ? '0 0 0 3px rgba(99,200,255,0.12), 0 0 20px rgba(99,200,255,0.08)' : 'none',
    transition: 'all .25s cubic-bezier(.22,1,.36,1)',
    resize: rows ? 'none' as const : undefined,
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div className="ct-field">
      <label className="ct-label" style={{ color: focused ? '#63C8FF' : 'rgba(255,255,255,0.65)' }}>
        {label}{required && <span style={{ color: '#F472B6', marginLeft: 3 }}>*</span>}
      </label>
      {rows ? (
        <textarea
          id={name} name={name} required={required}
          value={value} rows={rows}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          placeholder={placeholder}
          style={{ ...commonStyle, paddingTop: 14 }}
        />
      ) : (
        <input
          id={name} name={name} type={type} required={required}
          value={value}
          onChange={onChange} onFocus={onFocus} onBlur={onBlur}
          placeholder={placeholder}
          style={commonStyle}
        />
      )}
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Contact() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const ispt = language === 'pt'
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', message: '' })
  const [focused, setFocused] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    if (!serviceId || !templateId || !publicKey) {
      setStatus({ type: 'error', msg: ispt ? 'Email não configurado.' : 'Email not configured.' })
      return
    }
    try {
      setSending(true)
      await emailjs.send(serviceId, templateId, {
        title: ispt ? 'Novo contacto - Website' : 'New contact - Website',
        name: formData.name, from_name: formData.name,
        email: formData.email, from_email: formData.email,
        phone: formData.phone, company: formData.company,
        message: formData.message, language,
      }, { publicKey })
      setStatus({ type: 'success', msg: ispt ? 'Obrigado! Entraremos em contacto em breve.' : 'Thank you! We will get back to you soon.' })
      setFormData({ name: '', email: '', phone: '', company: '', message: '' })
    } catch {
      setStatus({ type: 'error', msg: ispt ? 'Não foi possível enviar. Tente novamente.' : 'Could not send. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Ponta+Gea,+Beira,+Mo%C3%A7ambique'

  const infoItems = [
    {
      hue: 195,
      label: ispt ? 'Telefone' : 'Phone',
      value: '+258 87 010 7006',
      href: 'tel:+258870107006',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      hue: 265,
      label: 'Email',
      value: t('header.email'),
      href: `mailto:${t('header.email')}`,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      hue: 145,
      label: ispt ? 'Localização' : 'Location',
      value: 'Ponta-Gea, Beira, Moçambique',
      href: mapsHref,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes ctReveal  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ctGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes ctPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes ctShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes ctOrbMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-14px)} }
        @keyframes ctSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes ctBounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

        /* ── Section ── */
        .ct-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .ct-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .ct-orb {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:ctOrbMove 12s ease-in-out infinite;
        }

        /* ── Header ── */
        .ct-header {
          text-align:center; max-width:680px;
          margin:0 auto 64px; opacity:0;
        }
        .ct-header.visible { animation:ctReveal .9s cubic-bezier(.22,1,.36,1) forwards; }
        .ct-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06); backdrop-filter:blur(10px);
        }
        .ct-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:ctPulse 2s ease-in-out infinite;
        }
        .ct-pill-text {
          font-size:11px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }
        .ct-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:ctGrad 8s linear infinite;
        }
        .ct-subtitle {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
        }

        /* ── Two-col grid ── */
        .ct-grid {
          display:grid; grid-template-columns:1fr 1fr;
          gap:28px; max-width:1100px; margin:0 auto;
        }
        @media(max-width:860px){ .ct-grid { grid-template-columns:1fr; } }

        /* ── Left panel ── */
        .ct-left {
          display:flex; flex-direction:column; gap:0;
          opacity:0;
        }
        .ct-left.visible { animation:ctReveal .9s cubic-bezier(.22,1,.36,1) .1s forwards; }

        .ct-left-card {
          position:relative; border-radius:24px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          padding:32px 28px;
          overflow:hidden;
          flex:1;
        }

        .ct-left-title {
          font-family:'Syne',sans-serif;
          font-size:22px; font-weight:800;
          background:linear-gradient(135deg,#fff 40%,rgba(99,200,255,.7) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:8px;
        }
        .ct-left-desc {
          font-size:14px; font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
          margin-bottom:28px;
        }

        /* info items */
        .ct-info-item {
          position:relative; display:flex; align-items:center; gap:14px;
          padding:14px 16px; border-radius:16px;
          border-width:1px; border-style:solid;
          margin-bottom:10px;
          backdrop-filter:blur(8px);
          transition:all .3s cubic-bezier(.22,1,.36,1);
          overflow:hidden; cursor:pointer;
        }
        .ct-info-icon {
          width:40px; height:40px; border-radius:12px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:transform .3s, box-shadow .3s;
        }
        .ct-info-label {
          font-size:10px; letter-spacing:.12em;
          text-transform:uppercase; color:rgba(255,255,255,.35);
          margin-bottom:2px;
        }
        .ct-info-value { font-size:14px; font-weight:500; transition:color .3s; }
        .ct-info-shimmer {
          position:absolute; bottom:0; left:0; right:0; height:1px;
          background-size:200% 100%;
          animation:ctShimmer 3s linear infinite;
          transition:opacity .4s;
        }

        /* WhatsApp btn */
        .ct-wa-btn {
          display:flex; align-items:center; justify-content:space-between;
          padding:14px 20px; border-radius:100px;
          background:linear-gradient(135deg,#25D366,#128C7E);
          color:#fff; text-decoration:none; font-size:14px; font-weight:600;
          margin-top:20px;
          box-shadow:0 0 24px rgba(37,211,102,0.25);
          transition:transform .2s, box-shadow .2s;
          animation:ctBounce 3s ease-in-out infinite;
        }
        .ct-wa-btn:hover {
          transform:translateY(-2px) scale(1.02);
          box-shadow:0 0 40px rgba(37,211,102,0.45);
        }

        /* Maps card */
        .ct-maps-card {
          display:block; margin-top:14px;
          border-radius:18px; overflow:hidden;
          border:1px solid rgba(99,200,255,.12);
          background:rgba(255,255,255,.03);
          text-decoration:none;
          transition:border-color .3s, box-shadow .3s, transform .3s;
        }
        .ct-maps-card:hover {
          border-color:rgba(99,200,255,.3);
          box-shadow:0 12px 36px rgba(0,0,0,.4);
          transform:translateY(-2px);
        }
        .ct-maps-top { padding:16px 20px 12px; }
        .ct-maps-place { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#fff; margin-bottom:3px; }
        .ct-maps-hint { font-size:11px; color:rgba(255,255,255,.4); letter-spacing:.05em; }
        .ct-maps-bottom {
          padding:14px 20px;
          border-top:1px solid rgba(99,200,255,.1);
          background:rgba(99,200,255,.04);
          display:flex; align-items:center; gap:12px;
        }
        .ct-maps-icon-wrap {
          width:40px; height:40px; border-radius:12px;
          background:rgba(99,200,255,.1); border:1px solid rgba(99,200,255,.2);
          display:flex; align-items:center; justify-content:center;
          color:#63C8FF; flex-shrink:0;
        }
        .ct-maps-cta { font-size:13px; font-weight:600; color:rgba(255,255,255,.8); }

        /* ── Right panel — form ── */
        .ct-right {
          position:relative; border-radius:24px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(20px);
          padding:32px 28px;
          overflow:hidden;
          opacity:0;
          transition:border-color .3s, box-shadow .3s;
        }
        .ct-right.visible { animation:ctReveal .9s cubic-bezier(.22,1,.36,1) .2s forwards; }
        .ct-right:hover {
          border-color:rgba(99,200,255,.15);
          box-shadow:0 24px 60px rgba(0,0,0,.4);
        }

        .ct-right-glow {
          position:absolute; inset:-1px; border-radius:24px;
          pointer-events:none; z-index:0;
          background:radial-gradient(circle at 50% 0%, rgba(99,200,255,0.08) 0%, transparent 60%);
          opacity:0; transition:opacity .5s;
        }
        .ct-right:hover .ct-right-glow { opacity:1; }

        .ct-corner { position:absolute; width:18px; height:18px; border-width:1.5px; border-style:solid; z-index:2; pointer-events:none; }
        .ct-tl { top:16px; left:16px; border-right:none; border-bottom:none; border-color:rgba(99,200,255,0.4); border-radius:4px 0 0 0; }
        .ct-br { bottom:16px; right:16px; border-left:none; border-top:none; border-color:rgba(99,200,255,0.4); border-radius:0 0 4px 0; }

        .ct-form-header {
          display:flex; align-items:center; gap:14px;
          margin-bottom:28px; position:relative; z-index:1;
        }
        .ct-form-icon {
          width:48px; height:48px; border-radius:14px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          background:rgba(99,200,255,.08);
          border:1px solid rgba(99,200,255,.2);
          color:#63C8FF;
          transition:transform .35s, box-shadow .35s;
        }
        .ct-right:hover .ct-form-icon {
          transform:scale(1.08) rotate(-4deg);
          box-shadow:0 0 20px rgba(99,200,255,.25);
        }
        .ct-form-title {
          font-family:'Syne',sans-serif;
          font-size:20px; font-weight:800; color:#fff; margin-bottom:3px;
        }
        .ct-form-sub { font-size:13px; color:rgba(255,255,255,.4); }

        /* fields */
        .ct-field { margin-bottom:16px; position:relative; z-index:1; }
        .ct-label {
          display:block; font-size:12px; font-weight:500;
          letter-spacing:.04em; margin-bottom:6px;
          transition:color .25s;
        }
        .ct-fields-row {
          display:grid; grid-template-columns:1fr 1fr; gap:14px;
        }
        @media(max-width:500px){ .ct-fields-row { grid-template-columns:1fr; } }

        /* status */
        .ct-status {
          padding:12px 16px; border-radius:14px;
          font-size:13px; margin-bottom:16px;
          position:relative; z-index:1;
        }
        .ct-status.success {
          background:rgba(74,222,128,.08);
          border:1px solid rgba(74,222,128,.25);
          color:rgba(134,239,172,1);
        }
        .ct-status.error {
          background:rgba(248,113,113,.08);
          border:1px solid rgba(248,113,113,.25);
          color:rgba(252,165,165,1);
        }

        /* submit btn */
        .ct-submit {
          width:100%; padding:13px 24px; border-radius:100px;
          font-size:14px; font-weight:600; letter-spacing:.02em;
          color:#020408; cursor:pointer; border:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:ctGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s, opacity .2s;
          display:flex; align-items:center; justify-content:center; gap:10px;
          margin-top:20px; position:relative; z-index:1;
        }
        .ct-submit:hover:not(:disabled) {
          transform:translateY(-2px) scale(1.01);
          box-shadow:0 0 44px rgba(99,200,255,.45);
        }
        .ct-submit:disabled { opacity:.6; cursor:not-allowed; }
        .ct-submit-arrow { transition:transform .2s; display:inline-block; }
        .ct-submit:not(:disabled):hover .ct-submit-arrow { transform:translateX(4px); }

        /* spinner */
        .ct-spinner {
          width:16px; height:16px; border-radius:50%;
          border:2px solid rgba(2,4,8,0.3);
          border-top-color:rgba(2,4,8,0.9);
          animation:ctSpin .7s linear infinite;
        }

        @media(max-width:600px){
          .ct-root { padding:64px 0 80px; }
          .ct-left-card, .ct-right { padding:24px 20px; }
        }
      `}</style>

      <section ref={sectionRef} id="contact" className="ct-root">
        <div className="ct-grid-bg" aria-hidden />
        <div className="ct-orb" aria-hidden style={{ width:500, height:500, top:'-10%', right:'-6%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="ct-orb" aria-hidden style={{ width:400, height:400, bottom:'-8%', left:'-5%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'5s' }} />
        <div className="ct-orb" aria-hidden style={{ width:260, height:260, top:'40%', left:'35%', background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay:'9s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`ct-header${visible ? ' visible' : ''}`}>
            <div className="ct-pill">
              <span className="ct-pill-dot" />
              <span className="ct-pill-text">{t('contact.tagline')}</span>
            </div>
            <h2 className="ct-h2">{t('contact.title')}</h2>
            <p className="ct-subtitle">{t('contact.subtitle')}</p>
          </div>

          <div className="ct-grid">

            {/* ── LEFT ───────────────────────────────────────────────── */}
            <div className={`ct-left${visible ? ' visible' : ''}`}>
              <div className="ct-left-card">
                {/* Corner accents */}
                <div className="ct-corner ct-tl" />
                <div className="ct-corner ct-br" />

                <h3 className="ct-left-title">{t('contact.getInTouch')}</h3>
                <p className="ct-left-desc">{t('contact.description')}</p>

                {/* Info items */}
                {infoItems.map((item) => (
                  <InfoItem key={item.label} {...item} />
                ))}

                {/* WhatsApp */}
                <a href="https://wa.me/258870107006" target="_blank" rel="noopener noreferrer" className="ct-wa-btn">
                  <span>{ispt ? 'Fale connosco no WhatsApp' : 'Chat with us on WhatsApp'}</span>
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                {/* Maps */}
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="ct-maps-card">
                  <div className="ct-maps-top">
                    <div className="ct-maps-place">{ispt ? 'Bairro Ponta-Gea, Beira' : 'Ponta-Gea District, Beira'}</div>
                    <div className="ct-maps-hint">{ispt ? 'Clique para abrir no Google Maps' : 'Click to open in Google Maps'}</div>
                  </div>
                  <div className="ct-maps-bottom">
                    <div className="ct-maps-icon-wrap">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="ct-maps-cta">{ispt ? 'Ver no Google Maps →' : 'View on Google Maps →'}</span>
                  </div>
                </a>
              </div>
            </div>

            {/* ── RIGHT — Form ────────────────────────────────────────── */}
            <div className={`ct-right${visible ? ' visible' : ''}`}>
              <div className="ct-right-glow" />
              <div className="ct-corner ct-tl" />
              <div className="ct-corner ct-br" />

              {/* Form header */}
              <div className="ct-form-header">
                <div className="ct-form-icon">
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="ct-form-title">{ispt ? 'Enviar Mensagem' : 'Send a Message'}</div>
                  <div className="ct-form-sub">{ispt ? 'Respondemos em menos de 24h' : 'We reply in less than 24h'}</div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Status */}
                {status && (
                  <div className={`ct-status ${status.type}`}>
                    {status.msg}
                  </div>
                )}

                {/* Name + Email */}
                <div className="ct-fields-row">
                  <FormField
                    name="name" label={t('contact.form.name')}
                    placeholder={t('contact.form.namePlaceholder')}
                    required value={formData.name}
                    onChange={handleChange}
                    focused={focused === 'name'}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                  />
                  <FormField
                    name="email" label={t('contact.form.email')}
                    placeholder={t('contact.form.emailPlaceholder')}
                    type="email" required value={formData.email}
                    onChange={handleChange}
                    focused={focused === 'email'}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                {/* Phone + Company */}
                <div className="ct-fields-row">
                  <FormField
                    name="phone" label={t('contact.form.phone')}
                    placeholder={t('contact.form.phonePlaceholder')}
                    type="tel" value={formData.phone}
                    onChange={handleChange}
                    focused={focused === 'phone'}
                    onFocus={() => setFocused('phone')}
                    onBlur={() => setFocused(null)}
                  />
                  <FormField
                    name="company" label={t('contact.form.company')}
                    placeholder={t('contact.form.companyPlaceholder')}
                    value={formData.company}
                    onChange={handleChange}
                    focused={focused === 'company'}
                    onFocus={() => setFocused('company')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                {/* Message */}
                <FormField
                  name="message" label={t('contact.form.message')}
                  placeholder={t('contact.form.messagePlaceholder')}
                  required value={formData.message} rows={5}
                  onChange={handleChange}
                  focused={focused === 'message'}
                  onFocus={() => setFocused('message')}
                  onBlur={() => setFocused(null)}
                />

                {/* Submit */}
                <button type="submit" disabled={sending} className="ct-submit">
                  {sending ? (
                    <>
                      <div className="ct-spinner" />
                      <span>{ispt ? 'A enviar...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('contact.form.send')}</span>
                      <span className="ct-submit-arrow">→</span>
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}