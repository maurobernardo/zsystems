'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import Script from 'next/script'

/* ─── FAQ data ───────────────────────────────────────────────────────────── */
const FAQ_PT = [
  {
    q: 'Quanto custa desenvolver um website ou sistema?',
    a: 'O custo varia conforme a complexidade do projecto. Um website institucional começa nos 8000MT, sistemas mais complexos com base de dados e autenticação têm preços personalizados. Contacte-nos para um orçamento gratuito e sem compromisso.',
    hue: 195,
  },
  {
    q: 'Qual é o prazo de entrega dos projectos?',
    a: 'Um website simples pode ficar pronto em 1-2 semanas. Sistemas web completos levam entre 4-12 semanas dependendo da complexidade. Trabalhamos com prazos definidos no contrato e mantemos comunicação constante durante o desenvolvimento.',
    hue: 265,
  },
  {
    q: 'Que tecnologias utilizam?',
    a: 'Trabalhamos principalmente com Next.js, React, Node.js, Jakarta EE (Java), Laravel/PHP, Tailwind CSS e bases de dados como MySQL, PostgreSQL e Apache Derby. Escolhemos a stack mais adequada a cada projecto.',
    hue: 145,
  },
  {
    q: 'Como funciona o processo de desenvolvimento?',
    a: '1) Reunião inicial para entender as necessidades. 2) Proposta e orçamento. 3) Design e protótipo. 4) Desenvolvimento por fases com feedback contínuo. 5) Testes e validação. 6) Entrega e formação. 7) Suporte pós-lançamento.',
    hue: 330,
  },
  {
    q: 'Oferecem suporte após a entrega do projecto?',
    a: 'Sim. Oferecemos suporte técnico pós-lançamento. O período base de suporte gratuito é de 30 dias. A partir daí temos planos de manutenção mensais que incluem actualizações, backups e monitorização.',
    hue: 195,
  },
  {
    q: 'Trabalham com clientes fora de Moçambique?',
    a: 'Sim. Trabalhamos remotamente com clientes em toda África e internacionalmente. A comunicação é feita por videochamada, email e WhatsApp. Os pagamentos são flexíveis e adaptados a cada região.',
    hue: 45,
  },
  {
    q: 'O meu website ficará optimizado para mobile?',
    a: 'Absolutamente. Todos os nossos projectos são desenvolvidos com abordagem mobile-first, garantindo uma experiência excelente em smartphones, tablets e computadores. Também optimizamos para velocidade e SEO.',
    hue: 265,
  },
  {
    q: 'Posso pedir alterações durante o desenvolvimento?',
    a: 'Sim. O nosso processo inclui revisões em cada fase. Alterações menores dentro do âmbito definido são incluídas sem custo adicional. Mudanças significativas de âmbito são orçamentadas separadamente com total transparência.',
    hue: 145,
  },
]

const FAQ_EN = [
  {
    q: 'How much does it cost to build a website or system?',
    a: 'Costs vary based on project complexity. A simple corporate website starts at 500 USD, while more complex systems with databases and authentication are priced individually. Contact us for a free, no-commitment quote.',
    hue: 195,
  },
  {
    q: 'What are the typical project delivery times?',
    a: 'A simple website can be ready in 1-2 weeks. Full web systems take 4-12 weeks depending on complexity. We work with contract-defined deadlines and maintain constant communication throughout development.',
    hue: 265,
  },
  {
    q: 'What technologies do you use?',
    a: 'We primarily work with Next.js, React, Node.js, Jakarta EE (Java), Laravel/PHP, Tailwind CSS, and databases like MySQL, PostgreSQL and Apache Derby. We choose the best stack for each project.',
    hue: 145,
  },
  {
    q: 'How does your development process work?',
    a: '1) Initial meeting to understand needs. 2) Proposal and quote. 3) Design and prototype. 4) Phased development with continuous feedback. 5) Testing and validation. 6) Delivery and training. 7) Post-launch support.',
    hue: 330,
  },
  {
    q: 'Do you offer post-delivery support?',
    a: 'Yes. We offer technical support after launch. The base free support period is 30 days. After that, we have monthly maintenance plans including updates, backups and monitoring.',
    hue: 195,
  },
  {
    q: 'Do you work with clients outside Mozambique?',
    a: 'Yes. We work remotely with clients across Africa and internationally. Communication is via video call, email and WhatsApp. Payment methods are flexible and adapted to each region.',
    hue: 45,
  },
  {
    q: 'Will my website be mobile optimised?',
    a: 'Absolutely. All our projects use a mobile-first approach, ensuring an excellent experience on smartphones, tablets and computers. We also optimise for speed and SEO.',
    hue: 265,
  },
  {
    q: 'Can I request changes during development?',
    a: 'Yes. Our process includes revisions at each phase. Minor changes within the defined scope are included at no extra cost. Significant scope changes are quoted separately with full transparency.',
    hue: 145,
  },
]

