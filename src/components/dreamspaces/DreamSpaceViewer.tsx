// ============================================================================
// TAMV MD-X4™ — DreamSpaceViewer v2.0 (Functional)
// Full 3D immersive viewer with KAOS audio, FPS monitor, LOD, avatars
// ============================================================================

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Float,
  Environment,
  MeshDistortMaterial,
  Sparkles,
} from '@react-three/drei';
import * as THREE from 'three';
import { XRPerformanceMonitor } from '@/hooks/useXRPerformance';
import { useXRStore } from '@/stores/xrStore';
import { KAOSAudioSystem } from '@/systems/KAOSAudioSystem';
import type { AudioEnvironment } from '@/systems/KAOSAudioSystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Maximize2, Minimize2, Activity, X } from 'lucide-react';

// ─── Sub-components (inside Canvas) ────────────────────────────────────────

function FirstPersonController({ speed = 5 }: { speed?: number }) {
  const { camera } = useThree();
  const keys = useRef({ w: false, s: false, a: false, d: false });
  const vel = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) (keys.current as any)[k] = true;
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k in keys.current) (keys.current as any)[k] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useFrame((_, delta) => {
    const dir = new THREE.Vector3(
      Number(keys.current.d) - Number(keys.current.a),
      0,
      Number(keys.current.s) - Number(keys.current.w)
    ).normalize();
    vel.current.lerp(dir.multiplyScalar(speed * delta), 0.15);
    camera.position.add(vel.current);
  });

  return null;
}

function Avatar({ position, color, name, isLocal }: { position: [number, number, number]; color: string; name: string; isLocal?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if (hovered) ref.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={ref} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={isLocal ? 1.2 : 1}>
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <MeshDistortMaterial color={color} clearcoat={1} metalness={0.8} distort={hovered ? 0.3 : 0.1} speed={2} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} metalness={0.5} roughness={0.2} />
        </mesh>
        {isLocal && (
          <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.7, 32]} />
            <meshBasicMaterial color="#00D9FF" transparent opacity={0.5} />
          </mesh>
        )}
      </Float>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
    </mesh>
  );
}

function Portal({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * 0.5; });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <torusGeometry args={[2, 0.1, 16, 100]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>
      <Sparkles count={50} scale={4} size={2} speed={0.4} color="#00D9FF" />
    </group>
  );
}

function AudioOrb({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime; });
  return (
    <mesh ref={ref} position={position} onClick={() => { setActive(!active); onClick(); }}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color={active ? '#FFD700' : '#9945FF'} emissive={active ? '#FFD700' : '#9945FF'} emissiveIntensity={active ? 2 : 0.5} transparent opacity={0.7} />
    </mesh>
  );
}

