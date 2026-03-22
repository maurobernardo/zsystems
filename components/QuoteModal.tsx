'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const WA_NUMBER = '258870107006'

type Step = 1 | 2 | 3

const PROJECT_TYPES_PT = ['Website Institucional', 'Sistema Web / App', 'Design UX/UI', 'Infraestrutura / Redes', 'API / Integração', 'Outro']
const PROJECT_TYPES_EN = ['Corporate Website', 'Web System / App', 'UX/UI Design', 'Infrastructure / Networks', 'API / Integration', 'Other']

const BUDGETS_PT = ['Menos de 10.000MT', '10.000– 15.000MT', '15.000 – 25.000MT', 'Mais de 25.000MT', 'A definir']
const BUDGETS_EN = ['Less than 10.000MT', '10.000 – 15.000MT', '15.000 – 25.000MT', 'More than 25.000MT', 'To be defined']

const DEADLINES_PT = ['Urgente (< 2 semanas)', '1 mês', '2 – 3 meses', 'Mais de 3 meses', 'Flexível']
const DEADLINES_EN = ['Urgent (< 2 weeks)', '1 month', '2 – 3 months', 'More than 3 months', 'Flexible']

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function QuoteModal({ isOpen, onClose }: Props) {
  const { language } = useLanguage()
  const ispt = language === 'pt'

  const [step, setStep] = useState<Step>(1)
  const [projectType, setProjectType] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [closing, setClosing] = useState(false)

  const projectTypes = ispt ? PROJECT_TYPES_PT : PROJECT_TYPES_EN
  const budgets      = ispt ? BUDGETS_PT      : BUDGETS_EN
  const deadlines    = ispt ? DEADLINES_PT    : DEADLINES_EN

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setStep(1); setProjectType(''); setBudget(''); setDeadline(''); setClosing(false)
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    if (isOpen) window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen])

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 350)
  }

  const sendToWhatsApp = () => {
    const msg = ispt
      ? `Olá Z-Systems! Tenho interesse num orçamento.\n\n📋 *Tipo de projecto:* ${projectType}\n💰 *Orçamento:* ${budget}\n⏱️ *Prazo:* ${deadline}\n\nAguardo o vosso contacto!`
      : `Hello Z-Systems! I'm interested in a quote.\n\n📋 *Project type:* ${projectType}\n💰 *Budget:* ${budget}\n⏱️ *Timeline:* ${deadline}\n\nLooking forward to hearing from you!`
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
    handleClose()
  }

  if (!isOpen) return null

  const progress = ((step - 1) / 2) * 100

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes qmFadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes qmFadeOut { from{opacity:1} to{opacity:0} }
        @keyframes qmSlideIn { from{opacity:0;transform:scale(.92) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes qmSlideOut{ from{opacity:1;transform:scale(1) translateY(0)} to{opacity:0;transform:scale(.92) translateY(16px)} }
        @keyframes qmGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes qmPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }

        .qm-backdrop {
          position:fixed; inset:0; z-index:9999;
          background:rgba(2,4,8,.85); backdrop-filter:blur(16px);
          display:flex; align-items:center; justify-content:center; padding:20px;
          animation:${closing ? 'qmFadeOut' : 'qmFadeIn'} .35s ease both;
        }

        .qm-card {
          position:relative; width:100%; max-width:480px;
          border-radius:24px;
          border:1px solid rgba(255,255,255,.09);
          background:rgba(6,8,18,.97);
          backdrop-filter:blur(24px);
          padding:36px 32px 32px;
          font-family:'DM Sans',sans-serif;
          animation:${closing ? 'qmSlideOut' : 'qmSlideIn'} .4s cubic-bezier(.22,1,.36,1) both;
          box-shadow:0 0 0 1px rgba(99,200,255,.07), 0 40px 80px rgba(0,0,0,.7);
        }

        .qm-top-line {
          position:absolute; top:0; left:10%; right:10%; height:1px;
          background:linear-gradient(90deg,transparent,rgba(99,200,255,.6),transparent);
        }
        .qm-corner { position:absolute; width:16px; height:16px; border-width:1.5px; border-style:solid; }
        .qm-c-tl { top:12px; left:12px; border-right:none; border-bottom:none; border-color:rgba(99,200,255,.4); border-radius:4px 0 0 0; }
        .qm-c-br { bottom:12px; right:12px; border-left:none; border-top:none; border-color:rgba(167,139,250,.4); border-radius:0 0 4px 0; }

        /* Close */
        .qm-close {
          position:absolute; top:14px; right:14px;
          width:30px; height:30px; border-radius:50%;
          background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1);
          display:flex; align-items:center; justify-content:center;
          color:rgba(255,255,255,.45); cursor:pointer; transition:all .2s;
        }
        .qm-close:hover { background:rgba(255,255,255,.12); color:#fff; transform:rotate(90deg); }

        /* Progress bar */
        .qm-progress-wrap {
          height:3px; border-radius:2px; background:rgba(255,255,255,.07);
          margin-bottom:28px; overflow:hidden;
        }
        .qm-progress-fill {
          height:100%; border-radius:2px;
          background:linear-gradient(90deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%; animation:qmGrad 3s linear infinite;
          transition:width .5s cubic-bezier(.22,1,.36,1);
        }

        /* Step indicator */
        .qm-step-label {
          font-size:10px; font-weight:600; letter-spacing:.18em;
          text-transform:uppercase; color:rgba(99,200,255,.7);
          margin-bottom:8px;
        }

        /* Title */
        .qm-title {
          font-family:'Syne',sans-serif;
          font-size:20px; font-weight:800; color:#fff;
          margin-bottom:24px; line-height:1.2;
        }

        /* Options grid */
        .qm-options {
          display:grid; grid-template-columns:1fr 1fr;
          gap:10px; margin-bottom:28px;
        }
        .qm-option {
          padding:12px 14px; border-radius:14px;
          border:1px solid rgba(255,255,255,.1);
          background:rgba(255,255,255,.03);
          font-size:13px; font-weight:500; color:rgba(255,255,255,.65);
          cursor:pointer; text-align:left;
          transition:all .2s cubic-bezier(.22,1,.36,1);
          display:flex; align-items:center; gap:8px;
          font-family:'DM Sans',sans-serif;
        }
        .qm-option:hover {
          background:rgba(99,200,255,.08);
          border-color:rgba(99,200,255,.3);
          color:#fff;
        }
        .qm-option.selected {
          background:rgba(99,200,255,.12);
          border-color:rgba(99,200,255,.5);
          color:#fff;
        }
        .qm-option-dot {
          width:7px; height:7px; border-radius:50%; flex-shrink:0;
          background:rgba(99,200,255,.3);
          transition:background .2s, box-shadow .2s;
        }
        .qm-option.selected .qm-option-dot {
          background:#63C8FF;
          box-shadow:0 0 8px #63C8FF;
          animation:qmPulse 2s ease-in-out infinite;
        }

        /* Nav buttons */
        .qm-nav {
          display:flex; gap:10px; align-items:center;
        }
        .qm-btn-back {
          padding:10px 18px; border-radius:100px;
          font-size:13px; font-weight:500;
          color:rgba(255,255,255,.5); cursor:pointer;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.1);
          transition:all .2s; font-family:'DM Sans',sans-serif;
        }
        .qm-btn-back:hover { background:rgba(255,255,255,.1); color:#fff; }

        .qm-btn-next {
          flex:1; padding:11px 20px; border-radius:100px;
          font-size:13px; font-weight:600; cursor:pointer; border:none;
          color:#020408;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%; animation:qmGrad 4s linear infinite;
          box-shadow:0 0 20px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s, opacity .2s;
          font-family:'DM Sans',sans-serif;
        }
        .qm-btn-next:disabled { opacity:.35; cursor:not-allowed; }
        .qm-btn-next:not(:disabled):hover {
          transform:translateY(-1px) scale(1.02);
          box-shadow:0 0 40px rgba(99,200,255,.45);
        }

        /* Summary step */
        .qm-summary {
          display:flex; flex-direction:column; gap:10px;
          margin-bottom:24px;
        }
        .qm-summary-item {
          display:flex; align-items:center; gap:12px;
          padding:12px 16px; border-radius:14px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
        }
        .qm-summary-icon {
          width:32px; height:32px; border-radius:9px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          font-size:16px;
        }
        .qm-summary-label {
          font-size:10px; color:rgba(255,255,255,.35); letter-spacing:.08em;
          text-transform:uppercase; margin-bottom:2px;
        }
        .qm-summary-value { font-size:14px; font-weight:500; color:#fff; }

        .qm-wa-btn {
          width:100%; padding:13px; border-radius:100px;
          font-size:14px; font-weight:700; cursor:pointer; border:none;
          color:#fff; display:flex; align-items:center; justify-content:center; gap:10px;
          background:linear-gradient(135deg,#25D366,#128C7E);
          box-shadow:0 0 24px rgba(37,211,102,.3);
          transition:transform .2s, box-shadow .2s;
          font-family:'DM Sans',sans-serif;
        }
        .qm-wa-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 40px rgba(37,211,102,.5); }

        @media(max-width:480px){
          .qm-card { padding:28px 20px 24px; }
          .qm-options { grid-template-columns:1fr; }
        }
      `}</style>

      <div className="qm-backdrop" onClick={handleClose}>
        <div className="qm-card" onClick={e => e.stopPropagation()}>
          <div className="qm-top-line" />
          <div className="qm-corner qm-c-tl" />
          <div className="qm-corner qm-c-br" />

          {/* Close */}
          <button className="qm-close" onClick={handleClose} aria-label="Fechar">
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress */}
          <div className="qm-progress-wrap">
            <div className="qm-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* STEP 1 — Project type */}
          {step === 1 && (
            <>
              <div className="qm-step-label">{ispt ? 'Passo 1 de 3' : 'Step 1 of 3'}</div>
              <div className="qm-title">{ispt ? 'Que tipo de projecto precisa?' : 'What type of project do you need?'}</div>
              <div className="qm-options">
                {projectTypes.map(opt => (
                  <button
                    key={opt}
                    className={`qm-option${projectType === opt ? ' selected' : ''}`}
                    onClick={() => setProjectType(opt)}
                  >
                    <span className="qm-option-dot" />
                    {opt}
                  </button>
                ))}
              </div>
              <div className="qm-nav">
                <button
                  className="qm-btn-next"
                  disabled={!projectType}
                  onClick={() => setStep(2)}
                >
                  {ispt ? 'Continuar →' : 'Continue →'}
                </button>
              </div>
            </>
          )}

          {/* STEP 2 — Budget */}
          {step === 2 && (
            <>
              <div className="qm-step-label">{ispt ? 'Passo 2 de 3' : 'Step 2 of 3'}</div>
              <div className="qm-title">{ispt ? 'Qual o orçamento estimado?' : 'What is the estimated budget?'}</div>
              <div className="qm-options">
                {budgets.map(opt => (
                  <button
                    key={opt}
                    className={`qm-option${budget === opt ? ' selected' : ''}`}
                    onClick={() => setBudget(opt)}
                  >
                    <span className="qm-option-dot" />
                    {opt}
                  </button>
                ))}
              </div>
              <div className="qm-nav">
                <button className="qm-btn-back" onClick={() => setStep(1)}>← {ispt ? 'Voltar' : 'Back'}</button>
                <button className="qm-btn-next" disabled={!budget} onClick={() => setStep(3)}>
                  {ispt ? 'Continuar →' : 'Continue →'}
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — Deadline + Summary */}
          {step === 3 && (
            <>
              <div className="qm-step-label">{ispt ? 'Passo 3 de 3' : 'Step 3 of 3'}</div>
              <div className="qm-title">{ispt ? 'Qual o prazo desejado?' : 'What is the desired timeline?'}</div>
              <div className="qm-options">
                {deadlines.map(opt => (
                  <button
                    key={opt}
                    className={`qm-option${deadline === opt ? ' selected' : ''}`}
                    onClick={() => setDeadline(opt)}
                  >
                    <span className="qm-option-dot" />
                    {opt}
                  </button>
                ))}
              </div>

              {deadline && (
                <>
                  {/* Summary */}
                  <div className="qm-summary">
                    {[
                      { icon: '💻', label: ispt ? 'Projecto' : 'Project', value: projectType },
                      { icon: '💰', label: ispt ? 'Orçamento' : 'Budget', value: budget },
                      { icon: '⏱️', label: ispt ? 'Prazo' : 'Timeline', value: deadline },
                    ].map(s => (
                      <div key={s.label} className="qm-summary-item">
                        <div className="qm-summary-icon"
                          style={{ background: 'rgba(99,200,255,.08)', border: '1px solid rgba(99,200,255,.2)' }}>
                          <svg width="14" height="14" fill="none" stroke="#63C8FF" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <div className="qm-summary-label">{s.label}</div>
                          <div className="qm-summary-value">{s.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="qm-wa-btn" onClick={sendToWhatsApp}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    {ispt ? 'Enviar pelo WhatsApp' : 'Send via WhatsApp'}
                  </button>
                </>
              )}

              {!deadline && (
                <div className="qm-nav">
                  <button className="qm-btn-back" onClick={() => setStep(2)}>← {ispt ? 'Voltar' : 'Back'}</button>
                  <button className="qm-btn-next" disabled>{ispt ? 'Seleccione um prazo' : 'Select a timeline'}</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}