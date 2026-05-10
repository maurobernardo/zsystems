"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/translations";
import QuoteModal        from "@/components/QuoteModal";
import AvailabilityBadge from "@/components/AvailabilityBadge";

/* ─── Canvas ─────────────────────────────────────────────────────────────── */
function ThreeCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      style={{
        position: "absolute", top: 0, left: 0,
        width: "100vw", height: "100vh",
        zIndex: 0, display: "block", pointerEvents: "none",
      }}
    />
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    /* ── Mobile: Canvas 2D leve ─────────────────────────────────────────── */
    if (isMobile) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const setSize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width  = window.innerWidth  + "px";
        canvas.style.height = window.innerHeight + "px";
      };
      setSize();
      window.addEventListener("resize", setSize);

      const palette = ["#63C8FF", "#A78BFA", "#F472B6", "#4ade80", "#FB923C"];
      const nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  1 + Math.random() * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));

      let tt = 0;
      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        tt += 0.008;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;
        nodes.forEach(n => {
          n.x += n.vx + Math.sin(tt + n.y * 0.02) * 0.1;
          n.y += n.vy + Math.cos(tt + n.x * 0.02) * 0.1;
          if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
          if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
          g.addColorStop(0, n.color + "cc");
          g.addColorStop(1, n.color + "00");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
        });
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const d  = Math.sqrt(dx * dx + dy * dy);
            if (d < 80) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(99,200,255,${(1 - d / 80) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.stroke();
            }
          }
        }
      };
      draw();
      return () => {
        window.removeEventListener("resize", setSize);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    /* ── Desktop: Three.js ──────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x020408, 1);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 5;

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── 1. CAMPO DE PARTÍCULAS ──────────────────────────────────────────── */
    const N = 1800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(N * 3);
    const pCol = new Float32Array(N * 3);
    const palette: [number, number, number][] = [
      [0.388, 0.784, 1.0],
      [0.655, 0.545, 0.98],
      [0.957, 0.443, 0.714],
      [0.302, 0.871, 0.502],
      [0.984, 0.573, 0.188],
    ];
    for (let i = 0; i < N; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 28;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      const c = palette[Math.floor(Math.random() * palette.length)];
      const b = 0.35 + Math.random() * 0.65;
      pCol[i * 3] = c[0] * b; pCol[i * 3 + 1] = c[1] * b; pCol[i * 3 + 2] = c[2] * b;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.07, vertexColors: true, transparent: true, opacity: 0.9,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    /* ── 2. GEOMETRIAS FLUTUANTES ───────────────────────────────────────── */
    interface FloatingGeo {
      mesh:       THREE.Mesh;
      baseY:      number;
      baseX:      number;
      floatPhase: number;
      rotSpeed:   [number, number, number];
    }

    const makeWire = (
      geo: THREE.BufferGeometry,
      px: number, py: number, pz: number,
      hex: number, op: number,
      scale = 1
    ): FloatingGeo => {
      const mesh = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: hex, wireframe: true, transparent: true, opacity: op })
      );
      mesh.position.set(px, py, pz);
      mesh.scale.setScalar(scale);
      scene.add(mesh);
      return {
        mesh, baseY: py, baseX: px,
        floatPhase: Math.random() * Math.PI * 2,
        rotSpeed: [
          (Math.random() - 0.5) * 0.008,
          (Math.random() - 0.5) * 0.010,
          (Math.random() - 0.5) * 0.006,
        ],
      };
    };

    const floaters: FloatingGeo[] = [
      // Icosahedros
      makeWire(new THREE.IcosahedronGeometry(1, 1),  3.5,  0.5,  0.5, 0x63C8FF, 0.28, 1.0),
      makeWire(new THREE.IcosahedronGeometry(1, 1), -4.0, -0.6, -1.0, 0xA78BFA, 0.30, 0.8),
      makeWire(new THREE.IcosahedronGeometry(1, 0),  5.5, -1.5,  0.0, 0xF472B6, 0.24, 0.6),
      makeWire(new THREE.IcosahedronGeometry(1, 0), -5.0,  1.5, -0.5, 0x4ade80, 0.22, 0.55),
      makeWire(new THREE.IcosahedronGeometry(1, 0),  1.5,  3.2,  1.0, 0xFB923C, 0.26, 0.50),
      // Octahedros
      makeWire(new THREE.OctahedronGeometry(1, 0),  -5.5,  0.8, -0.5, 0x63C8FF, 0.20, 0.7),
      makeWire(new THREE.OctahedronGeometry(1, 0),   4.5, -2.2,  0.0, 0xA78BFA, 0.22, 0.55),
      // Tetrahedros
      makeWire(new THREE.TetrahedronGeometry(1, 0), -2.5, -2.8,  0.5, 0xF472B6, 0.20, 0.60),
      makeWire(new THREE.TetrahedronGeometry(1, 0),  6.5,  2.0, -0.8, 0x4ade80, 0.18, 0.45),
    ];

    /* ── Mouse ───────────────────────────────────────────────────────────── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
      const glow = document.getElementById("hero-cursor-glow");
      if (glow) { glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px"; }
    };
    document.addEventListener("mousemove", onMouseMove);

    /* ── Loop de animação ────────────────────────────────────────────────── */
    let elapsed = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      elapsed += 0.005;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      // Partículas
      particles.rotation.y = elapsed * 0.06 + mouse.x * 0.12;
      particles.rotation.x = mouse.y * 0.06;

      // Geometrias flutuantes
      floaters.forEach((f) => {
        f.mesh.rotation.x += f.rotSpeed[0];
        f.mesh.rotation.y += f.rotSpeed[1];
        f.mesh.rotation.z += f.rotSpeed[2];
        f.mesh.position.y = f.baseY + Math.sin(elapsed * 0.6 + f.floatPhase) * 0.22;
        f.mesh.position.x = f.baseX + mouse.x * 0.18;
      });

      // Câmara segue o rato suavemente
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.35 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", onMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      renderer.dispose();
    };
  }, []);

  /* ─── JSX ────────────────────────────────────────────────────────────────  */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        html, body { overflow-x:hidden; max-width:100vw; background:#020408 !important; background-image:none !important; }
        section    { border:none !important; }

        @keyframes fadeUpHero    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShiftHero { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes pulseDotHero  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }
        @keyframes scrollLineH   { 0%,100%{opacity:.25;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.25)} }

        .hero-badge    { opacity:0;transform:translateY(20px);animation:fadeUpHero .8s cubic-bezier(.22,1,.36,1) .3s forwards; }
        .hero-headline { opacity:0;transform:translateY(30px);animation:fadeUpHero 1s  cubic-bezier(.22,1,.36,1) .5s forwards; }
        .hero-subtext  { opacity:0;transform:translateY(20px);animation:fadeUpHero .9s cubic-bezier(.22,1,.36,1) .7s forwards; }
        .hero-buttons  { opacity:0;transform:translateY(20px);animation:fadeUpHero .9s cubic-bezier(.22,1,.36,1) .9s forwards; }
        .hero-avail    { opacity:0;transform:translateY(12px);animation:fadeUpHero .8s cubic-bezier(.22,1,.36,1) 1.0s forwards; }
        .hero-stats    { opacity:0;transform:translateY(20px);animation:fadeUpHero .9s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
        .hero-scroll   { opacity:0;animation:fadeUpHero 1s ease 1.8s forwards; }

        .hero-grad-text {
          background: linear-gradient(135deg,#63C8FF 0%,#A78BFA 40%,#F472B6 80%,#FB923C 100%);
          background-size: 300% 300%;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation: gradShiftHero 6s linear infinite;
        }
        .hero-btn-grad {
          background: linear-gradient(135deg,#63C8FF,#A78BFA,#F472B6);
          background-size: 200% 200%;
          animation: gradShiftHero 4s linear infinite;
        }
        .hero-dot-pulse   { animation:pulseDotHero 2s ease-in-out infinite; }
        .hero-scroll-line { animation:scrollLineH  2s ease-in-out infinite; }

        .hero-btn-primary:hover   { transform:translateY(-2px) scale(1.02) !important; box-shadow:0 0 50px rgba(99,200,255,.5),0 0 80px rgba(167,139,250,.3) !important; }
        .hero-btn-secondary:hover { transform:translateY(-2px) !important; background:rgba(255,255,255,.1) !important; border-color:rgba(99,200,255,.4) !important; }
        .hero-btn-primary:hover .hero-arrow,
        .hero-btn-secondary:hover .hero-arrow,
        .hero-btn-quote:hover .hero-arrow { transform:translateX(4px); }
        .hero-arrow     { transition:transform .2s; display:inline-block; }
        .hero-btn-quote { cursor:pointer; border:none; font-family:'DM Sans',sans-serif; }
        .hero-btn-quote:hover { transform:translateY(-2px) scale(1.02) !important; box-shadow:0 0 50px rgba(99,200,255,.5),0 0 80px rgba(167,139,250,.3) !important; }

        @media (max-width:768px) {
          .hero-stats-wrap  { gap:16px !important; }
          .hero-buttons     { flex-direction:column !important; align-items:center !important; gap:10px !important; margin-bottom:24px !important; }
          .hero-buttons > * { width:240px !important; justify-content:center !important; }
        }
        @media (max-width:480px) { .hero-stats-wrap { gap:10px !important; } }
      `}</style>

      <section id="home" aria-label="Home" style={{
        position:"relative", minHeight:"100vh",
        background:"#020408", overflow:"hidden",
        fontFamily:"'DM Sans', sans-serif",
      }}>
        <ThreeCanvas canvasRef={canvasRef} />

        {/* Noise overlay */}
        <div aria-hidden style={{
          position:"absolute", inset:0, zIndex:1, opacity:0.03, pointerEvents:"none",
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize:"128px 128px",
        }} />

        {/* Grid overlay */}
        <div aria-hidden style={{
          position:"absolute", inset:0, zIndex:1, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(99,200,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(99,200,255,0.035) 1px,transparent 1px)",
          backgroundSize:"60px 60px",
          maskImage:"radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)",
          WebkitMaskImage:"radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)",
        }} />

        {/* Cursor glow — desktop */}
        <div id="hero-cursor-glow" aria-hidden style={{
          position:"fixed", width:360, height:360, borderRadius:"50%",
          pointerEvents:"none", zIndex:2,
          background:"radial-gradient(circle,rgba(99,200,255,.07) 0%,transparent 70%)",
          transform:"translate(-50%,-50%)",
        }} />

        {/* ── Conteúdo principal ── */}
        <div style={{
          position:"relative", zIndex:10, minHeight:"100vh",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:"80px 20px 60px",
        }}>
          <div style={{
            maxWidth:860, width:"100%", textAlign:"center",
            display:"flex", flexDirection:"column", alignItems:"center",
          }}>

            {/* Badge */}
            <div className="hero-badge" style={{
              display:"inline-flex", alignItems:"center", gap:10,
              padding:"7px 20px", borderRadius:100,
              border:"1px solid rgba(99,200,255,.2)",
              background:"rgba(99,200,255,.05)", backdropFilter:"blur(12px)",
              marginBottom:28, boxShadow:"0 0 20px rgba(99,200,255,.08)",
              flexWrap:"wrap", justifyContent:"center", maxWidth:"90vw",
            }}>
              <span className="hero-dot-pulse" style={{
                width:6, height:6, borderRadius:"50%", background:"#63C8FF",
                boxShadow:"0 0 8px #63C8FF,0 0 16px rgba(99,200,255,.5)",
                display:"inline-block", flexShrink:0,
              }} />
              <span style={{fontSize:11,fontWeight:600,letterSpacing:"0.16em",textTransform:"uppercase",color:"#63C8FF"}}>
                {t("hero.tagline")}
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline" style={{
              fontFamily:"'Syne',sans-serif",
              fontSize:"clamp(28px,4vw,54px)", fontWeight:800,
              lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:24,
            }}>
              <span className="hero-grad-text" style={{display:"block"}}>
                {t("hero.title")}
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="hero-subtext" style={{
              fontSize:"clamp(14px,1.8vw,18px)", fontWeight:300,
              color:"rgba(255,255,255,.5)", lineHeight:1.75,
              maxWidth:560, margin:"0 auto 48px",
            }}>
              {t("hero.description")}
            </p>

            {/* ── Botões ── */}
            <div className="hero-buttons" style={{
              display:"flex", gap:14, flexWrap:"wrap",
              justifyContent:"center", marginBottom:20,
            }}>
              {/* Iniciar Projecto → abre QuoteModal */}
              <button
                onClick={() => setQuoteOpen(true)}
                className="hero-btn-primary hero-btn-grad hero-btn-quote"
                style={{
                  display:"inline-flex", alignItems:"center", gap:10,
                  padding:"14px 30px", borderRadius:100,
                  fontSize:14, fontWeight:500, letterSpacing:"0.02em", color:"#020408",
                  boxShadow:"0 0 30px rgba(99,200,255,.3),0 0 60px rgba(167,139,250,.2)",
                  transition:"transform .2s,box-shadow .2s",
                }}
              >
                <span>{t("hero.startProject")}</span>
                <span className="hero-arrow">→</span>
              </button>

              {/* Ver Portfólio */}
              <a href="#projects" className="hero-btn-secondary" style={{
                display:"inline-flex", alignItems:"center", gap:10,
                padding:"13px 28px", borderRadius:100,
                fontSize:14, fontWeight:500, letterSpacing:"0.02em",
                color:"rgba(255,255,255,.85)", textDecoration:"none",
                background:"rgba(255,255,255,.05)",
                border:"1px solid rgba(255,255,255,.12)",
                backdropFilter:"blur(12px)", transition:"all .2s",
              }}>
                <span>{t("hero.viewPortfolio")}</span>
                <span className="hero-arrow">→</span>
              </a>
            </div>

            {/* Availability badge */}
            <div className="hero-avail" style={{marginBottom:52}}>
              <AvailabilityBadge />
            </div>

            {/* Stats */}
            <div className="hero-stats hero-stats-wrap" style={{
              display:"flex", gap:40, justifyContent:"center", alignItems:"center",
            }}>
              {[
                { num:"4",    label:"Clientes",   color:"#63C8FF" },
                { num:"6",    label:"Projectos",  color:"#A78BFA" },
                { num:"100%", label:"Satisfação", color:"#4ade80" },
                { num:"2026", label:"Fundada",    color:"#F472B6" },
              ].map((s, i) => (
                <div key={s.label} style={{display:"flex",alignItems:"center",gap:40}}>
                  {i > 0 && (
                    <div style={{width:1,height:32,background:"rgba(255,255,255,.07)",flexShrink:0}} />
                  )}
                  <div style={{textAlign:"center"}}>
                    <div style={{
                      fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:800,
                      color:s.color, lineHeight:1.1, marginBottom:6,
                      textShadow:`0 0 20px ${s.color}60`,
                    }}>{s.num}</div>
                    <div style={{
                      fontSize:10, color:"rgba(255,255,255,.35)",
                      letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:500,
                    }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll" style={{
          position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)",
          zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", gap:6,
        }}>
          <span style={{fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:"0.15em",textTransform:"uppercase"}}>
            Scroll
          </span>
          <div className="hero-scroll-line" style={{
            width:1, height:40,
            background:"linear-gradient(to bottom,rgba(99,200,255,.6),transparent)",
          }} />
        </div>
      </section>

      {/* Quote Modal */}
      <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  );
}