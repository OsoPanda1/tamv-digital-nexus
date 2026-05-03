// ============================================================================
// TAMV MD-X4™ — HERO SOVEREIGNTY v2.0
// Consola de Mando Civilizatoria · Industrial Luxury · 48 Federaciones
// ============================================================================

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FEDERATIONS, LAYER_META, FEDERATION_COUNT, type Federation } from "@/lib/federations";
import logoTamv from "@/assets/LOGOTAMV2.jpg";

interface HeroSovereigntyProps {
  onEnter?: () => void;
}

// ─── Federation Constellation (Canvas 2D — performant orbital layout) ───
const FederationConstellation = ({ onFederationSelect }: { onFederationSelect?: (f: Federation | null) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animRef = useRef(0);

  const nodesRef = useRef(
    FEDERATIONS.map((f, i) => {
      const layerIdx = ['L0', 'L1', 'L2', 'L3'].indexOf(f.layer);
      // Distribute nodes in elliptical orbits per layer
      const nodesInLayer = 12;
      const posInLayer = i % nodesInLayer;
      const angle = (posInLayer / nodesInLayer) * Math.PI * 2 + layerIdx * 0.4;
      const radiusX = 90 + layerIdx * 70;
      const radiusY = 70 + layerIdx * 55;
      return {
        fed: f,
        baseX: Math.cos(angle) * radiusX,
        baseY: Math.sin(angle) * radiusY,
        x: 0, y: 0,
        pulse: Math.random() * Math.PI * 2,
        size: f.status === 'active' ? 3.5 : 2,
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

    // Draw elliptical orbit rings
    [0, 1, 2, 3].forEach(i => {
      const rx = 90 + i * 70;
      const ry = 70 + i * 55;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(220, 10%, 18%, ${0.2 - i * 0.03})`;
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    const nodes = nodesRef.current;

    // Draw fiber optic connections (same layer, close nodes)
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i || a.fed.layer !== b.fed.layer) return;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(cx + a.x, cy + a.y);
          ctx.lineTo(cx + b.x, cy + b.y);
          ctx.strokeStyle = `hsla(220, 100%, 50%, ${(1 - dist / 160) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });

    // Draw nodes
    let closestNode: typeof nodes[0] | null = null;
    let closestDist = 35;

    nodes.forEach(n => {
      n.pulse += 0.012;
      const breathe = 1 + Math.sin(n.pulse) * 0.12;
      n.x = n.baseX + Math.sin(t * 0.2 + n.pulse) * 2.5;
      n.y = n.baseY + Math.cos(t * 0.18 + n.pulse) * 2.5;

      const sx = cx + n.x;
      const sy = cy + n.y;
      const dm = Math.sqrt((mx - sx) ** 2 + (my - sy) ** 2);

      if (dm < closestDist) {
        closestDist = dm;
        closestNode = n;
      }

      const isHovered = dm < 25;
      const r = n.size * breathe * (isHovered ? 2.5 : 1);

      // Glow for active nodes
      if (n.fed.status === 'active') {
        const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5);
        grad.addColorStop(0, `hsla(220, 100%, 50%, ${isHovered ? 0.5 : 0.12})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(sx, sy, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Core dot
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      const layerColors: Record<string, string> = {
        L0: isHovered ? 'hsl(220, 100%, 65%)' : 'hsl(220, 100%, 50%)',
        L1: isHovered ? 'hsl(214, 32%, 95%)' : 'hsl(214, 25%, 78%)',
        L2: isHovered ? 'hsl(51, 100%, 60%)' : 'hsl(51, 100%, 50%)',
        L3: isHovered ? 'hsl(220, 60%, 65%)' : 'hsl(220, 60%, 50%)',
      };
      ctx.fillStyle = n.fed.status === 'active'
        ? (layerColors[n.fed.layer] || 'hsl(220, 100%, 50%)')
        : 'hsl(220, 10%, 25%)';
      ctx.fill();

      // Hover burst lines
      if (isHovered) {
        for (let a = 0; a < 8; a++) {
          const angle = (a / 8) * Math.PI * 2 + t * 0.5;
          const lx = Math.cos(angle) * 22;
          const ly = Math.sin(angle) * 22;
          ctx.beginPath();
          ctx.moveTo(sx + lx * 0.35, sy + ly * 0.35);
          ctx.lineTo(sx + lx, sy + ly);
          ctx.strokeStyle = 'hsla(220, 100%, 55%, 0.35)';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    // Notify parent of hovered federation
    if (closestNode) {
      onFederationSelect?.((closestNode as typeof nodes[0]).fed);
    } else {
      onFederationSelect?.(null);
    }
  }, [onFederationSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMove);

    const loop = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        ctx.scale(dpr, dpr);
        draw(ctx, rect.width, rect.height);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

// ─── Technical Tooltip Panel (Frosted Glass) ───
const FederationPanel = ({ fed }: { fed: Federation }) => {
  const statusLabels: Record<string, string> = {
    active: 'OPERATIVO_SOBERANO',
    building: 'EN_CONSTRUCCIÓN',
    planned: 'PLANIFICADO',
  };
  const flowValue = fed.status === 'active' 
    ? `${(Math.random() * 5000 + 200).toFixed(0)} Tx/m` 
    : '—';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="bg-card/90 backdrop-blur-2xl border border-border/50 px-5 py-4 min-w-[260px]"
        style={{ boxShadow: '0 12px 40px hsla(0,0%,0%,0.7), 0 0 20px hsla(220,100%,50%,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{fed.icon}</span>
          <span className="text-[11px] font-mono text-foreground font-bold uppercase" style={{ letterSpacing: '0.08em' }}>
            {fed.name}
          </span>
        </div>
        <div className="space-y-1.5 font-mono text-[9px]" style={{ letterSpacing: '0.05em' }}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">&gt; DOMINIO:</span>
            <span className="text-foreground">{fed.domain.toUpperCase()}_{fed.layer}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">&gt; STATUS:</span>
            <span className={fed.status === 'active' ? 'text-primary' : 'text-accent'}>{statusLabels[fed.status]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">&gt; FLUJO_VIVO:</span>
            <span className="text-foreground">{flowValue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">&gt; ISABELLA_CONFIDENCE:</span>
            <span className="text-primary">{fed.status === 'active' ? '99.8%' : '—'}</span>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-border/20">
          <p className="text-[8px] text-muted-foreground font-mono">{fed.description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Hero ───
export const HeroSovereignty = ({ onEnter }: HeroSovereigntyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [hoveredFed, setHoveredFed] = useState<Federation | null>(null);

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background">
      {/* LAYER 1: Scanner Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
        backgroundImage: `
          linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
          linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* LAYER 1b: Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-px z-10"
        style={{ background: `linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)` }}
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* LAYER 2: Federation Constellation */}
      <div className="absolute inset-0 z-20 opacity-70">
        <FederationConstellation onFederationSelect={setHoveredFed} />
      </div>

      {/* LAYER 2b: Hovered Federation Technical Panel */}
      <div className="absolute inset-0 z-30 flex items-start justify-center pt-[15vh] pointer-events-none">
        {hoveredFed && <FederationPanel fed={hoveredFed} />}
      </div>

      {/* LAYER 3: Content Overlay */}
      <div className="relative z-40 flex flex-col items-center justify-center h-full px-4">
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
            alt="TAMV MD-X4 — Consola de Mando Civilizatoria"
            className="w-48 md:w-64 object-contain"
            style={{ filter: `drop-shadow(0 0 25px hsl(var(--primary) / 0.35))` }}
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
          <motion.p 
            className="text-[9px] text-primary/60 opacity-0 group-hover:opacity-100 mt-2 transition-opacity duration-300 text-center font-mono"
          >
            Sincronizando con el Kernel Isabella... <span className="text-primary">[OK]</span>
          </motion.p>
        </motion.div>
      </div>

      {/* LAYER 4: Bottom sovereign message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-8 z-50 max-w-xs"
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

      {/* Layer indicators — top right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute top-6 right-6 z-50 flex flex-col gap-2 items-end"
      >
        {Object.entries(LAYER_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2 font-mono text-[9px] uppercase" style={{ letterSpacing: '0.1em' }}>
            <span className="text-muted-foreground">{meta.name}</span>
            <span className="w-2 h-2 bg-primary animate-pulse" />
            <span className="text-foreground font-bold">{key}</span>
          </div>
        ))}
      </motion.div>

      {/* Network status — bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-8 right-8 z-50 font-mono text-[8px] text-muted-foreground uppercase text-right space-y-1"
        style={{ letterSpacing: '0.1em' }}
      >
        <p>TAMV MD-X4™ · KERNEL v9.0</p>
        <p>{FEDERATION_COUNT} FEDERACIONES · {FEDERATIONS.filter(f => f.status === 'active').length} ACTIVAS</p>
        <p>TURISMO · COMERCIO · EDUCACIÓN · SEGURIDAD · CULTURA</p>
      </motion.div>

      {/* Radial Vignette */}
      <div className="absolute inset-0 z-[5] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 25%, hsl(var(--background)) 100%)'
      }} />
    </section>
  );
};

export default HeroSovereignty;