/* ─── FAQ Item ───────────────────────────────────────────────────────────── */
function FaqItem({
  item, index, isOpen, onToggle,
}: {
  item: typeof FAQ_PT[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  return (
    <div
      className="faq-item"
      style={{
        borderColor: isOpen ? `hsla(${item.hue},70%,60%,0.3)` : 'rgba(255,255,255,0.07)',
        background: isOpen ? `hsla(${item.hue},80%,50%,0.04)` : 'rgba(255,255,255,0.02)',
        boxShadow: isOpen ? `0 0 30px hsla(${item.hue},80%,50%,0.06)` : 'none',
      }}
    >
      {/* Top shimmer when open */}
      {isOpen && (
        <div className="faq-open-line" style={{
          background: `linear-gradient(90deg, transparent, hsla(${item.hue},80%,65%,0.5), transparent)`,
        }} />
      )}

      {/* Question row */}
      <button className="faq-btn" onClick={onToggle} aria-expanded={isOpen}>
        {/* Number */}
        <span className="faq-num" style={{ color: `hsla(${item.hue},70%,65%,${isOpen ? 0.9 : 0.35})` }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Question text */}
        <span className="faq-q" style={{ color: isOpen ? '#fff' : 'rgba(255,255,255,0.8)' }}>
          {item.q}
        </span>

        {/* Icon */}
        <span
          className="faq-icon"
          style={{
            background: isOpen ? `hsla(${item.hue},80%,50%,0.15)` : 'rgba(255,255,255,0.05)',
            border: `1px solid hsla(${item.hue},70%,60%,${isOpen ? 0.4 : 0.15})`,
            color: isOpen ? `hsla(${item.hue},85%,72%,1)` : 'rgba(255,255,255,0.4)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      {/* Answer */}
      <div
        className="faq-body-wrap"
        style={{ maxHeight: height, opacity: isOpen ? 1 : 0 }}
      >
        <div ref={bodyRef} className="faq-body">
          <div
            className="faq-answer-line"
            style={{ background: `hsla(${item.hue},70%,60%,0.5)` }}
          />
          <p className="faq-a">{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function FAQ() {
  const { language } = useLanguage()
  const ispt = language === 'pt'
  const data = ispt ? FAQ_PT : FAQ_EN
  const [open, setOpen] = useState<number | null>(0)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const toggle = (i: number) => setOpen(open === i ? null : i)

  /* JSON-LD FAQ schema */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="beforeInteractive"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes faqReveal  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes faqGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes faqPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes faqOrbMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px)} }
        @keyframes faqShimmer { from{background-position:-200% 0} to{background-position:200% 0} }

        /* ── Section ── */
        .faq-root {
          position:relative; overflow:hidden;
          background:#020408; padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .faq-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%);
        }
        .faq-orb {
          position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none;
          animation:faqOrbMove 12s ease-in-out infinite;
        }

        /* ── Header ── */
        .faq-header {
          text-align:center; max-width:640px; margin:0 auto 60px;
          opacity:0;
        }
        .faq-header.visible { animation:faqReveal .9s cubic-bezier(.22,1,.36,1) forwards; }
        .faq-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2); background:rgba(99,200,255,.06);
          backdrop-filter:blur(10px);
        }
        .faq-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:faqPulse 2s ease-in-out infinite;
        }
        .faq-pill-text { font-size:11px; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:#63C8FF; }
        .faq-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,44px); font-weight:800; line-height:1.1;
          letter-spacing:-.02em; margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:faqGrad 8s linear infinite;
        }
        .faq-subtitle { font-size:clamp(14px,1.5vw,16px); font-weight:300; color:rgba(255,255,255,.5); line-height:1.7; }

        /* ── 2-col layout ── */
        .faq-cols {
          display:grid; grid-template-columns:1fr 1fr;
          gap:16px; max-width:1100px; margin:0 auto;
        }
        @media(max-width:768px){ .faq-cols { grid-template-columns:1fr; } }

        /* ── Item ── */
        .faq-item {
          border-radius:18px; border-width:1px; border-style:solid;
          border-color: rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          transition:border-color .35s cubic-bezier(.22,1,.36,1), background .35s, box-shadow .35s;
          overflow:hidden; position:relative;
        }

        .faq-open-line {
          position:absolute; top:0; left:8%; right:8%; height:1px;
          border-radius:1px;
          animation:faqShimmer 3s linear infinite; background-size:200% 100%;
        }

        .faq-btn {
          width:100%; display:flex; align-items:center; gap:14px;
          padding:20px 20px; background:none; border:none; cursor:pointer;
          text-align:left;
        }
        .faq-num {
          font-family:'Syne',sans-serif; font-size:12px; font-weight:700;
          letter-spacing:.06em; flex-shrink:0; transition:color .3s;
          min-width:24px;
        }
        .faq-q {
          font-size:14px; font-weight:500; line-height:1.45;
          flex:1; transition:color .3s;
        }
        .faq-icon {
          width:30px; height:30px; border-radius:9px; flex-shrink:0;
          display:flex; align-items:center; justify-content:center;
          transition:all .3s cubic-bezier(.22,1,.36,1);
        }

        /* ── Answer ── */
        .faq-body-wrap {
          overflow:hidden;
          transition:max-height .4s cubic-bezier(.22,1,.36,1), opacity .3s ease;
        }
        .faq-body {
          display:flex; gap:14px; padding:0 20px 20px;
        }
        .faq-answer-line {
          width:2px; border-radius:2px; flex-shrink:0; opacity:.5;
          align-self:stretch;
        }
        .faq-a {
          font-size:13px; font-weight:300; color:rgba(255,255,255,.6);
          line-height:1.75;
        }

        /* ── Bottom CTA ── */
        .faq-cta {
          text-align:center; margin-top:56px; opacity:0;
        }
        .faq-cta.visible { animation:faqReveal .9s cubic-bezier(.22,1,.36,1) .3s forwards; }
        .faq-cta-text { font-size:15px; color:rgba(255,255,255,.45); margin-bottom:20px; }
        .faq-cta-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 28px; border-radius:100px;
          font-size:14px; font-weight:600; letter-spacing:.02em;
          color:#020408; text-decoration:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%; animation:faqGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
        }
        .faq-cta-btn:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 0 44px rgba(99,200,255,.45); }
        .faq-cta-arrow { transition:transform .2s; display:inline-block; }
        .faq-cta-btn:hover .faq-cta-arrow { transform:translateX(4px); }

        @media(max-width:600px){
          .faq-root { padding:64px 0 80px; }
          .faq-btn { padding:16px 16px; gap:10px; }
          .faq-body { padding:0 16px 18px; }
        }
      `}</style>

      <section ref={sectionRef} id="faq" className="faq-root">
        <div className="faq-grid-bg" aria-hidden />
        <div className="faq-orb" aria-hidden style={{ width:500, height:500, top:'-15%', left:'-6%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="faq-orb" aria-hidden style={{ width:400, height:400, bottom:'-10%', right:'-5%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'5s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`faq-header${visible ? ' visible' : ''}`}>
            <div className="faq-pill">
              <span className="faq-pill-dot" />
              <span className="faq-pill-text">FAQ</span>
            </div>
            <h2 className="faq-h2">
              {ispt ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
            </h2>
            <p className="faq-subtitle">
              {ispt
                ? 'Tudo o que precisa de saber antes de começar o seu projecto connosco.'
                : 'Everything you need to know before starting your project with us.'}
            </p>
          </div>

          {/* 2-col FAQ grid */}
          <div className="faq-cols">
            {/* Left col — even items */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {data.filter((_, i) => i % 2 === 0).map((item, i) => {
                const realIndex = i * 2
                return (
                  <div
                    key={realIndex}
                    className="faq-item"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(24px)',
                      transition: `opacity .7s ease ${realIndex * 0.07}s, transform .7s cubic-bezier(.22,1,.36,1) ${realIndex * 0.07}s`,
                    }}
                  >
                    <FaqItem item={item} index={realIndex} isOpen={open === realIndex} onToggle={() => toggle(realIndex)} />
                  </div>
                )
              })}
            </div>
            {/* Right col — odd items */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {data.filter((_, i) => i % 2 === 1).map((item, i) => {
                const realIndex = i * 2 + 1
                return (
                  <div
                    key={realIndex}
                    className="faq-item"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(24px)',
                      transition: `opacity .7s ease ${realIndex * 0.07}s, transform .7s cubic-bezier(.22,1,.36,1) ${realIndex * 0.07}s`,
                    }}
                  >
                    <FaqItem item={item} index={realIndex} isOpen={open === realIndex} onToggle={() => toggle(realIndex)} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <div className={`faq-cta${visible ? ' visible' : ''}`}>
            <p className="faq-cta-text">
              {ispt ? 'Tem outra pergunta? Fale directamente connosco.' : 'Still have questions? Talk directly to us.'}
            </p>
            <a href="#contact" className="faq-cta-btn">
              <span>{ispt ? 'Enviar mensagem' : 'Send a message'}</span>
              <span className="faq-cta-arrow">→</span>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}