// ============================================================================
// TAMV MD-X4™ — INDUSTRIAL SCANNER BACKGROUND v9.0
// Ballistic Glass + Carbon Grid + Plasma Pulse
// ============================================================================

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
  pulse: number; speed: number;
}

export const EpicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const init = useCallback((w: number, h: number) => {
    const count = Math.min(Math.floor((w * h) / 20000), 80);
    const p: Particle[] = [];
    for (let i = 0; i < count; i++) {
      p.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.008,
      });
    }
    particlesRef.current = p;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init(canvas.width, canvas.height);
    };
    const onMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouse);

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;
      const maxDist = 120;

      // Connections
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `hsla(220, 100%, 50%, ${(1 - d / maxDist) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Particles
      ps.forEach(p => {
        p.pulse += p.speed;
        const breathe = 1 + Math.sin(p.pulse) * 0.3;

        // Mouse repulsion
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 150 && d > 0) {
          const f = (150 - d) / 150;
          p.vx -= (dx / d) * f * 0.015;
          p.vy -= (dy / d) * f * 0.015;
        }

        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.995; p.vy *= 0.995;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3 * breathe);
        grad.addColorStop(0, `hsla(220, 100%, 50%, ${p.opacity})`);
        grad.addColorStop(0.5, `hsla(220, 100%, 50%, ${p.opacity * 0.3})`);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * breathe, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Absolute black base */}
      <div className="absolute inset-0" style={{ background: '#050505' }} />

      {/* Industrial grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `
          linear-gradient(hsla(220, 100%, 50%, 0.4) 1px, transparent 1px),
          linear-gradient(90deg, hsla(220, 100%, 50%, 0.4) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      {/* Subtle plasma glow */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(ellipse 60% 40% at 20% 50%, hsla(220, 100%, 50%, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse 50% 30% at 80% 40%, hsla(220, 80%, 40%, 0.06) 0%, transparent 50%)
        `,
      }} />

      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.7 }} />

      {/* Carbon fiber noise */}
      <div className="absolute inset-0 noise-overlay opacity-[0.015]" />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.5) 100%)'
      }} />
    </div>
  );
};

export default EpicBackground;
