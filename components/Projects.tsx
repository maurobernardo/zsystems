'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Project data ───────────────────────────────────────────────────────── */
const PROJECTS_PT = [
  { id:'agro', title:'Agro Tech Mozambique', category:'Website Empresarial', description:'Website institucional para Agro Tech Mozambique, apresentando serviços, projectos e presença digital da empresa no sector agrícola.', technologies:['React','Next.js','Tailwind CSS'], image:'/Projectos/Agro/1.png', link:'https://agro-tech-mozambique.vercel.app/', imagesPath:'/Projectos/Agro', hue:145 },
  { id:'bioclean', title:'BioClean Environment', category:'Website Empresarial', description:'Website institucional para BioClean Environment, destacando soluções e serviços ambientais da empresa.', technologies:['React','Next.js','Tailwind CSS'], image:'/Projectos/Bio/1.png', link:'https://bioclean-environment.vercel.app/pt', imagesPath:'/Projectos/Bio', hue:195 },
  { id:'ucm', title:'Sistema Académico UCM-FEG', category:'Sistema Web', description:'Sistema web para facilitar o acesso às informações académicas dos estudantes, com assistente virtual com voz para responder dúvidas.', technologies:['React','TypeScript','Laravel','PHP'], image:'/images/UCM.png', link:'https://deyril-marlon.vercel.app/', imagesPath:'/Projectos/UCM', hue:220 },
  { id:'deyril', title:'Portfólio – Deyril Marlon', category:'Portfólio Web', description:'Portfólio pessoal moderno com suporte a múltiplos idiomas (PT/EN), modo escuro/claro e chatbot inteligente.', technologies:['Next.js','TypeScript','Tailwind CSS'], image:'/images/Deyril.png', link:'https://deyril-marlon.vercel.app/', imagesPath:'/Projectos/Deyril', hue:280 },
  { id:'samson', title:'Portfólio – Samson Chifamba', category:'Portfólio Web', description:'Portfólio profissional com suporte a modo escuro/claro, tradução PT/EN, mapa de localização e hospedagem no Vercel.', technologies:['React','Tailwind CSS'], image:'/images/Samson.png', link:'https://samson-chifamba.vercel.app/', imagesPath:'/Projectos/Samson', hue:165 },
  { id:'feg', title:'Gestão de Projectos de Fim de Curso', category:'Sistema de Gestão', description:'Sistema web para gestão de projectos de fim de curso do Departamento de Arquitectura da UCM-FEG.', technologies:['Laravel','PHP'], image:'/images/Feg.png', link:null, imagesPath:null, hue:20 },
]
const PROJECTS_EN = [
  { id:'agro', title:'Agro Tech Mozambique', category:'Corporate Website', description:'Corporate website for Agro Tech Mozambique, showcasing services, projects and company digital presence in the agricultural sector.', technologies:['React','Next.js','Tailwind CSS'], image:'/Projectos/Agro/1.png', link:'https://agro-tech-mozambique.vercel.app/', imagesPath:'/Projectos/Agro', hue:145 },
  { id:'bioclean', title:'BioClean Environment', category:'Corporate Website', description:'Corporate website for BioClean Environment, highlighting the company\'s environmental solutions and services.', technologies:['React','Next.js','Tailwind CSS'], image:'/Projectos/Bio/1.png', link:'https://bioclean-environment.vercel.app/pt', imagesPath:'/Projectos/Bio', hue:195 },
  { id:'ucm', title:'UCM-FEG Academic System', category:'Web System', description:'Web system to facilitate access to students\' academic information. Includes a voice virtual assistant to answer questions.', technologies:['React','TypeScript','Laravel','PHP'], image:'/images/UCM.png', link:'https://deyril-marlon.vercel.app/', imagesPath:'/Projectos/UCM', hue:220 },
  { id:'deyril', title:'Portfolio – Deyril Marlon', category:'Web Portfolio', description:'Modern personal portfolio with PT/EN support, dark/light mode, and an intelligent chatbot to answer questions.', technologies:['Next.js','TypeScript','Tailwind CSS'], image:'/images/Deyril.png', link:'https://deyril-marlon.vercel.app/', imagesPath:'/Projectos/Deyril', hue:280 },
  { id:'samson', title:'Portfolio – Samson Chifamba', category:'Web Portfolio', description:'Professional portfolio with dark/light mode, PT/EN translation, location map, and hosted on Vercel.', technologies:['React','Tailwind CSS'], image:'/images/Samson.png', link:'https://samson-chifamba.vercel.app/', imagesPath:'/Projectos/Samson', hue:165 },
  { id:'feg', title:'End-of-Course Project Management', category:'Management System', description:'Web system for managing end-of-course projects for the Architecture Department of UCM-FEG.', technologies:['Laravel','PHP'], image:'/images/Feg.png', link:null, imagesPath:null, hue:20 },
]

