'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { getTranslation } from '@/lib/translations'

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Social {
  href: string
  label: string
  fill?: boolean
  path: string
  hoverColor?: string
}

interface Member {
  key: string
  image: string
  badge: string
  roleIcon: JSX.Element
  socials: Social[]
  accentHue: number
}

/* ─── Role Icons ─────────────────────────────────────────────────────────── */
const ICON_CEO = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)
const ICON_MARKETING = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
)
const ICON_DESIGN = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
)
const ICON_DEV = (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
)

const PATH_LINKEDIN = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
const PATH_GITHUB = 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
const PATH_INSTAGRAM = 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
const PATH_YOUTUBE = 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
const PATH_PORTFOLIO = 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'

const MEMBERS: Member[] = [
  {
    key: 'ceo',
    image: '/images/Ceo.PNG',
    badge: 'CEO',
    roleIcon: ICON_CEO,
    accentHue: 195,
    socials: [
      { href: 'https://github.com/maurobernardo', label: 'GitHub', fill: true, path: PATH_GITHUB },
      { href: 'https://www.linkedin.com/in/mauro-bernardo-zibane-5619b427a/', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://mauro-zibanee.vercel.app/', label: 'Portfolio', fill: false, path: PATH_PORTFOLIO },
    ],
  },
  {
    key: 'marketing',
    image: '/images/Daniel.PNG',
    badge: 'MARKETING',
    roleIcon: ICON_MARKETING,
    accentHue: 265,
    socials: [
      { href: 'https://www.linkedin.com/in/daniel-francisco-vilanculo-3751a0353/', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://www.youtube.com/@OlharCotidiano', label: 'YouTube', fill: true, path: PATH_YOUTUBE, hoverColor: '#ef4444' },
    ],
  },
  {
    key: 'designer',
    image: '/images/Vandro.jpeg',
    badge: 'UX/UI',
    roleIcon: ICON_DESIGN,
    accentHue: 330,
    socials: [
      { href: '#', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: '#', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
    ],
  },
  {
    key: 'developer1',
    image: '/images/Frank.jpeg',
    badge: 'DEV',
    roleIcon: ICON_DEV,
    accentHue: 145,
    socials: [
      { href: 'https://www.linkedin.com/in/frank-walter-simbine-94833a339', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
      { href: 'https://www.instagram.com/frank_walter_9', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
      { href: 'https://frank-walter-simbine.vercel.app/', label: 'Portfolio', fill: false, path: PATH_PORTFOLIO },
    ],
  },
  {
    key: 'developer2',
    image: '/images/Helton.jpeg',
    badge: 'DEV',
    roleIcon: ICON_DEV,
    accentHue: 45,
    socials: [
      { href: 'https://www.instagram.com/heltoncjr', label: 'Instagram', fill: true, path: PATH_INSTAGRAM },
      { href: 'https://www.linkedin.com/in/helton-cunha-0a7b98408', label: 'LinkedIn', fill: true, path: PATH_LINKEDIN },
    ],
  },
]

/* ─── Three.js Background Canvas ────────────────────────────────────────── */
function TeamCanvas() {
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

    // Floating 3D wireframe nodes
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
      size: number
      color: number[]
      phase: number
    }

    const nodes: Node3D[] = Array.from({ length: 80 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
      vz: (Math.random() - 0.5) * 0.0004,
      size: 0.5 + Math.random() * 2.5,
      color: palette[Math.floor(Math.random() * palette.length)],
      phase: Math.random() * Math.PI * 2,
    }))

    // Icosahedron wireframe points (projected)
    const icoVerts = [
      [0, 1, 1.618], [0, -1, 1.618], [0, 1, -1.618], [0, -1, -1.618],
      [1, 1.618, 0], [-1, 1.618, 0], [1, -1.618, 0], [-1, -1.618, 0],
      [1.618, 0, 1], [-1.618, 0, 1], [1.618, 0, -1], [-1.618, 0, -1],
    ].map(v => { const l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]); return [v[0]/l,v[1]/l,v[2]/l] })

    const icoEdges = [
      [0,1],[0,4],[0,5],[0,8],[0,9],
      [1,6],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,5],[2,10],[2,11],
      [3,6],[3,7],[3,10],[3,11],
      [4,5],[4,8],[4,10],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,9],[7,11],[8,10],[9,11],
    ]

    interface Ico {
      cx: number; cy: number
      size: number
      rotX: number; rotY: number; rotZ: number
      rspX: number; rspY: number; rspZ: number
      color: number[]
      opacity: number
    }

    const icos: Ico[] = Array.from({ length: 5 }, () => ({
      cx: 0.1 + Math.random() * 0.8,
      cy: 0.1 + Math.random() * 0.8,
      size: 60 + Math.random() * 80,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotZ: Math.random() * Math.PI * 2,
      rspX: (Math.random() - 0.5) * 0.004,
      rspY: (Math.random() - 0.5) * 0.006,
      rspZ: (Math.random() - 0.5) * 0.003,
      color: palette[Math.floor(Math.random() * palette.length)],
      opacity: 0.06 + Math.random() * 0.10,
    }))

    const rotatePoint = (px: number, py: number, pz: number, rx: number, ry: number, rz: number) => {
      // rotate X
      let y = py * Math.cos(rx) - pz * Math.sin(rx)
      let z = py * Math.sin(rx) + pz * Math.cos(rx)
      let x = px
      // rotate Y
      const nx = x * Math.cos(ry) + z * Math.sin(ry)
      const nz = -x * Math.sin(ry) + z * Math.cos(ry)
      x = nx; z = nz
      // rotate Z
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

      // Draw rotating icosahedra wireframes
      icos.forEach(ico => {
        ico.rotX += ico.rspX
        ico.rotY += ico.rspY
        ico.rotZ += ico.rspZ

        const cx = ico.cx * W
        const cy = ico.cy * H
        const [r, g, b] = ico.color

        ctx.strokeStyle = `rgba(${r},${g},${b},${ico.opacity})`
        ctx.lineWidth = 0.8

        icoEdges.forEach(([a, b2]) => {
          const va = icoVerts[a]
          const vb = icoVerts[b2]
          const pa = rotatePoint(va[0], va[1], va[2], ico.rotX, ico.rotY, ico.rotZ)
          const pb = rotatePoint(vb[0], vb[1], vb[2], ico.rotX, ico.rotY, ico.rotZ)

          // Simple perspective
          const da = 2.5 / (2.5 + pa[2] * 0.3)
          const db = 2.5 / (2.5 + pb[2] * 0.3)

          ctx.beginPath()
          ctx.moveTo(cx + pa[0] * ico.size * da, cy + pa[1] * ico.size * da)
          ctx.lineTo(cx + pb[0] * ico.size * db, cy + pb[1] * ico.size * db)
          ctx.stroke()
        })
      })

      // Draw floating particles
      nodes.forEach(n => {
        n.x += n.vx + Math.sin(t * 0.4 + n.phase) * 0.0001
        n.y += n.vy + Math.cos(t * 0.3 + n.phase) * 0.0001
        n.z += n.vz
        if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0
        if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0
        if (n.z < 0) n.z = 1; if (n.z > 1) n.z = 0

        const px = n.x * W
        const py = n.y * H
        const depth = 0.4 + n.z * 0.6
        const [r, g, b] = n.color
        const alpha = depth * (0.4 + 0.3 * Math.sin(t * 0.8 + n.phase))
        const sz = n.size * depth

        const grad = ctx.createRadialGradient(px, py, 0, px, py, sz * 3)
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(px, py, sz * 3, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      })

      // Draw connections between nearby particles
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W
          const dy = (nodes[i].y - nodes[j].y) * H
          const dz = (nodes[i].z - nodes[j].z) * 100
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          if (dist < 80) {
            const [r, g, b] = nodes[i].color
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - dist / 80) * 0.08})`
            ctx.lineWidth = 0.4
            ctx.moveTo(nodes[i].x * W, nodes[i].y * H)
            ctx.lineTo(nodes[j].x * W, nodes[j].y * H)
            ctx.stroke()
          }
        }
      }
    }

    draw()

    return () => {
      window.removeEventListener('resize', setSize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, pointerEvents: 'none',
      }}
    />
  )
}

/* ─── Member Card with full 3D flip ─────────────────────────────────────── */
function MemberCard({ member, delay, t }: { member: Member; delay: number; t: (k: string) => string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (cardRef.current) obs.observe(cardRef.current)
    return () => obs.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
    const cx = x - 0.5
    const cy = y - 0.5
    setTilt({ x: cy * -18, y: cx * 18 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    setTilt({ x: 0, y: 0 })
    setMousePos({ x: 0.5, y: 0.5 })
  }, [])

  const sheenX = mousePos.x * 100
  const sheenY = mousePos.y * 100

  return (
    <div
      style={{
        perspective: '1000px',
        animationDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {/* Flip container */}
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: flipped
            ? 'transform 0.7s cubic-bezier(.22,1,.36,1)'
            : hovered
            ? 'transform 0.1s ease-out'
            : 'transform 0.5s cubic-bezier(.22,1,.36,1)',
          transform: flipped
            ? `perspective(1000px) rotateY(180deg)`
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${hovered ? 16 : 0}px)`,
          minHeight: 380,
          cursor: 'pointer',
        }}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setFlipped(f => !f)}
      >

        {/* ── FRONT FACE ── */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: 24,
            border: `1px solid hsla(${member.accentHue},70%,60%,${hovered ? 0.4 : 0.12})`,
            background: `rgba(2,4,8,0.85)`,
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: hovered
              ? `0 30px 80px hsla(${member.accentHue},80%,50%,0.25), 0 0 0 1px hsla(${member.accentHue},80%,60%,0.2), inset 0 1px 0 hsla(${member.accentHue},80%,80%,0.1)`
              : `0 8px 32px rgba(0,0,0,0.4)`,
            transition: 'box-shadow 0.4s, border-color 0.4s',
          }}
        >
          {/* Holographic sheen */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            pointerEvents: 'none', borderRadius: 24,
            opacity: hovered ? 0.6 : 0,
            transition: 'opacity 0.3s',
            background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, hsla(${member.accentHue},100%,80%,0.15) 0%, hsla(${member.accentHue + 60},100%,70%,0.08) 40%, transparent 70%)`,
          }} />

          {/* Top edge glow */}
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
            background: `linear-gradient(90deg, transparent, hsla(${member.accentHue},90%,65%,${hovered ? 0.8 : 0.2}), transparent)`,
            transition: 'all 0.4s',
            zIndex: 5,
          }} />

          {/* Photo */}
          <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
            <Image
              src={member.image}
              alt={t(`team.${member.key}.name`)}
              fill
              style={{
                objectFit: 'cover',
                objectPosition: 'top center',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.6s cubic-bezier(.22,1,.36,1)',
              }}
              priority
              quality={90}
            />

            {/* Depth overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(to top, rgba(2,4,8,0.95) 0%, rgba(2,4,8,0.4) 50%, transparent 100%)`,
              zIndex: 2,
            }} />

            {/* 3D floating badge */}
            <div style={{
              position: 'absolute', top: 14, right: 14, zIndex: 6,
              background: `linear-gradient(135deg, hsla(${member.accentHue},90%,60%,1), hsla(${member.accentHue + 40},80%,65%,1))`,
              color: '#020408', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', padding: '5px 14px',
              borderRadius: 100,
              boxShadow: `0 4px 20px hsla(${member.accentHue},80%,55%,0.5), 0 0 0 1px hsla(${member.accentHue},100%,80%,0.3)`,
              transform: hovered ? 'translateZ(30px) scale(1.05)' : 'translateZ(0)',
              transition: 'transform 0.3s',
            }}>
              {member.badge}
            </div>

            {/* Role icon */}
            <div style={{
              position: 'absolute', top: 14, left: 14, zIndex: 6,
              width: 38, height: 38, borderRadius: 12,
              background: 'rgba(2,4,8,0.75)',
              border: `1px solid hsla(${member.accentHue},80%,60%,0.35)`,
              color: `hsla(${member.accentHue},90%,70%,1)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              boxShadow: `0 0 20px hsla(${member.accentHue},80%,50%,0.2)`,
              transform: hovered ? 'translateZ(20px)' : 'translateZ(0)',
              transition: 'transform 0.3s',
            }}>
              {member.roleIcon}
            </div>

            {/* Corner accents */}
            {[
              { top: 10, left: 10, borderRight: 'none', borderBottom: 'none', borderRadius: '4px 0 0 0' },
              { top: 10, right: 10, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 4px 0 0' },
              { bottom: 10, left: 10, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 4px' },
              { bottom: 10, right: 10, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 4px 0' },
            ].map((s, i) => (
              <div key={i} style={{
                position: 'absolute', width: 16, height: 16,
                border: `1.5px solid hsla(${member.accentHue},90%,65%,${hovered ? 0.9 : 0.3})`,
                zIndex: 4, pointerEvents: 'none',
                transition: 'border-color 0.3s',
                ...s,
              }} />
            ))}

            {/* Socials */}
            <div style={{
              position: 'absolute', bottom: 14, left: '50%',
              transform: `translateX(-50%) translateY(${hovered ? 0 : 10}px)`,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s, transform 0.3s',
              zIndex: 6, display: 'flex', gap: 8,
            }}>
              {member.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#020408',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s, background 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = s.hoverColor ?? 'rgba(99,200,255,0.95)'
                    ;(e.currentTarget as HTMLElement).style.color = '#fff'
                    ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.92)'
                    ;(e.currentTarget as HTMLElement).style.color = '#020408'
                    ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                  }}
                >
                  <svg width="16" height="16" fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth={s.fill ? undefined : 2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '18px 20px 22px', position: 'relative', zIndex: 1 }}>
            {/* Shimmer line */}
            <div style={{
              height: 1, width: '100%', marginBottom: 14, borderRadius: 1,
              background: `linear-gradient(90deg, transparent, hsla(${member.accentHue},80%,65%,0.6), transparent)`,
            }} />

            <h3 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18, fontWeight: 700, color: '#fff',
              marginBottom: 4, lineHeight: 1.2,
              transform: hovered ? 'translateZ(10px)' : 'translateZ(0)',
              transition: 'transform 0.3s',
            }}>
              {t(`team.${member.key}.name`)}
            </h3>
            <p style={{
              fontSize: 12, fontWeight: 500, letterSpacing: '0.06em',
              textTransform: 'uppercase', marginBottom: 8,
              color: `hsla(${member.accentHue},80%,72%,1)`,
            }}>
              {t(`team.${member.key}.role`)}
            </p>
            <p style={{
              fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0,
            }}>
              {t(`team.${member.key}.bio`)}
            </p>

            {/* Flip hint */}
            <div style={{
              marginTop: 12, fontSize: 10, color: `hsla(${member.accentHue},70%,60%,0.6)`,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Clica para virar
            </div>
          </div>
        </div>

        {/* ── BACK FACE ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            minHeight: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: 24,
            border: `1px solid hsla(${member.accentHue},70%,60%,0.35)`,
            background: `radial-gradient(circle at 50% 30%, hsla(${member.accentHue},60%,15%,0.9) 0%, rgba(2,4,8,0.95) 60%)`,
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 28,
            boxShadow: `0 30px 80px hsla(${member.accentHue},80%,50%,0.3), inset 0 1px 0 hsla(${member.accentHue},80%,80%,0.1)`,
          }}
        >
          {/* Rotating ring decoration */}
          <div style={{
            position: 'absolute', width: 200, height: 200,
            borderRadius: '50%',
            border: `1px solid hsla(${member.accentHue},80%,60%,0.15)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            animation: 'tmSpin 12s linear infinite',
          }} />
          <div style={{
            position: 'absolute', width: 280, height: 280,
            borderRadius: '50%',
            border: `1px solid hsla(${member.accentHue},80%,60%,0.08)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            animation: 'tmSpin 20s linear infinite reverse',
          }} />

          {/* Avatar circle */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            border: `2px solid hsla(${member.accentHue},90%,60%,0.6)`,
            overflow: 'hidden', position: 'relative', marginBottom: 16,
            boxShadow: `0 0 30px hsla(${member.accentHue},80%,55%,0.4)`,
            flexShrink: 0,
          }}>
            <Image
              src={member.image}
              alt={t(`team.${member.key}.name`)}
              fill
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
            />
          </div>

          <h3 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 20, fontWeight: 800, color: '#fff',
            marginBottom: 4, textAlign: 'center',
          }}>
            {t(`team.${member.key}.name`)}
          </h3>

          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.16em',
            textTransform: 'uppercase', marginBottom: 20,
            color: `hsla(${member.accentHue},90%,70%,1)`,
          }}>
            {t(`team.${member.key}.role`)}
          </p>

          {/* Socials on back */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            {member.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                onClick={e => e.stopPropagation()}
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `hsla(${member.accentHue},60%,20%,0.8)`,
                  border: `1px solid hsla(${member.accentHue},80%,60%,0.3)`,
                  color: `hsla(${member.accentHue},90%,75%,1)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', flexShrink: 0,
                  transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px hsla(${member.accentHue},80%,55%,0.5)`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <svg width="18" height="18" fill={s.fill ? 'currentColor' : 'none'} stroke={s.fill ? 'none' : 'currentColor'} strokeWidth={s.fill ? undefined : 2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Bio on back */}
          <p style={{
            fontSize: 13, color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.65, textAlign: 'center', margin: 0,
          }}>
            {t(`team.${member.key}.bio`)}
          </p>

          {/* Back flip hint */}
          <div style={{
            marginTop: 16, fontSize: 10,
            color: `hsla(${member.accentHue},70%,60%,0.5)`,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clica para voltar
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
export default function Team() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(language, key)
  const [headerVisible, setHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setHeaderVisible(true) },
      { threshold: 0.1 }
    )
    if (headerRef.current) obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        @keyframes tmGrad  { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes tmPulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes tmSpin  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes tmOrbFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.05)} }

        .tm-orb-float {
          position:absolute; border-radius:50%;
          filter:blur(90px); pointer-events:none;
          animation:tmOrbFloat 12s ease-in-out infinite;
        }

        @media(max-width:900px) {
          .tm-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:600px) {
          .tm-grid-3, .tm-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section
        id="team"
        style={{
          position: 'relative', overflow: 'hidden',
          background: '#020408',
          padding: '100px 0 120px',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Animated 3D background canvas */}
        <TeamCanvas />

        {/* Grid overlay */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(99,200,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(99,200,255,.025) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%,black 0%,transparent 100%)',
        }} />

        {/* Floating orbs */}
        <div className="tm-orb-float" aria-hidden style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'radial-gradient(circle,rgba(99,200,255,.08) 0%,transparent 65%)', animationDelay: '0s', zIndex: 1 }} />
        <div className="tm-orb-float" aria-hidden style={{ width: 400, height: 400, bottom: '-8%', right: '-3%', background: 'radial-gradient(circle,rgba(167,139,250,.08) 0%,transparent 65%)', animationDelay: '5s', zIndex: 1 }} />
        <div className="tm-orb-float" aria-hidden style={{ width: 300, height: 300, top: '40%', right: '20%', background: 'radial-gradient(circle,rgba(244,114,182,.05) 0%,transparent 65%)', animationDelay: '9s', zIndex: 1 }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2 }}>

          {/* Header */}
          <div
            ref={headerRef}
            style={{
              textAlign: 'center', maxWidth: 680, margin: '0 auto 72px',
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(32px)',
              transition: 'opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1)',
            }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 18px', borderRadius: 100, marginBottom: 20,
              border: '1px solid rgba(99,200,255,.2)',
              background: 'rgba(99,200,255,.06)',
              backdropFilter: 'blur(10px)',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#63C8FF', boxShadow: '0 0 6px #63C8FF',
                display: 'inline-block',
                animation: 'tmPulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#63C8FF' }}>
                {t('team.tagline')}
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(26px,3.5vw,48px)',
              fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em',
              marginBottom: 16,
              background: 'linear-gradient(135deg, #fff 20%, rgba(99,200,255,.8) 55%, #A78BFA 80%, #fff 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'tmGrad 8s linear infinite',
            }}>
              {t('team.title')}
            </h2>

            <p style={{
              fontSize: 'clamp(14px,1.5vw,16px)', fontWeight: 300,
              color: 'rgba(255,255,255,.5)', lineHeight: 1.7, margin: 0,
            }}>
              {t('team.subtitle')}
            </p>

            {/* 3D hint text */}
            <p style={{
              marginTop: 12, fontSize: 12,
              color: 'rgba(99,200,255,0.4)',
              letterSpacing: '0.08em',
            }}>
              ↻ Passa o rato e clica nos cards para interagir em 3D
            </p>
          </div>

          {/* Row 1 — 3 cards */}
          <div
            className="tm-grid-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: 24, maxWidth: 1100,
              margin: '0 auto 24px',
            }}
          >
            {MEMBERS.slice(0, 3).map((m, i) => (
              <MemberCard key={m.key} member={m} delay={i * 120} t={t} />
            ))}
          </div>

          {/* Row 2 — 2 cards centradas */}
          <div
            className="tm-grid-2"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: 24, maxWidth: 748,
              margin: '0 auto',
            }}
          >
            {MEMBERS.slice(3).map((m, i) => (
              <MemberCard key={m.key} member={m} delay={(i + 3) * 120} t={t} />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}