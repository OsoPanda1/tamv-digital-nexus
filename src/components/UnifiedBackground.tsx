// ============================================================================
// TAMV MD-X4â"¢ - Unified Background System
// Single, elegant background system that prevents visual overlapping
// ============================================================================

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ============================================================================
// Configuration
// ============================================================================

type BackgroundMode = 'quantum' | 'matrix' | 'particles' | 'minimal' | 'none';

interface BackgroundConfig {
  mode: BackgroundMode;
  intensity: number;
  speed: number;
  color: string;
  secondaryColor: string;
}

const defaultConfig: BackgroundConfig = {
  mode: 'quantum',
  intensity: 0.4,
  speed: 1,
  color: '#00D9FF',
  secondaryColor: '#3E7EA3',
};

// ============================================================================
// 3D Quantum Particles (Three.js)
// ============================================================================

function QuantumParticles({ config }: { config: BackgroundConfig }) {
  const ref = useRef<THREE.Points>(null);
  const particlesCount = 3000;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.015 * config.speed;
      ref.current.rotation.y = state.clock.elapsedTime * 0.02 * config.speed;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={config.color}
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={config.intensity * 0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// ============================================================================
// Matrix Rain Effect (Canvas 2D)
// ============================================================================

function MatrixRainCanvas({ config }: { config: BackgroundConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const fontSize = 12;
    const chars = 'TAMV01∞∆∑∏';
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50);

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 12, 17, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const alpha = config.intensity * 0.7;
        ctx.fillStyle = i % 3 === 0 
          ? `rgba(0, 217, 255, ${alpha})` 
          : `rgba(62, 126, 163, ${alpha * 0.7})`;
        
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }
        drops[i] += 0.5 * config.speed;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
}

// ============================================================================
// Particle Field (Canvas 2D)
// ============================================================================

function ParticleFieldCanvas({ config }: { config: BackgroundConfig }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 12, 17, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx * config.speed;
        p.y += p.vy * config.speed;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${config.intensity * 0.5})`;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 217, 255, ${config.intensity * 0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.5 }}
    />
  );
}

// ============================================================================
// Main Unified Background Component
// ============================================================================

interface UnifiedBackgroundProps {
  mode?: BackgroundMode;
  intensity?: number;
  showVignette?: boolean;
}

export const UnifiedBackground: React.FC<UnifiedBackgroundProps> = ({
  mode = 'quantum',
  intensity = 0.4,
  showVignette = true,
}) => {
  const [config, setConfig] = useState<BackgroundConfig>({
    ...defaultConfig,
    mode,
    intensity,
  });

  // Update config when props change
  useEffect(() => {
    setConfig(prev => ({ ...prev, mode, intensity }));
  }, [mode, intensity]);

  // Don't render anything for 'none' mode
  if (config.mode === 'none') {
    return showVignette ? <VignetteOverlay /> : null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 217, 255, 0.03) 0%, transparent 50%), linear-gradient(180deg, #0B0C11 0%, #0D0F16 100%)',
        }}
      />

      {/* Render appropriate background based on mode */}
      {config.mode === 'quantum' && (
        <Canvas 
          camera={{ position: [0, 0, 30], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <QuantumParticles config={config} />
        </Canvas>
      )}

      {config.mode === 'matrix' && <MatrixRainCanvas config={config} />}
      
      {config.mode === 'particles' && <ParticleFieldCanvas config={config} />}

      {config.mode === 'minimal' && (
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(0, 217, 255, ${intensity * 0.05}) 0%, transparent 40%),
                         radial-gradient(circle at 70% 80%, rgba(62, 126, 163, ${intensity * 0.03}) 0%, transparent 40%)`,
          }}
        />
      )}

      {/* Vignette overlay */}
      {showVignette && <VignetteOverlay />}
    </div>
  );
};

// ============================================================================
// Vignette Overlay Component
// ============================================================================

const VignetteOverlay: React.FC = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-10"
    style={{
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.4) 100%)',
    }}
  />
);

// ============================================================================
// Hook for controlling background from any component
// ============================================================================

export const useBackgroundControl = () => {
  const [mode, setMode] = useState<BackgroundMode>('quantum');
  const [intensity, setIntensity] = useState(0.4);

  const setBackground = useCallback((newMode: BackgroundMode, newIntensity?: number) => {
    setMode(newMode);
    if (newIntensity !== undefined) {
      setIntensity(newIntensity);
    }
  }, []);

  return {
    mode,
    intensity,
    setBackground,
    setMode,
    setIntensity,
  };
};

// ============================================================================
// Exports
// ============================================================================

export default UnifiedBackground;
export type { BackgroundMode, BackgroundConfig };