type Project = (typeof PROJECTS_PT)[0]

/* ─── 3D Background Canvas ───────────────────────────────────────────────── */
function ProjectsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const setSize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2)
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2)
    }
    setSize(); window.addEventListener('resize', setSize)
    const ctx = canvas.getContext('2d'); if (!ctx) return

    const palette = [[99,200,255],[167,139,250],[244,114,182],[74,222,128],[251,146,60]]

    interface Node3D { x:number;y:number;z:number;vx:number;vy:number;vz:number;size:number;color:number[];phase:number }
    const nodes: Node3D[] = Array.from({length:70},()=>({
      x:Math.random(),y:Math.random(),z:Math.random(),
      vx:(Math.random()-.5)*.0003,vy:(Math.random()-.5)*.0003,vz:(Math.random()-.5)*.0004,
      size:.5+Math.random()*2.5,color:palette[Math.floor(Math.random()*palette.length)],phase:Math.random()*Math.PI*2,
    }))

    const icoVerts=[[0,1,1.618],[0,-1,1.618],[0,1,-1.618],[0,-1,-1.618],[1,1.618,0],[-1,1.618,0],[1,-1.618,0],[-1,-1.618,0],[1.618,0,1],[-1.618,0,1],[1.618,0,-1],[-1.618,0,-1]].map(v=>{const l=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);return[v[0]/l,v[1]/l,v[2]/l]})
    const icoEdges=[[0,1],[0,4],[0,5],[0,8],[0,9],[1,6],[1,7],[1,8],[1,9],[2,3],[2,4],[2,5],[2,10],[2,11],[3,6],[3,7],[3,10],[3,11],[4,5],[4,8],[4,10],[5,9],[5,11],[6,7],[6,8],[6,10],[7,9],[7,11],[8,10],[9,11]]

    interface Ico{cx:number;cy:number;size:number;rotX:number;rotY:number;rotZ:number;rspX:number;rspY:number;rspZ:number;color:number[];opacity:number}
    const icos:Ico[]=Array.from({length:5},()=>({cx:.1+Math.random()*.8,cy:.1+Math.random()*.8,size:55+Math.random()*75,rotX:Math.random()*Math.PI*2,rotY:Math.random()*Math.PI*2,rotZ:Math.random()*Math.PI*2,rspX:(Math.random()-.5)*.004,rspY:(Math.random()-.5)*.006,rspZ:(Math.random()-.5)*.003,color:palette[Math.floor(Math.random()*palette.length)],opacity:.06+Math.random()*.09}))

    const rot=(px:number,py:number,pz:number,rx:number,ry:number,rz:number)=>{
      let y=py*Math.cos(rx)-pz*Math.sin(rx),z=py*Math.sin(rx)+pz*Math.cos(rx),x=px
      const nx=x*Math.cos(ry)+z*Math.sin(ry),nz=-x*Math.sin(ry)+z*Math.cos(ry)
      x=nx;z=nz
      return[x*Math.cos(rz)-y*Math.sin(rz),x*Math.sin(rz)+y*Math.cos(rz),z]
    }

    let t=0
    const draw=()=>{
      rafRef.current=requestAnimationFrame(draw);t+=.005
      const W=canvas.width,H=canvas.height
      ctx.clearRect(0,0,W,H)
      icos.forEach(ico=>{
        ico.rotX+=ico.rspX;ico.rotY+=ico.rspY;ico.rotZ+=ico.rspZ
        const cx=ico.cx*W,cy=ico.cy*H;const[r,g,b]=ico.color
        ctx.strokeStyle=`rgba(${r},${g},${b},${ico.opacity})`;ctx.lineWidth=.8
        icoEdges.forEach(([a,b2])=>{
          const pa=rot(icoVerts[a][0],icoVerts[a][1],icoVerts[a][2],ico.rotX,ico.rotY,ico.rotZ)
          const pb=rot(icoVerts[b2][0],icoVerts[b2][1],icoVerts[b2][2],ico.rotX,ico.rotY,ico.rotZ)
          const da=2.5/(2.5+pa[2]*.3),db=2.5/(2.5+pb[2]*.3)
          ctx.beginPath();ctx.moveTo(cx+pa[0]*ico.size*da,cy+pa[1]*ico.size*da);ctx.lineTo(cx+pb[0]*ico.size*db,cy+pb[1]*ico.size*db);ctx.stroke()
        })
      })
      nodes.forEach(n=>{
        n.x+=n.vx+Math.sin(t*.4+n.phase)*.0001;n.y+=n.vy+Math.cos(t*.3+n.phase)*.0001;n.z+=n.vz
        if(n.x<0)n.x=1;if(n.x>1)n.x=0;if(n.y<0)n.y=1;if(n.y>1)n.y=0;if(n.z<0)n.z=1;if(n.z>1)n.z=0
        const px=n.x*W,py=n.y*H,depth=.4+n.z*.6
        const[r,g,bb]=n.color;const alpha=depth*(.4+.3*Math.sin(t*.8+n.phase)),sz=n.size*depth
        const grad=ctx.createRadialGradient(px,py,0,px,py,sz*3)
        grad.addColorStop(0,`rgba(${r},${g},${bb},${alpha})`);grad.addColorStop(1,`rgba(${r},${g},${bb},0)`)
        ctx.beginPath();ctx.arc(px,py,sz*3,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill()
      })
      for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
        const dx=(nodes[i].x-nodes[j].x)*W,dy=(nodes[i].y-nodes[j].y)*H,dz=(nodes[i].z-nodes[j].z)*100
        const dist=Math.sqrt(dx*dx+dy*dy+dz*dz)
        if(dist<80){const[r,g,bb]=nodes[i].color;ctx.beginPath();ctx.strokeStyle=`rgba(${r},${g},${bb},${(1-dist/80)*.07})`;ctx.lineWidth=.4;ctx.moveTo(nodes[i].x*W,nodes[i].y*H);ctx.lineTo(nodes[j].x*W,nodes[j].y*H);ctx.stroke()}
      }
    }
    draw()
    return()=>{window.removeEventListener('resize',setSize);if(rafRef.current)cancelAnimationFrame(rafRef.current)}
  },[])

  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}} />
}

