// ============================================================================
// TAMV MD-X4™ — Metaverse Hub v3.0 (Full XR Stack)
// Interactive scene selector with live presence, permissions, MSR integrity
// ============================================================================

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ThreeSceneManager } from '@/systems/ThreeSceneManager';
import { QuantumSphere, QuantumPortal, FloatingCrystal } from '@/systems/QuantumObjects';
import { DreamSpaceViewer } from '@/components/dreamspaces/DreamSpaceViewer';
import { useXRStore } from '@/stores/xrStore';
import { useXRPermissions } from '@/hooks/useXRPermissions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, Play, Activity, Headphones, Globe, Compass,
  Shield, Lock, Unlock, Users, Cpu, Layers, Wifi,
} from 'lucide-react';

type SceneKey = 'quantum' | 'forest' | 'cosmic' | 'crystal';

const SCENES: { key: SceneKey; title: string; desc: string; icon: typeof Sparkles; gradient: string }[] = [
  { key: 'quantum', title: 'Campo Cuántico', desc: 'Partículas y distorsión cuántica con audio theta binaural', icon: Sparkles, gradient: 'from-primary/20 to-secondary/10' },
  { key: 'forest', title: 'Bosque Sensorial', desc: 'Entorno inmersivo con sonidos naturales y cristales orgánicos', icon: Globe, gradient: 'from-green-900/20 to-emerald-800/10' },
  { key: 'cosmic', title: 'Espacio Profundo', desc: 'Nebulosas procedurales y binaural delta meditativo', icon: Compass, gradient: 'from-indigo-900/20 to-violet-800/10' },
  { key: 'crystal', title: 'Caverna Cristalina', desc: 'Resonancia 432 Hz en geometría cristalina fractal', icon: Layers, gradient: 'from-rose-900/20 to-amber-800/10' },
];

const sceneObjects: Record<SceneKey, JSX.Element> = {
  quantum: (
    <>
      <QuantumSphere position={[0, 0, 0]} color="#a78bfa" />
      <QuantumSphere position={[3, 1, -2]} color="#06b6d4" />
      <QuantumSphere position={[-3, -1, -1]} color="#f472b6" />
    </>
  ),
  forest: (
    <>
      <FloatingCrystal position={[0, 1, 0]} color="#22c55e" />
      <FloatingCrystal position={[2, 0.5, -2]} color="#16a34a" />
      <QuantumSphere position={[-2, 0, 1]} color="#86efac" />
    </>
  ),
  cosmic: (
    <>
      <QuantumPortal position={[0, 0, 0]} />
      <QuantumSphere position={[0, 0, -5]} color="#818cf8" />
      <FloatingCrystal position={[3, 2, -3]} color="#c4b5fd" />
    </>
  ),
  crystal: (
    <>
      <FloatingCrystal position={[0, 2, 0]} color="#f43f5e" />
      <FloatingCrystal position={[2, 0, -2]} color="#fb923c" />
      <FloatingCrystal position={[-2, -1, -1]} color="#fbbf24" />
      <FloatingCrystal position={[0, -2, -3]} color="#f472b6" />
    </>
  ),
};

export default function Metaverse() {
  const [selected, setSelected] = useState<SceneKey>('quantum');
  const [immersive, setImmersive] = useState(false);
  const fps = useXRStore((s) => s.fps);
  const { permissions, role } = useXRPermissions();

  // ─── Immersive DreamSpace ────────────────────────────────────────────
  if (immersive) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <DreamSpaceViewer
          environment={selected}
          spaceName={SCENES.find((s) => s.key === selected)?.title}
          spaceId={`metaverse-${selected}`}
          onExit={() => setImmersive(false)}
        />
      </div>
    );
  }

  const currentScene = SCENES.find((s) => s.key === selected)!;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Metaverso TAMV
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Dominio Social / XR / 4D · Arquitectura federada de microservicios · Consistencia adaptable
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="gap-1 bg-card/50"><Shield className="w-3 h-3" /> PQC Ready</Badge>
            <Badge variant="outline" className="gap-1 bg-card/50"><Wifi className="w-3 h-3" /> Sync Multiusuario</Badge>
            <Badge variant="outline" className="gap-1 bg-card/50"><Cpu className="w-3 h-3" /> MSR Integrity</Badge>
            <Badge variant="outline" className="gap-1 bg-card/50">
              {permissions.canInteractObjects ? <Unlock className="w-3 h-3 text-green-400" /> : <Lock className="w-3 h-3" />}
              Rol: {role}
            </Badge>
          </div>
        </div>

        {/* Scene selector cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {SCENES.map((s) => {
            const Icon = s.icon;
            const isActive = selected === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSelected(s.key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border/30 bg-card/50 hover:border-primary/30 hover:bg-card/80'
                }`}
              >
                <Icon className={`w-5 h-5 mb-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <h4 className={`text-sm font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{s.desc}</p>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <Card className={`border-border/30 p-1 h-[500px] relative overflow-hidden bg-gradient-to-br ${currentScene.gradient}`}>
              <ThreeSceneManager camera={{ position: [0, 0, 8], fov: 60 }} enableOrbitControls showStars environment="sunset">
                {sceneObjects[selected]}
              </ThreeSceneManager>

              {/* Overlay CTA */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-card/80 backdrop-blur-md gap-1">
                    <Activity className="w-3 h-3" /> Preview
                  </Badge>
                  <Badge variant="outline" className="bg-card/80 backdrop-blur-md gap-1">
                    <Users className="w-3 h-3" /> Multiusuario
                  </Badge>
                </div>
                <Button onClick={() => setImmersive(true)} className="gap-2 shadow-lg">
                  <Play className="w-4 h-4" /> Entrar en Inmersión
                </Button>
              </div>
            </Card>
          </div>

          {/* Info Panels */}
          <div className="space-y-5">
            <Card className="border-border/30 p-5">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <currentScene.icon className="w-5 h-5 text-primary" />
                {currentScene.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{currentScene.desc}</p>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Render</span><span className="font-mono text-xs">WebGL 2.0 + LOD Auto</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Audio</span><span className="font-mono text-xs">KAOS HRTF 432Hz</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Consistencia</span><span className="font-mono text-xs">Fuerte + Eventual</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Seguridad</span><span className="font-mono text-xs">PQC · MSR · AVIXA</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">IA</span><span className="font-mono text-xs">Isabella Guía XR</span></div>
              </div>
            </Card>

            <Card className="border-border/30 p-5">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Arquitectura Funcional</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-primary" /> Sincronización de escenas en tiempo real</li>
                <li className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-primary" /> Presencia multiusuario con avatares 3D</li>
                <li className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-primary" /> Permisos de interacción por rol</li>
                <li className="flex items-center gap-2"><Headphones className="w-3.5 h-3.5 text-primary" /> Audio binaural 3D espacial (HRTF)</li>
                <li className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-primary" /> LOD auto-adaptativo por FPS</li>
                <li className="flex items-center gap-2"><Compass className="w-3.5 h-3.5 text-primary" /> Isabella: seguridad cognitiva en XR</li>
              </ul>
            </Card>

            <Card className="border-border/30 p-5">
              <h3 className="text-sm font-bold mb-3 uppercase tracking-wider text-muted-foreground">Stack Técnico</h3>
              <div className="flex flex-wrap gap-1.5">
                {['Three.js', 'R3F', 'KAOS 432Hz', 'WebGL 2.0', 'GSAP', 'Zustand', 'Supabase RT', 'MSR Ledger', 'HRTF', 'Isabella AI'].map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
