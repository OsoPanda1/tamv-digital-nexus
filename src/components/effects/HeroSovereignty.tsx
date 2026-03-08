// ============================================================================
// TAMV MD-X4™ — HERO SOVEREIGNTY v1.0
// Industrial Luxury · Consola de Mando Civilizatoria
// ============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FEDERATIONS, LAYER_META, FEDERATION_COUNT, type Federation } from "@/lib/federations";
import logoTamv from "@/assets/LOGOTAMV2.jpg";

interface HeroSovereigntyProps {
  onEnter?: () => void;
}

// ─── Federation Constellation (Canvas 2D — performant) ───
const FederationConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);
  const [hoveredFed, setHoveredFed] = useState<Federation | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const nodesRef = useRef(
    FEDERATIONS.map((f, i) => {
      const layer = ['L0', 'L1', 'L2', 'L3'].indexOf(f.layer);
      const angle = (i % 12) * (Math.PI * 2 / 12) + layer * 0.15;
      const radius = 100 + layer * 65;
      return {
        fed: f,
        baseX: Math.cos(angle) * radius,
        baseY: Math.sin(angle) * radius,
        x: 0, y: 0,
        pulse: Math.random() * Math.PI * 2,
        size: f.status === 'active' ? 4 : 2.5,
      };
    })
  );

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const t = performance.now() / 1000;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Draw orbit rings
    [100, 165, 230, 295].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(220, 10%, 20%, ${0.15 - i * 0.02})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    const nodes = nodesRef.current;
    
    // Draw connections
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return;
        if (a.fed.layer !== b.fed.layer) return;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(cx + a.x, cy + a.y);
          ctx.lineTo(cx + b.x, cy + b.y);
          ctx.strokeStyle = `hsla(220, 100%, 50%, ${(1 - dist / 140) * 0.12})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    let closestNode: typeof nodes[0] | null = null;
    let closestDist = 30;

    nodes.forEach(n => {
      n.pulse += 0.015;
      const breathe = 1 + Math.sin(n.pulse) * 0.15;
      n.x = n.baseX + Math.sin(t * 0.3 + n.pulse) * 3;
      n.y = n.baseY + Math.cos(t * 0.25 + n.pulse) * 3;

      const sx = cx + n.x;
      const sy = cy + n.y;
      const dm = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);

      if (dm < closestDist) {
        closestDist = dm;
        closestNode = n;
      }

      const isHovered = dm < 20;
      const r = n.size * breathe * (isHovered ? 2 : 1);

      // Glow
      if (n.fed.status === 'active') {
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 4);
        grad.addColorStop(0, `hsla(220, 100%, 50%, ${isHovered ? 0.4 : 0.15})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fillStyle = n.fed.status === 'active' 
        ? (isHovered ? 'hsl(220, 100%, 60%)' : 'hsl(220, 100%, 50%)')
        : 'hsl(220, 10%, 30%)';
      ctx.fill();

      // Hover expansion — burst lines
      if (isHovered) {
        for (let a = 0; a < 6; a++) {
          const angle = (a / 6) * Math.PI * 2 + t;
          const lx = Math.cos(angle) * 18;
          const ly = Math.sin(angle) * 18;
          ctx.beginPath();
          ctx.moveTo(sx + lx * 0.4, sy + ly * 0.4);
          ctx.lineTo(sx + lx, sy + ly);
          ctx.strokeStyle = 'hsla(220, 100%, 55%, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    // Tooltip
    if (closestNode) {
      setHoveredFed((closestNode as typeof nodes[0]).fed);
      setTooltipPos({ x: cx + (closestNode as typeof nodes[0]).x, y: cy + (closestNode as typeof nodes[0]).y - 25 });
    } else {
      setHoveredFed(null);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMove);

    const loop = () => {
      draw(ctx, canvas.width, canvas.height);
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
      {hoveredFed && (
        <div
          className="absolute pointer-events-none z-50 px-3 py-1.5 bg-card/90 backdrop-blur-md border border-border/50 text-[11px] font-mono"
          style={{ left: tooltipPos.x, top: tooltipPos.y, transform: 'translate(-50%, -100%)' }}
        >
          <span className="text-primary font-bold">{hoveredFed.icon}</span>{' '}
          <span className="text-foreground">{hoveredFed.name}</span>
          <span className="text-muted-foreground ml-2">{hoveredFed.layer}</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Hero ───
export const HeroSovereignty = ({ onEnter }: HeroSovereigntyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const bgBlur = useTransform(scrollYProgress, [0, 1], [0, 8]);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden" style={{ background: '#050505' }}>
      {/* LAYER 1: Scanner Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(hsl(220 100% 50% / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(220 100% 50% / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* LAYER 1b: Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px z-10"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(220 100% 50% / 0.3), transparent)' }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* LAYER 2: Federation Constellation */}
      <div className="absolute inset-0 z-20 opacity-70">
        <FederationConstellation />
      </div>

      {/* LAYER 3: Content Overlay */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full px-4">
        {/* System status */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-[10px] uppercase font-mono text-muted-foreground mb-6"
          style={{ letterSpacing: '0.5em' }}
        >
          Infraestructura social federada
        </motion.p>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8"
        >
          <img
            src={logoTamv}
            alt="TAMV"
            className="w-48 md:w-64 object-contain"
            style={{ filter: 'drop-shadow(0 0 20px hsla(220, 100%, 50%, 0.3))' }}
          />
        </motion.div>

        {/* Sovereign tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mb-4"
        >
          <span className="block text-sm md:text-base uppercase font-mono text-muted-foreground mb-3" style={{ letterSpacing: '0.3em' }}>
            {FEDERATION_COUNT} Federaciones · OMNI-KERNEL · L0–L3
          </span>
          <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-foreground font-display" style={{ letterSpacing: '-0.02em' }}>
            La Consola de Mando
          </span>
          <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-primary font-display mt-1" style={{ letterSpacing: '-0.02em' }}>
            de tu Ciudad
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-sm text-muted-foreground max-w-md text-center mb-10 font-mono"
          style={{ letterSpacing: '0.05em' }}
        >
          Un solo ecosistema para crear, cobrar y crecer.
          <br />
          Menos explotación. Más soberanía.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="group"
        >
          <Button
            onClick={() => { onEnter?.(); navigate('/dashboard'); }}
            className="relative border border-primary/30 bg-card/50 backdrop-blur-md px-12 py-6 text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-500 rounded-none text-sm uppercase font-mono"
            style={{ letterSpacing: '0.2em' }}
          >
            Entrar al Multiverso
          </Button>
          <p className="text-[9px] text-primary/60 opacity-0 group-hover:opacity-100 mt-2 transition-opacity duration-300 text-center font-mono">
            Sincronizando con el Kernel Isabella...
          </p>
        </motion.div>
      </div>

      {/* LAYER 4: Bottom sovereign message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-8 z-40 max-w-xs"
      >
        <p className="text-foreground font-bold text-lg leading-tight font-display">
          "No somos una red social.
          <br />
          <span className="text-primary">Somos la consola de mando de tu ciudad.</span>"
        </p>
        <p className="text-[9px] text-muted-foreground mt-2 font-mono uppercase" style={{ letterSpacing: '0.15em' }}>
          Edwin Oswaldo Castillo Trejo · Real del Monte, Hidalgo
        </p>
      </motion.div>

      {/* Status indicators — top right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute top-6 right-6 z-40 flex flex-col gap-2 items-end"
      >
        {Object.entries(LAYER_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2 font-mono text-[9px] uppercase" style={{ letterSpacing: '0.1em' }}>
            <span className="text-muted-foreground">{meta.name}</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground font-bold">{key}</span>
          </div>
        ))}
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)'
      }} />
    </section>
  );
};

export default HeroSovereignty;
