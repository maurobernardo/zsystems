"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/lib/translations";

/* ─── Types ──────────────────────────────────────────────────────────────── */
interface ThreeModule {
  WebGLRenderer: new (opts: object) => {
    setPixelRatio: (r: number) => void;
    setSize: (w: number, h: number, updateStyle?: boolean) => void;
    setClearColor: (c: number, a: number) => void;
    render: (scene: object, camera: object) => void;
  };
  PerspectiveCamera: new (fov: number, asp: number, near: number, far: number) => {
    aspect: number;
    position: { x: number; y: number; z: number; set: (x: number, y: number, z: number) => void };
    updateProjectionMatrix: () => void;
    lookAt: (x: number, y: number, z: number) => void;
  };
  Scene: new () => { add: (o: object) => void; children: object[] };
  BufferGeometry: new () => {
    setAttribute: (name: string, attr: object) => void;
  };
  BufferAttribute: new (arr: Float32Array, size: number) => object;
  Points: new (geo: object, mat: object) => {
    rotation: { x: number; y: number; z: number };
    userData: Record<string, unknown>;
  };
  Mesh: new (geo: object, mat: object) => {
    rotation: { x: number; y: number; z: number };
    scale: { setScalar: (s: number) => void };
    userData: Record<string, unknown>;
    rotateOnAxis: (axis: object, angle: number) => void;
  };
  ShaderMaterial: new (opts: object) => {
    uniforms: Record<string, { value: unknown }>;
    clone: () => object;
  };
  MeshBasicMaterial: new (opts: object) => object;
  SphereGeometry: new (r: number, w: number, h: number) => object;
  TorusGeometry: new (r: number, t: number, rs: number, ts: number) => object;
  IcosahedronGeometry: new (r: number, d: number) => object;
  Vector2: new (x?: number, y?: number) => { set: (x: number, y: number) => void };
  Vector3: new (x: number, y: number, z: number) => { normalize: () => object };
  AdditiveBlending: number;
  FrontSide: number;
  Math: { min: (a: number, b: number) => number };
}

