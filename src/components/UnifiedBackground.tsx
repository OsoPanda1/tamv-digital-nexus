// ============================================================================
// TAMV MD-X4™ - Unified Background System v10.0
// 3D Matrix · Metallic Blue · Silver-Platinum · Iridescent Pearl Glow
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
  color: '#0066FF',
  secondaryColor: '#E2E8F0',
};

// ============================================================================
// 3D Matrix Rain (Three.js) — Metallic Blue / Silver-Platinum / Pearl
// ============================================================================

function MatrixColumn({ position, speed, chars, delay }: {
  position: [number, number, number];
  speed: number;
  chars: string;
  delay: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const count = Math.floor(Math.random() * 12) + 8;
  const spacing = 1.2;

  // Color palette: metallic blue, silver-platinum, iridescent pearl
  const colors = useMemo(() => [
    new THREE.Color('#0066FF'),   // Plasma Blue
    new THREE.Color('#4D94FF'),   // Aqua Light
    new THREE.Color('#E2E8F0'),   // Silver Platinum
    new THREE.Color('#F1F5F9'),   // Pearl White
    new THREE.Color('#94A3B8'),   // Steel Silver
    new THREE.Color('#0044AA'),   // Deep Metallic Blue
  ], []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + delay;

    meshRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;

      // Cascade downward
      const localY = ((t * 2 + i * 0.3) % (count * spacing)) - (count * spacing * 0.5);
      mesh.position.y = localY;

      // Head glow (first chars bright, trail fades)
      const headDist = ((t * 2) % (count * spacing));
      const distFromHead = Math.abs(localY - (headDist - count * spacing * 0.5));
      const fade = Math.max(0, 1 - distFromHead / (count * spacing * 0.6));

      // Color: head is pearl/silver, body is metallic blue
      const isHead = distFromHead < 1.5;
      const color = isHead
        ? colors[Math.random() > 0.5 ? 2 : 3] // Pearl or Silver
        : colors[i % 2 === 0 ? 0 : 5]; // Plasma Blue or Deep Blue

      mat.color.lerp(color, 0.08);
      mat.opacity = fade * (isHead ? 0.95 : 0.45);
    });
  });

  const charGeometries = useMemo(() => {
    return Array.from({ length: count }, () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.font = 'bold 48px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, 32, 32);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    });
  }, [chars, count]);

  return (
    <group ref={meshRef} position={position}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[0, i * spacing, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          <meshBasicMaterial
            map={charGeometries[i]}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function Matrix3DScene({ config }: { config: BackgroundConfig }) {
  const groupRef = useRef<THREE.Group>(null);
  const chars = 'TAMV01∞∆∑∏ΩΞΨ';
  const gridSize = 18;
  const spread = 2.8;

  // Slow camera rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.15;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  const columns = useMemo(() => {
    const cols = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        if (Math.random() > 0.55) continue; // Sparse distribution
        cols.push({
          key: `${x}-${z}`,
          position: [
            (x - gridSize / 2) * spread + (Math.random() - 0.5) * 0.8,
            0,
            (z - gridSize / 2) * spread - 8 + (Math.random() - 0.5) * 0.8,
          ] as [number, number, number],
          speed: 0.3 + Math.random() * 0.7,
          delay: Math.random() * 20,
        });
      }
    }
    return cols;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Ambient glow */}
      <ambientLight intensity={0.05} color="#0066FF" />
      <pointLight position={[0, 15, 0]} intensity={0.4} color="#E2E8F0" distance={60} decay={2} />
      <pointLight position={[-20, 5, -10]} intensity={0.2} color="#0066FF" distance={40} decay={2} />
      <pointLight position={[20, 5, -10]} intensity={0.2} color="#4D94FF" distance={40} decay={2} />

      {/* Matrix columns */}
      {columns.map((col) => (
        <MatrixColumn
          key={col.key}
          position={col.position}
          speed={col.speed * config.speed}
          chars={chars}
          delay={col.delay}
        />
      ))}

      {/* Floating particles — iridescent pearl dust */}
      <PearlDust count={800} config={config} />
    </group>
  );
}

function PearlDust({ count, config }: { count: number; config: BackgroundConfig }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.008 * config.speed;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#E2E8F0"
        size={0.06}
        sizeAttenuation
        depthWrite={false}
        opacity={config.intensity * 0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

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
      ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx * config.speed;
        p.y += p.vy * config.speed;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 102, 255, ${config.intensity * 0.5})`;
        ctx.fill();

        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(226, 232, 240, ${config.intensity * 0.12 * (1 - dist / 120)})`;
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

  useEffect(() => {
    setConfig(prev => ({ ...prev, mode, intensity }));
  }, [mode, intensity]);

  if (config.mode === 'none') {
    return showVignette ? <VignetteOverlay /> : null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient — deep black with subtle blue shift */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsla(220, 100%, 50%, 0.02) 0%, transparent 50%), linear-gradient(180deg, hsl(0 0% 2%) 0%, hsl(220 8% 4%) 100%)',
        }}
      />

      {/* 3D Matrix Mode */}
      {config.mode === 'matrix' && (
        <Canvas
          camera={{ position: [0, 8, 22], fov: 65, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ background: 'transparent' }}
          dpr={[1, 1.5]}
        >
          <Matrix3DScene config={config} />
        </Canvas>
      )}

      {/* Quantum Mode */}
      {config.mode === 'quantum' && (
        <Canvas
          camera={{ position: [0, 0, 30], fov: 75 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <QuantumParticles config={config} />
        </Canvas>
      )}

      {config.mode === 'particles' && <ParticleFieldCanvas config={config} />}

      {config.mode === 'minimal' && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, hsla(220, 100%, 50%, ${intensity * 0.04}) 0%, transparent 40%),
                         radial-gradient(circle at 70% 80%, hsla(215, 25%, 84%, ${intensity * 0.02}) 0%, transparent 40%)`,
          }}
        />
      )}

      {/* Iridescent glow overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 50% at 30% 20%, hsla(220, 100%, 50%, 0.04) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 70% 80%, hsla(215, 25%, 90%, 0.03) 0%, transparent 50%)
        `,
      }} />

      {showVignette && <VignetteOverlay />}
    </div>
  );
};

// ============================================================================
// Vignette Overlay
// ============================================================================

const VignetteOverlay: React.FC = () => (
  <div
    className="fixed inset-0 pointer-events-none z-10"
    style={{
      background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
    }}
  />
);

// ============================================================================
// Hook for controlling background
// ============================================================================

export const useBackgroundControl = () => {
  const [mode, setMode] = useState<BackgroundMode>('quantum');
  const [intensity, setIntensity] = useState(0.4);

  const setBackground = useCallback((newMode: BackgroundMode, newIntensity?: number) => {
    setMode(newMode);
    if (newIntensity !== undefined) setIntensity(newIntensity);
  }, []);

  return { mode, intensity, setBackground, setMode, setIntensity };
};

export default UnifiedBackground;
export type { BackgroundMode, BackgroundConfig };