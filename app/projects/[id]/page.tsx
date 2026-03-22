'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/* ─── Project data ───────────────────────────────────────────────────────── */
const projectsData = {
  ucm: {
    title: { pt: 'Sistema Académico UCM-FEG', en: 'UCM-FEG Academic System' },
    category: { pt: 'Sistema Web', en: 'Web System' },
    description: {
      pt: 'Sistema web para facilitar o acesso às informações académicas dos estudantes. Permite consultar avisos, controlar créditos, enviar comprovativos de pagamento e acompanhar validações. Inclui assistente virtual com voz para responder dúvidas.',
      en: "Web system to facilitate access to students' academic information. Allows checking notices, controlling credits, sending payment receipts, and tracking validations. Includes a voice virtual assistant to answer questions.",
    },
    technologies: ['React', 'TypeScript', 'Laravel', 'PHP'],
    image: '/images/UCM.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/UCM',
    hue: 220,
  },
  deyril: {
    title: { pt: 'Portfólio – Deyril Marlon', en: 'Portfolio – Deyril Marlon' },
    category: { pt: 'Portfólio Web', en: 'Web Portfolio' },
    description: {
      pt: 'Portfólio pessoal moderno e interativo com suporte a múltiplos idiomas (PT/EN), modo escuro/claro e chatbot inteligente para responder perguntas sobre projectos e trajectória profissional.',
      en: 'Modern and interactive personal portfolio with support for multiple languages (PT/EN), dark/light mode, and an intelligent chatbot to answer questions about projects and professional journey.',
    },
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    image: '/images/Deyril.png',
    link: 'https://deyril-marlon.vercel.app/',
    imagesPath: '/Projectos/Deyril',
    hue: 280,
  },
  samson: {
    title: { pt: 'Portfólio – Samson Chifamba', en: 'Portfolio – Samson Chifamba' },
    category: { pt: 'Portfólio Web', en: 'Web Portfolio' },
    description: {
      pt: 'Portfólio profissional moderno desenvolvido em React e Tailwind CSS, com suporte a modo escuro/claro, tradução português/inglês, mapa de localização e hospedagem no Vercel.',
      en: 'Modern professional portfolio developed in React and Tailwind CSS, with dark/light mode support, Portuguese/English translation, location map, and hosted on Vercel.',
    },
    technologies: ['React', 'Tailwind CSS'],
    image: '/images/Samson.png',
    link: 'https://samson-chifamba.vercel.app/',
    imagesPath: '/Projectos/Samson',
    hue: 165,
  },
  agro: {
    title: { pt: 'Agro Tech Mozambique', en: 'Agro Tech Mozambique' },
    category: { pt: 'Website Empresarial', en: 'Corporate Website' },
    description: {
      pt: 'Website institucional para Agro Tech Mozambique, apresentando serviços, projectos e presença digital da empresa no sector agrícola.',
      en: 'Corporate website for Agro Tech Mozambique, showcasing services, projects and company digital presence in the agricultural sector.',
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Agro/1.png',
    link: 'https://agro-tech-mozambique.vercel.app/',
    imagesPath: '/Projectos/Agro',
    hue: 145,
  },
  bioclean: {
    title: { pt: 'BioClean Environment', en: 'BioClean Environment' },
    category: { pt: 'Website Empresarial', en: 'Corporate Website' },
    description: {
      pt: 'Website institucional para BioClean Environment, destacando soluções e serviços ambientais da empresa.',
      en: "Corporate website for BioClean Environment, highlighting the company's environmental solutions and services.",
    },
    technologies: ['React', 'Next.js', 'Tailwind CSS'],
    image: '/Projectos/Bio/1.png',
    link: 'https://bioclean-environment.vercel.app/pt',
    imagesPath: '/Projectos/Bio',
    hue: 195,
  },
}

type ProjectKey = keyof typeof projectsData
type Project = (typeof projectsData)[ProjectKey]

/* ─── Gallery thumb ─────────────────────────────────────────────────────── */
function GalleryThumb({
  src, alt, index, total, onOpen,
}: {
  src: string; alt: string; index: number; total: number; onOpen: (i: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setTilt({
      x: ((e.clientY - cy) / (rect.height / 2)) * -4,
      y: ((e.clientX - cx) / (rect.width / 2)) * 4,
    })
  }

  return (
    <div
      ref={ref}
      className="pd-thumb"
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 6 : 0}px)`,
        transition: hovered ? 'transform .1s ease-out' : 'transform .5s cubic-bezier(.22,1,.36,1)',
        animationDelay: `${0.06 + index * 0.05}s`,
      }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      onClick={() => onOpen(index)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="pd-thumb-img"
        style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
      />
      <div className="pd-thumb-overlay" style={{ opacity: hovered ? 1 : 0 }} />
      <div className="pd-thumb-zoom" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'scale(1)' : 'scale(0.7)' }}>
        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
        </svg>
      </div>
      <div className="pd-thumb-counter" style={{ opacity: hovered ? 1 : 0 }}>
        {index + 1} / {total}
      </div>
      {/* corner accents */}
      <div className="pd-corner pd-c-tl" style={{ opacity: hovered ? 1 : 0 }} />
      <div className="pd-corner pd-c-br" style={{ opacity: hovered ? 1 : 0 }} />
    </div>
  )
}

/* ─── Lightbox ───────────────────────────────────────────────────────────── */
function Lightbox({
  images, index, onClose, onNav,
}: {
  images: string[]; index: number; onClose: () => void; onNav: (d: 'prev' | 'next') => void
}) {
  return (
    <div className="pd-lb-root" onClick={onClose}>
      {/* Close */}
      <button className="pd-lb-btn pd-lb-close" onClick={onClose} aria-label="Close">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {/* Prev */}
      <button className="pd-lb-btn pd-lb-prev" onClick={(e) => { e.stopPropagation(); onNav('prev') }} aria-label="Previous">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      {/* Next */}
      <button className="pd-lb-btn pd-lb-next" onClick={(e) => { e.stopPropagation(); onNav('next') }} aria-label="Next">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {/* Counter */}
      <div className="pd-lb-counter">{index + 1} / {images.length}</div>
      {/* Image */}
      <div className="pd-lb-img-wrap" onClick={(e) => e.stopPropagation()}>
        <Image src={images[index]} alt={`Screenshot ${index + 1}`} fill className="object-contain" priority sizes="100vw" />
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function ProjectDetails() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const projectId = params.id as string
  const project = projectsData[projectId as ProjectKey] as Project | undefined

  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [coverLoaded, setCoverLoaded] = useState(false)
  const ispt = language === 'pt'

  const openLightbox = useCallback((index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }, [])

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImage((cur) => {
      if (cur === null) return cur
      return direction === 'prev'
        ? cur > 0 ? cur - 1 : images.length - 1
        : cur < images.length - 1 ? cur + 1 : 0
    })
  }, [images.length])

  useEffect(() => {
    if (!project) { router.push('/#projects'); return }
    const maxByProject: Record<string, number> = { samson: 12, agro: 7, bioclean: 8 }
    const max = maxByProject[projectId] ?? 9
    const paths: string[] = []
    if (project.imagesPath) {
      for (let i = 1; i <= max; i++) paths.push(`${project.imagesPath}/${i}.png`)
    }
    setImages(paths)
    setLoading(false)
  }, [project, router, projectId])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (selectedImage !== null) {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') navigateImage('prev')
        if (e.key === 'ArrowRight') navigateImage('next')
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [selectedImage, closeLightbox, navigateImage])

  if (!project) return null

  const hue = project.hue ?? 195

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes pdReveal  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pdGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pdPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes pdShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes pdOrbMove { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-15px)} }
        @keyframes pdLbIn    { from{opacity:0} to{opacity:1} }
        @keyframes pdImgIn   { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }

        /* ── Page root ── */
        .pd-root {
          min-height:100vh;
          background:#020408;
          font-family:'DM Sans',sans-serif;
        }
        .pd-grid-bg {
          position:fixed; inset:0; pointer-events:none; z-index:0;
          background-image:
            linear-gradient(rgba(99,200,255,.025) 1px, transparent 1px),
            linear-gradient(90deg,rgba(99,200,255,.025) 1px, transparent 1px);
          background-size:64px 64px;
          mask-image:radial-gradient(ellipse 80% 80% at 50% 30%, black 0%, transparent 100%);
          -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 30%, black 0%, transparent 100%);
        }
        .pd-orb {
          position:fixed; border-radius:50%; filter:blur(90px);
          pointer-events:none; z-index:0;
          animation:pdOrbMove 14s ease-in-out infinite;
        }

        /* ── Section ── */
        .pd-section {
          position:relative; z-index:1;
          padding:32px 0 100px;
          max-width:1200px; margin:0 auto;
          padding-left:24px; padding-right:24px;
        }

        /* ── Back link ── */
        .pd-back {
          display:inline-flex; align-items:center; gap:10px;
          text-decoration:none; margin-bottom:32px;
          color:rgba(255,255,255,.55); font-size:14px; font-weight:500;
          transition:color .2s;
          animation:pdReveal .7s cubic-bezier(.22,1,.36,1) forwards;
        }
        .pd-back:hover { color:#fff; }
        .pd-back-arrow { transition:transform .2s; }
        .pd-back:hover .pd-back-arrow { transform:translateX(-4px); }
        .pd-back-badge {
          padding:3px 12px; border-radius:100px;
          font-size:11px; font-weight:700; letter-spacing:.1em;
          color:#020408; text-transform:uppercase;
        }

        /* ── Cover image ── */
        .pd-cover-wrap {
          position:relative; height:420px;
          border-radius:24px; overflow:hidden;
          border:1px solid rgba(255,255,255,.07);
          margin-bottom:48px;
          box-shadow:0 24px 60px rgba(0,0,0,.6);
          animation:pdReveal .8s cubic-bezier(.22,1,.36,1) .1s both;
        }
        @media(min-width:768px){ .pd-cover-wrap { height:520px; } }
        @media(min-width:1024px){ .pd-cover-wrap { height:600px; } }

        .pd-cover-corner {
          position:absolute; width:24px; height:24px;
          border-width:2px; border-style:solid; z-index:3; pointer-events:none;
        }
        .pd-cover-corner.tl { top:18px; left:18px; border-right:none; border-bottom:none; border-radius:5px 0 0 0; }
        .pd-cover-corner.tr { top:18px; right:18px; border-left:none; border-bottom:none; border-radius:0 5px 0 0; }
        .pd-cover-corner.bl { bottom:18px; left:18px; border-right:none; border-top:none; border-radius:0 0 0 5px; }
        .pd-cover-corner.br { bottom:18px; right:18px; border-left:none; border-top:none; border-radius:0 0 5px 0; }

        /* ── Header block ── */
        .pd-header { margin-bottom:48px; animation:pdReveal .8s cubic-bezier(.22,1,.36,1) .2s both; }
        .pd-cat-badge {
          display:inline-flex; align-items:center; gap:7px;
          padding:5px 16px; border-radius:100px; margin-bottom:18px;
          font-size:11px; font-weight:700; letter-spacing:.15em;
          text-transform:uppercase; color:#020408;
        }
        .pd-h1 {
          font-family:'Syne',sans-serif;
          font-size:clamp(28px,5vw,60px);
          font-weight:800; line-height:1.05; letter-spacing:-.025em;
          margin-bottom:20px;
          background:linear-gradient(135deg,#fff 30%,rgba(99,200,255,.7) 70%,#fff 100%);
          background-size:300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:pdGrad 8s linear infinite;
        }
        .pd-desc {
          font-size:clamp(14px,1.6vw,17px); font-weight:300;
          color:rgba(255,255,255,.55); line-height:1.75;
          max-width:780px;
        }

        /* ── Info cards row ── */
        .pd-info-row {
          display:grid; grid-template-columns:1fr 1fr; gap:20px;
          margin-bottom:56px;
          animation:pdReveal .8s cubic-bezier(.22,1,.36,1) .3s both;
        }
        @media(max-width:600px){ .pd-info-row { grid-template-columns:1fr; } }

        .pd-info-card {
          padding:24px 24px 26px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.03);
          backdrop-filter:blur(16px);
          transition:border-color .3s, box-shadow .3s;
        }
        .pd-info-card:hover {
          border-color:rgba(99,200,255,.2);
          box-shadow:0 12px 36px rgba(0,0,0,.4);
        }
        .pd-info-icon-wrap {
          width:44px; height:44px; border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:16px;
        }
        .pd-info-title {
          font-family:'Syne',sans-serif;
          font-size:15px; font-weight:700; color:#fff;
          margin-bottom:14px;
        }

        /* tech pills */
        .pd-tech-pills { display:flex; flex-wrap:wrap; gap:8px; }
        .pd-tech-pill {
          display:inline-flex; align-items:center; gap:6px;
          padding:5px 13px; border-radius:100px;
          font-size:12px; font-weight:500;
          border-width:1px; border-style:solid;
          transition:all .2s;
        }
        .pd-tech-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }

        /* visit btn */
        .pd-visit-btn {
          display:inline-flex; align-items:center; gap:8px;
          padding:10px 22px; border-radius:100px;
          font-size:13px; font-weight:600; letter-spacing:.02em;
          color:#020408; text-decoration:none;
          animation:pdGrad 4s linear infinite;
          background-size:200% 200%;
          box-shadow:0 0 20px rgba(99,200,255,.2);
          transition:transform .2s, box-shadow .2s;
        }
        .pd-visit-btn:hover {
          transform:translateY(-2px) scale(1.03);
          box-shadow:0 0 40px rgba(99,200,255,.4);
        }
        .pd-visit-arrow { transition:transform .2s; display:inline-block; }
        .pd-visit-btn:hover .pd-visit-arrow { transform:translateX(4px); }

        /* ── Gallery section ── */
        .pd-gallery-title {
          font-family:'Syne',sans-serif;
          font-size:22px; font-weight:700;
          background:linear-gradient(135deg,#fff 40%,rgba(99,200,255,.65) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:24px;
          animation:pdReveal .8s cubic-bezier(.22,1,.36,1) .4s both;
        }
        .pd-gallery-grid {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:16px;
          animation:pdReveal .8s cubic-bezier(.22,1,.36,1) .45s both;
        }
        @media(max-width:900px){ .pd-gallery-grid { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:500px){ .pd-gallery-grid { grid-template-columns:1fr; } }

        /* thumb */
        .pd-thumb {
          position:relative; aspect-ratio:16/10;
          border-radius:16px; overflow:hidden;
          border:1px solid rgba(255,255,255,.07);
          cursor:pointer; transform-style:preserve-3d;
          background:rgba(255,255,255,.03);
          animation:pdReveal .7s cubic-bezier(.22,1,.36,1) both;
        }
        .pd-thumb-img {
          object-fit:cover; object-position:top center;
          transition:transform .6s cubic-bezier(.22,1,.36,1) !important;
        }
        .pd-thumb-overlay {
          position:absolute; inset:0; z-index:1;
          background:linear-gradient(to top, rgba(2,4,8,.8) 0%, rgba(2,4,8,.1) 60%, transparent 100%);
          transition:opacity .3s;
        }
        .pd-thumb-zoom {
          position:absolute; inset:0; z-index:2;
          display:flex; align-items:center; justify-content:center;
          transition:opacity .3s, transform .3s;
        }
        .pd-thumb-zoom > svg {
          width:40px; height:40px;
          background:rgba(2,4,8,.7);
          border-radius:50%; padding:8px;
          color:#63C8FF;
          backdrop-filter:blur(8px);
          border:1px solid rgba(99,200,255,.3);
        }
        .pd-thumb-counter {
          position:absolute; top:10px; right:10px; z-index:3;
          background:rgba(2,4,8,.7); backdrop-filter:blur(8px);
          border-radius:100px; padding:3px 10px;
          font-size:11px; font-weight:600; color:#fff;
          border:1px solid rgba(255,255,255,.1);
          transition:opacity .3s;
        }
        .pd-corner {
          position:absolute; width:14px; height:14px;
          border-width:1.5px; border-style:solid;
          border-color:#63C8FF; pointer-events:none; z-index:4;
          transition:opacity .3s;
        }
        .pd-c-tl { top:10px; left:10px; border-right:none; border-bottom:none; border-radius:3px 0 0 0; }
        .pd-c-br { bottom:10px; right:10px; border-left:none; border-top:none; border-radius:0 0 3px 0; }

        /* skeleton */
        .pd-skeleton {
          aspect-ratio:16/10; border-radius:16px;
          background:rgba(255,255,255,.04);
          animation:pdPulse 1.8s ease-in-out infinite;
          border:1px solid rgba(255,255,255,.04);
        }

        /* ── Lightbox ── */
        .pd-lb-root {
          position:fixed; inset:0; z-index:100;
          background:rgba(2,4,8,.96);
          backdrop-filter:blur(16px);
          display:flex; align-items:center; justify-content:center;
          animation:pdLbIn .25s ease both;
        }
        .pd-lb-img-wrap {
          position:relative;
          width:100%; height:100%;
          max-width:1280px; max-height:90vh;
          animation:pdImgIn .3s cubic-bezier(.22,1,.36,1) both;
        }
        .pd-lb-btn {
          position:absolute; z-index:10;
          width:44px; height:44px; border-radius:50%;
          background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.12);
          color:#fff; cursor:pointer;
          display:flex; align-items:center; justify-content:center;
          transition:background .2s, transform .2s;
          backdrop-filter:blur(8px);
        }
        .pd-lb-btn:hover { background:rgba(99,200,255,.2); transform:scale(1.1); }
        .pd-lb-close { top:20px; right:20px; }
        .pd-lb-prev  { left:20px;  top:50%; transform:translateY(-50%); }
        .pd-lb-prev:hover  { transform:translateY(-50%) scale(1.1); }
        .pd-lb-next  { right:20px; top:50%; transform:translateY(-50%); }
        .pd-lb-next:hover  { transform:translateY(-50%) scale(1.1); }
        .pd-lb-counter {
          position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
          background:rgba(255,255,255,.08); backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,.12);
          border-radius:100px; padding:5px 16px;
          font-size:13px; font-weight:600; color:#fff;
        }
      `}</style>

      <main className="pd-root">
        <div className="pd-grid-bg" aria-hidden />
        <div className="pd-orb" aria-hidden style={{ width: 500, height: 500, top: '-10%', right: '-5%', background: `radial-gradient(circle,hsla(${hue},70%,55%,.07) 0%,transparent 65%)`, animationDelay: '0s' }} />
        <div className="pd-orb" aria-hidden style={{ width: 400, height: 400, bottom: '-5%', left: '-5%', background: 'radial-gradient(circle,rgba(167,139,250,.06) 0%,transparent 65%)', animationDelay: '6s' }} />

        <Header />

        <div className="pd-section">

          {/* Back */}
          <Link href="/#projects" className="pd-back">
            <svg className="pd-back-arrow" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="pd-back-badge" style={{
              background: `linear-gradient(135deg, hsla(${hue},80%,55%,1), hsla(${hue + 40},70%,60%,1))`,
            }}>
              {project.category[language as 'pt' | 'en']}
            </span>
            <span>{ispt ? 'Voltar aos Projectos' : 'Back to Projects'}</span>
          </Link>

          {/* Cover */}
          {project.image && (
            <div className="pd-cover-wrap">
              <Image
                src={project.image}
                alt={project.title[language as 'pt' | 'en']}
                fill
                className="object-cover object-top"
                priority
                quality={90}
                onLoad={() => setCoverLoaded(true)}
                style={{ transition: 'opacity .5s', opacity: coverLoaded ? 1 : 0 }}
              />
              <div style={{
                position: 'absolute', inset: 0, zIndex: 1,
                background: `linear-gradient(to top, rgba(2,4,8,.85) 0%, rgba(2,4,8,.05) 50%, transparent 100%)`,
              }} />
              {/* Corner accents */}
              {['tl','tr','bl','br'].map((c) => (
                <div key={c} className={`pd-cover-corner ${c}`} style={{ borderColor: `hsla(${hue},80%,65%,0.6)` }} />
              ))}
            </div>
          )}

          {/* Header */}
          <div className="pd-header">
            <div className="pd-cat-badge" style={{
              background: `linear-gradient(135deg, hsla(${hue},80%,55%,1), hsla(${hue + 40},70%,60%,1))`,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(2,4,8,0.5)', display: 'inline-block' }} />
              {project.category[language as 'pt' | 'en']}
            </div>
            <h1 className="pd-h1">{project.title[language as 'pt' | 'en']}</h1>
            <p className="pd-desc">{project.description[language as 'pt' | 'en']}</p>
          </div>

          {/* Info row */}
          <div className="pd-info-row">
            {/* Technologies */}
            <div className="pd-info-card">
              <div className="pd-info-icon-wrap" style={{
                background: `hsla(${hue},80%,50%,0.1)`,
                border: `1px solid hsla(${hue},70%,60%,0.25)`,
              }}>
                <svg width="20" height="20" fill="none" stroke={`hsla(${hue},85%,70%,1)`} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="pd-info-title">{ispt ? 'Tecnologias Utilizadas' : 'Technologies Used'}</div>
              <div className="pd-tech-pills">
                {project.technologies.map((tech) => (
                  <span key={tech} className="pd-tech-pill" style={{
                    borderColor: `hsla(${hue},70%,60%,0.3)`,
                    color: `hsla(${hue},80%,72%,1)`,
                    background: `hsla(${hue},80%,50%,0.07)`,
                  }}>
                    <span className="pd-tech-dot" style={{ background: `hsla(${hue},80%,65%,1)` }} />
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {project.link && project.link !== '#' && (
              <div className="pd-info-card">
                <div className="pd-info-icon-wrap" style={{
                  background: 'rgba(99,200,255,0.08)',
                  border: '1px solid rgba(99,200,255,0.2)',
                }}>
                  <svg width="20" height="20" fill="none" stroke="#63C8FF" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <div className="pd-info-title">{ispt ? 'Links do Projecto' : 'Project Links'}</div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-visit-btn"
                  style={{ background: `linear-gradient(135deg, hsla(${hue},80%,55%,1), hsla(${hue + 40},70%,60%,1))` }}
                >
                  <span>{ispt ? 'Visitar Projecto' : 'Visit Project'}</span>
                  <span className="pd-visit-arrow">→</span>
                </a>
              </div>
            )}
          </div>

          {/* Gallery */}
          {loading ? (
            <div className="pd-gallery-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="pd-skeleton" />
              ))}
            </div>
          ) : images.length > 0 ? (
            <>
              <h2 className="pd-gallery-title">
                {ispt ? 'Galeria de Imagens' : 'Image Gallery'}
              </h2>
              <div className="pd-gallery-grid">
                {images.map((src, i) => (
                  <GalleryThumb
                    key={i}
                    src={src}
                    alt={`${project.title[language as 'pt' | 'en']} — Screenshot ${i + 1}`}
                    index={i}
                    total={images.length}
                    onOpen={openLightbox}
                  />
                ))}
              </div>
            </>
          ) : null}

        </div>

        <Footer />
      </main>

      {/* Lightbox */}
      {selectedImage !== null && (
        <Lightbox
          images={images}
          index={selectedImage}
          onClose={closeLightbox}
          onNav={navigateImage}
        />
      )}
    </>
  )
}