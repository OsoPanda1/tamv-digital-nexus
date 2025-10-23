import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function NeuralNetwork() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const particlesCount = 150;
  
  const particles = useRef<Array<{x: number, y: number, z: number, vx: number, vy: number, vz: number}>>([]);
  
  useEffect(() => {
    for (let i = 0; i < particlesCount; i++) {
      particles.current.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
      });
    }
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const linePositions: number[] = [];
    const lineColors: number[] = [];

    particles.current.forEach((particle, i) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      if (Math.abs(particle.x) > 25) particle.vx *= -1;
      if (Math.abs(particle.y) > 25) particle.vy *= -1;
      if (Math.abs(particle.z) > 25) particle.vz *= -1;

      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      particles.current.forEach((otherParticle, j) => {
        if (i < j) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dz = particle.z - otherParticle.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 8) {
            linePositions.push(particle.x, particle.y, particle.z);
            linePositions.push(otherParticle.x, otherParticle.y, otherParticle.z);
            
            const alpha = 1 - distance / 8;
            lineColors.push(0.3, 0.6, 1, alpha);
            lineColors.push(0.3, 0.6, 1, alpha);
          }
        }
      });
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    if (linePositions.length > 0) {
      linesRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(linePositions, 3)
      );
      linesRef.current.geometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(lineColors, 4)
      );
    }

    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  const initialPositions = new Float32Array(particlesCount * 3);
  
  return (
    <>
      <Points ref={pointsRef} positions={initialPositions} stride={3}>
        <PointMaterial
          transparent
          color="#00D9FF"
          size={0.3}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

function CameraAnimation({ phase }: { phase: string }) {
  const { camera } = useThree();
  
  useFrame((state) => {
    if (phase === 'particles') {
      camera.position.z = 60 - state.clock.elapsedTime * 2;
    } else if (phase === 'logo') {
      camera.position.z = 40 + Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });
  
  return null;
}

function EnergyCore({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      innerRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={progress * 4}>
      <Sphere args={[1, 32, 32]}>
        <meshPhongMaterial
          color="#00D9FF"
          emissive="#0080FF"
          emissiveIntensity={1.2}
          transparent
          opacity={0.3}
          wireframe
        />
      </Sphere>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshPhongMaterial
          color="#FF00FF"
          emissive="#FF00FF"
          emissiveIntensity={1}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={2} color="#00D9FF" distance={10} />
    </group>
  );
}

export const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'start' | 'particles' | 'logo' | 'reveal' | 'complete'>('start');
  const [showText, setShowText] = useState(false);
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
      { time: 0, phase: 'start' as const },
      { time: 500, phase: 'particles' as const },
      { time: 2500, phase: 'logo' as const, text: true },
      { time: 5000, phase: 'reveal' as const },
      { time: 6500, phase: 'complete' as const }
    ];

    timeline.forEach(({ time, phase: newPhase, text }) => {
      setTimeout(() => {
        setPhase(newPhase);
        if (text) setShowText(true);
      }, time);
    });

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1000);
          return 1;
        }
        return prev + 0.015;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  const getStatusText = () => {
    switch(phase) {
      case 'start': return 'Inicializando...';
      case 'particles': return 'Construyendo red neuronal';
      case 'logo': return 'Sincronizando consciencia cuántica';
      case 'reveal': return 'Activando protocolo sensorial';
      case 'complete': return 'Bienvenido al futuro';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <audio ref={audioRef} loop>
        <source src="/audio/quantum-intro.ogg" type="audio/ogg" />
      </audio>
      
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900/50 to-black">
        <Canvas camera={{ position: [0, 0, 60], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[20, 20, 20]} intensity={1.5} color="#00D9FF" />
          <pointLight position={[-20, -20, -20]} intensity={0.8} color="#FF00FF" />
          <pointLight position={[0, -20, 10]} intensity={0.5} color="#FFD700" />
          
          <fog attach="fog" args={['#000000', 30, 100]} />
          
          <CameraAnimation phase={phase} />
          <NeuralNetwork />
          
          {(phase === 'logo' || phase === 'reveal' || phase === 'complete') && (
            <EnergyCore progress={Math.min(progress * 1.5, 1)} />
          )}
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/80" />
        
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="text-center px-6"
              >
                <motion.h1 
                  className="text-7xl md:text-9xl font-bold mb-8 tracking-tight"
                  initial={{ letterSpacing: '0.5em', opacity: 0 }}
                  animate={{ letterSpacing: '0em', opacity: 1 }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                    TAMV
                  </span>
                </motion.h1>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mb-8 max-w-md mx-auto"
                />
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-2xl md:text-4xl font-light text-gray-300 mb-4 tracking-wide"
                >
                  MD-X4™
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="text-sm md:text-lg text-gray-400 font-light tracking-widest uppercase"
                >
                  Civilización Digital Mexicana
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl mx-auto">
            <motion.p 
              className="text-gray-400 text-sm md:text-base mb-6 text-center font-light tracking-wide"
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getStatusText()}
            </motion.p>
            
            <div className="relative h-1 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/50 to-transparent rounded-full blur-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            
            <motion.p
              className="text-gray-500 text-xs text-center mt-3 font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {Math.round(progress * 100)}%
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
