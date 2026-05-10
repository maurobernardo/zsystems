'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Animated counter hook ─────────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, start = false) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!start || !ref.current) return
    let startTime: number | null = null
    const step = (ts: number) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      if (ref.current) ref.current.textContent = String(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return ref
}

function StatCard({ value, suffix, label, delay, visible, hue }: {
  value: number; suffix: string; label: string; delay: number; visible: boolean; hue: number
}) {
  const numRef = useCounter(value, 1600, visible)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="abt-stat-card"
      style={{ animationDelay: `${delay}ms`, '--hue': hue } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="abt-stat-orb" />
      {/* top edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: '15%', right: '15%', height: 1,
        background: `linear-gradient(90deg, transparent, hsla(${hue},90%,65%,${hovered ? 0.9 : 0.25}), transparent)`,
        transition: 'all 0.4s', zIndex: 2,
      }} />
      <div className="abt-stat-num">
        <span ref={numRef}>0</span>{suffix}
      </div>
      <div className="abt-stat-label">{label}</div>
    </div>
  )
}

/* ─── 3D Background Canvas (same as Team) ───────────────────────────────── */
function AboutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const setSize = () => {
      canvas.width = canvas.offsetWidth * Math.min(window.devicePixelRatio, 2)
      canvas.height = canvas.offsetHeight * Math.min(window.devicePixelRatio, 2)
    }
    setSize()
    window.addEventListener('resize', setSize)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const palette = [
      [99, 200, 255],
      [167, 139, 250],
      [244, 114, 182],
      [74, 222, 128],
      [251, 146, 60],
    ]

    interface Node3D {
      x: number; y: number; z: number
      vx: number; vy: number; vz: number
      size: number; color: number[]; phase: number
    }

    const nodes: Node3D[] = Array.from({ length: 60 }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      vz: (Math.random() - 0.5) * 0.0004,
      size: 0.5 + Math.random() * 2.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      phase: Math.random() * Math.PI * 2,
    }))

    const icoVerts = [
      [0,1,1.618],[0,-1,1.618],[0,1,-1.618],[0,-1,-1.618],
      [1,1.618,0],[-1,1.618,0],[1,-1.618,0],[-1,-1.618,0],
      [1.618,0,1],[-1.618,0,1],[1.618,0,-1],[-1.618,0,-1],
    ].map(v => { const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); return [v[0]/l,v[1]/l,v[2]/l] })

    const icoEdges = [
      [0,1],[0,4],[0,5],[0,8],[0,9],[1,6],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,5],[2,10],[2,11],[3,6],[3,7],[3,10],[3,11],
      [4,5],[4,8],[4,10],[5,9],[5,11],[6,7],[6,8],[6,10],[7,9],[7,11],[8,10],[9,11],
    ]

    interface Ico {
      cx: number; cy: number; size: number
      rotX: number; rotY: number; rotZ: number
      rspX: number; rspY: number; rspZ: number
      color: number[]; opacity: number
    }

    const icos: Ico[] = Array.from({ length: 4 }, () => ({
      cx: 0.1 + Math.random() * 0.8, cy: 0.1 + Math.random() * 0.8,
      size: 50 + Math.random() * 70,
      rotX: Math.random() * Math.PI * 2, rotY: Math.random() * Math.PI * 2, rotZ: Math.random() * Math.PI * 2,
      rspX: (Math.random() - 0.5) * 0.004, rspY: (Math.random() - 0.5) * 0.006, rspZ: (Math.random() - 0.5) * 0.003,
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: 0.06 + Math.random() * 0.09,
    }))

    const rotatePoint = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
      let y = py * Math.cos(rx) - pz * Math.sin(rx)
      let z = py * Math.sin(rx) + pz * Math.cos(rx)
      let x = px
      const nx = x * Math.cos(ry) + z * Math.sin(ry)
      const nz = -x * Math.sin(ry) + z * Math.cos(ry)
      x = nx; z = nz
      const fx = x * Math.cos(rz) - y * Math.sin(rz)
      const fy = x * Math.sin(rz) + y * Math.cos(rz)
      return [fx, fy, z]
    }

    let t = 0
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      t += 0.005
      const W = canvas.width, H = canvas.height
      ctx.clearRect(0, 0, W, H)

      icos.forEach(ico => {
        ico.rotX += ico.rspX; ico.rotY += ico.rspY; ico.rotZ += ico.rspZ
        const cx = ico.cx * W, cy = ico.cy * H
        const [r, g, b] = ico.color
        ctx.strokeStyle = `rgba(${r},${g},${b},${ico.opacity})`
        ctx.lineWidth = 0.8
        icoEdges.forEach(([a, b2]) => {
          const pa = rotatePoint(icoVerts[a][0], icoVerts[a][1], icoVerts[a][2], ico.rotX, ico.rotY, ico.rotZ)
          const pb = rotatePoint(icoVerts[b2][0], icoVerts[b2][1], icoVerts[b2][2], ico.rotX, ico.rotY, ico.rotZ)
          const da = 2.5 / (2.5 + pa[2] * 0.3)
          const db = 2.5 / (2.5 + pb[2] * 0.3)
          ctx.beginPath()
          ctx.moveTo(cx + pa[0] * ico.size * da, cy + pa[1] * ico.size * da)
          ctx.lineTo(cx + pb[0] * ico.size * db, cy + pb[1] * ico.size * db)
          ctx.stroke()
        })
      })

      nodes.forEach(n => {
        n.x += n.vx + Math.sin(t * 0.4 + n.phase) * 0.0001
        n.y += n.vy + Math.cos(t * 0.3 + n.phase) * 0.0001
        n.z += n.vz
        if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0
        if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0
        if (n.z < 0) n.z = 1; if (n.z > 1) n.z = 0
        const px = n.x * W, py = n.y * H
        const depth = 0.4 + n.z * 0.6
        const [r, g, bb] = n.color
        const alpha = depth * (0.4 + 0.3 * Math.sin(t * 0.8 + n.phase))
        const sz = n.size * depth
        const grad = ctx.createRadialGradient(px, py, 0, px, py, sz * 3)
        grad.addColorStop(0, `rgba(${r},${g},${bb},${alpha})`)
        grad.addColorStop(1, `rgba(${r},${g},${bb},0)`)
        ctx.beginPath(); ctx.arc(px, py, sz * 3, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W
          const dy = (nodes[i].y - nodes[j].y) * H
          const dz = (nodes[i].z - nodes[j].z) * 100
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          if (dist < 80) {
            const [r, g, bb] = nodes[i].color
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${r},${g},${bb},${(1 - dist / 80) * 0.07})`
            ctx.lineWidth = 0.4
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H)
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H)
            ctx.stroke()
          }
        }
      }
    }
    draw()
    return () => { window.removeEventListener('resize', setSize); if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      zIndex: 0, pointerEvents: 'none',
    }} />
  )
}

/* ─── 3D Image Card ─────────────────────────────────────────────────────── */
function ImageCard3D() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x: x * 100, y: y * 100 })
    setTilt({ x: (y - 0.5) * -16, y: (x - 0.5) * 16 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); setMousePos({ x: 50, y: 50 }) }}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 12 : 0}px)`,
        transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(.22,1,.36,1)',
        borderRadius: 28,
        border: `1px solid hsla(195,70%,60%,${hovered ? 0.45 : 0.12})`,
        background: 'rgba(2,4,8,0.85)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        aspectRatio: '4/5',
        boxShadow: hovered
          ? '0 40px 100px hsla(195,80%,50%,0.3), 0 0 0 1px hsla(195,80%,60%,0.2), inset 0 1px 0 hsla(195,80%,80%,0.1)'
          : '0 16px 48px rgba(0,0,0,0.5)',
        cursor: 'default',
      }}
    >
      {/* Holographic sheen */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', borderRadius: 28,
        opacity: hovered ? 0.7 : 0, transition: 'opacity 0.3s',
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, hsla(195,100%,80%,0.18) 0%, hsla(255,100%,70%,0.09) 40%, transparent 70%)`,
      }} />

      {/* Top edge glow */}
      <div style={{
        position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
        background: `linear-gradient(90deg, transparent, hsla(195,90%,65%,${hovered ? 0.9 : 0.2}), transparent)`,
        transition: 'all 0.4s', zIndex: 5,
      }} />

      {/* Photo */}
      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
        <Image
          src="/images/about4.png"
          alt="Tecnologia e transformação digital"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(.22,1,.36,1)',
          }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(2,4,8,0.9) 0%, rgba(2,4,8,0.35) 50%, transparent 100%)',
          zIndex: 1,
        }} />
      </div>

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
      }} />

      {/* Corner accents */}
      {[
        { top: 14, left: 14, borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' },
        { top: 14, right: 14, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' },
        { bottom: 14, left: 14, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' },
        { bottom: 14, right: 14, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: 20, height: 20,
          border: `1.5px solid hsla(195,90%,65%,${hovered ? 0.9 : 0.3})`,
          zIndex: 6, pointerEvents: 'none', transition: 'border-color 0.3s', ...s,
        }} />
      ))}

      {/* 3D floating badge — year */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20, zIndex: 8,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '7px 16px', borderRadius: 100,
        background: 'linear-gradient(135deg, #63C8FF, #A78BFA)',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
        color: '#020408', textTransform: 'uppercase',
        boxShadow: '0 4px 24px rgba(99,200,255,0.4)',
        transform: hovered ? 'translateZ(30px) scale(1.05)' : 'translateZ(0)',
        transition: 'transform 0.3s',
        animation: 'abtFloat 3s ease-in-out infinite',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#020408', opacity: 0.6 }} />
        DESDE 2026
      </div>
    </div>
  )
}

/* ─── Floating Chip ─────────────────────────────────────────────────────── */
function FloatingChip({ top, left, right, bottom, delay, hue, icon, title, value }: {
  top?: number|string; left?: number|string; right?: number|string; bottom?: number|string
  delay: string; hue: number; icon: React.ReactNode; title: string; value: string
}) {
  return (
    <div style={{
      position: 'absolute', zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 16px', borderRadius: 16,
      background: 'rgba(2,4,8,0.82)',
      border: `1px solid hsla(${hue},70%,60%,0.25)`,
      backdropFilter: 'blur(16px)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px hsla(${hue},80%,50%,0.1)`,
      animation: 'abtFloat 4s ease-in-out infinite',
      animationDelay: delay,
      top, left, right, bottom,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `hsla(${hue},60%,20%,0.8)`,
        border: `1px solid hsla(${hue},80%,60%,0.3)`,
        color: `hsla(${hue},90%,72%,1)`, flexShrink: 0,
        boxShadow: `0 0 16px hsla(${hue},80%,50%,0.2)`,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>{title}</div>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{value}</div>
      </div>
    </div>
  )
}

