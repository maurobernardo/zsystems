'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Project data ───────────────────────────────────────────────────────── */
const PROJECTS_PT = [
  {
    id: 'agro',
    title: 'Agro Tech Mozambique',
    category: 'Website Empresarial',
    description: 'Website institucional para Agro Tech Mozambique, apresentando serviços, projectos e presença digital da empresa no sector agrícola.',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Agro/1.png',
    link: 'https://agro-tech-mozambique.vercel.app/',
    imagesPath: '/Projectos/Agro',
    hue: 145,
  },
  {
    id: 'bioclean',
    title: 'BioClean Environment',
    category: 'Website Empresarial',
    description: 'Website institucional para BioClean Environment, destacando soluções e serviços ambientais da empresa.',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Bio/1.png',
    link: 'https://bioclean-environment.vercel.app/pt',
    imagesPath: '/Projectos/Bio',
    hue: 195,
  },
  {
    id: 'ucm',
    title: 'Sistema Académico UCM-FEG',
    category: 'Sistema Web',
    description: 'Sistema web para facilitar o acesso às informações académicas dos estudantes, com assistente virtual com voz para responder dúvidas.',
    technologies: ['React', 'TypeScript', 'Laravel', 'PHP'],
    image: '/images/UCM.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/UCM',
    hue: 220,
  },
  {
    id: 'deyril',
    title: 'Portfólio – Deyril Marlon',
    category: 'Portfólio Web',
    description: 'Portfólio pessoal moderno com suporte a múltiplos idiomas (PT/EN), modo escuro/claro e chatbot inteligente.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: '/images/Deyril.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/Deyril',
    hue: 280,
  },
  {
    id: 'samson',
    title: 'Portfólio – Samson Chifamba',
    category: 'Portfólio Web',
    description: 'Portfólio profissional com suporte a modo escuro/claro, tradução PT/EN, mapa de localização e hospedagem no Vercel.',
    technologies: ['React', 'Tailwind CSS'],
    image: '/images/Samson.png',
    link: 'https://samson-chifamba.vercel.app/',
    imagesPath: '/Projectos/Samson',
    hue: 165,
  },
  {
    id: 'feg',
    title: 'Gestão de Projectos de Fim de Curso',
    category: 'Sistema de Gestão',
    description: 'Sistema web para gestão de projectos de fim de curso do Departamento de Arquitectura da UCM-FEG.',
    technologies: ['Laravel', 'PHP'],
    image: '/images/Feg.png',
    link: null,
    imagesPath: null,
    hue: 20,
  },
]

const PROJECTS_EN = [
  {
    id: 'agro',
    title: 'Agro Tech Mozambique',
    category: 'Corporate Website',
    description: 'Corporate website for Agro Tech Mozambique, showcasing services, projects and company digital presence in the agricultural sector.',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Agro/1.png',
    link: 'https://agro-tech-mozambique.vercel.app/',
    imagesPath: '/Projectos/Agro',
    hue: 145,
  },
  {
    id: 'bioclean',
    title: 'BioClean Environment',
    category: 'Corporate Website',
    description: 'Corporate website for BioClean Environment, highlighting the company\'s environmental solutions and services.',
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Bio/1.png',
    link: 'https://bioclean-environment.vercel.app/pt',
    imagesPath: '/Projectos/Bio',
    hue: 195,
  },
  {
    id: 'ucm',
    title: 'UCM-FEG Academic System',
    category: 'Web System',
    description: 'Web system to facilitate access to students\' academic information. Includes a voice virtual assistant to answer questions.',
    technologies: ['React', 'TypeScript', 'Laravel', 'PHP'],
    image: '/images/UCM.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/UCM',
    hue: 220,
  },
  {
    id: 'deyril',
    title: 'Portfolio – Deyril Marlon',
    category: 'Web Portfolio',
    description: 'Modern personal portfolio with PT/EN support, dark/light mode, and an intelligent chatbot to answer questions.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: '/images/Deyril.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/Deyril',
    hue: 280,
  },
  {
    id: 'samson',
    title: 'Portfolio – Samson Chifamba',
    category: 'Web Portfolio',
    description: 'Professional portfolio with dark/light mode, PT/EN translation, location map, and hosted on Vercel.',
    technologies: ['React', 'Tailwind CSS'],
    image: '/images/Samson.png',
    link: 'https://samson-chifamba.vercel.app/',
    imagesPath: '/Projectos/Samson',
    hue: 165,
  },
  {
    id: 'feg',
    title: 'End-of-Course Project Management',
    category: 'Management System',
    description: 'Web system for managing end-of-course projects for the Architecture Department of UCM-FEG.',
    technologies: ['Laravel', 'PHP'],
    image: '/images/Feg.png',
    link: null,
    imagesPath: null,
    hue: 20,
  },
]

