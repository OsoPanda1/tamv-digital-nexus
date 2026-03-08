// ============================================================================
// TAMV MD-X4™ — Metaverse Hub v2.0 (Functional)
// Interactive 3D scene selector that launches DreamSpaces
// ============================================================================

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ThreeSceneManager } from '@/systems/ThreeSceneManager';
import { QuantumSphere, QuantumPortal, FloatingCrystal } from '@/systems/QuantumObjects';
import { DreamSpaceViewer } from '@/components/dreamspaces/DreamSpaceViewer';
import { useXRStore } from '@/stores/xrStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play, Activity, Headphones, Globe, Compass, ArrowLeft } from 'lucide-react';

type SceneKey = 'quantum' | 'forest' | 'cosmic' | 'crystal';

const SCENES: { key: SceneKey; title: string; desc: string; color: string }[] = [
  { key: 'quantum', title: 'Campo Cuántico', desc: 'Partículas y distorsión cuántica con audio theta', color: 'text-primary' },
  { key: 'forest', title: 'Bosque Sensorial', desc: 'Entorno inmersivo con sonidos naturales', color: 'text-green-400' },
  { key: 'cosmic', title: 'Espacio Profundo', desc: 'Nebulosas y binaural delta meditativo', color: 'text-indigo-400' },
  { key: 'crystal', title: 'Caverna Cristalina', desc: 'Resonancia 432 Hz en geometría cristalina', color: 'text-rose-400' },
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

  // ─── Immersive DreamSpace ────────────────────────────────────────────
  if (immersive) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <DreamSpaceViewer environment={selected} spaceName={SCENES.find((s) => s.key === selected)?.title} onExit={() => setImmersive(false)} />
      </div>
    );
  }

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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Motor MD-X4™ · Pipeline dual datos + sensorial · Audio KAOS 432 Hz
          </p>
        </div>

        {/* Scene selector */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {SCENES.map((s) => (
            <Button key={s.key} variant={selected === s.key ? 'default' : 'outline'} size="sm" onClick={() => setSelected(s.key)} className="gap-2">
              <Sparkles className={`w-3 h-3 ${s.color}`} />
              {s.title}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 3D Preview */}
          <div className="lg:col-span-2">
            <Card className="border-border/30 p-1 h-[500px] relative overflow-hidden">
              <ThreeSceneManager camera={{ position: [0, 0, 8], fov: 60 }} enableOrbitControls showStars environment="sunset">
                {sceneObjects[selected]}
              </ThreeSceneManager>

              {/* Overlay CTA */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <Badge variant="outline" className="bg-card/80 backdrop-blur-md gap-1">
                  <Activity className="w-3 h-3" /> Modo Preview
                </Badge>
                <Button onClick={() => setImmersive(true)} className="gap-2 shadow-lg">
                  <Play className="w-4 h-4" /> Entrar en Inmersión
                </Button>
              </div>
            </Card>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="border-border/30 p-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {SCENES.find((s) => s.key === selected)?.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{SCENES.find((s) => s.key === selected)?.desc}</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Render</span><span className="font-mono">WebGL 2.0</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Audio</span><span className="font-mono">KAOS HRTF</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Consistencia</span><span className="font-mono">Fuerte / Eventual</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Seguridad</span><span className="font-mono">PQC Ready</span></div>
              </div>
            </Card>

            <Card className="border-border/30 p-6">
              <h3 className="text-lg font-bold mb-3">Capacidades XR/4D</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Sincronización multiusuario</li>
                <li className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" /> Audio binaural 3D (HRTF)</li>
                <li className="flex items-center gap-2"><Activity className="w-4 h-4 text-primary" /> LOD auto-adaptativo por FPS</li>
                <li className="flex items-center gap-2"><Compass className="w-4 h-4 text-primary" /> Navegación WASD + pointer lock</li>
              </ul>
            </Card>

            <Card className="border-border/30 p-6">
              <h3 className="text-lg font-bold mb-3">Stack Técnico</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Three.js</Badge>
                <Badge variant="secondary">R3F</Badge>
                <Badge variant="secondary">KAOS 432Hz</Badge>
                <Badge variant="secondary">WebGL</Badge>
                <Badge variant="secondary">GSAP</Badge>
                <Badge variant="secondary">Zustand</Badge>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
