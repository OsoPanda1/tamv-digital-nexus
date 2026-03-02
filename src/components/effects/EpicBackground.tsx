// ============================================================================
// TAMV MD-X4™ - EPIC BACKGROUND v7.0
// Ultra-Premium Visual Atmosphere - 100x Quality Enhancement
// ============================================================================

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

export const EpicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() > 0.5 ? 185 : 271, // Aqua or Purple
        pulse: 0,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    particlesRef.current = particles;
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, p: Particle) => {
    // Update pulse
    p.pulse += p.pulseSpeed;
    const pulseFactor = 1 + Math.sin(p.pulse) * 0.3;
    
    // Create gradient for glow effect
    const gradient = ctx.createRadialGradient(
      p.x, p.y, 0,
      p.x, p.y, p.radius * 4 * pulseFactor
    );
    
    const color = p.hue === 185 
      ? `hsla(${p.hue}, 100%, 60%, ${p.opacity})`
      : `hsla(${p.hue}, 100%, 65%, ${p.opacity})`;
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.5})`);
    gradient.addColorStop(1, "transparent");

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * pulseFactor, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }, []);

  const drawConnections = useCallback((ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    const maxDistance = 150;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.15;
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          
          gradient.addColorStop(0, `hsla(185, 100%, 60%, ${opacity})`);
          gradient.addColorStop(1, `hsla(271, 100%, 65%, ${opacity})`);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((p) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 200;
          p.vx -= (dx / distance) * force * 0.02;
          p.vy -= (dy / distance) * force * 0.02;
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        drawParticle(ctx, p);
      });

      // Draw connections
      drawConnections(ctx, particles);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, drawParticle, drawConnections]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050508] via-[#0a0a10] to-[#050508]" />
      
      {/* Aurora effects */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsla(185, 100%, 60%, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsla(271, 100%, 65%, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Animated aurora */}
      <div 
        className="absolute inset-0 animate-aurora-flow opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 100% 60% at 50% 0%, hsla(330, 100%, 65%, 0.1) 0%, transparent 60%)
          `,
        }}
      />
      
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.8 }}
      />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
      
      {/* Vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
};

export default EpicBackground;
