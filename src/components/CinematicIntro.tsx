import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function QuantumParticlesIntro() {
  const ref = useRef<THREE.Points>(null);
  const particlesCount = 8000;
  
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = 30 + Math.random() * 20;
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const wave = Math.sin(state.clock.elapsedTime * 2 + i * 0.01);
        positions[i3 + 1] += wave * 0.002;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#4A90E2"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function EnergyOrb({ progress }: { progress: number }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref} scale={progress * 3}>
      <icosahedronGeometry args={[1, 1]} />
      <meshPhongMaterial
        color="#00D9FF"
        emissive="#0080FF"
        emissiveIntensity={0.8}
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'particles' | 'logo' | 'complete'>('particles');
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const permissionsGranted = localStorage.getItem('tamv_permissions');
    
    if (!permissionsGranted) {
      const granted = window.confirm(
        '🌌 TAMV MD-X4™ — Civilización Digital Mexicana\n\n' +
        'Activa los permisos sensoriales para ingresar al metaverso:\n' +
        '• Audio espacial 3D\n' +
        '• Efectos visuales cuánticos\n' +
        '• Vibraciones hápticas (si están disponibles)\n\n' +
        '¿Permitir experiencia sensorial completa?'
      );
      
      if (granted) {
        localStorage.setItem('tamv_permissions', 'true');
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }
    }

    const timeline = [
      { time: 0, phase: 'particles' as const },
      { time: 2000, phase: 'logo' as const },
      { time: 5000, phase: 'complete' as const }
    ];

    timeline.forEach(({ time, phase: newPhase }) => {
      setTimeout(() => setPhase(newPhase), time);
    });

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1000);
          return 1;
        }
        return prev + 0.02;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <audio ref={audioRef} loop>
        <source src="/audio/quantum-intro.ogg" type="audio/ogg" />
      </audio>
      
      <Canvas camera={{ position: [0, 0, 50], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00D9FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#FF00FF" />
        
        <QuantumParticlesIntro />
        
        {phase !== 'particles' && (
          <EnergyOrb progress={progress} />
        )}
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center mb-32">
          <h1 className="text-6xl md:text-8xl font-bold glow-text mb-6 animate-pulse-glow">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              TAMV MD-X4™
            </span>
          </h1>
          <p className="text-white text-xl md:text-2xl font-medium mb-8">
            {phase === 'particles' && 'Inicializando nodos cuánticos...'}
            {phase === 'logo' && 'Sincronizando consciencia...'}
            {phase === 'complete' && 'Bienvenido al Metaverso'}
          </p>
          <div className="w-64 h-2 bg-white/20 mx-auto rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
