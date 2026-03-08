// =======================================================
// EPIC VISUAL EFFECTS — Nebula, Shockwave, Glitch, Scanlines
// Canvas-based cinematic overlays for AAA intro
// =======================================================

import { useEffect, useRef, useCallback } from "react";

interface EpicVisualEffectsProps {
  intensity: number; // 0-1
  mode: "void" | "awaken" | "crisis" | "expand" | "reveal" | "ascend" | "declare";
  time: number;
}

// Nebula particle
interface Nebula {
  x: number; y: number; r: number;
  vx: number; vy: number;
  hue: number; sat: number; light: number;
  opacity: number; pulse: number; pulseSpeed: number;
  trail: { x: number; y: number }[];
}

// Energy ring from shockwave
interface Ring {
  x: number; y: number;
  radius: number; maxRadius: number;
  opacity: number; hue: number; width: number;
}

export function EpicVisualEffects({ intensity, mode, time }: EpicVisualEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<Nebula[]>([]);
  const ringsRef = useRef<Ring[]>([]);
  const lastRingTime = useRef(0);
  const glitchRef = useRef({ active: false, timer: 0 });

  const initParticles = useCallback((w: number, h: number) => {
    nebulaRef.current = Array.from({ length: 200 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      hue: 200 + Math.random() * 40,
      sat: 60 + Math.random() * 40,
      light: 50 + Math.random() * 30,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 2,
      trail: [],
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (nebulaRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;
    const draw = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Clear with slight trail
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, w, h);

      const t = now / 1000;

      // ─── MODE-BASED COLOR MAPPING ───
      let baseHue = 220;
      let particleSpeed = 1;
      let glitchChance = 0;
      let ringInterval = 999;
      let nebulaGlow = 0;

      switch (mode) {
        case "void":
          baseHue = 220; particleSpeed = 0.3; nebulaGlow = 0.05;
          break;
        case "awaken":
          baseHue = 35; particleSpeed = 0.8; nebulaGlow = 0.4; ringInterval = 3;
          break;
        case "crisis":
          baseHue = 0; particleSpeed = 2.5; glitchChance = 0.15; nebulaGlow = 0.7; ringInterval = 0.8;
          break;
        case "expand":
          baseHue = 185; particleSpeed = 1.2; nebulaGlow = 0.5; ringInterval = 2;
          break;
        case "reveal":
          baseHue = 45; particleSpeed = 0.6; nebulaGlow = 0.8; ringInterval = 4;
          break;
        case "ascend":
          baseHue = 270; particleSpeed = 1.5; nebulaGlow = 0.6; ringInterval = 1.5;
          break;
        case "declare":
          baseHue = 200; particleSpeed = 0.4; nebulaGlow = 0.3;
          break;
      }

      // ─── NEBULA PARTICLES ───
      ctx.globalCompositeOperation = "lighter";
      for (const p of nebulaRef.current) {
        p.pulse += p.pulseSpeed * 0.016;
        const pulseFactor = 0.5 + Math.sin(p.pulse) * 0.5;
        const dynamicOpacity = p.opacity * pulseFactor * intensity * (0.3 + nebulaGlow * 0.7);

        // Movement
        p.x += p.vx * particleSpeed;
        p.y += p.vy * particleSpeed;

        // Attraction to center during reveal/ascend
        if (mode === "reveal" || mode === "ascend") {
          const dx = w / 2 - p.x;
          const dy = h / 2 - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 50) {
            p.vx += (dx / dist) * 0.008;
            p.vy += (dy / dist) * 0.008;
          }
        }

        // Crisis scatter
        if (mode === "crisis") {
          p.vx += (Math.random() - 0.5) * 0.15;
          p.vy += (Math.random() - 0.5) * 0.15;
        }

        // Bounds wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Velocity dampening
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        // Draw trail
        if (p.trail.length > 1 && dynamicOpacity > 0.05) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let i = 1; i < p.trail.length; i++) {
            ctx.lineTo(p.trail[i].x, p.trail[i].y);
          }
          ctx.strokeStyle = `hsla(${baseHue + p.hue * 0.3}, ${p.sat}%, ${p.light}%, ${dynamicOpacity * 0.3})`;
          ctx.lineWidth = p.r * 0.5;
          ctx.stroke();
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        gradient.addColorStop(0, `hsla(${baseHue + p.hue * 0.3}, ${p.sat}%, ${p.light}%, ${dynamicOpacity})`);
        gradient.addColorStop(0.5, `hsla(${baseHue + p.hue * 0.3}, ${p.sat}%, ${p.light}%, ${dynamicOpacity * 0.3})`);
        gradient.addColorStop(1, `hsla(${baseHue}, ${p.sat}%, ${p.light}%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // ─── SHOCKWAVE RINGS ───
      if (time - lastRingTime.current > ringInterval && ringInterval < 100) {
        lastRingTime.current = time;
        ringsRef.current.push({
          x: w / 2 + (Math.random() - 0.5) * 200,
          y: h / 2 + (Math.random() - 0.5) * 100,
          radius: 0,
          maxRadius: 300 + Math.random() * 400,
          opacity: 0.6 + Math.random() * 0.4,
          hue: baseHue + (Math.random() - 0.5) * 30,
          width: 1 + Math.random() * 2,
        });
      }

      for (let i = ringsRef.current.length - 1; i >= 0; i--) {
        const ring = ringsRef.current[i];
        ring.radius += (ring.maxRadius - ring.radius) * 0.03;
        ring.opacity *= 0.985;

        if (ring.opacity < 0.01) {
          ringsRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${ring.hue}, 80%, 60%, ${ring.opacity * intensity})`;
        ctx.lineWidth = ring.width;
        ctx.stroke();
      }

      // ─── CENTRAL ENERGY GLOW ───
      if (nebulaGlow > 0.2) {
        const glowRadius = 150 + Math.sin(t * 1.5) * 50;
        const cGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, glowRadius);
        cGrad.addColorStop(0, `hsla(${baseHue}, 100%, 70%, ${nebulaGlow * 0.15 * intensity})`);
        cGrad.addColorStop(0.5, `hsla(${baseHue}, 80%, 50%, ${nebulaGlow * 0.06 * intensity})`);
        cGrad.addColorStop(1, `hsla(${baseHue}, 60%, 30%, 0)`);
        ctx.fillStyle = cGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // ─── SCANLINES ───
      ctx.globalCompositeOperation = "source-over";
      if (intensity > 0.1) {
        ctx.fillStyle = `rgba(0,0,0,${0.03 * intensity})`;
        for (let y = 0; y < h; y += 3) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      // ─── GLITCH EFFECT ───
      if (mode === "crisis" && Math.random() < glitchChance) {
        const sliceH = 5 + Math.random() * 40;
        const sliceY = Math.random() * h;
        const shift = (Math.random() - 0.5) * 40;
        const imgData = ctx.getImageData(0, sliceY, w, sliceH);
        ctx.putImageData(imgData, shift, sliceY);

        // Color channel shift
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = `rgba(255,0,0,${0.05 * intensity})`;
        ctx.fillRect(shift, sliceY, w, sliceH);
        ctx.fillStyle = `rgba(0,255,255,${0.04 * intensity})`;
        ctx.fillRect(-shift * 0.5, sliceY + 2, w, sliceH);
        ctx.globalCompositeOperation = "source-over";
      }

      // ─── VIGNETTE ───
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75);
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, `rgba(0,0,0,${0.4 + intensity * 0.2})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, mode, time, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
