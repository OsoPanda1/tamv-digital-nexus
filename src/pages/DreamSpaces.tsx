// ============================================================================
// TAMV MD-X4™ — DreamSpaces v2.0 (Functional)
// Real data from Lovable Cloud + immersive 3D viewer + KAOS audio
// ============================================================================

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { DreamSpaceViewer } from '@/components/dreamspaces/DreamSpaceViewer';
import { useDreamSpaces, type DreamSpaceRow } from '@/hooks/useDreamSpaces';
import { useQuantumState } from '@/hooks/useQuantumState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Users, Lock, Globe, Headphones, Volume2, Play, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type XREnv = 'quantum' | 'forest' | 'cosmic' | 'crystal';

const ENV_COLORS: Record<string, string> = {
  quantum: 'from-primary/20 to-secondary/10',
  forest: 'from-green-900/30 to-emerald-800/10',
  cosmic: 'from-indigo-900/30 to-violet-800/10',
  crystal: 'from-rose-900/30 to-amber-800/10',
};

function resolveEnv(theme: string | null): XREnv {
  if (['quantum', 'forest', 'cosmic', 'crystal'].includes(theme || '')) return theme as XREnv;
  return 'quantum';
}

export default function DreamSpaces() {
  const { spaces, loading, error } = useDreamSpaces();
  const { user, quantumCoherence } = useQuantumState();
  const [activeSpace, setActiveSpace] = useState<DreamSpaceRow | null>(null);

  const handleEnter = (space: DreamSpaceRow) => {
    if (!user) {
      toast.error('Inicia sesión para entrar a un DreamSpace');
      return;
    }
    if ((space.current_participants ?? 0) >= (space.max_participants ?? 100)) {
      toast.error('Este espacio está lleno');
      return;
    }
    setActiveSpace(space);
    toast.success(`Entrando a ${space.name}…`);
  };

  // ─── Fullscreen 3D Mode ────────────────────────────────────────────────
  if (activeSpace) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <DreamSpaceViewer
          environment={resolveEnv(activeSpace.theme)}
          spaceName={activeSpace.name}
          spaceId={activeSpace.id}
          onExit={() => setActiveSpace(null)}
        />
      </div>
    );
  }

  // ─── Listing ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              DreamSpaces
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entornos inmersivos 3D con audio espacial binaural KAOS, avatares y consistencia adaptable en tiempo real.
          </p>
          <div className="flex justify-center gap-3 mt-6 flex-wrap">
            <Badge variant="outline" className="gap-1 bg-card/50"><Sparkles className="w-3 h-3" /> Coherencia: {quantumCoherence}%</Badge>
            <Badge variant="outline" className="gap-1 bg-card/50"><Headphones className="w-3 h-3" /> KAOS 432 Hz</Badge>
            <Badge variant="outline" className="gap-1 bg-card/50"><Users className="w-3 h-3" /> Multiusuario</Badge>
          </div>
        </div>

        {/* Error */}
        {error && <p className="text-destructive text-center mb-8">Error al cargar espacios: {error}</p>}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && spaces.length === 0 && (
          <Card className="max-w-lg mx-auto p-12 text-center border-border/30">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Sin DreamSpaces activos</h3>
            <p className="text-muted-foreground">Crea el primer entorno inmersivo desde el panel de administración.</p>
          </Card>
        )}

        {/* Spaces Grid */}
        {!loading && spaces.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {spaces.map((space) => {
              const env = resolveEnv(space.theme);
              const cap = space.max_participants ?? 100;
              const cur = space.current_participants ?? 0;
              const pct = Math.min(100, (cur / cap) * 100);
              const isPublic = space.access_level === 'public';

              return (
                <Card
                  key={space.id}
                  className={`relative overflow-hidden border-border/30 bg-gradient-to-br ${ENV_COLORS[env] || ENV_COLORS.quantum} backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/10`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">{space.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{space.description || 'Espacio inmersivo TAMV'}</p>
                      </div>
                      {isPublic ? <Globe className="w-5 h-5 text-primary shrink-0" /> : <Lock className="w-5 h-5 text-accent shrink-0" />}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {cur}/{cap}</span>
                      <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {env}</span>
                      <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> {space.space_type || 'binaural'}</span>
                    </div>

                    {/* Capacity */}
                    <Progress value={pct} className="h-1.5 mb-5" />

                    <Button className="w-full gap-2" onClick={() => handleEnter(space)}>
                      <Play className="w-4 h-4" /> Entrar al Espacio
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Headphones, title: 'Audio Binaural KAOS', desc: 'HRTF espacial 432 Hz con presets theta, alpha y gamma para inmersión cognitiva.' },
            { icon: Users, title: 'Presencia Multiusuario', desc: 'Avatares 3D con consistencia eventual para animaciones y fuerte para accesos.' },
            { icon: Globe, title: 'Navegación Libre (WASD)', desc: 'Controles de primera persona con LOD adaptativo y monitoreo de FPS en tiempo real.' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="p-6 border-border/30 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