function EnvLighting({ type }: { type: string }) {
  const envMap: Record<string, { fog: string; light: string; ambient: number; preset: 'night' | 'forest' | 'warehouse' | 'sunset' }> = {
    quantum: { fog: '#0a0a1a', light: '#00D9FF', ambient: 0.3, preset: 'night' },
    forest: { fog: '#0a3a1a', light: '#90EE90', ambient: 0.4, preset: 'forest' },
    cosmic: { fog: '#050510', light: '#C0C0C0', ambient: 0.2, preset: 'night' },
    crystal: { fog: '#1a1a2e', light: '#FF6B6B', ambient: 0.5, preset: 'warehouse' },
  };
  const c = envMap[type] || envMap.quantum;
  const particleCount = useXRStore((s) => s.sceneConfig.particleCount);

  return (
    <>
      <fog attach="fog" args={[c.fog, 10, 80]} />
      <ambientLight intensity={c.ambient} />
      <pointLight position={[10, 20, 10]} intensity={1.5} color={c.light} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#9945FF" />
      {type === 'cosmic' && <Stars radius={100} depth={50} count={Math.min(particleCount * 3, 7000)} factor={4} saturation={0.5} fade speed={1} />}
      <Environment preset={c.preset} />
      <Sparkles count={Math.min(particleCount, 300)} scale={50} size={3} speed={0.2} color="#00D9FF" />
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

interface DreamSpaceViewerProps {
  environment: 'quantum' | 'forest' | 'cosmic' | 'crystal';
  spaceName?: string;
  participants?: Array<{ id: string; name: string; position: [number, number, number]; color: string }>;
  onExit?: () => void;
}

const kaos = new KAOSAudioSystem();

export function DreamSpaceViewer({ environment, spaceName, participants = [], onExit }: DreamSpaceViewerProps) {
  const [audioOn, setAudioOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const fps = useXRStore((s) => s.fps);
  const quality = useXRStore((s) => s.sceneConfig.quality);
  const containerRef = useRef<HTMLDivElement>(null);

  const mockParticipants = useMemo(() => [
    { id: 'p1', name: 'Explorador Ω', position: [5, 0, 5] as [number, number, number], color: '#FF6B6B' },
    { id: 'p2', name: 'Guardián Θ', position: [-3, 0, 8] as [number, number, number], color: '#4ECDC4' },
    { id: 'p3', name: 'Creador Δ', position: [8, 0, -3] as [number, number, number], color: '#FFE66D' },
    ...participants,
  ], [participants]);

  // KAOS audio lifecycle
  useEffect(() => {
    if (audioOn) {
      kaos.initialize().then(() => {
        const audioEnv = environment as AudioEnvironment;
        kaos.playEnvironment(audioEnv);
        kaos.playBinauralPreset(environment === 'cosmic' ? 'meditate' : environment === 'forest' ? 'relax' : 'focus', 0);
      });
    } else {
      kaos.stopBinaural();
      kaos.stopEnvironment();
    }
    return () => { kaos.stopBinaural(); kaos.stopEnvironment(); };
  }, [audioOn, environment]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const handleAudioOrb = async () => {
    if (!audioOn) setAudioOn(true);
    await kaos.playNotification('celebration', { x: 0, y: 0, z: -2 });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background">
      <Canvas camera={{ position: [0, 2, 10], fov: 75 }} shadows gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
        <XRPerformanceMonitor />
        <EnvLighting type={environment} />
        <FirstPersonController speed={5} />
        <OrbitControls enablePan enableZoom minDistance={2} maxDistance={50} maxPolarAngle={Math.PI / 2} />
        <Ground />

        {/* Local avatar */}
        <Avatar position={[0, 0, 0]} color="#00D9FF" name="Tú" isLocal />

        {/* Remote avatars */}
        {mockParticipants.map((p) => (
          <Avatar key={p.id} position={p.position} color={p.color} name={p.name} />
        ))}

        {/* Portals */}
        <Portal position={[0, 2, -20]} />
        <Portal position={[15, 2, 0]} />

        {/* Interactive audio orbs */}
        <AudioOrb position={[-5, 1, 5]} onClick={handleAudioOrb} />
        <AudioOrb position={[10, 1, -5]} onClick={handleAudioOrb} />
      </Canvas>

      {/* ─── HUD Overlay ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="flex items-start justify-between p-4 pointer-events-auto">
          {/* Left: controls */}
          <div className="bg-card/80 backdrop-blur-md border border-border/30 p-4 rounded-xl space-y-1">
            <h3 className="text-primary font-bold text-sm tracking-wider uppercase">{spaceName || 'DreamSpace'}</h3>
            <p className="text-xs text-muted-foreground">W/A/S/D — Movimiento</p>
            <p className="text-xs text-muted-foreground">Mouse — Cámara · Scroll — Zoom</p>
          </div>

          {/* Right: metrics */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-card/80 backdrop-blur-md border-border/30 gap-1">
              <Activity className="w-3 h-3" />
              <span className={fps >= 45 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
                {fps} FPS
              </span>
            </Badge>
            <Badge variant="outline" className="bg-card/80 backdrop-blur-md border-border/30 uppercase text-xs">
              LOD: {quality}
            </Badge>
            <Badge variant="outline" className="bg-card/80 backdrop-blur-md border-border/30">
              {mockParticipants.length + 1} usuarios
            </Badge>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-auto">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-card/80 backdrop-blur-md" onClick={() => setAudioOn(!audioOn)}>
              {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="ml-1 text-xs">{audioOn ? 'KAOS ON' : 'KAOS OFF'}</span>
            </Button>
            <Button size="sm" variant="outline" className="bg-card/80 backdrop-blur-md" onClick={toggleFullscreen}>
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {onExit && (
            <Button size="sm" variant="destructive" onClick={onExit} className="gap-1">
              <X className="w-4 h-4" /> Salir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