/* ─── Canvas 3D ─────────────────────────────────────────────────────────── */
function ThreeCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  return (
    <canvas
      ref={canvasRef as React.RefObject<HTMLCanvasElement>}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Main Hero ──────────────────────────────────────────────────────────── */
export default function Hero() {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(language, key);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    /* ── Mobile: Canvas 2D particles (no WebGL, no overflow) ── */
    if (isMobile) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const setSize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
      };
      setSize();
      window.addEventListener("resize", setSize);

      const palette = ["#63C8FF", "#A78BFA", "#F472B6", "#4ade80", "#FB923C"];
      const nodes = Array.from({ length: 60 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1 + Math.random() * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      }));

      let t = 0;
      const draw = () => {
        rafRef.current = requestAnimationFrame(draw);
        t += 0.008;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;

        nodes.forEach((n) => {
          n.x += n.vx + Math.sin(t + n.y * 0.02) * 0.1;
          n.y += n.vy + Math.cos(t + n.x * 0.02) * 0.1;
          if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
          if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;

          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
          g.addColorStop(0, n.color + "cc");
          g.addColorStop(1, n.color + "00");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        });

        /* connections */
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
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

    /* ── Desktop: Three.js WebGL ── */
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;

    script.onload = () => {
      const THREE = (window as unknown as { THREE: ThreeModule }).THREE;
      if (!THREE) return;

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      camera.position.set(0, 0, 22);

      function resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        canvas!.style.width = w + "px";
        canvas!.style.height = h + "px";
      }
      resize();
      window.addEventListener("resize", resize);

      /* ── Particles ── */
      const particleGeo = new THREE.BufferGeometry();
      const N = 2200;
      const pos = new Float32Array(N * 3);
      const sizes = new Float32Array(N);
      const colors = new Float32Array(N * 3);
      const palette = [
        [0.388, 0.784, 1.0],
        [0.655, 0.545, 0.98],
        [0.957, 0.443, 0.714],
        [0.984, 0.573, 0.188],
        [0.302, 0.871, 0.502],
      ];
      for (let i = 0; i < N; i++) {
        const r = 12 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi) - 5;
        sizes[i] = Math.random() < 0.05 ? 4 + Math.random() * 4 : 0.8 + Math.random() * 2;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i * 3] = c[0];
        colors[i * 3 + 1] = c[1];
        colors[i * 3 + 2] = c[2];
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      particleGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2() },
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          uniform vec2 mouse;
          void main() {
            vColor = color;
            vec3 p = position;
            float wave = sin(p.x * 0.3 + time * 0.5) * 0.3 + cos(p.y * 0.25 + time * 0.4) * 0.3;
            p.z += wave;
            vec2 dm = vec2(p.x, p.y) - mouse * 12.0;
            float dist = length(dm);
            float push = max(0.0, 3.0 - dist) * 0.4;
            p.xy += normalize(dm + 0.001) * push;
            vAlpha = 0.4 + 0.6 * (sin(time * 0.8 + p.x + p.y) * 0.5 + 0.5);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
      } as object);

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      /* ── Orbit Rings ── */
      const ringGeo = new THREE.TorusGeometry(7, 0.015, 8, 200);
      const ringMatBase = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying float vPos;
          void main() {
            vPos = position.x;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying float vPos;
          uniform float time;
          void main() {
            float t = mod(vPos * 0.14 + time * 0.5, 1.0);
            float alpha = pow(sin(t * 3.14159), 2.0) * 0.7;
            vec3 c1 = vec3(0.388, 0.784, 1.0);
            vec3 c2 = vec3(0.655, 0.545, 0.98);
            vec3 col = mix(c1, c2, t);
            gl_FragColor = vec4(col, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      } as object);

      for (let i = 0; i < 5; i++) {
        const ring = new THREE.Mesh(ringGeo, (ringMatBase as { clone: () => object }).clone());
        ring.rotation.x = Math.PI * 0.3 + i * 0.25;
        ring.rotation.y = i * 0.6;
        ring.scale.setScalar(0.7 + i * 0.28);
        ring.userData.speed = 0.003 + i * 0.001;
        ring.userData.axis = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize();
        scene.add(ring);
      }

      /* ── Central Sphere ── */
      const sphereGeo = new THREE.SphereGeometry(4.5, 64, 64);
      const sphereMat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float time;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPos = position;
            float dist = 0.12 * sin(5.0 * position.y + time * 1.5) * cos(5.0 * position.x + time);
            vec3 newPos = position + normal * dist;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float time;
          void main() {
            float rim = 1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0);
            rim = pow(rim, 2.5);
            vec3 c1 = vec3(0.388, 0.784, 1.0);
            vec3 c2 = vec3(0.655, 0.545, 0.98);
            vec3 c3 = vec3(0.957, 0.443, 0.714);
            float t = sin(time * 0.5 + vPos.y * 0.5) * 0.5 + 0.5;
            float t2 = sin(time * 0.3 + vPos.x * 0.5) * 0.5 + 0.5;
            vec3 col = mix(mix(c1, c2, t), c3, t2 * 0.5);
            gl_FragColor = vec4(col * rim, rim * 0.6);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.FrontSide,
      } as object);
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);

      /* ── Wireframe Icosahedron ── */
      const wireGeo = new THREE.IcosahedronGeometry(5, 2);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x3399ff,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
      });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wire);

      /* ── Mouse tracking ── */
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMouseMove = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
        const glow = document.getElementById("hero-cursor-glow");
        if (glow) {
          glow.style.left = e.clientX + "px";
          glow.style.top = e.clientY + "px";
        }
      };
      document.addEventListener("mousemove", onMouseMove);

      /* ── Animation Loop ── */
      let elapsed = 0;
      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        elapsed += 0.008;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;

        (particleMat as { uniforms: Record<string, { value: unknown }> }).uniforms.time.value = elapsed;
        (particleMat as { uniforms: Record<string, { value: { set: (x: number, y: number) => void } }> }).uniforms.mouse.value.set(mouse.x, mouse.y);

        particles.rotation.y = elapsed * 0.03 + mouse.x * 0.15;
        particles.rotation.x = mouse.y * 0.08;

        (scene.children as Array<{
          userData: Record<string, unknown>;
          rotateOnAxis?: (axis: object, angle: number) => void;
          rotation: { x: number; y: number };
          material?: { uniforms?: Record<string, { value: number }> };
        }>).forEach((obj) => {
          if (obj.userData.speed && obj.rotateOnAxis) {
            obj.rotateOnAxis(obj.userData.axis as object, obj.userData.speed as number);
          }
          if (obj.material?.uniforms?.time) {
            obj.material.uniforms.time.value = elapsed;
          }
        });

        sphere.rotation.y = elapsed * 0.1;
        sphere.rotation.x = mouse.y * 0.1;
        wire.rotation.y = elapsed * 0.05;
        wire.rotation.x = elapsed * 0.03;

        camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
        camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };
      animate();

      /* ── Cleanup ── */
      return () => {
        window.removeEventListener("resize", resize);
        document.removeEventListener("mousemove", onMouseMove);
      };
    };

    document.head.appendChild(script);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      {/* ─── Global styles injected once ─────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        html, body { overflow-x: hidden; max-width: 100vw; }

        @keyframes fadeUpHero {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradShiftHero {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulseDotHero {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.65); }
        }
        @keyframes cardFloatHero {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollLineHero {
          0%, 100% { opacity: 0.25; transform: scaleY(1); }
          50%       { opacity: 1; transform: scaleY(1.25); }
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .hero-badge        { opacity: 0; transform: translateY(20px); animation: fadeUpHero 0.8s cubic-bezier(.22,1,.36,1) 0.3s forwards; }
        .hero-headline     { opacity: 0; transform: translateY(30px); animation: fadeUpHero 1s   cubic-bezier(.22,1,.36,1) 0.5s forwards; }
        .hero-subtext      { opacity: 0; transform: translateY(20px); animation: fadeUpHero 0.9s cubic-bezier(.22,1,.36,1) 0.7s forwards; }
        .hero-buttons      { opacity: 0; transform: translateY(20px); animation: fadeUpHero 0.9s cubic-bezier(.22,1,.36,1) 0.9s forwards; }
        .hero-stats        { opacity: 0; transform: translateY(20px); animation: fadeUpHero 0.9s cubic-bezier(.22,1,.36,1) 1.1s forwards; }
        .hero-scroll       { opacity: 0;                               animation: fadeUpHero 1s   ease 1.8s forwards; }

        .hero-grad-text {
          background: linear-gradient(135deg, #63C8FF 0%, #A78BFA 40%, #F472B6 80%, #FB923C 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradShiftHero 6s linear infinite;
        }
        .hero-btn-grad {
          background: linear-gradient(135deg, #63C8FF, #A78BFA, #F472B6);
          background-size: 200% 200%;
          animation: gradShiftHero 4s linear infinite;
        }
        .hero-dot-pulse { animation: pulseDotHero 2s ease-in-out infinite; }
        .hero-scroll-line { animation: scrollLineHero 2s ease-in-out infinite; }

        .hero-btn-primary:hover  { transform: translateY(-2px) scale(1.02) !important; box-shadow: 0 0 50px rgba(99,200,255,0.5), 0 0 80px rgba(167,139,250,0.3) !important; }
        .hero-btn-secondary:hover { transform: translateY(-2px) !important; background: rgba(255,255,255,0.1) !important; border-color: rgba(99,200,255,0.4) !important; box-shadow: 0 0 20px rgba(99,200,255,0.15) !important; }
        .hero-btn-primary:hover  .hero-arrow { transform: translateX(4px); }
        .hero-btn-secondary:hover .hero-arrow { transform: translateX(4px); }
        .hero-arrow { transition: transform 0.2s; display: inline-block; }

        @media (max-width: 768px) {
          .hero-stats-wrap { gap: 16px !important; }
          .hero-buttons    { flex-direction: column !important; align-items: center !important; gap: 10px !important; margin-bottom: 40px !important; }
          .hero-buttons a  { width: 240px !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .hero-stats-wrap { gap: 10px !important; }
        }
      `}</style>

      {/* ─── Root ────────────────────────────────────────────────────────── */}
      <section
        id="home"
        aria-label="Home"
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#020408",
          overflow: "hidden",
          overflowX: "hidden",
          maxWidth: "100vw",
          marginTop: "-72px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Three.js Canvas */}
        <ThreeCanvas canvasRef={canvasRef} />

        {/* Noise */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1, opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
            pointerEvents: "none",
          }}
        />

        {/* Grid */}
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(99,200,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,200,255,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* Cursor glow */}
        <div
          id="hero-cursor-glow"
          aria-hidden
          style={{
            position: "fixed", width: 320, height: 320, borderRadius: "50%",
            pointerEvents: "none", zIndex: 2,
            background: "radial-gradient(circle, rgba(99,200,255,0.08) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            transition: "opacity 0.3s",
          }}
        />

        {/* ── no floating cards ── */}

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative", zIndex: 10,
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "80px 20px 60px",
          }}
        >
          <div style={{ maxWidth: 860, width: "100%", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>

            {/* Badge */}
            <div
              className="hero-badge"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "7px 20px", borderRadius: 100,
                border: "1px solid rgba(99,200,255,0.2)",
                background: "rgba(99,200,255,0.05)",
                backdropFilter: "blur(12px)",
                marginBottom: 28,
                boxShadow: "0 0 20px rgba(99,200,255,0.08)",
                flexWrap: "wrap", justifyContent: "center",
                maxWidth: "90vw", textAlign: "center",
              }}
            >
              <span
                className="hero-dot-pulse"
                style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#63C8FF",
                  boxShadow: "0 0 8px #63C8FF, 0 0 16px rgba(99,200,255,0.5)",
                  display: "inline-block", flexShrink: 0,
                }}
              />
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.16em",
                textTransform: "uppercase", color: "#63C8FF",
              }}>
                {t("hero.tagline")}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="hero-headline"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 4vw, 54px)",
                fontWeight: 800, lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              <span className="hero-grad-text" style={{ display: "block" }}>
                {t("hero.title")}
              </span>
            </h1>

            {/* Sub */}
            <p
              className="hero-subtext"
              style={{
                fontSize: "clamp(14px, 1.8vw, 18px)", fontWeight: 300,
                color: "rgba(255,255,255,0.5)", lineHeight: 1.75,
                maxWidth: 560, margin: "0 auto 48px",
              }}
            >
              {t("hero.description")}
            </p>

            {/* Buttons */}
            <div
              className="hero-buttons"
              style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}
            >
              <Link
                href="#contact"
                className="hero-btn-primary hero-btn-grad"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 30px", borderRadius: 100,
                  fontSize: 14, fontWeight: 500, letterSpacing: "0.02em",
                  color: "#020408", textDecoration: "none",
                  boxShadow: "0 0 30px rgba(99,200,255,0.3), 0 0 60px rgba(167,139,250,0.2)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                <span>{t("hero.startProject")}</span>
                <span className="hero-arrow">→</span>
              </Link>

              <Link
                href="#projects"
                className="hero-btn-secondary"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "13px 28px", borderRadius: 100,
                  fontSize: 14, fontWeight: 500, letterSpacing: "0.02em",
                  color: "rgba(255,255,255,0.85)", textDecoration: "none",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.2s",
                }}
              >
                <span>{t("hero.viewPortfolio")}</span>
                <span className="hero-arrow">→</span>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="hero-stats hero-stats-wrap"
              style={{ display: "flex", gap: 40, justifyContent: "center", alignItems: "center" }}
            >
              {[
                { num: "4",    label: "Clientes",   color: "#63C8FF" },
                { num: "5",    label: "Projectos",  color: "#A78BFA" },
                { num: "100%", label: "Satisfação", color: "#4ade80" },
                { num: "2026", label: "Fundada",    color: "#F472B6" },
              ].map((s, i) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 40 }}>
                  {i > 0 && (
                    <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.07)", flexShrink: 0 }} />
                  )}
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 26, fontWeight: 800,
                      color: s.color,
                      lineHeight: 1.1, marginBottom: 6,
                      textShadow: `0 0 20px ${s.color}60`,
                    }}>
                      {s.num}
                    </div>
                    <div style={{
                      fontSize: 10, color: "rgba(255,255,255,0.35)",
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      fontWeight: 500,
                    }}>
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="hero-scroll"
          style={{
            position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)",
            zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            Scroll
          </span>
          <div
            className="hero-scroll-line"
            style={{
              width: 1, height: 40,
              background: "linear-gradient(to bottom, rgba(99,200,255,0.6), transparent)",
            }}
          />
        </div>
      </section>
    </>
  );
}