type Project = (typeof PROJECTS_PT)[0]

/* ─── Project Card ───────────────────────────────────────────────────────── */
function ProjectCard({ project, index, t, language, visible }: {
  project: Project
  index: number
  t: (k: string) => string
  language: string
  visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const [imgErr, setImgErr] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -4,
      y: ((e.clientX - cx) / (rect.width / 2)) * 4,
    })
  }

  return (
    <div
      ref={cardRef}
      className={`prj-card${visible ? ' visible' : ''}`}
      style={{
        animationDelay: `${index * 0.13}s`,
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 8 : 0}px)`,
        transition: hovered ? 'transform .1s ease-out' : 'transform .55s cubic-bezier(.22,1,.36,1)',
        '--hue': project.hue,
      } as React.CSSProperties}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
    >
      {/* Spotlight */}
      <div className="prj-spotlight" style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsla(${project.hue},90%,65%,0.1) 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0,
      }} />

      {/* Top glow line */}
      <div className="prj-top-line" style={{
        background: `linear-gradient(90deg, transparent, hsla(${project.hue},85%,65%,0.7), transparent)`,
        opacity: hovered ? 1 : 0.2,
      }} />

      {/* Corner accents */}
      <div className="prj-corner prj-tl" style={{ borderColor: `hsla(${project.hue},75%,65%,${hovered ? 0.85 : 0.25})` }} />
      <div className="prj-corner prj-tr" style={{ borderColor: `hsla(${project.hue},75%,65%,${hovered ? 0.85 : 0.25})` }} />

      {/* Image */}
      <div className="prj-img-wrap">
        {project.image && !imgErr ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="prj-img"
            style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="prj-img-fallback" style={{
            background: `linear-gradient(135deg, hsla(${project.hue},60%,20%,1), hsla(${project.hue + 40},50%,15%,1))`,
          }}>
            <svg width="40" height="40" fill="none" stroke={`hsla(${project.hue},70%,65%,0.5)`} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}

        {/* Image overlay on hover */}
        <div className="prj-img-overlay" style={{ opacity: hovered ? 1 : 0 }} />

        {/* Category badge */}
        <div className="prj-badge" style={{
          background: `rgba(2,4,8,0.75)`,
          border: `1px solid hsla(${project.hue},70%,60%,${hovered ? 0.5 : 0.25})`,
          color: `hsla(${project.hue},85%,72%,1)`,
        }}>
          {project.category}
        </div>

        {/* Index number */}
        <div className="prj-index" style={{
          color: `hsla(${project.hue},80%,65%,${hovered ? 0.7 : 0.3})`,
        }}>
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="prj-content">
        {/* Shimmer divider */}
        <div className="prj-shimmer" style={{
          background: `linear-gradient(90deg, transparent, hsla(${project.hue},75%,65%,0.5), transparent)`,
          backgroundSize: '200% 100%',
          opacity: hovered ? 1 : 0.35,
        }} />

        <h3 className="prj-title" style={{ color: hovered ? `hsla(${project.hue},90%,85%,1)` : '#fff' }}>
          {project.title}
        </h3>

        <p className="prj-desc">{project.description}</p>

        {/* Tech pills */}
        <div className="prj-pills">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="prj-pill"
              style={{
                borderColor: `hsla(${project.hue},70%,60%,${hovered ? 0.4 : 0.2})`,
                color: `hsla(${project.hue},80%,72%,1)`,
                background: `hsla(${project.hue},80%,50%,${hovered ? 0.1 : 0.05})`,
              }}
            >
              <span className="prj-pill-dot" style={{ background: `hsla(${project.hue},80%,65%,1)` }} />
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="prj-actions">
          {project.imagesPath ? (
            <Link href={`/projects/${project.id}`} className="prj-btn prj-btn-details" style={{
              borderColor: `hsla(${project.hue},70%,60%,0.4)`,
              color: `hsla(${project.hue},85%,75%,1)`,
              background: `hsla(${project.hue},80%,50%,0.08)`,
            }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
            </Link>
          ) : (
            <span className="prj-btn prj-btn-disabled">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
            </span>
          )}

          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              className="prj-btn prj-btn-live"
              style={{
                background: `linear-gradient(135deg, hsla(${project.hue},80%,55%,1), hsla(${project.hue + 40},70%,60%,1))`,
                backgroundSize: '200% 200%',
                boxShadow: hovered ? `0 0 20px hsla(${project.hue},80%,55%,0.4)` : 'none',
              }}
            >
              {t('projects.viewProject')}
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          ) : (
            <span className="prj-btn prj-btn-disabled">
              {t('projects.viewProject')}
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          )}
        </div>
      </div>

      {/* Bottom ambient */}
      <div className="prj-bottom-glow" style={{
        background: `radial-gradient(circle, hsla(${project.hue},80%,55%,0.14) 0%, transparent 70%)`,
        opacity: hovered ? 1 : 0,
      }} />
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Projects() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [visibleCount, setVisibleCount] = useState(3)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const ispt = language === 'pt'
  const projects = ispt ? PROJECTS_PT : PROJECTS_EN
  const shown = projects.slice(0, visibleCount)
  const hasMore = visibleCount < projects.length

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0, rootMargin: '0px 0px -50px 0px' }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes prjReveal  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes prjGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes prjPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes prjShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes prjOrbMove { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.2) translate(16px,-12px)} }

        /* ── Section ── */
        .prj-root {
          position:relative; overflow:hidden;
          background:#020408;
          padding:100px 0 120px;
          font-family:'DM Sans',sans-serif;
        }
        .prj-grid-bg {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(99,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.03) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 85% 85% at 50% 50%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 85% 85% at 50% 50%, black 0%, transparent 100%);
        }
        .prj-orb {
          position:absolute; border-radius:50%;
          filter:blur(80px); pointer-events:none;
          animation:prjOrbMove 12s ease-in-out infinite;
        }

        /* ── Header ── */
        .prj-header {
          text-align:center; max-width:700px;
          margin:0 auto 60px; opacity:0;
        }
        .prj-header.visible { animation:prjReveal .9s cubic-bezier(.22,1,.36,1) forwards; }

        .prj-pill {
          display:inline-flex; align-items:center; gap:8px;
          padding:5px 16px; border-radius:100px; margin-bottom:20px;
          border:1px solid rgba(99,200,255,.2);
          background:rgba(99,200,255,.06); backdrop-filter:blur(10px);
        }
        .prj-pill-dot {
          width:6px; height:6px; border-radius:50%;
          background:#63C8FF; box-shadow:0 0 6px #63C8FF;
          animation:prjPulse 2s ease-in-out infinite;
        }
        .prj-pill-text {
          font-size:11px; font-weight:600; letter-spacing:.2em;
          text-transform:uppercase; color:#63C8FF;
        }
        .prj-h2 {
          font-family:'Syne',sans-serif;
          font-size:clamp(26px,3.5vw,46px);
          font-weight:800; line-height:1.1; letter-spacing:-.02em;
          margin-bottom:16px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:prjGrad 8s linear infinite;
        }
        .prj-subtitle {
          font-size:clamp(14px,1.5vw,16px); font-weight:300;
          color:rgba(255,255,255,.5); line-height:1.7;
        }

        /* ── Grid ── */
        .prj-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:20px; max-width:1100px;
          margin:0 auto;
        }

        /* ── Card ── */
        .prj-card {
          position:relative; border-radius:22px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          overflow:hidden;
          transform-style:preserve-3d;
          cursor:default;
          opacity:0;
        }
        .prj-card.visible { animation:prjReveal .8s cubic-bezier(.22,1,.36,1) forwards; }

        .prj-spotlight {
          position:absolute; inset:0; border-radius:22px;
          pointer-events:none; z-index:0; transition:opacity .3s;
        }
        .prj-top-line {
          position:absolute; top:0; left:8%; right:8%;
          height:1px; border-radius:1px; z-index:5;
          transition:opacity .4s;
        }
        .prj-corner {
          position:absolute; width:16px; height:16px;
          border-width:1.5px; border-style:solid;
          pointer-events:none; z-index:5;
          transition:border-color .4s;
        }
        .prj-tl { top:14px; left:14px; border-right:none; border-bottom:none; border-radius:4px 0 0 0; }
        .prj-tr { top:14px; right:14px; border-left:none; border-bottom:none; border-radius:0 4px 0 0; }

        /* image */
        .prj-img-wrap {
          position:relative; height:200px; overflow:hidden;
        }
        .prj-img {
          object-fit:cover; object-position:top center;
          transition:transform .6s cubic-bezier(.22,1,.36,1) !important;
        }
        .prj-img-fallback {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
        }
        .prj-img-overlay {
          position:absolute; inset:0; z-index:2;
          background:linear-gradient(to top, rgba(2,4,8,.85) 0%, rgba(2,4,8,.1) 60%, transparent 100%);
          transition:opacity .4s;
        }
        .prj-badge {
          position:absolute; bottom:12px; left:14px; z-index:4;
          font-size:10px; font-weight:600; letter-spacing:.1em;
          text-transform:uppercase;
          padding:4px 10px; border-radius:100px;
          backdrop-filter:blur(8px);
          transition:border-color .4s;
        }
        .prj-index {
          position:absolute; top:14px; right:56px; z-index:4;
          font-family:'Syne',sans-serif;
          font-size:12px; font-weight:700; letter-spacing:.08em;
          transition:color .4s;
        }

        /* content */
        .prj-content { padding:18px 20px 22px; position:relative; z-index:1; }

        .prj-shimmer {
          height:1px; width:100%; border-radius:1px;
          margin-bottom:14px;
          animation:prjShimmer 4s linear infinite;
          transition:opacity .4s;
        }
        .prj-title {
          font-family:'Syne',sans-serif;
          font-size:17px; font-weight:700; line-height:1.25;
          margin-bottom:8px; transition:color .3s;
        }
        .prj-desc {
          font-size:13px; color:rgba(255,255,255,.5);
          line-height:1.6; margin-bottom:14px;
        }

        /* tech pills */
        .prj-pills { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px; }
        .prj-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 10px; border-radius:100px;
          font-size:11px; font-weight:500;
          border-width:1px; border-style:solid;
          transition:all .25s;
        }
        .prj-pill-dot { width:4px; height:4px; border-radius:50%; flex-shrink:0; }

        /* action buttons */
        .prj-actions { display:flex; gap:8px; flex-wrap:wrap; }
        .prj-btn {
          flex:1; min-width:0;
          display:inline-flex; align-items:center; justify-content:center; gap:6px;
          padding:9px 12px; border-radius:12px;
          font-size:12px; font-weight:600; letter-spacing:.01em;
          text-decoration:none;
          transition:all .25s; white-space:nowrap;
          border:1px solid transparent;
        }
        .prj-btn-details:hover {
          filter:brightness(1.15);
          transform:translateY(-1px);
        }
        .prj-btn-live {
          color:#020408 !important;
          animation:prjGrad 4s linear infinite;
          border:none;
        }
        .prj-btn-live:hover {
          transform:translateY(-1px);
          filter:brightness(1.1);
        }
        .prj-btn-disabled {
          color:rgba(255,255,255,.25) !important;
          background:rgba(255,255,255,.03) !important;
          border-color:rgba(255,255,255,.06) !important;
          cursor:not-allowed;
        }

        /* bottom glow */
        .prj-bottom-glow {
          position:absolute; bottom:-30px; right:-30px;
          width:130px; height:130px; border-radius:50%;
          pointer-events:none; transition:opacity .4s;
        }

        /* ── Load more btn ── */
        .prj-load-btn {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 28px; border-radius:100px;
          font-size:14px; font-weight:500; letter-spacing:.02em;
          color:#020408; cursor:pointer; border:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:prjGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
        }
        .prj-load-btn:hover {
          transform:translateY(-2px) scale(1.02);
          box-shadow:0 0 44px rgba(99,200,255,.45);
        }

        /* ── CTA block ── */
        .prj-cta {
          text-align:center; margin-top:64px; opacity:0;
        }
        .prj-cta.visible { animation:prjReveal .9s cubic-bezier(.22,1,.36,1) .2s forwards; }
        .prj-cta-text {
          font-size:clamp(15px,1.8vw,18px); color:rgba(255,255,255,.55);
          line-height:1.6; margin-bottom:24px;
        }
        .prj-cta-btn {
          display:inline-flex; align-items:center; gap:10px;
          padding:13px 28px; border-radius:100px;
          font-size:14px; font-weight:500; letter-spacing:.02em;
          color:#020408; text-decoration:none;
          background:linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size:200% 200%;
          animation:prjGrad 4s linear infinite;
          box-shadow:0 0 24px rgba(99,200,255,.25);
          transition:transform .2s, box-shadow .2s;
        }
        .prj-cta-btn:hover {
          transform:translateY(-2px) scale(1.02);
          box-shadow:0 0 44px rgba(99,200,255,.45);
        }
        .prj-cta-arrow { transition:transform .2s; display:inline-block; }
        .prj-cta-btn:hover .prj-cta-arrow { transform:translateX(4px); }

        @media(max-width:900px){
          .prj-grid { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:580px){
          .prj-root { padding:64px 0 80px; }
          .prj-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <section ref={sectionRef} id="projects" className="prj-root">
        {/* Grid bg */}
        <div className="prj-grid-bg" aria-hidden />

        {/* Orbs */}
        <div className="prj-orb" aria-hidden style={{ width:500, height:500, top:'-12%', right:'-6%', background:'radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 65%)', animationDelay:'0s' }} />
        <div className="prj-orb" aria-hidden style={{ width:400, height:400, bottom:'-8%', left:'-5%', background:'radial-gradient(circle,rgba(167,139,250,.07) 0%,transparent 65%)', animationDelay:'5s' }} />
        <div className="prj-orb" aria-hidden style={{ width:260, height:260, top:'45%', left:'38%', background:'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay:'9s' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px' }}>

          {/* Header */}
          <div className={`prj-header${visible ? ' visible' : ''}`}>
            <div className="prj-pill">
              <span className="prj-pill-dot" />
              <span className="prj-pill-text">{t('projects.tagline')}</span>
            </div>
            <h2 className="prj-h2">{t('projects.title')}</h2>
            <p className="prj-subtitle">{t('projects.subtitle')}</p>
          </div>

          {/* Cards grid */}
          <div className="prj-grid">
            {shown.map((project, i) => (
              <ProjectCard
                key={`${project.id}-${i}`}
                project={project}
                index={i}
                t={t}
                language={language}
                visible={visible}
              />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button
                className="prj-load-btn"
                onClick={() => setVisibleCount((v) => Math.min(v + 3, projects.length))}
              >
                <span>{ispt ? 'Ver Mais Projectos' : 'Load More Projects'}</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {/* CTA */}
          <div className={`prj-cta${visible ? ' visible' : ''}`}>
            <p className="prj-cta-text">{t('projects.ready')}</p>
            <a href="#contact" className="prj-cta-btn">
              <span>{t('projects.startProject')}</span>
              <span className="prj-cta-arrow">→</span>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}