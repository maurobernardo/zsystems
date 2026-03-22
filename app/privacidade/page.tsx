import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da Z-Systems. Saiba como tratamos os seus dados pessoais.',
}

const SECTIONS = [
  {
    title: '1. Quem somos',
    content: 'A Z-Systems é uma empresa de tecnologia sediada em Ponta-Gea, Beira, Moçambique. Somos responsáveis pelo tratamento dos dados recolhidos através deste website (zsystems.vercel.app).',
  },
  {
    title: '2. Dados que recolhemos',
    content: 'Quando preenche o formulário de contacto, recolhemos: nome completo, endereço de email, número de telefone (opcional), nome da empresa (opcional) e mensagem. Estes dados são usados exclusivamente para responder ao seu pedido de contacto.',
  },
  {
    title: '3. Como usamos os seus dados',
    items: [
      'Responder às mensagens enviadas pelo formulário de contacto.',
      'Fornecer informações sobre os nossos serviços quando solicitado.',
      'Melhorar a qualidade do nosso website e serviços.',
      'Não vendemos, alugamos nem partilhamos os seus dados com terceiros para fins comerciais.',
    ],
  },
  {
    title: '4. Serviços de terceiros',
    content: 'Utilizamos o EmailJS (emailjs.com) para envio de mensagens do formulário de contacto. O EmailJS processa os dados de acordo com a sua própria política de privacidade. Os dados são transmitidos de forma segura via HTTPS e não são armazenados permanentemente pelo EmailJS.',
  },
  {
    title: '5. Cookies',
    content: 'Utilizamos cookies essenciais para o funcionamento do site (preferência de idioma, consentimento de cookies). Se aceitar todos os cookies, poderemos utilizar cookies analíticos para compreender como os visitantes interagem com o site. Pode gerir as suas preferências a qualquer momento através do banner de cookies.',
  },
  {
    title: '6. Retenção de dados',
    content: 'Os dados submetidos através do formulário de contacto são mantidos apenas pelo tempo necessário para responder ao seu pedido, tipicamente não mais de 12 meses. Pode solicitar a eliminação dos seus dados em qualquer momento.',
  },
  {
    title: '7. Os seus direitos',
    items: [
      'Direito de acesso — solicitar uma cópia dos dados que temos sobre si.',
      'Direito de rectificação — corrigir dados incorrectos.',
      'Direito de apagamento — solicitar a eliminação dos seus dados.',
      'Direito de oposição — opor-se ao tratamento dos seus dados.',
      'Direito de portabilidade — receber os seus dados num formato estruturado.',
    ],
  },
  {
    title: '8. Segurança',
    content: 'Implementamos medidas técnicas e organizacionais adequadas para proteger os seus dados pessoais contra acesso não autorizado, perda ou destruição. O nosso website utiliza HTTPS para encriptação de dados em trânsito.',
  },
  {
    title: '9. Contacto',
    content: 'Para exercer qualquer um dos seus direitos ou para questões sobre privacidade, contacte-nos através do formulário no nosso website ou por telefone: +258 87 010 7006.',
  },
  {
    title: '10. Alterações a esta política',
    content: 'Podemos actualizar esta política de privacidade periodicamente. A data da última actualização está indicada abaixo. Recomendamos que reveja esta página regularmente.',
  },
]

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes pvFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pvGrad   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .pv-root {
          min-height: 100vh; background: #020408;
          font-family: 'DM Sans', sans-serif;
          color: rgba(255,255,255,.8);
        }

        .pv-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(99,200,255,.025) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.025) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 0%, black 0%, transparent 100%);
        }

        .pv-orb {
          position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0;
        }

        .pv-inner {
          position: relative; z-index: 1;
          max-width: 760px; margin: 0 auto;
          padding: 80px 24px 120px;
          animation: pvFadeUp .8s cubic-bezier(.22,1,.36,1) both;
        }

        /* Back link */
        .pv-back {
          display: inline-flex; align-items: center; gap: 8px;
          text-decoration: none; margin-bottom: 48px;
          color: rgba(255,255,255,.45); font-size: 13px; font-weight: 500;
          transition: color .2s;
        }
        .pv-back:hover { color: #63C8FF; }
        .pv-back svg { transition: transform .2s; }
        .pv-back:hover svg { transform: translateX(-4px); }

        /* Header */
        .pv-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 4px 14px; border-radius: 100px; margin-bottom: 20px;
          border: 1px solid rgba(99,200,255,.2);
          background: rgba(99,200,255,.06);
          font-size: 10px; font-weight: 600; letter-spacing: .2em;
          text-transform: uppercase; color: #63C8FF;
        }
        .pv-badge-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #63C8FF; box-shadow: 0 0 6px #63C8FF;
        }

        .pv-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 5vw, 44px); font-weight: 800;
          line-height: 1.1; letter-spacing: -.02em;
          background: linear-gradient(135deg, #fff 40%, rgba(99,200,255,.7) 100%);
          background-size: 200%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: pvGrad 8s linear infinite;
          margin-bottom: 12px;
        }

        .pv-meta {
          font-size: 12px; color: rgba(255,255,255,.3);
          letter-spacing: .04em; margin-bottom: 48px;
        }

        /* Divider */
        .pv-divider {
          height: 1px; width: 100%; margin-bottom: 48px;
          background: linear-gradient(90deg, rgba(99,200,255,.3), rgba(167,139,250,.2), transparent);
        }

        /* Sections */
        .pv-section {
          margin-bottom: 36px;
          padding: 28px 28px 24px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.06);
          background: rgba(255,255,255,.02);
          backdrop-filter: blur(8px);
          transition: border-color .3s;
        }
        .pv-section:hover { border-color: rgba(99,200,255,.15); }

        .pv-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; color: #fff;
          margin-bottom: 12px;
          display: flex; align-items: center; gap: 10px;
        }
        .pv-section-title::before {
          content: '';
          width: 3px; height: 16px; border-radius: 2px;
          background: linear-gradient(to bottom, #63C8FF, #A78BFA);
          flex-shrink: 0;
        }

        .pv-section p {
          font-size: 14px; line-height: 1.75; color: rgba(255,255,255,.55);
        }

        .pv-section ul {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 8px;
        }
        .pv-section ul li {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 14px; line-height: 1.65; color: rgba(255,255,255,.55);
        }
        .pv-section ul li::before {
          content: '';
          width: 5px; height: 5px; border-radius: 50%;
          background: #63C8FF; box-shadow: 0 0 5px rgba(99,200,255,.5);
          flex-shrink: 0; margin-top: 8px;
        }

        /* CTA */
        .pv-cta {
          text-align: center; margin-top: 56px;
          padding: 32px 24px;
          border-radius: 20px;
          border: 1px dashed rgba(99,200,255,.2);
          background: rgba(99,200,255,.03);
        }
        .pv-cta p { font-size: 14px; color: rgba(255,255,255,.45); margin-bottom: 16px; }
        .pv-cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px; border-radius: 100px;
          font-size: 13px; font-weight: 600; letter-spacing: .02em;
          color: #020408; text-decoration: none;
          background: linear-gradient(135deg, #63C8FF, #A78BFA);
          background-size: 200%;
          box-shadow: 0 0 16px rgba(99,200,255,.2);
          transition: transform .2s, box-shadow .2s;
        }
        .pv-cta-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 32px rgba(99,200,255,.4);
        }
      `}</style>

      <div className="pv-root">
        <div className="pv-grid" aria-hidden />
        <div className="pv-orb" aria-hidden style={{ width: 400, height: 400, top: '-10%', right: '-5%', background: 'radial-gradient(circle,rgba(99,200,255,.06) 0%,transparent 65%)' }} />
        <div className="pv-orb" aria-hidden style={{ width: 300, height: 300, bottom: '10%', left: '-4%', background: 'radial-gradient(circle,rgba(167,139,250,.06) 0%,transparent 65%)' }} />

        <div className="pv-inner">
          {/* Back */}
          <Link href="/" className="pv-back">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao início
          </Link>

          {/* Header */}
          <div className="pv-badge">
            <span className="pv-badge-dot" />
            Legal
          </div>
          <h1 className="pv-h1">Política de Privacidade</h1>
          <p className="pv-meta">
            Última actualização: Janeiro 2026 &nbsp;·&nbsp; Z-Systems &nbsp;·&nbsp; Beira, Moçambique
          </p>

          <div className="pv-divider" />

          {/* Sections */}
          {SECTIONS.map((s) => (
            <div key={s.title} className="pv-section">
              <div className="pv-section-title">{s.title}</div>
              {s.content && <p>{s.content}</p>}
              {s.items && (
                <ul>
                  {s.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="pv-cta">
            <p>Tem alguma questão sobre a nossa política de privacidade?</p>
            <Link href="/#contact" className="pv-cta-btn">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar-nos
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}