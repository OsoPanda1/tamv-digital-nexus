import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { ThreeSceneManager } from '@/systems/ThreeSceneManager';
import { QuantumSphere, QuantumPortal, FloatingCrystal } from '@/systems/QuantumObjects';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Maximize2, Settings } from 'lucide-react';

/**
 * Página de Espacios 3D Interactivos
 * Demo de DreamSpaces con objetos cuánticos
 */
const ThreeDSpace = () => {
  const [selectedScene, setSelectedScene] = useState<'quantum' | 'portal' | 'crystals'>('quantum');

  const scenes = {
    quantum: (
      <>
        <QuantumSphere position={[0, 0, 0]} color="#a78bfa" />
        <QuantumSphere position={[3, 1, -2]} color="#06b6d4" />
        <QuantumSphere position={[-3, -1, -1]} color="#f472b6" />
      </>
    ),
    portal: (
      <>
        <QuantumPortal position={[0, 0, 0]} />
        <QuantumSphere position={[0, 0, -5]} color="#fbbf24" />
      </>
    ),
    crystals: (
      <>
        <FloatingCrystal position={[0, 2, 0]} color="#06b6d4" />
        <FloatingCrystal position={[2, 0, -2]} color="#a78bfa" />
        <FloatingCrystal position={[-2, -1, -1]} color="#f472b6" />
        <FloatingCrystal position={[0, -2, -3]} color="#fbbf24" />
      </>
    )
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Espacios 3D Cuánticos
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora entornos tridimensionales interactivos con objetos cuánticos y física avanzada
            </p>
          </div>

          {/* Selector de Escenas */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={selectedScene === 'quantum' ? 'default' : 'outline'}
              onClick={() => setSelectedScene('quantum')}
              className="gap-2"
            >
              <Badge>3D</Badge>
              Esferas Cuánticas
            </Button>
            <Button
              variant={selectedScene === 'portal' ? 'default' : 'outline'}
              onClick={() => setSelectedScene('portal')}
              className="gap-2"
            >
              <Badge>XR</Badge>
              Portal Quantum
            </Button>
            <Button
              variant={selectedScene === 'crystals' ? 'default' : 'outline'}
              onClick={() => setSelectedScene('crystals')}
              className="gap-2"
            >
              <Badge>VR</Badge>
              Cristales Flotantes
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Escena 3D */}
            <div className="lg:col-span-2">
              <Card className="glass-panel p-4 h-[600px] relative overflow-hidden">
                <ThreeSceneManager
                  camera={{ position: [0, 0, 8], fov: 60 }}
                  enableOrbitControls={true}
                  showStars={true}
                  environment="sunset"
                >
                  {scenes[selectedScene]}
                </ThreeSceneManager>
              </Card>
            </div>

            {/* Panel de Control */}
            <div className="space-y-6">
              <Card className="glass-panel p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Controles
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rotación</p>
                    <p className="text-sm">Click izquierdo + arrastrar</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Zoom</p>
                    <p className="text-sm">Scroll del mouse</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Pan</p>
                    <p className="text-sm">Click derecho + arrastrar</p>
                  </div>
                  <Button className="w-full gap-2" variant="outline">
                    <Maximize2 className="w-4 h-4" />
                    Modo Pantalla Completa
                  </Button>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="text-xl font-bold mb-4">Detalles de la Escena</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objetos</span>
                    <span className="font-bold">
                      {selectedScene === 'quantum' ? '3' : selectedScene === 'portal' ? '2' : '4'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Polígonos</span>
                    <span className="font-bold">~12,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">FPS</span>
                    <span className="font-bold text-green-400">60</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Render</span>
                    <span className="font-bold">WebGL 2.0</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="text-xl font-bold mb-4">Tecnologías</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Three.js</Badge>
                  <Badge>React Three Fiber</Badge>
                  <Badge>WebGL</Badge>
                  <Badge>GSAP</Badge>
                  <Badge>drei</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Información Adicional */}
          <Card className="glass-panel p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Acerca de los DreamSpaces 3D</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-2">Interactividad Real-Time</h3>
                <p className="text-sm text-muted-foreground">
                  Los objetos responden a tu interacción con física y animaciones fluidas a 60 FPS.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Optimización Avanzada</h3>
                <p className="text-sm text-muted-foreground">
                  Renderizado eficiente con GPU acceleration y lazy loading de assets.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Compatible XR</h3>
                <p className="text-sm text-muted-foreground">
                  Preparado para realidad virtual (VR) y realidad aumentada (AR) con WebXR API.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThreeDSpace;