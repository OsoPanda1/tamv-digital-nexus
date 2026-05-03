import { motion } from "framer-motion";

export const EpicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef(0);
  const tickRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const init = useCallback((w: number, h: number) => {
    const count = Math.min(Math.floor((w * h) / 28000), 56);
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
      tickRef.current += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;
      const maxDist = 120;

      // Connections
      if (tickRef.current % 2 === 0) {
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
      <div className="absolute inset-0 bg-[#030712]" />

      <motion.div
        className="absolute -inset-[20%]"
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 20% 25%, rgba(56,189,248,0.22) 0%, transparent 40%), radial-gradient(circle at 80% 30%, rgba(168,85,247,0.2) 0%, transparent 45%), radial-gradient(circle at 50% 80%, rgba(16,185,129,0.16) 0%, transparent 42%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.08) 45%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/25 to-black/70" />
    </div>
  );
};

export default EpicBackground;
