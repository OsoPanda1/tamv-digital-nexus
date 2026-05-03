// ============================================================================
// TAMV MD-X4™ — DreamSpaceViewer v3.0 (Full XR Stack)
// Multi-user presence, Isabella guide, MSR integrity, permission system,
// KAOS audio, LOD auto-adjust, consistency model (strong/eventual)
// ============================================================================

import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Float,
  Environment,
  MeshDistortMaterial,
  Sparkles,
  Text,
} from '@react-three/drei';
import * as THREE from 'three';
import { XRPerformanceMonitor } from '@/hooks/useXRPerformance';
import { useXRStore } from '@/stores/xrStore';
import { useXRPresence, type XRUserPresence } from '@/hooks/useXRPresence';
import { useXRPermissions } from '@/hooks/useXRPermissions';
import { useXRIntegrity } from '@/hooks/useXRIntegrity';
import { KAOSAudioSystem } from '@/systems/KAOSAudioSystem';
import type { AudioEnvironment } from '@/systems/KAOSAudioSystem';
import { IsabellaXRGuide } from './IsabellaXRGuide';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Volume2, VolumeX, Maximize2, Minimize2, Activity, X,
  Users, Shield, Lock, Unlock, Wifi, WifiOff, Eye,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── 3D Sub-components ─────────────────────────────────────────────────────

function FirstPersonController({ speed = 5, onPositionUpdate }: { speed?: number; onPositionUpdate?: (pos: [number, number, number]) => void }) {
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

    // Broadcast position (eventual consistency — non-critical)
    if (onPositionUpdate) {
      onPositionUpdate([camera.position.x, camera.position.y, camera.position.z]);
    }
  });

  return null;
}

function RemoteAvatar({ presence }: { presence: XRUserPresence }) {
  const ref = useRef<THREE.Group>(null);
  const targetPos = useRef(new THREE.Vector3(...presence.position));
  const [hovered, setHovered] = useState(false);

  // Smooth interpolation (eventual consistency model)
  useEffect(() => {
    targetPos.current.set(...presence.position);
  }, [presence.position]);

  useFrame((state) => {
    if (ref.current) {
      // Lerp to target position (smooth eventual consistency)
      ref.current.position.lerp(targetPos.current, 0.1);
      // Idle animation
      ref.current.children[0].position.y = Math.sin(state.clock.elapsedTime * 2 + presence.userId.charCodeAt(0)) * 0.05;
    }
  });

  return (
    <group ref={ref} position={presence.position}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
          <MeshDistortMaterial
            color={presence.color}
            clearcoat={1}
            metalness={0.8}
            distort={hovered ? 0.3 : 0.1}
            speed={2}
          />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial
            color={presence.color}
            emissive={presence.color}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>
        {/* Status indicator */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial
            color={presence.status === 'active' ? '#22c55e' : presence.status === 'idle' ? '#eab308' : '#6b7280'}
          />
        </mesh>
      </Float>
      {/* Nametag */}
      {hovered && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {presence.displayName}
        </Text>
      )}
    </group>
  );
}

function LocalAvatar() {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshBasicMaterial color="#00D9FF" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[200, 200, 80, 80]} />
      <meshStandardMaterial
        color="#0d0d1a"
        metalness={0.9}
        roughness={0.15}
        wireframe={false}
      />
    </mesh>
  );
}

function Portal({ position, label }: { position: [number, number, number]; label?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => { if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * 0.5; });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <torusGeometry args={[2.5, 0.08, 16, 128]} />
        <meshStandardMaterial color="#00D9FF" emissive="#00D9FF" emissiveIntensity={3} transparent opacity={0.9} />
      </mesh>
      {/* Inner glow */}
      <mesh>
        <circleGeometry args={[2.3, 64]} />
        <meshBasicMaterial color="#00D9FF" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
      <Sparkles count={80} scale={5} size={2} speed={0.3} color="#00D9FF" />
      {label && (
        <Text position={[0, 3.2, 0]} fontSize={0.3} color="#00D9FF" anchorX="center">
          {label}
        </Text>
      )}
    </group>
  );
}

