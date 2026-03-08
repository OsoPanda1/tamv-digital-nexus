// =======================================================
// EPIC VISUAL EFFECTS v3.0 — Cinematic Grade
// Volumetric light rays, holographic grids, constellation networks,
// aurora waves, electromagnetic pulses, digital rain
// =======================================================

import { useEffect, useRef, useCallback } from "react";

interface EpicVisualEffectsProps {
  intensity: number;
  mode: "void" | "awaken" | "crisis" | "expand" | "reveal" | "ascend" | "declare";
  time: number;
}

interface Star {
  x: number; y: number;
  size: number;
  brightness: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

interface LightRay {
  angle: number;
  length: number;
  width: number;
  opacity: number;
  speed: number;
  hue: number;
}

interface GridLine {
  y: number;
  speed: number;
  opacity: number;
}

interface AuroraWave {
  offset: number;
  amplitude: number;
  frequency: number;
  speed: number;
  hue: number;
  opacity: number;
}

export function EpicVisualEffects({ intensity, mode, time }: EpicVisualEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const raysRef = useRef<LightRay[]>([]);
  const gridRef = useRef<GridLine[]>([]);
  const auroraRef = useRef<AuroraWave[]>([]);
  const frameRef = useRef(0);

  const init = useCallback((w: number, h: number) => {
    // Stars - deep space background
    starsRef.current = Array.from({ length: 300 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.5 + 0.3,
      brightness: Math.random(),
      twinkleSpeed: 0.5 + Math.random() * 3,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    // Volumetric light rays from center
    raysRef.current = Array.from({ length: 24 }, (_, i) => ({
      angle: (i / 24) * Math.PI * 2,
      length: 0.4 + Math.random() * 0.6,
      width: 1 + Math.random() * 3,
      opacity: 0.02 + Math.random() * 0.08,
      speed: 0.1 + Math.random() * 0.3,
      hue: 200 + Math.random() * 40,
    }));

    // Perspective grid lines
    gridRef.current = Array.from({ length: 30 }, (_, i) => ({
      y: i / 30,
      speed: 0.001 + Math.random() * 0.003,
      opacity: 0.05 + Math.random() * 0.1,
    }));

    // Aurora waves
    auroraRef.current = Array.from({ length: 5 }, (_, i) => ({
      offset: i * 0.2,
      amplitude: 30 + Math.random() * 60,
      frequency: 0.002 + Math.random() * 0.004,
      speed: 0.3 + Math.random() * 0.7,
      hue: 180 + i * 30,
      opacity: 0.03 + Math.random() * 0.05,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w: number, h: number;
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      if (starsRef.current.length === 0) init(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;

    const draw = () => {
      frameRef.current++;
      const t = frameRef.current / 60;

      // ── Mode config ──
      let baseHue = 220, glitchLevel = 0, rayIntensity = 0.5, gridOpacity = 0, auroraLevel = 0, pulseRate = 0;
      let bgAlpha = 0.15;

      switch (mode) {
        case "void":
          baseHue = 220; rayIntensity = 0.2; gridOpacity = 0.02; auroraLevel = 0; bgAlpha = 0.08;
          break;
        case "awaken":
          baseHue = 35; rayIntensity = 0.6; gridOpacity = 0.06; auroraLevel = 0.4; pulseRate = 0.5;
          break;
        case "crisis":
          baseHue = 0; glitchLevel = 0.8; rayIntensity = 1.0; gridOpacity = 0.15; pulseRate = 3; bgAlpha = 0.25;
          break;
        case "expand":
          baseHue = 185; rayIntensity = 0.7; gridOpacity = 0.08; auroraLevel = 0.7; pulseRate = 0.3;
          break;
        case "reveal":
          baseHue = 45; rayIntensity = 0.9; gridOpacity = 0.1; auroraLevel = 0.5; pulseRate = 0.2;
          break;
        case "ascend":
          baseHue = 270; rayIntensity = 0.8; auroraLevel = 1.0; pulseRate = 0.8;
          break;
        case "declare":
          baseHue = 200; rayIntensity = 0.3; gridOpacity = 0.03; auroraLevel = 0.2; bgAlpha = 0.06;
          break;
      }

      // ── Clear ──
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(0,0,0,${bgAlpha})`;
      ctx.fillRect(0, 0, w, h);

      // ══════════════════════════════════════════
      // 1. STAR FIELD — depth perception
      // ══════════════════════════════════════════
      ctx.globalCompositeOperation = "lighter";
      for (const star of starsRef.current) {
        const twinkle = 0.3 + Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.7;
        const alpha = star.brightness * twinkle * intensity * 0.6;
        if (alpha < 0.01) continue;

        ctx.fillStyle = `hsla(${baseHue + 20}, 30%, 90%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Cross-shaped glow for brighter stars
        if (star.size > 1 && alpha > 0.2) {
          ctx.strokeStyle = `hsla(${baseHue}, 60%, 80%, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          const len = star.size * 4;
          ctx.beginPath();
          ctx.moveTo(star.x - len, star.y);
          ctx.lineTo(star.x + len, star.y);
          ctx.moveTo(star.x, star.y - len);
          ctx.lineTo(star.x, star.y + len);
          ctx.stroke();
        }
      }

      // ══════════════════════════════════════════
      // 2. VOLUMETRIC LIGHT RAYS — from center
      // ══════════════════════════════════════════
      if (rayIntensity > 0.1) {
        const cx = w / 2, cy = h / 2;
        const maxLen = Math.max(w, h) * 0.8;

        for (const ray of raysRef.current) {
          const angle = ray.angle + t * ray.speed * 0.1;
          const len = maxLen * ray.length * rayIntensity;
          const wobble = Math.sin(t * 2 + ray.angle * 3) * 0.02;

          const x1 = cx;
          const y1 = cy;
          const x2 = cx + Math.cos(angle + wobble) * len;
          const y2 = cy + Math.sin(angle + wobble) * len;

          const grad = ctx.createLinearGradient(x1, y1, x2, y2);
          const alpha = ray.opacity * intensity * rayIntensity;
          grad.addColorStop(0, `hsla(${baseHue + ray.hue * 0.2}, 80%, 70%, ${alpha * 0.8})`);
          grad.addColorStop(0.3, `hsla(${baseHue + ray.hue * 0.2}, 70%, 60%, ${alpha * 0.4})`);
          grad.addColorStop(1, `hsla(${baseHue}, 60%, 50%, 0)`);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = ray.width * (1 + Math.sin(t + ray.angle) * 0.5);
          ctx.stroke();
        }

        // Central glow
        const glowSize = 80 + Math.sin(t * 1.5) * 30;
        const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize * rayIntensity);
        cGrad.addColorStop(0, `hsla(${baseHue}, 100%, 80%, ${0.15 * intensity * rayIntensity})`);
        cGrad.addColorStop(0.4, `hsla(${baseHue}, 80%, 60%, ${0.06 * intensity * rayIntensity})`);
        cGrad.addColorStop(1, "transparent");
        ctx.fillStyle = cGrad;
        ctx.fillRect(cx - glowSize, cy - glowSize, glowSize * 2, glowSize * 2);
      }

      // ══════════════════════════════════════════
      // 3. PERSPECTIVE GRID — sci-fi floor
      // ══════════════════════════════════════════
      if (gridOpacity > 0.01) {
        ctx.globalCompositeOperation = "lighter";
        const horizon = h * 0.45;

        // Horizontal lines with perspective
        for (const line of gridRef.current) {
          const progress = (line.y + t * line.speed) % 1;
          const yPos = horizon + progress * progress * (h - horizon);
          const alpha = line.opacity * gridOpacity * intensity * (1 - progress * 0.5);

          if (alpha < 0.005) continue;

          ctx.strokeStyle = `hsla(${baseHue}, 70%, 50%, ${alpha})`;
          ctx.lineWidth = 0.5 + (1 - progress) * 0.5;
          ctx.beginPath();
          ctx.moveTo(0, yPos);
          ctx.lineTo(w, yPos);
          ctx.stroke();
        }

        // Vertical converging lines
        const vanishX = w / 2;
        const numVLines = 16;
        for (let i = 0; i < numVLines; i++) {
          const spread = (i / numVLines - 0.5) * 2;
          const bottomX = vanishX + spread * w * 0.8;
          const alpha = gridOpacity * intensity * 0.5 * (1 - Math.abs(spread) * 0.5);

          ctx.strokeStyle = `hsla(${baseHue}, 60%, 50%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(vanishX, horizon);
          ctx.lineTo(bottomX, h);
          ctx.stroke();
        }
      }

      // ══════════════════════════════════════════
      // 4. AURORA BOREALIS — flowing waves
      // ══════════════════════════════════════════
      if (auroraLevel > 0.05) {
        ctx.globalCompositeOperation = "lighter";

        for (const wave of auroraRef.current) {
          const baseY = h * (0.15 + wave.offset * 0.3);
          ctx.beginPath();

          for (let x = 0; x <= w; x += 3) {
            const y = baseY +
              Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude +
              Math.sin(x * wave.frequency * 2.3 + t * wave.speed * 1.7) * wave.amplitude * 0.4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          // Draw filled aurora band
          ctx.lineTo(w, h * 0.5);
          ctx.lineTo(0, h * 0.5);
          ctx.closePath();

          const aGrad = ctx.createLinearGradient(0, baseY - wave.amplitude, 0, baseY + wave.amplitude * 2);
          const alpha = wave.opacity * auroraLevel * intensity;
          aGrad.addColorStop(0, "transparent");
          aGrad.addColorStop(0.3, `hsla(${wave.hue + baseHue * 0.3}, 80%, 60%, ${alpha})`);
          aGrad.addColorStop(0.6, `hsla(${wave.hue + 30 + baseHue * 0.2}, 70%, 50%, ${alpha * 0.5})`);
          aGrad.addColorStop(1, "transparent");
          ctx.fillStyle = aGrad;
          ctx.fill();
        }
      }

      // ══════════════════════════════════════════
      // 5. ELECTROMAGNETIC PULSE — rhythmic rings
      // ══════════════════════════════════════════
      if (pulseRate > 0) {
        ctx.globalCompositeOperation = "lighter";
        const cx = w / 2, cy = h / 2;
        const numPulses = 3;

        for (let i = 0; i < numPulses; i++) {
          const phase = ((t * pulseRate + i * 1.2) % 4) / 4;
          if (phase > 0.99) continue;

          const radius = phase * Math.max(w, h) * 0.6;
          const alpha = (1 - phase) * 0.15 * intensity;

          ctx.strokeStyle = `hsla(${baseHue + i * 20}, 80%, 65%, ${alpha})`;
          ctx.lineWidth = 1.5 * (1 - phase);
          ctx.beginPath();
          ctx.ellipse(cx, cy, radius, radius * 0.4, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // ══════════════════════════════════════════
      // 6. CONSTELLATION NETWORK — connecting nearby stars
      // ══════════════════════════════════════════
      if (mode === "expand" || mode === "reveal" || mode === "ascend") {
        ctx.globalCompositeOperation = "lighter";
        const connectionDist = 120;
        const stars = starsRef.current;

        for (let i = 0; i < stars.length; i += 3) {
          for (let j = i + 1; j < stars.length; j += 3) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * 0.08 * intensity;
              ctx.strokeStyle = `hsla(${baseHue}, 60%, 60%, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // ══════════════════════════════════════════
      // 7. DIGITAL RAIN — crisis mode
      // ══════════════════════════════════════════
      if (mode === "crisis" && glitchLevel > 0) {
        ctx.globalCompositeOperation = "source-over";
        const chars = "TAMV01ANOMALYERRORSENTINELCRITICAL";
        ctx.font = "10px monospace";

        for (let col = 0; col < w; col += 20) {
          if (Math.random() > 0.15) continue;
          const row = (frameRef.current * 3 + col * 7) % h;
          const alpha = 0.1 + Math.random() * 0.3;
          ctx.fillStyle = `hsla(${baseHue}, 90%, 50%, ${alpha * glitchLevel * intensity})`;
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], col, row);
        }

        // Horizontal glitch slices
        if (Math.random() < glitchLevel * 0.12) {
          const sliceH = 2 + Math.random() * 20;
          const sliceY = Math.random() * h;
          const shift = (Math.random() - 0.5) * 30;
          try {
            const imgData = ctx.getImageData(0, Math.floor(sliceY), w, Math.floor(sliceH));
            ctx.putImageData(imgData, Math.floor(shift), Math.floor(sliceY));
          } catch {}

          // RGB channel split
          ctx.globalCompositeOperation = "screen";
          ctx.fillStyle = `rgba(255,0,0,${0.04 * intensity})`;
          ctx.fillRect(shift, sliceY, w, sliceH);
          ctx.fillStyle = `rgba(0,255,255,${0.03 * intensity})`;
          ctx.fillRect(-shift * 0.5, sliceY + 1, w, sliceH);
        }
      }

      // ══════════════════════════════════════════
      // 8. SCANLINES + VIGNETTE + FILM GRAIN
      // ══════════════════════════════════════════
      ctx.globalCompositeOperation = "source-over";

      // Subtle scanlines
      if (intensity > 0.1) {
        ctx.fillStyle = `rgba(0,0,0,${0.015 * intensity})`;
        for (let y = 0; y < h; y += 2) {
          ctx.fillRect(0, y, w, 1);
        }
      }

      // Film grain
      if (intensity > 0.3) {
        const grainData = ctx.createImageData(w, 4);
        for (let i = 0; i < grainData.data.length; i += 4) {
          const v = Math.random() * 12;
          grainData.data[i] = v;
          grainData.data[i + 1] = v;
          grainData.data[i + 2] = v;
          grainData.data[i + 3] = Math.random() * 8 * intensity;
        }
        const grainY = (frameRef.current * 4) % h;
        ctx.putImageData(grainData, 0, grainY);
      }

      // Cinematic vignette
      const vigR = Math.max(w, h) * 0.7;
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, vigR * 0.3, w / 2, h / 2, vigR);
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(0.7, "rgba(0,0,0,0.1)");
      vigGrad.addColorStop(1, `rgba(0,0,0,${0.5 + intensity * 0.15})`);
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Letterbox bars for cinematic aspect
      const barH = h * 0.035;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, w, barH);
      ctx.fillRect(0, h - barH, w, barH);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, mode, time, init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