/* ─── Feature row ────────────────────────────────────────────────────────── */
function Feature3D({ icon, text, hue, delay }: { icon: React.ReactNode; text: string; hue: number; delay: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14,
        padding: '14px 18px', borderRadius: 16,
        border: `1px solid hsla(${hue},70%,60%,${hovered ? 0.3 : 0.08})`,
        background: hovered ? `hsla(${hue},80%,50%,0.06)` : 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(10px)',
        marginBottom: 10,
        transform: hovered ? 'translateX(6px) translateZ(8px)' : 'translateX(0) translateZ(0)',
        transition: 'all 0.3s cubic-bezier(.22,1,.36,1)',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.3), 0 0 20px hsla(${hue},80%,50%,0.08)` : 'none',
        animationDelay: `${delay}ms`,
        cursor: 'default',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `hsla(${hue},60%,20%,0.7)`,
        border: `1px solid hsla(${hue},80%,60%,${hovered ? 0.5 : 0.2})`,
        color: `hsla(${hue},90%,72%,1)`,
        boxShadow: hovered ? `0 0 16px hsla(${hue},80%,50%,0.3)` : 'none',
        transition: 'all 0.3s',
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 14, color: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)', lineHeight: 1.55, paddingTop: 8, transition: 'color 0.3s' }}>
        {text}
      </span>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function About() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const sectionRef = useRef<HTMLElement>(null)
  const statsVisible = useRef(false)
  const [statsTriggered, setStatsTriggered] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [imageVisible, setImageVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsTriggered(true); statsVisible.current = true } }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const makeObs = (setter: (v: boolean) => void) =>
      new IntersectionObserver(([e]) => { if (e.isIntersecting) setter(true) }, { threshold: 0.1 })
    const o1 = makeObs(setHeaderVisible); const o2 = makeObs(setContentVisible); const o3 = makeObs(setImageVisible)
    if (headerRef.current) o1.observe(headerRef.current)
    if (contentRef.current) o2.observe(contentRef.current)
    if (imageRef.current) o3.observe(imageRef.current)
    return () => { o1.disconnect(); o2.disconnect(); o3.disconnect() }
  }, [])

  const ispt = language === 'pt'

  const features = ispt ? [
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, text: 'Parceiro estratégico para transformação digital das empresas.', hue: 195 },
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: 'Soluções completas: consultoria, design e desenvolvimento.', hue: 265 },
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, text: 'Foco em resultados: sistemas rápidos, seguros e escaláveis.', hue: 145 },
  ] : [
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, text: 'Strategic partner for companies\' digital transformation.', hue: 195 },
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: 'End-to-end solutions: consulting, design and development.', hue: 265 },
    { icon: <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, text: 'Results-driven: fast, secure and scalable systems.', hue: 145 },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes abtGrad   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes abtPulse  { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes abtFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes abtShimmer{ from{background-position:-200% 0} to{background-position:200% 0} }
        @keyframes abtSpin   { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }

        .abt-stat-card {
          position:relative; overflow:hidden;
          padding:22px 16px 18px;
          border-radius:20px;
          border:1px solid rgba(255,255,255,0.07);
          background:rgba(255,255,255,0.03);
          backdrop-filter:blur(12px);
          text-align:center;
          transition:border-color 0.3s, transform 0.3s, box-shadow 0.3s;
          cursor:default;
        }
        .abt-stat-card:hover {
          border-color:hsla(var(--hue),70%,60%,0.35);
          transform:translateY(-6px) translateZ(10px);
          box-shadow:0 20px 50px rgba(0,0,0,0.4), 0 0 30px hsla(var(--hue),80%,50%,0.1);
        }
        .abt-stat-orb {
          position:absolute; top:-20px; right:-20px;
          width:70px; height:70px; border-radius:50%;
          background:radial-gradient(circle,hsla(var(--hue),80%,60%,0.15) 0%,transparent 70%);
          pointer-events:none;
        }
        .abt-stat-num {
          font-family:'Syne',sans-serif;
          font-size:34px; font-weight:800; line-height:1;
          background:linear-gradient(135deg,#fff 40%,hsla(var(--hue),90%,75%,0.8) 100%);
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          margin-bottom:6px;
        }
        .abt-stat-label {
          font-size:11px; color:rgba(255,255,255,0.35);
          letter-spacing:0.12em; text-transform:uppercase;
        }

        @media(max-width:767px){
          .abt-grid-layout { grid-template-columns:1fr !important; gap:48px !important; }
          .abt-chips { display:none !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        id="about"
        style={{
          position: 'relative', overflow: 'hidden',
          background: '#020408',
          padding: '60px 0 60px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* 3D canvas background */}
        <AboutCanvas />

        {/* Grid overlay */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(99,200,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,200,255,.025) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
        }} />

        {/* Ambient orbs */}
        {[
          { w:500, h:500, top:'-10%', right:'-8%', hue:195, delay:'0s' },
          { w:400, h:400, bottom:'-5%', left:'-5%', hue:265, delay:'4s' },
          { w:300, h:300, top:'40%', left:'40%', hue:330, delay:'8s' },
        ].map((o, i) => (
          <div key={i} aria-hidden style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none',
            width: o.w, height: o.h, top: o.top, right: (o as any).right, bottom: (o as any).bottom, left: (o as any).left,
            background: `radial-gradient(circle,hsla(${o.hue},80%,60%,0.08) 0%,transparent 65%)`,
            animation: 'abtFloat 10s ease-in-out infinite', animationDelay: o.delay, zIndex: 1,
          }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>
          <div
            className="abt-grid-layout"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}
          >

            {/* ── LEFT: 3D Image ── */}
            <div
              ref={imageRef}
              style={{
                position: 'relative',
                opacity: imageVisible ? 1 : 0,
                transform: imageVisible ? 'translateX(0)' : 'translateX(-40px)',
                transition: 'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)',
              }}
            >
              {/* Floating chip top-right */}
              <div className="abt-chips">
                <FloatingChip
                  top={20} right={-20} delay="0s" hue={195}
                  title="INOVAÇÃO" value="Contínua"
                  icon={<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.82m5.84-2.56a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.82m2.56-5.84a14.98 14.98 0 00-2.58 5.84m2.699 2.7L3 3l4.2 15.8L21 21l-5.3-4.5z" /></svg>}
                />
                {/* Floating chip bottom-left */}
                <FloatingChip
                  bottom={48} left={-24} delay="2s" hue={265}
                  title="BASE" value="Beira, Moçambique"
                  icon={<svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
              </div>

              {/* Rotating ring behind card */}
              <div style={{
                position: 'absolute', width: 340, height: 340, borderRadius: '50%',
                border: '1px solid hsla(195,80%,60%,0.08)',
                top: '50%', left: '50%', zIndex: 0,
                animation: 'abtSpin 20s linear infinite',
              }} />
              <div style={{
                position: 'absolute', width: 460, height: 460, borderRadius: '50%',
                border: '1px solid hsla(265,80%,60%,0.05)',
                top: '50%', left: '50%', zIndex: 0,
                animation: 'abtSpin 30s linear infinite reverse',
              }} />

              <ImageCard3D />
            </div>

            {/* ── RIGHT: Content ── */}
            <div
              ref={contentRef}
              style={{
                paddingTop: 8,
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible ? 'translateX(0)' : 'translateX(40px)',
                transition: 'opacity 0.9s cubic-bezier(.22,1,.36,1) 0.15s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.15s',
              }}
            >
              {/* Label */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 18px', borderRadius: 100, marginBottom: 20, border: '1px solid rgba(99,200,255,.2)', background: 'rgba(99,200,255,.06)', backdropFilter: 'blur(10px)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#63C8FF', boxShadow: '0 0 6px #63C8FF', display: 'inline-block', animation: 'abtPulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#63C8FF' }}>
                  {ispt ? 'Sobre Nós' : 'About Us'}
                </span>
              </div>

              {/* Headline */}
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(26px,3.5vw,46px)',
                fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20,
                background: 'linear-gradient(135deg, #fff 20%, rgba(99,200,255,.8) 55%, #A78BFA 80%, #fff 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'abtGrad 8s linear infinite',
              }}>
                {ispt ? 'Quem Somos e o\u00a0Que Fazemos' : 'Who We Are and What We Do'}
              </h2>

              <p style={{ fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 300, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 24 }}>
                {t('about.description')}
              </p>

              {/* Tech pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
                {['Next.js','Java EE','Node.js','Cloud','Redes','Sistemas'].map((p, i) => (
                  <span key={p} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 100,
                    fontSize: 12, fontWeight: 500,
                    color: 'rgba(255,255,255,.7)',
                    border: `1px solid hsla(${[195,265,145,330,45,195][i]},70%,60%,0.2)`,
                    background: `hsla(${[195,265,145,330,45,195][i]},80%,50%,0.06)`,
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: `hsla(${[195,265,145,330,45,195][i]},90%,65%,1)`, boxShadow: `0 0 5px hsla(${[195,265,145,330,45,195][i]},90%,65%,0.6)` }} />
                    {p}
                  </span>
                ))}
              </div>

              {/* Shimmer divider */}
              <div style={{
                height: 1, width: '100%', margin: '28px 0',
                background: 'linear-gradient(90deg,transparent,rgba(99,200,255,.4),transparent)',
                backgroundSize: '200% 100%', animation: 'abtShimmer 3s linear infinite',
              }} />

              {/* Features */}
              <div>
                {features.map((f, i) => (
                  <Feature3D key={i} icon={f.icon} text={f.text} hue={f.hue} delay={i * 100} />
                ))}
              </div>

              {/* CTA */}
              <a href="#services" style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '12px 26px', borderRadius: 100,
                fontSize: 14, fontWeight: 500, letterSpacing: '0.02em',
                color: '#020408', textDecoration: 'none', marginTop: 28,
                background: 'linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6)',
                backgroundSize: '200% 200%', animation: 'abtGrad 4s linear infinite',
                boxShadow: '0 0 24px rgba(99,200,255,0.25)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 44px rgba(99,200,255,0.45)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(99,200,255,0.25)' }}
              >
                <span>{ispt ? 'Ver Serviços' : 'View Services'}</span>
                <span>→</span>
              </a>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 36, perspective: '600px' }}>
                {[
                  { value: 4, suffix: '', label: ispt ? 'Clientes' : 'Clients', hue: 195 },
                  { value: 6, suffix: '', label: ispt ? 'Projectos' : 'Projects', hue: 265 },
                  { value: 1, suffix: '', label: ispt ? 'Ano Activo' : 'Year Active', hue: 145 },
                ].map((s, i) => (
                  <StatCard key={s.label} value={s.value} suffix={s.suffix} label={s.label} delay={i * 120} visible={statsTriggered} hue={s.hue} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}