function InteractiveOrb({ position, color, locked, onClick }: {
  position: [number, number, number]; color: string; locked?: boolean; onClick: () => void;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((s) => { if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.8; });

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={locked ? undefined : onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered && !locked ? 1.2 : 1}
    >
      <icosahedronGeometry args={[0.5, 2]} />
      <meshStandardMaterial
        color={locked ? '#4b5563' : color}
        emissive={locked ? '#1f2937' : color}
        emissiveIntensity={hovered && !locked ? 2 : 0.5}
        transparent
        opacity={locked ? 0.4 : 0.8}
        wireframe={locked}
      />
    </mesh>
  );
}

function EnvLighting({ type }: { type: string }) {
  const envMap: Record<string, { fog: string; light: string; ambient: number; preset: 'night' | 'forest' | 'warehouse' | 'sunset' }> = {
    quantum: { fog: '#080818', light: '#00D9FF', ambient: 0.25, preset: 'night' },
    forest: { fog: '#081a08', light: '#90EE90', ambient: 0.35, preset: 'forest' },
    cosmic: { fog: '#030308', light: '#C0C0FF', ambient: 0.15, preset: 'night' },
    crystal: { fog: '#180818', light: '#FF6B6B', ambient: 0.4, preset: 'warehouse' },
  };
  const c = envMap[type] || envMap.quantum;
  const particleCount = useXRStore((s) => s.sceneConfig.particleCount);

  return (
    <>
      <fog attach="fog" args={[c.fog, 15, 120]} />
      <ambientLight intensity={c.ambient} />
      <pointLight position={[10, 30, 10]} intensity={2} color={c.light} castShadow />
      <pointLight position={[-15, 15, -15]} intensity={0.6} color="#9945FF" />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#ffffff" />
      {type === 'cosmic' && <Stars radius={150} depth={80} count={Math.min(particleCount * 3, 8000)} factor={5} saturation={0.6} fade speed={0.8} />}
      <Environment preset={c.preset} />
      <Sparkles count={Math.min(particleCount, 400)} scale={80} size={2} speed={0.15} color="#00D9FF" />
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

interface DreamSpaceViewerProps {
  environment: 'quantum' | 'forest' | 'cosmic' | 'crystal';
  spaceName?: string;
  spaceId?: string;
  onExit?: () => void;
}

const kaos = new KAOSAudioSystem();

export function DreamSpaceViewer({ environment, spaceName, spaceId, onExit }: DreamSpaceViewerProps) {
  const [audioOn, setAudioOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [sessionStart] = useState(Date.now());
  const [sessionDuration, setSessionDuration] = useState(0);
  const fps = useXRStore((s) => s.fps);
  const quality = useXRStore((s) => s.sceneConfig.quality);
  const containerRef = useRef<HTMLDivElement>(null);

  // ─── Functional hooks ──────────────────────────────────────────────────
  const resolvedSpaceId = spaceId || `scene-${environment}`;
  const { remoteUsers, connected, updatePosition, userCount } = useXRPresence(resolvedSpaceId, spaceName);
  const { permissions, role } = useXRPermissions();
  const { logEvent } = useXRIntegrity();

  // Session timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStart) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStart]);

  // Log join event (strong consistency — critical)
  useEffect(() => {
    logEvent('space_join', { spaceId: resolvedSpaceId, environment, spaceName }, 'info');
    return () => {
      logEvent('space_leave', { spaceId: resolvedSpaceId, sessionDuration: Math.floor((Date.now() - sessionStart) / 1000) }, 'info');
    };
  }, [resolvedSpaceId]);

  // KAOS audio lifecycle
  useEffect(() => {
    if (audioOn) {
      kaos.initialize().then(() => {
        kaos.playEnvironment(environment as AudioEnvironment);
        kaos.playBinauralPreset(
          environment === 'cosmic' ? 'meditate' : environment === 'forest' ? 'relax' : 'focus',
          0
        );
      });
    } else {
      kaos.stopBinaural();
      kaos.stopEnvironment();
    }
    return () => { kaos.stopBinaural(); kaos.stopEnvironment(); };
  }, [audioOn, environment]);

  const handlePositionUpdate = useCallback((pos: [number, number, number]) => {
    updatePosition(pos);
  }, [updatePosition]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  };

  const handleOrbInteract = async () => {
    if (!permissions.canInteractObjects) {
      toast.error('No tienes permisos para interactuar con objetos en este espacio.');
      logEvent('permission_denied', { action: 'object_interact', role }, 'warning');
      return;
    }
    if (!audioOn) setAudioOn(true);
    await kaos.playNotification('celebration', { x: 0, y: 0, z: -2 });
    logEvent('object_interact', { object: 'audio_orb', environment }, 'info');
  };

  const handleExit = () => {
    logEvent('space_leave', {
      spaceId: resolvedSpaceId,
      sessionDuration,
      environment,
    }, 'info');
    onExit?.();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-background">
      {/* ─── 3D Canvas ────────────────────────────────────────────────────── */}
      <Canvas
        camera={{ position: [0, 2, 10], fov: 75 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <XRPerformanceMonitor />
        <EnvLighting type={environment} />
        <FirstPersonController speed={5} onPositionUpdate={handlePositionUpdate} />
        <OrbitControls enablePan enableZoom minDistance={2} maxDistance={60} maxPolarAngle={Math.PI / 2} />
        <Ground />

        {/* Local avatar indicator */}
        <LocalAvatar />

        {/* Remote avatars (eventual consistency — smooth interpolation) */}
        {remoteUsers.map((u) => (
          <RemoteAvatar key={u.userId} presence={u} />
        ))}

        {/* Portals */}
        <Portal position={[0, 2, -25]} label="Portal Federado" />
        <Portal position={[20, 2, 0]} label="Nexo Cuántico" />

        {/* Interactive objects (permission-gated) */}
        <InteractiveOrb position={[-6, 1, 6]} color="#9945FF" locked={!permissions.canInteractObjects} onClick={handleOrbInteract} />
        <InteractiveOrb position={[12, 1, -6]} color="#FFD700" locked={!permissions.canInteractObjects} onClick={handleOrbInteract} />
        <InteractiveOrb position={[0, 2, -10]} color="#00D9FF" locked={!permissions.canInteractObjects} onClick={handleOrbInteract} />
      </Canvas>

      {/* ─── HUD Overlay ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top bar */}
        <div className="flex items-start justify-between p-4 pointer-events-auto">
          {/* Left: space info + controls */}
          <div className="bg-card/85 backdrop-blur-lg border border-border/30 p-4 rounded-xl space-y-1.5 shadow-lg">
            <div className="flex items-center gap-2">
              <h3 className="text-primary font-bold text-sm tracking-wider uppercase">{spaceName || 'DreamSpace'}</h3>
              {connected ? (
                <Wifi className="w-3 h-3 text-green-400" />
              ) : (
                <WifiOff className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">W/A/S/D — Movimiento · Mouse — Cámara · Scroll — Zoom</p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 bg-muted/30">
                <Shield className="w-2.5 h-2.5" />
                {role}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-1 bg-muted/30">
                {permissions.canInteractObjects ? <Unlock className="w-2.5 h-2.5 text-green-400" /> : <Lock className="w-2.5 h-2.5 text-muted-foreground" />}
                {permissions.interactionLevel}
              </Badge>
            </div>
          </div>

          {/* Right: metrics */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-card/85 backdrop-blur-lg border-border/30 gap-1">
                <Activity className="w-3 h-3" />
                <span className={fps >= 45 ? 'text-green-400' : fps >= 30 ? 'text-yellow-400' : 'text-red-400'}>
                  {fps} FPS
                </span>
              </Badge>
              <Badge variant="outline" className="bg-card/85 backdrop-blur-lg border-border/30 uppercase text-[10px]">
                LOD: {quality}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-card/85 backdrop-blur-lg border-border/30 gap-1">
                <Users className="w-3 h-3" /> {userCount} en línea
              </Badge>
              <Badge variant="outline" className="bg-card/85 backdrop-blur-lg border-border/30 gap-1">
                <Eye className="w-3 h-3" /> {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Isabella XR Guide (cognitive safety + contextual tips) */}
        <IsabellaXRGuide
          environment={environment}
          userCount={userCount}
          fps={fps}
          sessionDuration={sessionDuration}
        />

        {/* Bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-auto">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="bg-card/85 backdrop-blur-lg gap-1" onClick={() => setAudioOn(!audioOn)}>
              {audioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-xs">{audioOn ? 'KAOS ON' : 'KAOS OFF'}</span>
            </Button>
            <Button size="sm" variant="outline" className="bg-card/85 backdrop-blur-lg" onClick={toggleFullscreen}>
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>

          {onExit && (
            <Button size="sm" variant="destructive" onClick={handleExit} className="gap-1 shadow-lg">
              <X className="w-4 h-4" /> Salir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
