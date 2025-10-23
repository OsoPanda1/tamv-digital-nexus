import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import Navigation from '@/components/Navigation';
import { HolographicPanel, HolographicButton, QuantumBadge } from '@/components/HolographicUI';
import { Sparkles, Users, Lock, Globe, Headphones } from 'lucide-react';
import { useQuantumState } from '@/hooks/useQuantumState';
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
}

const mockSpaces: DreamSpace[] = [
  {
    id: '1',
    name: 'Plaza Cuántica Central',
    description: 'Espacio público de encuentro y co-creación colectiva',
    participants: 47,
    maxParticipants: 100,
    isPublic: true,
    environment: 'quantum',
    coherenceRequired: 0
  },
  {
    id: '2',
    name: 'Bosque de Meditación',
    description: 'Espacio sensorial para introspección y conexión emocional',
    participants: 12,
    maxParticipants: 30,
    isPublic: true,
    environment: 'forest',
    coherenceRequired: 20
  },
  {
    id: '3',
    name: 'Sala de Colaboración Pro',
    description: 'Workspace privado con herramientas avanzadas',
    participants: 8,
    maxParticipants: 20,
    isPublic: false,
    environment: 'crystal',
    coherenceRequired: 60
  },
  {
    id: '4',
    name: 'Observatorio Cósmico',
    description: 'Experiencia astronómica inmersiva con visualización de datos reales',
    participants: 23,
    maxParticipants: 50,
    isPublic: true,
    environment: 'cosmic',
    coherenceRequired: 40
  }
];

function SpaceEnvironment({ type }: { type: DreamSpace['environment'] }) {
  switch (type) {
    case 'cosmic':
      return (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Sky sunPosition={[0, 1, 0]} />
        </>
      );
    case 'quantum':
      return (
        <>
          <fog attach="fog" args={['#0a0a1a', 10, 50]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
        </>
      );
    default:
      return <ambientLight intensity={0.5} />;
  }
}

export default function DreamSpaces() {
  const [spaces, setSpaces] = useState<DreamSpace[]>(mockSpaces);
  const [selectedSpace, setSelectedSpace] = useState<DreamSpace | null>(null);
  const { user, quantumCoherence, activateDreamSpace } = useQuantumState();

  const handleEnterSpace = (space: DreamSpace) => {
    if (!user) {
      toast.error('Debes iniciar sesión para entrar a un Dream Space');
      return;
    }

    if (quantumCoherence < space.coherenceRequired) {
      toast.error(
        `Necesitas ${space.coherenceRequired} de coherencia cuántica. Actual: ${quantumCoherence}`
      );
      return;
    }

    if (!space.isPublic && user.role === 'public') {
      toast.error('Este espacio requiere membresía Pro o Creator');
      return;
    }

    activateDreamSpace(space.id);
    setSelectedSpace(space);
    toast.success(`Entrando a ${space.name}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navigation />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Dream Spaces
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Espacios multisensoriales de co-creación, meditación y colaboración en tiempo real
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
            <QuantumBadge color="primary">
              Coherencia: {quantumCoherence}%
            </QuantumBadge>
            <QuantumBadge color="secondary">
              {user?.role || 'Invitado'}
            </QuantumBadge>
          </div>
        </div>

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

              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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
              </div>

              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-quantum-gradient h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(space.participants / space.maxParticipants) * 100}%` }}
                />
              </div>

              <HolographicButton
                variant="primary"
                onClick={() => handleEnterSpace(space)}
                className="w-full"
              >
                Entrar al Espacio
              </HolographicButton>
            </HolographicPanel>
          ))}
        </div>

        {selectedSpace && (
          <HolographicPanel className="p-8">
            <h2 className="text-3xl font-bold mb-6">
              {selectedSpace.name}
            </h2>
            
            <div className="h-96 rounded-xl overflow-hidden">
              <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
                <SpaceEnvironment type={selectedSpace.environment} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground mb-4">
                Estás conectado a {selectedSpace.name} con {selectedSpace.participants} participantes
              </p>
              <HolographicButton
                variant="secondary"
                onClick={() => setSelectedSpace(null)}
              >
                Salir del Espacio
              </HolographicButton>
            </div>
          </HolographicPanel>
        )}
      </div>
    </div>
  );
}
