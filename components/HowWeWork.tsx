'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

const STEPS_PT = [
  {
    num: '01',
    title: 'Reunião Inicial',
    desc: 'Conversamos para entender a sua visão, objectivos e necessidades. Sem compromisso, sem custo.',
    hue: 195,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Design & Protótipo',
    desc: 'Criamos wireframes e protótipos visuais. Só avançamos para o código após a sua aprovação.',
    hue: 265,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Desenvolvimento',
    desc: 'Construímos com código limpo, seguro e escalável. Actualizações semanais de progresso.',
    hue: 145,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Entrega & Suporte',
    desc: 'Lançamos o projecto, fazemos a formação e ficamos disponíveis para suporte contínuo.',
    hue: 330,
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const STEPS_EN = [
  {
    num: '01',
    title: 'Initial Meeting',
    desc: 'We talk to understand your vision, goals and needs. No commitment, no cost.',
    hue: 195,
    icon: STEPS_PT[0].icon,
  },
  {
    num: '02',
    title: 'Design & Prototype',
    desc: 'We create wireframes and visual prototypes. We only move to code after your approval.',
    hue: 265,
    icon: STEPS_PT[1].icon,
  },
  {
    num: '03',
    title: 'Development',
    desc: 'We build with clean, secure and scalable code. Weekly progress updates.',
    hue: 145,
    icon: STEPS_PT[2].icon,
  },
  {
    num: '04',
    title: 'Delivery & Support',
    desc: 'We launch the project, provide training and remain available for ongoing support.',
    hue: 330,
    icon: STEPS_PT[3].icon,
  },
]

export default function HowWeWork() {
  const { language } = useLanguage()
  const ispt = language === 'pt'
  const steps = ispt ? STEPS_PT : STEPS_EN
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [lineWidth, setLineWidth] = useState(0)
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true)
          // Animate line growing
          let w = 0
          const interval = setInterval(() => {
            w += 2
            setLineWidth(Math.min(w, 100))
            if (w >= 100) clearInterval(interval)
          }, 16)
          // Activate steps sequentially
          steps.forEach((_, i) => {
            setTimeout(() => setActiveStep(i), 400 + i * 300)
          })
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [steps])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes hwwFadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hwwGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes hwwPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes hwwRing    { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.7);opacity:0} }
        @keyframes hwwOrbMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px)} }
        @keyframes hwwFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .hww-root {
          position:relative; overflow:hidden;
          background:#020408; padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .hww-grid {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px,transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px,transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 0%,transparent 100%);
        }
        .hww-orb {
          position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none;
          animation:hwwOrbMove 12s ease-in-out infinite;
        }

        /* header */
        .hww-header {
          text-align:center; max-width:640px; margin:0 auto 72px;
          opacity:0;
        }
        .hww-header.visible { animation:hwwFadeUp .9s cubic-bezier(.22,1,.36,1) forwards; }
        .hww-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2); background:rgba(99,200,255,.06);
          backdrop-filter:blur(10px);
        }
        .hww-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:hwwPulse 2s ease-in-out infinite;
        }
        .hww-pill-text { font-size:11px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#63C8FF; }
        .hww-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px); font-weight:800; line-height:1.1;
          letter-spacing:-.02em; margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:hwwGrad 8s linear infinite;
        }
        .hww-subtitle { font-size:15px; font-weight:300; color:rgba(255,255,255,.5); line-height:1.7; }

        /* timeline track */
        .hww-track-wrap {
          position:relative; max-width:1100px; margin:0 auto;
          padding:0 24px;
        }

        /* horizontal line */
        .hww-line-bg {
          position:absolute; top:52px; left:calc(24px + 8%); right:calc(24px + 8%);
          height:2px; background:rgba(255,255,255,.06); border-radius:2px;
        }
        .hww-line-fill {
          height:100%; border-radius:2px;
          background:linear-gradient(90deg,#63C8FF,#A78BFA,#F472B6,#4ade80);
          background-size:300% 100%;
          animation:hwwGrad 3s linear infinite;
          transition:width 1.6s cubic-bezier(.22,1,.36,1);
        }

        /* steps grid */
        .hww-steps {
          display:grid; grid-template-columns:repeat(4,1fr);
          gap:20px; position:relative; z-index:1;
        }

        /* step card */
        .hww-step {
          display:flex; flex-direction:column; align-items:center;
          text-align:center; padding:0 8px;
          opacity:0; transform:translateY(24px);
          transition:opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1);
        }
        .hww-step.active { opacity:1; transform:translateY(0); }

        /* icon circle */
        .hww-icon-wrap {
          position:relative; margin-bottom:20px;
        }
        .hww-icon-ring {
          position:absolute; inset:-8px; border-radius:50%;
          border-width:1px; border-style:solid;
          animation:hwwRing 2.5s ease-out infinite;
          opacity:0; transition:opacity .4s;
        }
        .hww-step.active .hww-icon-ring { opacity:1; }

        .hww-icon-circle {
          width:64px; height:64px; border-radius:20px;
          display:flex; align-items:center; justify-content:center;
          border-width:1px; border-style:solid;
          backdrop-filter:blur(12px);
          transition:all .4s cubic-bezier(.22,1,.36,1);
          position:relative; z-index:1;
          animation:hwwFloat 4s ease-in-out infinite;
        }

        .hww-num {
          font-family:'Syne',sans-serif;
          font-size:11px; font-weight:700; letter-spacing:.12em;
          margin-bottom:10px; transition:color .4s;
        }
        .hww-title {
          font-family:'Syne',sans-serif;
          font-size:16px; font-weight:700; color:#fff;
          margin-bottom:10px; line-height:1.25;
        }
        .hww-desc {
          font-size:13px; color:rgba(255,255,255,.5);
          line-height:1.65;
        }

        /* connector dots on the line */
        .hww-dot {
          width:12px; height:12px; border-radius:50%;
          margin:0 auto 8px;
          border-width:2px; border-style:solid;
          transition:all .4s;
          position:relative; z-index:2;
        }
        .hww-step.active .hww-dot {
          box-shadow:0 0 12px currentColor;
        }

        /* bottom CTA */
        .hww-cta {
          text-align:center; margin-top:64px;
          opacity:0;
        }
        .hww-cta.visible { animation:hwwFadeUp .9s cubic-bezier(.22,1,.36,1) .3s forwards; }
        .hww-cta-btn {
          display:inline-flex; align-items:center; gap:10px;
          padding:13px 28px; border-radius:100px;
          font-size:14px; font-weight:600; color:#020408; text-decoration:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%; animation:hwwGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
        }
        .hww-cta-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 44px rgba(99,200,255,.45); }
        .hww-cta-arrow { transition:transform .2s; display:inline-block; }
        .hww-cta-btn:hover .hww-cta-arrow { transform:translateX(4px); }

        /* mobile */
        @media(max-width:768px){
          .hww-root { padding:64px 0 80px; }
          .hww-steps { grid-template-columns:1fr 1fr; gap:24px; }
          .hww-line-bg { display:none; }
        }
        @media(max-width:480px){
          .hww-steps { grid-template-columns:1fr; }
        }
      `}</style>

      <section ref={sectionRef} id="how-we-work" className="hww-root">
        <div className="hww-grid" aria-hidden />
        <div className="hww-orb" aria-hidden style={{ width:500,height:500,top:'-12%',right:'-6%',background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)',animationDelay:'0s' }} />
        <div className="hww-orb" aria-hidden style={{ width:400,height:400,bottom:'-8%',left:'-5%',background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)',animationDelay:'5s' }} />

        <div style={{ maxWidth:1200,margin:'0 auto',padding:'0 24px' }}>

          {/* Header */}
          <div className={`hww-header${visible ? ' visible' : ''}`}>
            <div className="hww-pill">
              <span className="hww-pill-dot" />
              <span className="hww-pill-text">{ispt ? 'Como Trabalhamos' : 'How We Work'}</span>
            </div>
            <h2 className="hww-h2">
              {ispt ? 'Do Conceito à Entrega' : 'From Concept to Delivery'}
            </h2>
            <p className="hww-subtitle">
              {ispt
                ? 'Um processo transparente, colaborativo e focado nos seus resultados.'
                : 'A transparent, collaborative process focused on your results.'}
            </p>
          </div>

          {/* Timeline */}
          <div className="hww-track-wrap">

            {/* Animated connecting line */}
            <div className="hww-line-bg">
              <div className="hww-line-fill" style={{ width: `${lineWidth}%` }} ref={lineRef} />
            </div>

            {/* Steps */}
            <div className="hww-steps">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className={`hww-step${activeStep >= i ? ' active' : ''}`}
                  style={{ transitionDelay: `${i * 0.08}s` }}
                >
                  {/* Dot on the line */}
                  <div
                    className="hww-dot"
                    style={{
                      background: activeStep >= i ? `hsla(${step.hue},80%,65%,1)` : 'rgba(255,255,255,0.1)',
                      borderColor: `hsla(${step.hue},80%,65%,${activeStep >= i ? 0.6 : 0.2})`,
                      color: `hsla(${step.hue},80%,65%,1)`,
                    }}
                  />

                  {/* Number */}
                  <div
                    className="hww-num"
                    style={{ color: activeStep >= i ? `hsla(${step.hue},80%,65%,1)` : 'rgba(255,255,255,0.2)' }}
                  >
                    {step.num}
                  </div>

                  {/* Icon */}
                  <div className="hww-icon-wrap">
                    <div
                      className="hww-icon-ring"
                      style={{ borderColor: `hsla(${step.hue},80%,65%,0.3)`, animationDelay: `${i * 0.5}s` }}
                    />
                    <div
                      className="hww-icon-circle"
                      style={{
                        background: activeStep >= i ? `hsla(${step.hue},80%,50%,0.12)` : 'rgba(255,255,255,0.03)',
                        borderColor: `hsla(${step.hue},70%,60%,${activeStep >= i ? 0.45 : 0.1})`,
                        color: activeStep >= i ? `hsla(${step.hue},85%,72%,1)` : 'rgba(255,255,255,0.2)',
                        boxShadow: activeStep >= i ? `0 0 24px hsla(${step.hue},80%,55%,0.2)` : 'none',
                        animationDelay: `${i * 1}s`,
                      }}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="hww-title">{step.title}</div>
                  <div className="hww-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={`hww-cta${visible ? ' visible' : ''}`}>
            <a href="#contact" className="hww-cta-btn">
              <span>{ispt ? 'Iniciar o Meu Projecto' : 'Start My Project'}</span>
              <span className="hww-cta-arrow">→</span>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}