/* ─── Project Card (full 3D flip) ────────────────────────────────────────── */
function ProjectCard({ project, index, t, language, visible }: {
  project: Project; index: number; t: (k: string) => string; language: string; visible: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [cardHeight, setCardHeight] = useState(480)
  const [imgErr, setImgErr] = useState(false)

  useEffect(() => {
    if (!frontRef.current) return
    const ro = new ResizeObserver(([e]) => setCardHeight(e.contentRect.height))
    ro.observe(frontRef.current)
    return () => ro.disconnect()
  }, [])

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect(); if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y }); setTilt({ x: (y - 0.5) * -14, y: (x - 0.5) * 14 })
  }, [])

  const sheenX = mousePos.x * 100; const sheenY = mousePos.y * 100
  const { hue } = project

  return (
    <div
      style={{
        perspective: '1000px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${index * 0.13}s, transform 0.7s cubic-bezier(.22,1,.36,1) ${index * 0.13}s`,
      }}
    >
      {/* Flip container */}
      <div
        ref={cardRef}
        style={{
          position: 'relative', transformStyle: 'preserve-3d',
          transition: flipped ? 'transform 0.7s cubic-bezier(.22,1,.36,1)' : hovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(.22,1,.36,1)',
          transform: flipped
            ? 'perspective(1000px) rotateY(180deg)'
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 14 : 0}px)`,
          minHeight: cardHeight,
          cursor: 'pointer',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); setMousePos({ x: 0.5, y: 0.5 }) }}
        onClick={() => setFlipped(f => !f)}
      >

        {/* ── FRONT FACE ── */}
        <div
          ref={frontRef}
          style={{
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            borderRadius: 24,
            border: `1px solid hsla(${hue},70%,60%,${hovered ? 0.4 : 0.1})`,
            background: 'rgba(2,4,8,0.88)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: hovered
              ? `0 30px 80px hsla(${hue},80%,50%,0.25), 0 0 0 1px hsla(${hue},80%,60%,0.15), inset 0 1px 0 hsla(${hue},80%,80%,0.1)`
              : '0 8px 32px rgba(0,0,0,0.4)',
            transition: 'box-shadow 0.4s, border-color 0.4s',
          }}
        >
          {/* Holographic sheen */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', borderRadius: 24,
            opacity: hovered ? 0.65 : 0, transition: 'opacity 0.3s',
            background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, hsla(${hue},100%,80%,0.14) 0%, hsla(${hue+60},100%,70%,0.07) 40%, transparent 70%)`,
          }} />

          {/* Top edge glow */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, hsla(${hue},90%,65%,${hovered ? 0.85 : 0.2}), transparent)`,
            transition: 'all 0.4s', zIndex: 5,
          }} />

          {/* Image */}
          <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
            {project.image && !imgErr ? (
              <Image src={project.image} alt={project.title} fill
                style={{ objectFit:'cover', objectPosition:'top center', transform: hovered ? 'scale(1.08)' : 'scale(1)', transition:'transform 0.6s cubic-bezier(.22,1,.36,1)' }}
                onError={() => setImgErr(true)}
              />
            ) : (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, hsla(${hue},60%,20%,1), hsla(${hue+40},50%,15%,1))` }}>
                <svg width="40" height="40" fill="none" stroke={`hsla(${hue},70%,65%,0.5)`} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}

            {/* Depth overlay */}
            <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(2,4,8,0.95) 0%, rgba(2,4,8,0.3) 55%, transparent 100%)`, zIndex:2 }} />

            {/* Badge */}
            <div style={{
              position:'absolute', bottom:12, left:14, zIndex:6,
              background:`rgba(2,4,8,0.8)`,
              border:`1px solid hsla(${hue},70%,60%,${hovered ? 0.55 : 0.25})`,
              color:`hsla(${hue},85%,72%,1)`,
              fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase',
              padding:'4px 10px', borderRadius:100, backdropFilter:'blur(8px)',
              transition:'border-color 0.3s',
            }}>
              {project.category}
            </div>

            {/* Index */}
            <div style={{
              position:'absolute', top:14, right:14, zIndex:6,
              fontFamily:"'Syne',sans-serif", fontSize:12, fontWeight:700,
              color:`hsla(${hue},80%,65%,${hovered ? 0.8 : 0.35})`,
              transition:'color 0.3s',
            }}>
              {String(index + 1).padStart(2,'0')}
            </div>

            {/* Corner accents */}
            {[
              { top:10, left:10, borderRight:'none', borderBottom:'none', borderRadius:'4px 0 0 0' },
              { top:10, right:10, borderLeft:'none', borderBottom:'none', borderRadius:'0 4px 0 0' },
            ].map((s,i)=>(
              <div key={i} style={{ position:'absolute', width:14, height:14, border:`1.5px solid hsla(${hue},90%,65%,${hovered ? 0.9 : 0.25})`, zIndex:5, pointerEvents:'none', transition:'border-color 0.3s', ...s }} />
            ))}

            {/* Flip hint overlay on hover */}
            <div style={{
              position:'absolute', inset:0, zIndex:7,
              display:'flex', alignItems:'center', justifyContent:'center',
              opacity: hovered ? 1 : 0, transition:'opacity 0.3s',
              background:'rgba(2,4,8,0.3)', backdropFilter:'blur(2px)',
            }}>
              <div style={{
                display:'flex', alignItems:'center', gap:6,
                fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
                color:`hsla(${hue},90%,80%,0.8)`,
              }}>
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Ver detalhes
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding:'18px 20px 22px', position:'relative', zIndex:1 }}>
            {/* Shimmer line */}
            <div style={{
              height:1, width:'100%', marginBottom:14, borderRadius:1,
              background:`linear-gradient(90deg, transparent, hsla(${hue},80%,65%,0.55), transparent)`,
              backgroundSize:'200% 100%', animation:'prjShimmer 4s linear infinite',
              opacity: hovered ? 1 : 0.4, transition:'opacity 0.4s',
            }} />

            <h3 style={{
              fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:700, color: hovered ? `hsla(${hue},90%,88%,1)` : '#fff',
              marginBottom:8, lineHeight:1.25, transition:'color 0.3s',
            }}>
              {project.title}
            </h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.48)', lineHeight:1.65, marginBottom:14 }}>
              {project.description}
            </p>

            {/* Tech pills */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
              {project.technologies.map(tech => (
                <span key={tech} style={{
                  display:'inline-flex', alignItems:'center', gap:5,
                  padding:'4px 10px', borderRadius:100,
                  fontSize:11, fontWeight:500,
                  borderColor:`hsla(${hue},70%,60%,${hovered ? 0.4 : 0.18})`,
                  borderWidth:1, borderStyle:'solid',
                  color:`hsla(${hue},80%,72%,1)`,
                  background:`hsla(${hue},80%,50%,${hovered ? 0.1 : 0.04})`,
                  transition:'all 0.25s',
                }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:`hsla(${hue},80%,65%,1)`, flexShrink:0 }} />
                  {tech}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {project.imagesPath ? (
                <Link href={`/projects/${project.id}`}
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex:1, minWidth:0, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
                    padding:'9px 12px', borderRadius:12, fontSize:12, fontWeight:600, textDecoration:'none',
                    borderColor:`hsla(${hue},70%,60%,0.35)`, borderWidth:1, borderStyle:'solid',
                    color:`hsla(${hue},85%,75%,1)`,
                    background:`hsla(${hue},80%,50%,0.08)`,
                    transition:'all 0.25s', whiteSpace:'nowrap',
                  }}
                >
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
                </Link>
              ) : (
                <span style={{ flex:1, minWidth:0, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 12px', borderRadius:12, fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.22)', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', cursor:'not-allowed', whiteSpace:'nowrap' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {language === 'pt' ? 'Ver Detalhes' : 'View Details'}
                </span>
              )}

              {project.link ? (
                <a href={project.link} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{
                    flex:1, minWidth:0, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
                    padding:'9px 12px', borderRadius:12, fontSize:12, fontWeight:600, textDecoration:'none',
                    color:'#020408',
                    background:`linear-gradient(135deg, hsla(${hue},80%,55%,1), hsla(${hue+40},70%,60%,1))`,
                    backgroundSize:'200% 200%', animation:'prjGrad 4s linear infinite',
                    boxShadow: hovered ? `0 0 20px hsla(${hue},80%,55%,0.4)` : 'none',
                    transition:'box-shadow 0.3s', whiteSpace:'nowrap',
                  }}
                >
                  {t('projects.viewProject')}
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </a>
              ) : (
                <span style={{ flex:1, minWidth:0, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px 12px', borderRadius:12, fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.22)', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', cursor:'not-allowed', whiteSpace:'nowrap' }}>
                  {t('projects.viewProject')}
                  <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div style={{
          position:'absolute', inset:0, minHeight:'100%',
          backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          borderRadius:24,
          border:`1px solid hsla(${hue},70%,60%,0.35)`,
          background:`radial-gradient(circle at 50% 30%, hsla(${hue},60%,15%,0.9) 0%, rgba(2,4,8,0.96) 60%)`,
          backdropFilter:'blur(20px)',
          overflow:'hidden',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:28,
          boxShadow:`0 30px 80px hsla(${hue},80%,50%,0.3), inset 0 1px 0 hsla(${hue},80%,80%,0.1)`,
        }}>
          {/* Rotating rings */}
          {[{ s:180, d:'14s', op:0.15 },{ s:260, d:'22s', op:0.07 }].map((r,i)=>(
            <div key={i} style={{
              position:'absolute', width:r.s, height:r.s, borderRadius:'50%',
              border:`1px solid hsla(${hue},80%,60%,${r.op})`,
              top:'50%', left:'50%',
              animation:`tmSpin ${r.d} linear infinite ${i%2===1?'reverse':''}`,
            }}/>
          ))}

          {/* Top glow line */}
          <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:1, background:`linear-gradient(90deg,transparent,hsla(${hue},90%,65%,0.7),transparent)`, zIndex:5 }} />

          {/* Project image thumb */}
          <div style={{
            width:100, height:70, borderRadius:12, overflow:'hidden', position:'relative',
            border:`1.5px solid hsla(${hue},80%,60%,0.4)`,
            boxShadow:`0 0 24px hsla(${hue},80%,50%,0.3)`,
            marginBottom:16, flexShrink:0,
          }}>
            {project.image && !imgErr ? (
              <Image src={project.image} alt={project.title} fill style={{ objectFit:'cover', objectPosition:'top center' }} />
            ) : (
              <div style={{ width:'100%', height:'100%', background:`hsla(${hue},60%,20%,1)` }} />
            )}
          </div>

          <div style={{
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'3px 12px', borderRadius:100, marginBottom:12,
            background:`hsla(${hue},60%,20%,0.8)`,
            border:`1px solid hsla(${hue},70%,60%,0.3)`,
            fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase',
            color:`hsla(${hue},85%,72%,1)`,
          }}>
            {project.category}
          </div>

          <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:'#fff', marginBottom:12, textAlign:'center', lineHeight:1.2 }}>
            {project.title}
          </h3>

          <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.65, textAlign:'center', marginBottom:20 }}>
            {project.description}
          </p>

          {/* Tech pills on back */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:20 }}>
            {project.technologies.map(tech => (
              <span key={tech} style={{
                padding:'4px 10px', borderRadius:100, fontSize:11, fontWeight:500,
                border:`1px solid hsla(${hue},70%,60%,0.3)`,
                color:`hsla(${hue},80%,72%,1)`,
                background:`hsla(${hue},60%,20%,0.5)`,
              }}>{tech}</span>
            ))}
          </div>

          {/* Action on back */}
          <div style={{ display:'flex', gap:10 }}>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'10px 20px', borderRadius:12, fontSize:13, fontWeight:600,
                  color:'#020408', textDecoration:'none',
                  background:`linear-gradient(135deg, hsla(${hue},80%,55%,1), hsla(${hue+40},70%,60%,1))`,
                  boxShadow:`0 4px 20px hsla(${hue},80%,50%,0.35)`,
                }}
              >
                {t('projects.viewProject')}
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </a>
            )}
          </div>

          {/* Back flip hint */}
          <div style={{ marginTop:16, fontSize:10, color:`hsla(${hue},70%,60%,0.5)`, letterSpacing:'0.12em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6 }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Clica para voltar
          </div>
        </div>
      </div>
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0, rootMargin:'0px 0px -50px 0px' })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes prjGrad    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes prjPulse   { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes prjShimmer { from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes tmSpin     { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes prjOrbMove { 0%,100%{transform:scale(1) translate(0,0)} 50%{transform:scale(1.2) translate(16px,-12px)} }

        @media(max-width:900px){ .prj-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:580px){ .prj-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      <section ref={sectionRef} id="projects" style={{ position:'relative', overflow:'hidden', background:'#020408', padding:'60px 0 60px', fontFamily:"'DM Sans',sans-serif" }}>

        {/* 3D Canvas background */}
        <ProjectsCanvas />

        {/* Grid overlay */}
        <div aria-hidden style={{
          position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
          backgroundImage:'linear-gradient(rgba(99,200,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,200,255,.025) 1px,transparent 1px)',
          backgroundSize:'64px 64px',
          maskImage:'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
          WebkitMaskImage:'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
        }} />

        {/* Orbs */}
        {[{ w:500,h:500,top:'-12%',right:'-6%',hue:195,d:'0s' },{ w:400,h:400,bottom:'-8%',left:'-5%',hue:265,d:'5s' },{ w:260,h:260,top:'45%',left:'38%',hue:330,d:'9s' }].map((o,i)=>(
          <div key={i} aria-hidden style={{
            position:'absolute', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none',
            width:o.w, height:o.h, top:(o as any).top, right:(o as any).right, bottom:(o as any).bottom, left:(o as any).left,
            background:`radial-gradient(circle,hsla(${o.hue},80%,60%,0.08) 0%,transparent 65%)`,
            animation:'prjOrbMove 12s ease-in-out infinite', animationDelay:o.d, zIndex:1,
          }}/>
        ))}

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', position:'relative', zIndex:2 }}>

          {/* Header */}
          <div style={{
            textAlign:'center', maxWidth:700, margin:'0 auto 60px',
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition:'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)',
          }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'5px 16px', borderRadius:100, marginBottom:20, border:'1px solid rgba(99,200,255,.2)', background:'rgba(99,200,255,.06)', backdropFilter:'blur(10px)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#63C8FF', boxShadow:'0 0 6px #63C8FF', display:'inline-block', animation:'prjPulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'#63C8FF' }}>{t('projects.tagline')}</span>
            </div>
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontSize:'clamp(26px,3.5vw,46px)', fontWeight:800, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:16,
              background:'linear-gradient(135deg,#fff 20%,rgba(99,200,255,.8) 55%,#A78BFA 80%,#fff 100%)',
              backgroundSize:'300% 300%', WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'prjGrad 8s linear infinite',
            }}>{t('projects.title')}</h2>
            <p style={{ fontSize:'clamp(14px,1.5vw,16px)', fontWeight:300, color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>{t('projects.subtitle')}</p>

            {/* 3D hint */}
            <p style={{ marginTop:12, fontSize:12, color:'rgba(99,200,255,0.4)', letterSpacing:'0.08em' }}>
              ↻ Passa o rato e clica nos cards para interagir em 3D
            </p>
          </div>

          {/* Cards grid */}
          <div className="prj-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:22, maxWidth:1100, margin:'0 auto' }}>
            {shown.map((project, i) => (
              <ProjectCard key={`${project.id}-${i}`} project={project} index={i} t={t} language={language} visible={visible} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div style={{ textAlign:'center', marginTop:40 }}>
              <button
                style={{
                  display:'inline-flex', alignItems:'center', gap:10,
                  padding:'12px 28px', borderRadius:100,
                  fontSize:14, fontWeight:500, letterSpacing:'0.02em',
                  color:'#020408', cursor:'pointer', border:'none',
                  background:'linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6)',
                  backgroundSize:'200% 200%', animation:'prjGrad 4s linear infinite',
                  boxShadow:'0 0 24px rgba(99,200,255,0.25)',
                  transition:'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px) scale(1.02)';(e.currentTarget as HTMLElement).style.boxShadow='0 0 44px rgba(99,200,255,0.45)'}}
                onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='0 0 24px rgba(99,200,255,0.25)'}}
                onClick={() => setVisibleCount(v => Math.min(v + 3, projects.length))}
              >
                <span>{ispt ? 'Ver Mais Projectos' : 'Load More Projects'}</span>
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          )}

          {/* CTA */}
          <div style={{
            textAlign:'center', marginTop:64,
            opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition:'opacity 0.9s cubic-bezier(.22,1,.36,1) 0.2s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.2s',
          }}>
            <p style={{ fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(255,255,255,.5)', lineHeight:1.6, marginBottom:24 }}>{t('projects.ready')}</p>
            <a href="#contact" style={{
              display:'inline-flex', alignItems:'center', gap:10,
              padding:'13px 28px', borderRadius:100,
              fontSize:14, fontWeight:500, letterSpacing:'0.02em',
              color:'#020408', textDecoration:'none',
              background:'linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6)',
              backgroundSize:'200% 200%', animation:'prjGrad 4s linear infinite',
              boxShadow:'0 0 24px rgba(99,200,255,0.25)',
              transition:'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px) scale(1.02)';(e.currentTarget as HTMLElement).style.boxShadow='0 0 44px rgba(99,200,255,0.45)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='0 0 24px rgba(99,200,255,0.25)'}}
            >
              <span>{t('projects.startProject')}</span>
              <span>→</span>
            </a>
          </div>

        </div>
      </section>
    </>
  )
}