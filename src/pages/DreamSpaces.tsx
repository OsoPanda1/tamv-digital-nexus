import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { HolographicPanel, HolographicButton, QuantumBadge } from '@/components/HolographicUI';
import { DreamSpaceViewer } from '@/components/dreamspaces/DreamSpaceViewer';
import { Sparkles, Users, Lock, Globe, Headphones, Volume2, Play } from 'lucide-react';
import { useQuantumState } from '@/hooks/useQuantumState';
import { binauralAudio } from '@/utils/binauralAudio';
import { toast } from 'sonner';

interface DreamSpace {
  id: string;
  name: string;
  description: string;
  participants: number;
  maxParticipants: number;
  isPublic: boolean;
  environment: 'quantum' | 'forest' | 'cosmic' | 'crystal';
  coherenceRequired: number;
  audioType: 'binaural' | 'ambient' | 'interactive';
}

const mockSpaces: DreamSpace[] = [
  {
    id: '1',
    name: 'Plaza Cuántica Central',
    description: 'Espacio público de encuentro y co-creación colectiva con audio espacial 3D',
    participants: 47,
    maxParticipants: 100,
    isPublic: true,
    environment: 'quantum',
    coherenceRequired: 0,
    audioType: 'binaural'
  },
  {
    id: '2',
    name: 'Bosque de Meditación',
    description: 'Espacio sensorial para introspección con ondas theta binaurales',
    participants: 12,
    maxParticipants: 30,
    isPublic: true,
    environment: 'forest',
    coherenceRequired: 20,
    audioType: 'ambient'
  },
  {
    id: '3',
    name: 'Sala de Colaboración Pro',
    description: 'Workspace privado con herramientas avanzadas y audio reactivo',
    participants: 8,
    maxParticipants: 20,
    isPublic: false,
    environment: 'crystal',
    coherenceRequired: 60,
    audioType: 'interactive'
  },
  {
    id: '4',
    name: 'Observatorio Cósmico',
    description: 'Experiencia astronómica inmersiva con sonido espacial envolvente',
    participants: 23,
    maxParticipants: 50,
    isPublic: true,
    environment: 'cosmic',
    coherenceRequired: 40,
    audioType: 'binaural'
  }
];

export default function DreamSpaces() {
  const [spaces] = useState<DreamSpace[]>(mockSpaces);
  const [selectedSpace, setSelectedSpace] = useState<DreamSpace | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { user, quantumCoherence, activateDreamSpace } = useQuantumState();

  const handleEnterSpace = async (space: DreamSpace) => {
    if (!user) {
      toast.error('Debes iniciar sesión para entrar a un Dream Space');
      return;
    }

    if (quantumCoherence < space.coherenceRequired) {
      toast.error(
        `Necesitas ${space.coherenceRequired}% de coherencia cuántica. Actual: ${quantumCoherence}%`
      );
      return;
    }

    if (!space.isPublic && user.role === 'public') {
      toast.error('Este espacio requiere membresía Pro o Creator');
      return;
    }

    // Play entrance sound
    await binauralAudio.playNotificationSound('celebration', { x: 0, y: 0, z: -1 });

    activateDreamSpace(space.id);
    setSelectedSpace(space);
    setIsFullscreen(true);
    toast.success(`Entrando a ${space.name}... 🌟`);
  };

  const handleExitSpace = async () => {
    await binauralAudio.playNotificationSound('system', { x: 0, y: 0, z: 1 });
    setSelectedSpace(null);
    setIsFullscreen(false);
  };

  const handleTestAudio = async (type: 'binaural' | 'ambient' | 'interactive') => {
    toast.info('Reproduciendo audio de prueba...');
    if (type === 'binaural') {
      await binauralAudio.playBinauralBeat(10, 3000); // Theta waves
    } else {
      await binauralAudio.playNotificationSound('celebration', { x: 0, y: 0, z: -1 });
    }
  };

  // Fullscreen 3D view
  if (selectedSpace && isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <DreamSpaceViewer
          environment={selectedSpace.environment}
          onExit={handleExitSpace}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dream Spaces
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Espacios multisensoriales 3D con navegación libre, avatares interactivos y audio espacial binaural
          </p>
          
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <QuantumBadge color="primary">
              Coherencia: {quantumCoherence}%
            </QuantumBadge>
            <QuantumBadge color="secondary">
              {user?.role || 'Invitado'}
            </QuantumBadge>
            <QuantumBadge color="accent">
              🎧 Audio Binaural HRTF
            </QuantumBadge>
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {spaces.map((space) => (
            <HolographicPanel key={space.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{space.name}</h3>
                  <p className="text-muted-foreground">{space.description}</p>
                </div>
                {space.isPublic ? (
                  <Globe className="w-6 h-6 text-primary" />
                ) : (
                  <Lock className="w-6 h-6 text-accent" />
                )}
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{space.participants}/{space.maxParticipants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Req: {space.coherenceRequired}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4" />
                  <span className="capitalize">{space.environment}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  <span className="capitalize">{space.audioType}</span>
                </div>
              </div>

              {/* Capacity bar */}
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-quantum-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(space.participants / space.maxParticipants) * 100}%` }}
                />
              </div>

              <div className="flex gap-3">
                <HolographicButton
                  variant="primary"
                  onClick={() => handleEnterSpace(space)}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2 inline" />
                  Entrar al Espacio
                </HolographicButton>
                <HolographicButton
                  variant="ghost"
                  onClick={() => handleTestAudio(space.audioType)}
                >
                  <Volume2 className="w-4 h-4" />
                </HolographicButton>
              </div>
            </HolographicPanel>
          ))}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Audio Binaural 3D</h3>
            <p className="text-muted-foreground text-sm">
              Sistema HRTF para audio espacial inmersivo que responde a tu posición en el espacio
            </p>
          </HolographicPanel>

          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Avatares Interactivos</h3>
            <p className="text-muted-foreground text-sm">
              Presencia en tiempo real con avatares 3D que responden a emociones y movimientos
            </p>
          </HolographicPanel>

          <HolographicPanel className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-xl font-bold mb-2">Navegación Libre</h3>
            <p className="text-muted-foreground text-sm">
              Controles WASD para movimiento fluido y exploración libre del entorno 3D
            </p>
          </HolographicPanel>
        </div>
      </div>
    </div>
  );
}
